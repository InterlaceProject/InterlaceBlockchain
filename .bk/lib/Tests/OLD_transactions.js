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


/**
 * Sample transaction processor function.
 * @param {org.decentralized.credit.network.CreditTransfer} tx The sample transaction instance.
 * @transaction
 */


function CreditTransfer(tx) {
 	// Update the value in the asset.
    var sender = tx.sender;
    var recipient = tx.recipient;
    // var account = sender.account;
    //account.balance = account.balance - tx.value;
 
    
  return getAssetRegistry('org.decentralized.credit.network.Account')
  .then(function (accountAssetRegistry) {
    // Get the specific vehicle from the vehicle asset registry.
    return accountAssetRegistry.get(sender.account.accountID)
      .then(function (senderAccount) {
      	console.log(senderAccount);
        // Process the the vehicle object.
      if( tx.value > (senderAccount.availableBalance*1)) {
        throw "NO!";
      }
        senderAccount.balance = senderAccount.balance - tx.value;
        senderAccount.availableBalance = senderAccount.availableBalance - tx.value;
        return accountAssetRegistry.update(senderAccount);
      })
      .then(function (){
      return getAssetRegistry('org.decentralized.credit.network.Account');
		})
		.then(function (accountAssetRegistry) {
		// Get the specific vehicle from the vehicle asset registry.
		return accountAssetRegistry.get(recipient.account.accountID)
		.then(function (recipientAccount) {
      	   
        recipientAccount.balance = recipientAccount.balance + tx.value;
        recipientAccount.availableBalance =  recipientAccount.availableBalance + tx.value ;
        return accountAssetRegistry.update(recipientAccount);
      });
  })
      .catch(function (error) {
        throw error;
      });
  })
  .catch(function (error) {
    throw error;
  });
}

/*
/**
 * @param {org.decentralized.credit.network.event} eventTx
 * @transaction
 */
/*
function event(eventTx) {
    var factory = getFactory();

    var event = factory.newEvent('org.decentralized.credit.network.event', 'BasicEvent');
    emit(event);
}
* 
* */
