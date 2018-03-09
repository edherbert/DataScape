const FieldType = require("../FieldType");

function PhoneNumberType(){
}

PhoneNumberType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PhoneNumberType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = String(Math.floor(Math.random() * 1000000000) + 9999999999)
    current.PhoneNumber = "+44" + target;

    return current;
  }
});

module.exports = PhoneNumberType;
