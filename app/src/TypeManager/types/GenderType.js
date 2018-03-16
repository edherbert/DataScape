const FieldType = require("../FieldType");

function GenderType(){

}

GenderType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: GenderType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(Math.random() * 2 <= 1){
      target = "Male";
    }else{
      target = "Female";
    }
    current.Gender = target;

    return current;
  }
});

module.exports = GenderType;
