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
 * Init base on predefined values
 * @param {net.sardex.interlace.InitBlockchain} transfer
 * @transaction
 */
async function initBlockchain(transfer) {
  var factory = getFactory();

  var m1 = factory.newResource(NS, 'Individual', 'm1');
  m1.firstName='f1';
  m1.surName='s1';
  m1.employedBy='ab';
  m1.email=['f1@mail.com'];
  m1.phone=['0815'];
  m1.activeGroup=GroupType.company;
  m1.availableCapacity=1000000;

  var m2 = factory.newResource(NS, 'Individual', 'm2');
  m2.firstName='f2';
  m2.surName='s2';
  m2.employedBy='ab';
  m2.email=['f2@mail.com'];
  m2.phone=['4711'];
  m2.activeGroup=GroupType.company;
  m2.availableCapacity=1000000;

  var a1 = factory.newResource(NS, 'CCAccount', 'a1');
  a1.creditLimit=0;
  a1.creditLimitDate=new Date('2018-08-30T19:11:40.212Z');
  a1.availableBalance=1000;
  a1.unit='SRD';
  a1.balance=1000;
  a1.accountType=AccountType.CC;
  a1.member=factory.newRelationship(NS, 'Individual', 'm1');
  a1.upperLimit=1000000;

  var a2 = factory.newResource(NS, 'CCAccount', 'a2');
  a2.creditLimit=0;
  a2.creditLimitDate=new Date('2018-08-30T19:11:40.212Z');
  a2.availableBalance=1000;
  a2.unit='SRD';
  a2.balance=1000;
  a2.accountType=AccountType.CC;
  a2.member=factory.newRelationship(NS, 'Individual', 'm2');
  a2.upperLimit=1000000;

  let partReg = await getParticipantRegistry(NS + '.Individual');
  await partReg.addAll([m1, m2]);

  let accReg = await getAssetRegistry(NS + '.CCAccount');
  await accReg.addAll([a1, a2]);
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
    let accTCheck = accT('credit', fromAccount.unit, fromAccount.accountType);

    if (accTCheck === null) { //like SourceAccountViolation
      throw new Error('Source account ' + fromAccount.accountID + ' not of the correct type');
    } else if (accTCheck.indexOf(toAccount.accountType) <= -1) { //check for valid account type
      throw new Error('Account ' + fromAccount.accountID + ' is not in one of these groups ' + accTCheck);
    }
  }

  // no error => ok
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
  return account.accountType !== AccountType.DOMU &&
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
