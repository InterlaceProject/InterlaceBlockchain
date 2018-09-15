'use strict';

var Unit = Object.freeze({
  'Euro': 'Euro',
  'SRD': 'SRD'
});

var GroupType = Object.freeze ({
  'welcome': 'welcome',
  'retail': 'retail',
  'company': 'company',
  'full': 'full',
  'employee': 'employee',
  'on_hold': 'on_hold',
  'MNGR': 'MNGR',
  'consumer': 'consumer',
  'consumer_verified': 'consumer_verified'
});

var Operation = Object.freeze ({
  'Credit': 'Credit',
  'Debit': 'Debit'
});

var AccountType = Object.freeze({
  'CC':'CC',
  'DOMU': 'DOMU',
  'MIRROR': 'MIRROR',
  'Income': 'Income',
  'Prepaid': 'Prepaid',
  'Bisoo': 'Bisoo',
  'Topup': 'Topup'
});

var accTTree = {
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
};

var ttTree = {
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
};

/**
 * get back transfer type or null if undefined
 */
function tt(operation, unit, memberGroup) {
  return treeSearch(operation, unit, memberGroup, ttTree);
}

/**
 * get back account connectivity or null if undefined
 */
function accT(operation, unit, accountType) {
  return treeSearch(operation, unit, accountType, accTTree);
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

var namespace = 'net.sardex.interlace';
var NS = namespace;

/**
 * CreditTransfer transaction
 * @param {net.sardex.interlace.CreditTransfer} transfer
 * @transaction
 */
async function CreditTransfer(transfer) {
  // some error checking
  if (transfer.amount <= 0) {
    throw new Error('Transfer amount must be a positive value.');
  }
  if (transfer.senderAccount.balance < transfer.amount) {
    throw new Error('Transfer amount ' + transfer.amount +
    ' is bigger than the available balance of ' + transfer.senderAccount.balance);
  }

  // preview check throws error in case of violation
  previewCheck(transfer.senderAccount, transfer.recipientAccount, transfer.amount);

  // account limits checks thrwos error in case of violation
  accountLimitCheck(transfer.senderAccount, transfer.recipientAccount, transfer.amount);

  // check account limits and emits event if violated
  checkAccountLimitsAlerts(transfer.senderAccount);

  // move money
  transfer.senderAccount.balance -= transfer.amount;
  transfer.recipientAccount.balance += transfer.amount;

  //TODO: handle different account types
  let assetRegistry = await getAssetRegistry('net.sardex.interlace.CCAccount');

  // persist the state of the account as well as accountReceive => append to ledger
  await assetRegistry.update(transfer.senderAccount);
  await assetRegistry.update(transfer.recipientAccount);
}

/**
 * DebitTransfer transaction
 * @param {net.sardex.interlace.DebitTransfer} transfer
 * @transaction
 */
async function DebitTransfer(transfer) {
  throw new Error('not implemented');
}

/**
 * PreviewCheck as of D3.1 => ASIMSpec
 * throws 'Error' on checking issue
 * @param {net.sardex.interlace.Member} member
 * @param {net.sardex.interlace.Account} fromAccount
 * @param {net.sardex.interlace.Account} toAccount
 * @param {net.sardex.interlace.Operation} operation
 */
async function previewCheck(fromAccount, toAccount, operation) {
  //check equal units
  if (fromAccount.unit !== toAccount.unit) {
    throw new Error('Units do not match');
  }

  //determine transfer type
  let ttCheck = tt('credit', fromAccount.unit, fromAccount.member.activeGroup);

  if (ttCheck === null) { //like MayStartCredit/DebitOpns
    //SourceGroupViolation
    throw new Error('Member: ' + fromAccount.member.memberID + ' in group ' +
                    fromAccount.member.activeGroup +
                    ' does not have the right privilegedes for that transfer');

  } else if (ttCheck.indexOf(toAccount.member.activeGroup) > -1) { // check for valid group membership
    //determine connectivity information
    let accTCheck = accT('credit', fromAccount.unit, getAccountType(fromAccount));

    if (accTCheck === null) { //like SourceAccountViolation
      throw new Error('Source account ' + fromAccount.accountID + ' not of the correct type');
    } else if (accTCheck.indexOf(getAccountType(toAccount)) <= -1) { //check for valid account type
      throw new Error('Account ' + fromAccount.accountID + ' is not in one of these groups ' + accTCheck);
    }
  }

  // no error => ok
}

/**
 * Helper function returning the account type of a given account
 */
function getAccountType(account) {
  let type = account.$type;
  return type.replace('Account', '');
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
 * returns boolean
 * @param {net.sardex.interlace.Account} account
 * @param {Double} amount
 */
function canBeSpentBy(account, amount) {
  return account.availableBalance >= amount;
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
 * @param {net.sardex.interlace.Account} account account (carries member information)
 * // TODO: implement
 */
async function checkAccountLimitsAlerts(account) { /*TODO*/ }
