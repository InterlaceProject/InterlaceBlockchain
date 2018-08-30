const TransferLabel_CreditTransfer = "CreditTransfer";
const TransferLabel_DebitTransfer = "DebitTransfer";
 
 /**
 * Sample transaction processor function.
 * @param {net.sardex.interlace.CreditTransfer} transfer The sample transaction instance.
 * @transaction
 */
async function CreditTransfer(transfer) {
	//some error checking
	if (transfer.transferLabel != TransferLabel_CreditTransfer) {
		console.log("Wrong transfer label");
		return;
	}
	if (transfer.amount <= 0) {
		console.log("Transfer amount must be a positive value.");
		return;
	}
	if (transfer.senderAccount.balance < transfer.amount) {
		console.log("Transfer amount " + transfer.amount + 
					" is bigger than the available balance of " + transfer.senderAccount.balance);
		return;
	}
	
	//move money
	transfer.senderAccount.balance -= transfer.amount;
	transfer.recipientAccount.balance += transfer.amount;
	
    let assetRegistry = await getAssetRegistry('net.sardex.interlace.CreditTransfer');

    // persist the state of the account as well as accountReceive
    await assetRegistry.update(transfer.senderAccount);
    await assetRegistry.update(transfer.recipientAccount);
}

/**
 * Sample transaction processor function.
 * @param {net.sardex.interlace.DebitTransfer} transfer The sample transaction instance.
 * @transaction
 */
async function DebitTransfer(transfer) {
	//some error checking
	if (transfer.transferLabel != TransferLabel_DebitTransfer) {
		console.log("Wrong transfer label");
		return;
	}
	console.log("not implemented");
}
