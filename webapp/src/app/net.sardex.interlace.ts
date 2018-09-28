import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace net.sardex.interlace{
   export abstract class Member extends Participant {
      memberID: string;
      email: string[];
      phone: string[];
   }
   export class Subscriber extends Member {
      entityName: string;
      entityAddress: string;
   }
   export class Individual extends Member {
      firstName: string;
      surName: string;
      employedBy: string;
   }
   export abstract class Transfer extends Transaction {
      amount: number;
      senderAccount: Account;
      recipientAccount: Account;
   }
   export class CreditTransfer extends Transfer {
   }
   export class DebitTransfer extends Transfer {
   }
   export class InitBlockchain extends Transaction {
   }
   export enum Unit {
      Euro,
      SRD,
   }
   export abstract class Account extends Asset {
      accountID: string;
      unit: Unit;
      balance: number;
      member: Member;
   }
   export abstract class MemberAccount extends Account {
   }
   export class SysAccount extends Account {
   }
   export class CCAccount extends MemberAccount {
      creditLimit: number;
      creditLimitDate: Date;
      availableBalance: number;
   }
// }
