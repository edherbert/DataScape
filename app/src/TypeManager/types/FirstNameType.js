const FieldType = require("../FieldType");

function FirstNameType(){

}

FirstNameType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: FirstNameType,

  Requirements: ["Gender"],

  generate: function(previous){
    console.log("Generating for the First Name");
  }
});

module.exports = FirstNameType;
