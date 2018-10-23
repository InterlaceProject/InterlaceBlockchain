/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { AngularTestPage } from './app.po';
import { ExpectedConditions, browser, element, by } from 'protractor';
import {} from 'jasmine';


describe('Starting tests for interlace-webapp', function() {
  let page: AngularTestPage;

  beforeEach(() => {
    page = new AngularTestPage();
  });

  it('website title should be interlace-webapp', () => {
    page.navigateTo('/');
    return browser.getTitle().then((result)=>{
      expect(result).toBe('interlace-webapp');
    })
  });

  it('network-name should be sardex-open-network@0.2.9',() => {
    element(by.css('.network-name')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('sardex-open-network@0.2.9.bna');
    });
  });

  it('navbar-brand should be interlace-webapp',() => {
    element(by.css('.navbar-brand')).getWebElement()
    .then((webElement) => {
      return webElement.getText();
    })
    .then((txt) => {
      expect(txt).toBe('interlace-webapp');
    });
  });

  
    it('SysAccount component should be loadable',() => {
      page.navigateTo('/SysAccount');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('SysAccount');
      });
    });

    it('SysAccount table should have 6 columns',() => {
      page.navigateTo('/SysAccount');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(6); // Addition of 1 for 'Action' column
      });
    });
  
    it('CCAccount component should be loadable',() => {
      page.navigateTo('/CCAccount');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CCAccount');
      });
    });

    it('CCAccount table should have 9 columns',() => {
      page.navigateTo('/CCAccount');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  
    it('PendingTransfer component should be loadable',() => {
      page.navigateTo('/PendingTransfer');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('PendingTransfer');
      });
    });

    it('PendingTransfer table should have 7 columns',() => {
      page.navigateTo('/PendingTransfer');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  
    it('DeltaDebt component should be loadable',() => {
      page.navigateTo('/DeltaDebt');
      browser.findElement(by.id('assetName'))
      .then((assetName) => {
        return assetName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DeltaDebt');
      });
    });

    it('DeltaDebt table should have 7 columns',() => {
      page.navigateTo('/DeltaDebt');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(7); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('Subscriber component should be loadable',() => {
      page.navigateTo('/Subscriber');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Subscriber');
      });
    });

    it('Subscriber table should have 8 columns',() => {
      page.navigateTo('/Subscriber');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(8); // Addition of 1 for 'Action' column
      });
    });
  
    it('Individual component should be loadable',() => {
      page.navigateTo('/Individual');
      browser.findElement(by.id('participantName'))
      .then((participantName) => {
        return participantName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('Individual');
      });
    });

    it('Individual table should have 9 columns',() => {
      page.navigateTo('/Individual');
      element.all(by.css('.thead-cols th')).then(function(arr) {
        expect(arr.length).toEqual(9); // Addition of 1 for 'Action' column
      });
    });
  

  
    it('CreditTransfer component should be loadable',() => {
      page.navigateTo('/CreditTransfer');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CreditTransfer');
      });
    });
  
    it('DebitTransfer component should be loadable',() => {
      page.navigateTo('/DebitTransfer');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DebitTransfer');
      });
    });
  
    it('DebitTransferAcknowledge component should be loadable',() => {
      page.navigateTo('/DebitTransferAcknowledge');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('DebitTransferAcknowledge');
      });
    });
  
    it('InitBlockchain component should be loadable',() => {
      page.navigateTo('/InitBlockchain');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('InitBlockchain');
      });
    });
  
    it('CleanupPendingTransfers component should be loadable',() => {
      page.navigateTo('/CleanupPendingTransfers');
      browser.findElement(by.id('transactionName'))
      .then((transactionName) => {
        return transactionName.getText();
      })
      .then((txt) => {
        expect(txt).toBe('CleanupPendingTransfers');
      });
    });
  

});