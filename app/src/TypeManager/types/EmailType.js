const FieldType = require("../FieldType");

function EmailType(){
	this.emailService = ['@gmail', '@yahoo', '@hotmail', '@outlook'];
  this.emailEnding = ['.com', '.co.uk'];
}

EmailType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: EmailType,

  Requirements: ["FirstName", "SecondName"],

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let targetService = "";
		let targetEnding = "";
    targetService = this.emailService[Math.floor(Math.random() * this.emailService.length)];
    targetEnding = this.emailEnding[Math.floor(Math.random() * this.emailEnding.length)];
    current.Email = previous.FirstName + previous.SecondName + this.targetService + this.targetEnding;

    return current;
  }
});

module.exports = EmailType;
