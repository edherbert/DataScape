const FieldType = require("../FieldType");

function RandomColourType(){
	this.colour = ['Red', 'Yellow', 'Pink', 'Green'];
}

RandomColourType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: RandomColourType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = this.colour[Math.floor(Math.random() * this.colour.length)];

    current.Colour = target;
    return current;
  }
});

module.exports = RandomColourType;

// reference CMD for errors as it keeps a record of the changes made
