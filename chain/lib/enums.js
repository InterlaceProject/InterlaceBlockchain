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
  'credit': 'credit',
  'debit': 'debit'
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

var TransactionStatus = Object.freeze({
  'Pending': 'Pending',
  'Performed': 'Performed',
  'Rejected': 'Rejected',
  'Expired': 'Expired'
});
