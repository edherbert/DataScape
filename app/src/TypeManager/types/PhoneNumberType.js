const FieldType = require("../FieldType");

function PhoneNumberType(){
}

PhoneNumberType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PhoneNumber,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = Math.floor(Math.random() * 1000000000) + 9999999999
    current.PhoneNumber = "+44" + String(target);

    return current;
  }
});

module.exports = PhoneNumberType;
