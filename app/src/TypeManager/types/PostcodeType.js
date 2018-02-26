const FieldType = require("../FieldType");

function PostcodeType(){

}

PostcodeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PostcodeType,

  generate: function(previous){
    console.log("Generating a postcode");
  }
});

module.exports = PostcodeType;
