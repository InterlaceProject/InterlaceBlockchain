'use strict';

/**
 * Init base on predefined values
 * @param {net.sardex.interlace.InitBlockchain} transfer
 * @transaction
 */
async function initBlockchain(transfer) {
  var factory = getFactory();

  var m1 = factory.newResource(NS, 'Individual', 'm1');
  m1.firstName='f1';
  m1.surName='s1';
  m1.employedBy='ab';
  m1.email=['f1@mail.com'];
  m1.phone=['0815'];
  m1.activeGroup=GroupType.company;
  m1.availableCapacity=1000000;

  var m2 = factory.newResource(NS, 'Individual', 'm2');
  m2.firstName='f2';
  m2.surName='s2';
  m2.employedBy='ab';
  m2.email=['f2@mail.com'];
  m2.phone=['4711'];
  m2.activeGroup=GroupType.company;
  m2.availableCapacity=1000000;

  var a1 = factory.newResource(NS, 'CCAccount', 'a1');
  a1.creditLimit=0;
  a1.creditLimitDate=new Date('2018-08-30T19:11:40.212Z');
  a1.availableBalance=1000;
  a1.unit='SRD';
  a1.balance=1000;
  a1.member=factory.newRelationship(NS, 'Individual', 'm1');
  a1.upperLimit=1000000;

  var a2 = factory.newResource(NS, 'CCAccount', 'a2');
  a2.creditLimit=0;
  a2.creditLimitDate=new Date('2018-08-30T19:11:40.212Z');
  a2.availableBalance=1000;
  a2.unit='SRD';
  a2.balance=1000;
  a2.member=factory.newRelationship(NS, 'Individual', 'm2');
  a2.upperLimit=1000000;

  let partReg = await getParticipantRegistry(NS + '.Individual');
  await partReg.addAll([m1, m2]);

  let accReg = await getAssetRegistry(NS + '.CCAccount');
  await accReg.addAll([a1, a2]);
}
