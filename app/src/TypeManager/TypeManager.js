const TestType = require('./TestType');

function TypeManager(){
  this.testType = new TestType();
}

TypeManager.prototype = {
  getFieldType: function(fieldTypeName){
      switch(fieldTypeName){
        case "TestType":
          return this.testType;
          break;
      }
  }
};

module.exports = new TypeManager;
