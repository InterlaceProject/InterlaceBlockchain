    //get the sender
    //var sender = tx.sender;
    //console.log("sender is", sender);

    //get the recipient
    //var recipient = tx.recipient;
    //console.log("recipient is", recipient);

        
  return getAssetRegistry('org.decentralized.credit.network.Account')
  .then(function (accountAssetRegistry) {
    // Get the specific vehicle from the vehicle asset registry.
    return accountAssetRegistry.get('tx.sender')
      .then(function (senderAccount) {
      	console.log(senderAccount);
        // Process the the vehicle object.
      if( tx.value > (senderAccount.AvailableBalance*1)) {
        throw "NO!";
      }
        senderAccount.Balance = senderAccount.Balance - tx.value;
        senderAccount.AvailableBalance = senderAccount.AvailableBalance - tx.value;
        return accountAssetRegistry.update(senderAccount);
      })
      .then(function (){
      return getAssetRegistry('org.decentralized.credit.network.Account');
		})
		.then(function (accountAssetRegistry) {
		// Get the specific vehicle from the vehicle asset registry.
		return accountAssetRegistry.get('tx.recipient')
		.then(function (recipientAccount) {
      	   
        recipientAccount.Balance = recipientAccount.Balance + tx.value;
        recipientAccount.AvailableBalance =  recipientAccount.AvailableBalance + tx.value ;
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
