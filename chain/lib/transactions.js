'use strict';

var config = {
  NS: 'net.sardex.interlace',
  debit: {
    quick_transfer_amount: 100,
    lifetime_otps: (1000*3600*2), //in milliseconds => 2 hours
    //lifetime_otps: (1000), //in milliseconds => 1 Second, for testing
  },
  accTTree: {
    credit: {
      SRD: {
        'CC': ['CC', 'DOMU', 'MIRROR'],
        'DOMU': ['CC'],
        'MIRROR' : ['CC']
      }
    },
    debit: {
      SRD: {
        'CC': ['CC']
      },
      EUR: {
        'Income': ['Bisoo']
      }
    }
  },
  ttTree: {
    credit: {
      SRD: {
        company: ['company', 'employee', 'MNGR', 'full'],
        full: ['company', 'employee', 'MNGR', 'full'],
        MNGR: ['retail', 'company', 'employee', 'MNGR', 'full'],
        employee: ['retail', 'company', 'full'],
        consumer_verified: ['retail', 'company', 'full']
      }
    },
    debit: {
      SRD: {
        'retail': 'retail',
        'company': 'company',
        'full': 'full',
        'MNGR': 'MNGR'
      },
      EUR: {
        'retail': 'retail',
        'full': 'full'
      }
    }
  }
};

/**
 * get back transfer type or null if undefined
 */
function tt(operation, unit, memberGroup) {
  return treeSearch(operation, unit, memberGroup, config.ttTree);
}

/**
 * get back account connectivity or null if undefined
 */
function accT(operation, unit, accountType) {
  return treeSearch(operation, unit, accountType, config.accTTree);
}

/**
 * Helper Function for tt and accT
 */
function treeSearch(p1, p2, p3, tree) {
  if (tree[p1] !== undefined) {
    if (tree[p1][p2] !== undefined) {
      if (tree[p1][p2][p3] !== undefined) {
        return tree[p1][p2][p3];
      }
    }
  }

  return null;
}

/**
 * CreditTransfer transaction
 * @param {net.sardex.interlace.CreditTransfer} transfer
 * @transaction
 */
async function CreditTransfer(transfer) {
  //some basic checks
  await checkAmountPlausible(transfer);

  // preview check throws error in case of violation
  await previewCheck(transfer);

  // account limits checks throws error in case of violation
  await accountLimitCheck(
    transfer.senderAccount,
    transfer.recipientAccount,
    transfer.amount);

  // check account limits and emits event if violated
  await checkAccountLimitsAlerts(transfer.senderAccount);

  // perform the transfer
  await moveMoney(transfer);
}

/**
 * do the actual money moving
 * @param {net.sardex.interlace.Transfer} transfer
 * @transaction
 */
async function moveMoney(transfer) {
  // move money
  transfer.senderAccount.balance -= transfer.amount;
  transfer.recipientAccount.balance += transfer.amount;

  //get account type registry
  let arSA = await getAssetRegistry(transfer.senderAccount.getFullyQualifiedType());
  let arRA = await getAssetRegistry(transfer.recipientAccount.getFullyQualifiedType());

  // persist the state of the account as well as accountReceive => append to ledger
  await arSA.update(transfer.senderAccount);
  await arRA.update(transfer.recipientAccount);
}


/**
 * some basic checks for credit/debit
 * @param {net.sardex.interlace.Transfer} transfer
 * @transaction
 */
function checkAmountPlausible(transfer) {
  // some error checking
  if (transfer.amount <= 0) {
    throw new Error('Transfer amount must be a positive value.');
  }
  //if (transfer.senderAccount.balance < transfer.amount) {
  //  throw new Error('Transfer amount ' + transfer.amount +
  //                  ' is bigger than the available balance of ' +
  //                  transfer.senderAccount.balance);
  //}
}

/**
 * DebitTransfer transaction
 * @param {net.sardex.interlace.DebitTransfer} transfer
 * @transaction
 */
async function DebitTransfer(transfer) {
  // some basic checks
  await checkAmountPlausible(transfer);

  // preview check throws error in case of violation
  await previewCheck(transfer);

  // account limits checks throws error in case of violation
  await accountLimitCheck(
    transfer.senderAccount,
    transfer.recipientAccount,
    transfer.amount);

  // check for immediate transfer possibility
  if (transfer.amount <= config.debit.quick_transfer_amount) {
    // perform the transfer
    await moveMoney(transfer);

    // check account limits and emits event if violated
    await checkAccountLimitsAlerts(transfer.senderAccount);
  } else { // requires confirmation
    // add the debit transfer to the pending queue
    let otp = await insertPendingTransfer(transfer);

    // emit request for confirmation
    // by creating event RequestDebitAckReqAnswCompletion
    let factory = getFactory();
    let confirmReq = factory.newEvent(config.NS, 'RequestDebitAcknowledge');

    confirmReq.otp = otp;
    confirmReq.debitorAccount =
      factory.newRelationship(
        config.NS,
        transfer.senderAccount.getType(),
        transfer.senderAccount.accountID);

    // emit the event
    emit(confirmReq);
  }
}

/**
 * update pending transfer state
 * @param {net.sardex.interlace.PendingTransfer} pT
 * @param {net.sardex.interlace.TransactionStatus} newState
 * @param {String} rejectionReason
 */
async function updatePendingTransaction(pT, newState, rejectionReason) {
  //update state
  pT.state = newState;

  if (newState === TransactionStatus.Rejected) {
    pT.rejectionReason = rejectionReason;
  }

  //get registry and update pending transfer in ledger
  let ptReg = await getAssetRegistry(pT.getFullyQualifiedType());
  await ptReg.update(pT);
}

/**
 * Acknowledge a DebitTransfer transaction and write it
 * to the ledger if applicable
 * @param {net.sardex.interlace.DebitTransferAcknowledge} ack
 * @returns {net.sardex.interlace.AcknowledgeStatus} status text.
 * @transaction
 */
async function DebitTransferAcknowledge(ack) {
  //prepare return AcknowledgeStatus
  let rS = getFactory().newConcept(config.NS, 'AcknowledgeStatus');

  //get pending transaction
  let pT = ack.transfer;

  // varify state of pending transfer
  if (pT.state !== TransactionStatus.Pending) {
    throw new Error('Transfer is not in state "' +
      TransactionStatus.Pending + '" but in state "' + pT.state + '"');
  }

  // varify if pending transaction has been expired
  if (new Date() >= pT.expires) {
    //update state from Pending to Rejected
    await updatePendingTransaction(pT, TransactionStatus.Expired);

    //prepare return message
    rS.status = TransactionStatus.Expired;
    rS.description = 'OTP ' + pT.otp + ' is expired.';
    return rS; //TODO: raise event
  }

  try {
    let transfer = pT.transfer;

    // account limits checks throws error in case of violation
    await accountLimitCheck(
      transfer.senderAccount,
      transfer.recipientAccount,
      transfer.amount);

    //update state from Pending to Performed
    await updatePendingTransaction(pT, TransactionStatus.Performed);

    // perform the transfer
    await moveMoney(transfer);

    // check account limits and emits event if violated
    await checkAccountLimitsAlerts(transfer.senderAccount);
  } catch(error) {
    // fix pending transfer state before returning status
    await updatePendingTransaction(
      pT,
      TransactionStatus.Rejected,
      error.toString());

    //prepare return message
    rS.status = TransactionStatus.Expired;
    rS.description = 'Error acknoledging transfer: ' + error.toString();
    return rS; //TODO: raise event
  }

  rS.status = TransactionStatus.Performed;
  rS.description = 'Transfer performed successfull.';
  return rS; //TODO: raise event
}

/**
 * DebitTransfer transaction
 * @param {net.sardex.interlace.CleanupPendingTransfers} transfer
 * @transaction
 */
async function CleanupPendingTransfers(transfer) {
  //TODO: maybe read lifetime_otps from ledger?
  let expiredPending =
    await query('selectExpiredPendingTransfers', {now: (new Date())});
  let aR = await getAssetRegistry(config.NS + '.PendingTransfer');

  // change all states to expired
  expiredPending.forEach(p => p.state = TransactionStatus.Expired);
  await aR.updateAll(expiredPending);
}

/**
 * create id - quick solution - rethink for production
 * Math.random should be unique because of its seeding algorithm.
 * Convert it to base 36 (numbers + letters), and grab the first 9 characters
 * after the decimal.
 */
function makeid() {
  return Math.random().toString(36).substr(2, 20);
}

/**
 * simple hash function - insecure!!!!
 * @param {String} s
 */
function simplehash(s) {
  for(var i=0, h=1; i<s.length; i++) {
    h=Math.imul(h+s.charCodeAt(i)|0, 2654435761);
  }
  return ((h^h>>>17)>>>0).toString();
}

/**
 * get one time pad - insecure!!!!
 * just a quick solution
 */
function getOTP() {
  return simplehash(makeid());
}

/**
 * insert a pending Transfer
 * @param {net.sardex.interlace.Transfer} transfer
 * @returns {String} otp
 */
async function insertPendingTransfer(transfer) {
  let factory = getFactory();
  let otp = getOTP();

  // create pending transfer
  let pT = factory.newResource(config.NS, 'PendingTransfer', otp);
  pT.transfer = transfer;
  pT.state = TransactionStatus.Pending;
  pT.created = new Date();
  pT.expires = new Date(pT.created.getTime() + config.debit.lifetime_otps);
  pT.otp = otp;

  try {
    let accReg = await getAssetRegistry(config.NS + '.PendingTransfer');
    await accReg.add(pT);
  } catch (error) {
    throw new Error('write error: ' + error.toString());
  }

  return otp;
}

/**
 * PreviewCheck as of D3.1 => ASIMSpec
 * throws 'Error' on checking issue
 * @param {net.sardex.interlace.Transfer} transfer
 */
async function previewCheck(transfer) {
  let fromAccount = transfer.senderAccount;
  let toAccount = transfer.recipientAccount;
  let fromGroup = fromAccount.member.activeGroup;
  let toGroup = toAccount.member.activeGroup;
  let operation = getOperation(transfer);

  //info: debit request
  //      debitor=buyer=fromAccount
  //      creditor=seller=toAccount
  //fix fromGroup for debit request
  if (operation === Operation.debit) {
    //from- and to-group taken from creditor
    fromGroup = toAccount.member.activeGroup;
    toGroup = fromGroup;
  }

  //check equal units
  if (fromAccount.unit !== toAccount.unit) {
    throw new Error('Units do not match');
  }

  //determine transfer type
  let ttCheck = tt(operation, fromAccount.unit, fromGroup);

  if (ttCheck === null) { //like MayStartCredit/DebitOpns
    //SourceGroupViolation
    let memberID = fromAccount.member.memberID;
    if (operation === Operation.debit) memberID = toAccount.member.memberID;

    throw new Error('Member: ' + memberID + ' in group ' + fromGroup +
      ' does not have the right privileges for that transfer');
  }

  if (ttCheck.indexOf(toGroup) > -1) { // check for valid group membership
    //determine connectivity information
    let accTCheck = accT(
      'credit',
      fromAccount.unit,
      getAccountType(fromAccount));

    if (accTCheck === null) { //like SourceAccountViolation
      throw new Error('Source account ' + fromAccount.accountID +
        ' not of the correct type');
    } else if (accTCheck.indexOf(getAccountType(toAccount)) <= -1) { //check for valid account type
      throw new Error('Account ' + fromAccount.accountID +
        ' is not in one of these groups ' + accTCheck);
    }

    // no error => ok
  } else {
    let memberID = fromAccount.member.memberID;
    if (operation === Operation.debit) memberID = toAccount.member.memberID;

    throw new Error('Member: ' + memberID + ' is in group ' + fromGroup +
      ' but needs to be in one of those: ' + ttCheck.join(', '));
  }

  // no error => ok
}

/**
 * Helper function returning the account type of a given account
 * @param {net.sardex.interlace.Account} account
 */
function getAccountType(account) {
  try {
    let type = account.getType();
    return type.replace('Account', '');
  } catch (error) {
    throw new Error('Problem determining account type: ' + error);
  }
}

/**
 * Helper function returning the operation of a given transfer
 * @param {net.sardex.interlace.Transfer} transfer
 */
function getOperation(transfer) {
  try {
    let type = transfer.getType().replace('Transfer', '');
    return type.toLowerCase();
  } catch (error) {
    throw new Error('Problem determining transfer operation: ' + error);
  }
}

/**
 * AccountLimitCheck as of D3.1 => ASIMSpec
 * throws 'Error' on checking issue - runs through otherwise
 * @param {net.sardex.interlace.Account} fromAccount
 * @param {net.sardex.interlace.Account} toAccount
 * @param {Double} amount
 */
async function accountLimitCheck(fromAccount, toAccount, amount) {
  if (canBeSpentBy(fromAccount, amount)) {
    if (canBeCashedBy(toAccount, amount)) {
      if (!hasSellCapacityFor(toAccount, amount)) {
        throw new Error('CapacityViolation()');
      }
    } else {
      throw new Error('UpperLimitViolation()');
    }
  } else {
    throw new Error('AvailBalanceViolation()');
  }
}

/**
 * canBeSpentBy as of D3.1 => ASIMSpec
 * returns available balance
 * @param {net.sardex.interlace.Account} account
 * @returns {Double}
 */
function availableBalance(account) {
  return account.balance + account.creditLimit;
}

/**
 * canBeSpentBy as of D3.1 => ASIMSpec
 * returns boolean
 * @param {net.sardex.interlace.Account} account
 * @param {Double} amount
 */
function canBeSpentBy(account, amount) {
  return availableBalance(account) >= amount;
}
/**
 * canBeCashedBy as of D3.1 => ASIMSpec
 * returns boolean
 * @param {net.sardex.interlace.Account} account
 * @param {Double} amount
 */
function canBeCashedBy(account, amount) {
  return getAccountType(account) !== AccountType.DOMU &&
          (account.balance + amount) <= account.upperLimit;
}
/**
 * hasSellCapacityFor as of D3.1 => ASIMSpec
 * returns boolean
 * @param {net.sardex.interlace.Account} account
 * @param {Double} amount
 */
function hasSellCapacityFor(account, amount) {
  return amount <= account.member.availableCapacity;
}

/**
 * CheckAccountLimitsAlerts as of D3.1 => ASIMSpec
 * emits event LimitAlert if applicable
 * @param {net.sardex.interlace.Account} account account that carries member info
 * // TODO: implement
 */
async function checkAccountLimitsAlerts(account) { /*TODO*/ }
