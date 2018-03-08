const FieldType = require("../FieldType");

function BooleanType(){
}

BooleanType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: BooleanType,
  
  generate: function(previous){
	
	let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(Math.random() * 2 <= 1){
      target = true;
    }else{
      target = false;
    }
    current.Boolean = target;

    return current;
  }
});

module.exports = BooleanType;