const FieldType = require("../FieldType");

function AgeType(){
}

AgeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: AgeType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = String(Math.floor(Math.random() * 60) + 15)
    current.Age = target;

    return current;
  }
});

module.exports = AgeType;
