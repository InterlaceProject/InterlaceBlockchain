'use strict';

var config = {
  NS: 'net.sardex.interlace',
  debit: {
    quick_transfer_amount: 100,
    lifetime_otps: (1000*3600*2), //in milliseconds => 2 hours
    //lifetime_otps: (1000), //in milliseconds => 1 Second, for testing
    debitDueDuration: function (year) {
      let dayMLSeconds = 1000*3600*24;
      if (year%4 === 0 && (year%100 !== 0 || year%400 === 0)) {
        return 366 * dayMLSeconds;
      }
      return 365 * dayMLSeconds;
    }
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
 * Helper Function for tt and accT
 */
function configSearch(p1, p2, p3, tree) {
  if (tree[p1] !== undefined) {
    if (tree[p1][p2] !== undefined) {
      if (tree[p1][p2][p3] !== undefined) {
        return tree[p1][p2][p3];
      }
    }
  }

  return null;
}
