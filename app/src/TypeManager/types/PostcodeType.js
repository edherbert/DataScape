const FieldType = require("../FieldType");

function PostcodeType(){

}

PostcodeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PostcodeType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};
    current.Postcode = "PO4 9LD";

    return current;
  }
});

module.exports = PostcodeType;
