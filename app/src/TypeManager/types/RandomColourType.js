const FieldType = require("../FieldType");

function RandomColourType(){
	this.colour = ['Red', 'Yellow', 'Pink', 'Green'];
}

RandomColourType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: RandomColourType,
  
  generate: function(previous){
	  //console.log("Generating random colour"); 
	  
	  //previous.Colour <----- Has to be the same as the string
	  previous.Colour = this.colour[Math.floor(Math.random() * this.colour.length)];//math.floor rounds number to whole number (e.g 5.6 = 5, it will go below)
	  
	  return previous;
  }
  
  
});

module.exports = RandomColourType;

// reference CMD for errors as it keeps a record of the changes made