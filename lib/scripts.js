/**
 * count transaction
 * @param {org.decentralized.credit.network.getCard} getCard
 * @transaction
 */
function getCard(getCard) {
	getCard.UUID.MemberID.forEach(function(MemberID) {
		var serializer = getSerializer()
		var serializer = getSerializer();
		var jsonObj = serializer.toJSON(MemberID);
		console.log("Ask: ", MemberID);
		console.log("Ask jsonObj: ", jsonObj);    
	});
}

/**
 * Sample transaction processor function.
 * @param {org.decentralized.credit.network.CardToUser} tx The sample transaction pippo.
 * @transaction
 */
function CardToUser(tx) {
	//get the User from Card Number
  		var UUID = tx.cardNumber
		 console.log("Card Number is", UUID);  
  	   return getAssetRegistry('org.decentralized.credit.network.Identifiers')
    	.then(function (UUIDAssetRegistry) {
			return UUIDAssetRegistry.get(UUID)
      	 .then(function (memberID) {
      	console.log(memberID);})})
//  		return UUID.identifiers.getFullyQualifiedType();
//         .then function()
//  		return UUID.getIdentifier();
//  		AssetRegistry.resolve(UUID)
}

/**
 * Sample transaction processor function.
 * @param {org.s.network.CreditTransfer} tx The sample transaction instance.
 * @transaction
 */
function CreditTransfer(tx) {
	//get the sender
	var sender = tx.sender;
	console.log("sender is", sender);
	//get the recipient
	var recipient = tx.recipient;
	console.log("recipient is", recipient);    
	// Verify sender and recipient are unique
	if( sender == recipient) {
		throw  "Sender and recipient accounts cannot match";
	}
	// Verify the transfer amount is not zero
	if( tx.value == 0 ) {
		throw  "Transfer amount cannot be zero";
	}
	// Get account registry
	return getAssetRegistry('org.s.network.Account')
		.then(function (accountAssetRegistry) {
			//Verify account type matching
			if( sender.unit !== recipient.unit) {
				throw  "Account types do not match";
			}
			// Get the specific sender account from the account asset registry.
			return accountAssetRegistry.get(sender.AccountID)
				.then(function (senderAccount) {
      	console.log(senderAccount);
// Verify the sender available balance is sufficient for the transfer
// "*1" may be related to what AvailableBalance evaluates to (should be double rather than a type)
					if( tx.value > (senderAccount.AvailableBalance*1)) {
						throw "Sender available balance is not sufficient. Try reducing the transfer amount.";
					}
					senderAccount.Balance = senderAccount.Balance - tx.value;
					senderAccount.AvailableBalance = senderAccount.AvailableBalance - tx.value;
					return accountAssetRegistry.update(senderAccount);
				})
				.then(function (){
					return getAssetRegistry('org.s.network.Account');
				})
				.then(function (accountAssetRegistry) {
					// Get the specific account from the account asset registry.
					return accountAssetRegistry.get(recipient.AccountID)
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

/**
 * Sample transaction processor function.
 * @param {org.decentralized.credit.network.SimplestTransfer} tx The sample transaction instance.
 * @transaction
 */
function SimplestTransfer(tx) {
// The existing vehicles that have come from elsewhere.
	var sender = tx.sender;
	var recipient = tx.recipient;
	var amount = tx.value;
	// Get the account asset registry.
	return getAssetRegistry('org.decentralized.credit.network.Account')
		.then(function (accountAssetRegistry) {
			console.log(accountAssetRegistry);
			// Check if sender has Available balance greater than tx value
			if(amount > (sender.AvailableBalance*1)) {
				throw "NOT ENOUGH !";
			}    
			// Modify the properties of the first account - sender
			sender.Balance = sender.Balance - amount;
			sender.AvailableBalance = sender.AvailableBalance - amount;
			// Modify the properties of the second account - recipient.
			recipient.Balance = recipient.Balance + amount;
			recipient.AvailableBalance =  recipient.AvailableBalance + amount ;
			// Update the vehicles in the vehicle asset registry.
			return accountAssetRegistry.updateAll([sender, recipient]);
		})
		.catch(function (error) {
			// Add optional error handling here.
		});
}
