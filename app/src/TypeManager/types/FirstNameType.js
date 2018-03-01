const FieldType = require("../FieldType");

function FirstNameType(){
  this.maleNames = ['Liam', 'Jacob', 'William', 'Ethan', 'Nathan', 'James', 'Alex', 'Bilbo'];
  this.femaleNames = ['Emma', 'Olivia', 'Sophie', 'Isabella', 'Abigail', 'Emily', 'Elizabeth', 'Ella', 'Shasdane'];
}

FirstNameType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: FirstNameType,

  Requirements: ["Gender"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(previous.Gender == "Male"){
      target = this.maleNames[Math.floor(Math.random() * this.maleNames.length)];
    }else{
      target = this.femaleNames[Math.floor(Math.random() * this.femaleNames.length)];
    }
    current.FirstName = target;

    return current;
  }
});

module.exports = FirstNameType;
