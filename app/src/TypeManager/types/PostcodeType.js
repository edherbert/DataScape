const FieldType = require("../FieldType");

function PostcodeType(){
    this.characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
}

PostcodeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: PostcodeType,

  Requirements: ["City"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    let cityCode = previous.City.substring(0,2).toUpperCase();
    let randChar = this.characters[Math.floor(Math.random() * this.characters.length)];
    let randChars = this.randChar + this.randChar;
    let randNum = String(Math.floor(Math.random() * 9))

    target = this.cityCode + this.randNum + " " + this.randNum + this.randChars

    current.Postcode = target;
    return current;
  }
});

module.exports = PostcodeType;
