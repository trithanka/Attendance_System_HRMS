const { createHash } = require('node:crypto');


function CreateDBHash(plainText){
    const hash = createHash('sha256');
    hash.update(plainText)
    console.log( hash.digest('hex'))
  }
  CreateDBHash('DHEMAJI_1234')
  CreateDBHash('BISWANATH_1234')
  CreateDBHash('DIPHU_1234')
  CreateDBHash('MORIGAON_1234')
  CreateDBHash('UDALGURI_1234')
  CreateDBHash('KAMRUPR_1234')
