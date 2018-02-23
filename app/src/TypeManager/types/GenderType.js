const FieldType = require("../FieldType");

function GenderType(){

}

GenderType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: GenderType,

  generate: function(previous){
    console.log("Generating for the Gender");
  }
});

module.exports = GenderType;
