const FieldType = require("./FieldType");

function TestType(){

}

TestType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: TestType,

  generate: function(previous){
    console.log("Generating for the test type");
  }
});

module.exports = TestType;
