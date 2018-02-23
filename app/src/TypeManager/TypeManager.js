const TestType = require('./types/TestType');
const FirstNameType = require('./types/FirstNameType');
const GenderType = require('./types/GenderType');
const PostcodeType = require('./types/PostcodeType');

function TypeManager(){
  this.testType = new TestType();
  this.firstNameType = new FirstNameType();
  this.genderType = new GenderType();
  this.postcodeType = new PostcodeType();
}

TypeManager.prototype = {
  getFieldType: function(fieldTypeName){
      switch(fieldTypeName){
        case "TestType":
          return this.testType;
          break;
        case "FirstName":
          return this.firstNameType;
          break;
        case "Gender":
          return this.genderType;
          break;
        case "Postcode":
          return this.postcodeType;
          break;
        default:
          console.log("No type was found for " + fieldTypeName);
          break;
      }
  },

  getRequirements: function(fieldTypeName){
    return this.getFieldType(fieldTypeName).Requirements;
  }
};

module.exports = new TypeManager;
