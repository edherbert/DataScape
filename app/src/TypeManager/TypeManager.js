const TestType = require('./types/TestType');
const FirstNameType = require('./types/FirstNameType');
const SecondNameType = require('./types/SecondNameType');
const GenderType = require('./types/GenderType');
const PostcodeType = require('./types/PostcodeType');
const RandomColourType = require('./types/RandomColourType'); //Reference/including from another class
const BooleanType = require('./types/BooleanType');
const EmailType = require('./types/EmailType');
const PhoneNumberType = require('./types/PhoneNumberType');
const TitleType = require('./types/TitleType');
const AgeType = require('./types/AgeType');
const CityType = require('./types/CityType');
const BornCountry = require('./types/BornCountry');
const ReligionType = require('./types/ReligionType');
const CountyType = require('./types/CountyType');
//
const ShirtSizeType = require('./types/ShirtSizeType');
const MovieTitleType = require('./types/MovieTitleType');


function TypeManager(){
  this.testType = new TestType();
  this.firstNameType = new FirstNameType();
  this.secondNameType = new SecondNameType();
  this.genderType = new GenderType();
  this.postcodeType = new PostcodeType();
  this.randomColourType = new RandomColourType();  //creating the instance
  this.booleanType = new BooleanType();
  this.emailType = new EmailType();
  this.phoneNumberType = new PhoneNumberType();
  this.titleType = new TitleType();
  this.ageType = new AgeType();
  this.cityType = new CityType();
  this.bornCountryType = new BornCountry();
  this.religionType = new ReligionType();
  this.countyType = new CountyType();
  //
  this.shirtSizeType = new ShirtSizeType();
  this.movieTitleType = new MovieTitleType();


  this.typeNames = ["First Name", "Second Name", "Gender", "Postcode", "Random Colour", "Boolean", "Email", 
  "Phone Number", "Title", "Age", "City", "Born Country", "Religion", "County", 
  //
  "Shirt Size",
  "Movie",
  ];
}

TypeManager.prototype = {
  getFieldType: function(fieldTypeName){
      switch(fieldTypeName){
        case "TestType":
          return this.testType;
          break;
        case "First Name":
          return this.firstNameType;
          break;
        case "Second Name":
          return this.secondNameType;
          break;
        case "Gender":
          return this.genderType;
          break;
        case "Postcode":
          return this.postcodeType;
          break;
		    case "Random Colour":
		      return this.randomColourType;
		      break; //Break is used to stop it from searching when its found the data
		    case "Boolean":
			    return this.booleanType;
			    break;
        case "Email":
  			  return this.emailType;
  			  break;
        case "Phone Number":
          return this.phoneNumberType;
          break;
        case "Title":
  			  return this.titleType;
  			  break;
        case "Age":
          return this.ageType;
          break;
        case "City":
          return this.cityType;
          break;
        case "Born Country":
          return this.bornCountryType;
          break;
        case "Religion":
          return this.religionType;
          break;
        case "County":
          return this.countyType;
          break;
        //  
        case "Shirt Size":
          return this.shirtSizeType;
          break;
        case "Movie":
          return this.movieTitleType;
          break; 
           
        default:
          console.log("No type was found for " + fieldTypeName);
          break;
      }
  },

  getRequirements: function(fieldTypeName){
    return this.getFieldType(fieldTypeName).Requirements;
  },

  getTypesList: function(){
    return this.typeNames;
  }
};

module.exports = new TypeManager; //Exporting instance of typeMananger
