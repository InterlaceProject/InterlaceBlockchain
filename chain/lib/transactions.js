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
		throw new Error("Wrong transfer label");
	}
	if (transfer.amount <= 0) {
		throw new Error("Transfer amount must be a positive value.");
	}
	if (transfer.senderAccount.balance < transfer.amount) {
		throw new Error("Transfer amount " + transfer.amount +
					" is bigger than the available balance of " + transfer.senderAccount.balance);
	}

	//move money
	transfer.senderAccount.balance -= transfer.amount;
	transfer.recipientAccount.balance += transfer.amount;

    let assetRegistry = await getAssetRegistry('net.sardex.interlace.CCAccount');

    // persist the state of the account as well as accountReceive
    await assetRegistry.update(transfer.senderAccount);
    await assetRegistry.update(transfer.recipientAccount);
}

/**
 * Sample transaction processor function.
 * @param {net.sardex.interlace.DebitTransfer} transfer
 * @transaction
 */
async function DebitTransfer(transfer) {
	//some error checking
	if (transfer.transferLabel != TransferLabel_DebitTransfer) {
		throw new Error("Wrong transfer label");
	}
	throw new Error("not implemented");
}

/**
 * Init base on prefined values and JSON Strings
 * @param {net.sardex.interlace.InitBlockchain} transfer
 * @transaction
 */
async function initBlockchain(transfer) {
    var factory = getFactory();
    var NS = 'net.sardex.interlace';
    var ind_json1 = {
      "firstName": "f1",
      "surName": "s1",
      "employedBy": "ab",
      "memberID": "m1",
      "email": ["f1@mail.com"],
      "phone": ["0815"]
    }

    var ind_json2 = {
      "firstName": "f2",
      "surName": "s2",
      "employedBy": "cd",
      "memberID": "m2",
      "email": ["f2@mail.com"],
      "phone": ["4711"]
    }

    var m1 = factory.newResource(NS, 'Individual', {allowEmptyId: true});
    Object.assign(m1, ind_json);
    var m2 = factory.newResource(NS, 'Individual', {allowEmptyId: true});
    Object.assign(m2, ind_json);

    let accReg = await getAssetRegistry('net.sardex.interlace.Individual');
    await accReg.addAll([m1, m2]);

}
