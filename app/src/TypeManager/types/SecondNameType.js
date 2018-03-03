const FieldType = require("../FieldType");

function SecondNameType(){
  this.secondNames = ['Jones', 'Taylor', 'Williams', 'Brown', 'Smith', 'Evans', 'Thomas', 'Wood'];
}

SecondNameType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: SecondNameType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let secondName = this.secondNames[Math.floor(Math.random() * this.secondNames.length)];
    current.SecondName = secondName;

    return current;
  }
});

module.exports = SecondNameType;
