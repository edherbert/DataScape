const TestType = require('./types/TestType');
const FirstNameType = require('./types/FirstNameType');
const SecondNameType = require('./types/SecondNameType');
const GenderType = require('./types/GenderType');
const PostcodeType = require('./types/PostcodeType');
const RandomColourType = require('./types/RandomColourType'); //Reference/including from another class 

function TypeManager(){
  this.testType = new TestType();
  this.firstNameType = new FirstNameType();
  this.secondNameType = new SecondNameType();
  this.genderType = new GenderType();
  this.postcodeType = new PostcodeType();
  this.randomColourType = new RandomColourType();  //creating the instance
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
        case "SecondName":
          return this.secondNameType;
          break;
        case "Gender":
          return this.genderType;
          break;
        case "Postcode":
          return this.postcodeType;
          break;
		case "Colour":
		  return this.randomColourType;
		  break; //Break is used to stop it from searching when its found the data
        default:
          console.log("No type was found for " + fieldTypeName);
          break;
      }
  },

  getRequirements: function(fieldTypeName){
    return this.getFieldType(fieldTypeName).Requirements;
  }
};

module.exports = new TypeManager; //Exporting instance of typeMananger
