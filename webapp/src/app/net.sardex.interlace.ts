import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace net.sardex.interlace{
   export abstract class Member extends Participant {
      memberID: string;
      email: string[];
      phone: string[];
      activeGroup: GroupType;
      capacity: number;
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
      fromAccount: Account;
      toAccount: Account;
   }
   export class CreditTransfer extends Transfer {
   }
   export class DebitTransfer extends Transfer {
   }
   export class DebitTransferAcknowledge extends Transaction {
      transfer: PendingTransfer;
   }
   export class InitBlockchain extends Transaction {
   }
   export class CleanupPendingTransfers extends Transaction {
      currentDate: Date;
   }
   export enum Unit {
      Euro,
      SRD,
   }
   export enum Operation {
      credit,
      debit,
   }
   export enum GroupType {
      welcome,
      retail,
      company,
      full,
      employee,
      on_hold,
      MNGR,
      consumer,
      consumer_verified,
   }
   export enum AccountType {
      CC,
      DOMU,
      MIRROR,
      Income,
      Prepaid,
      Bisoo,
      Topup,
   }
   export enum TransactionStatus {
      Pending,
      Performed,
      Rejected,
      Expired,
   }
   export abstract class Account extends Asset {
      accountID: string;
      unit: Unit;
      balance: number;
      availableCapacity: number;
      member: Member;
   }
   export abstract class MemberAccount extends Account {
   }
   export class SysAccount extends Account {
   }
   export class CCAccount extends MemberAccount {
      creditLimit: number;
      creditLimitDate: Date;
      upperLimit: number;
   }
   export class PendingTransfer extends Asset {
      otp: string;
      created: Date;
      expires: Date;
      rejectionReason: string;
      transfer: DebitTransfer;
      state: TransactionStatus;
   }
   export class DeltaDebt extends Asset {
      id: string;
      created: Date;
      due: Date;
      amount: number;
      deptPos: number;
      debitorID: string;
   }
   export class AcknowledgeStatus {
      status: TransactionStatus;
      description: string;
   }
   export class LimitAlert extends Event {
      alertText: string;
      account: Account;
   }
   export class RequestDebitAcknowledge extends Event {
      otp: string;
      debitorAccount: Account;
   }
   export class DebitAcknowledgeInvalid extends Event {
      pendingTransfer: PendingTransfer;
      message: string;
   }
// }
