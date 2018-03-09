const FieldType = require("../FieldType");

function AgeType(){
}

AgeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: Age,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = String(Math.floor(Math.random() * 15) + 85)
    current.Email = target;

    return current;
  }
});

module.exports = AgeType;
