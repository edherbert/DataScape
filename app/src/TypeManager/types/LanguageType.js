const FieldType = require("../FieldType");

function LanguageType(){
  this.languages = ['Thai', 'English', 'Chinese', 'Korean', 'Japanese', 'French'];
}

LanguageType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: LanguageType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.languages[Math.floor(Math.random() * this.languages.length)]
    current.Language = target;

    return current;
  }
});

module.exports = LanguageType;
