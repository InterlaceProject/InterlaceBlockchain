'use strict';

/**
 * Init base on predefined values
 * @param {net.sardex.interlace.InitBlockchain} transfer
 * @transaction
 */
async function initBlockchain(transfer) {
  let factory = getFactory();

  let m1 = factory.newResource(config.NS, 'Individual', 'm1');
  m1.firstName='f1';
  m1.surName='s1';
  m1.employedBy='ab';
  m1.email=['f1@mail.com'];
  m1.phone=['0815'];
  m1.activeGroup=GroupType.company;
  m1.capacity=100000;

  let m2 = factory.newResource(config.NS, 'Individual', 'm2');
  m2.firstName='f2';
  m2.surName='s2';
  m2.employedBy='ab';
  m2.email=['f2@mail.com'];
  m2.phone=['4711'];
  m2.activeGroup=GroupType.company;
  m2.capacity=100000;

  let a1 = factory.newResource(config.NS, 'CCAccount', 'a1');
  a1.creditLimit=1000;
  a1.creditLimitDate=new Date();
  a1.unit='SRD';
  a1.balance=1000;
  a1.member=factory.newRelationship(config.NS, 'Individual', 'm1');
  a1.upperLimit=1000;
  a1.availableCapacity=m1.capacity; //init with members capacity

  let a2 = factory.newResource(config.NS, 'CCAccount', 'a2');
  a2.creditLimit=5000;
  a2.creditLimitDate=new Date();
  a2.unit='SRD';
  a2.balance=1000;
  a2.member=factory.newRelationship(config.NS, 'Individual', 'm2');
  a2.upperLimit=5000;
  a2.availableCapacity=m2.capacity; //init with members capacity

  let partReg = await getParticipantRegistry(config.NS + '.Individual');
  await partReg.addAll([m1, m2]);

  let accReg = await getAssetRegistry(config.NS + '.CCAccount');
  await accReg.addAll([a1, a2]);
}
