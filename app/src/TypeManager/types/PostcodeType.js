const FieldType = require("../FieldType");

function PostcodeType(){

}

PostcodeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PostcodeType,

  Requirements: ["FirstName"],

  generate: function(previous){
    console.log("Generating a postcode");
  }
});

module.exports = PostcodeType;
