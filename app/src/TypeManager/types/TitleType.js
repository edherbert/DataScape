const FieldType = require("../FieldType");

function TitleType(){
  this.maleTitles = ['Mr', 'Sir', 'Dr'];
  this.femaleTitles = ['Miss', 'Ms', 'Mrs', 'Dr'];
}

TitleType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: TitleType,

  Requirements: ["Gender"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    if(previous.Gender == "Male"){
      target = this.maleTitles[Math.floor(Math.random() * this.maleTitles.length)];
    }else{
      target = this.femaleTitles[Math.floor(Math.random() * this.femaleTitles.length)];
    }
    current.Title = target;

    return current;
  }
});

module.exports = TitleType;
