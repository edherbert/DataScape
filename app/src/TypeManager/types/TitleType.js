const FieldType = require("../FieldType");

function TitleType() {
    this.maleTitles = ['Mr'];
    this.femaleTitles = ['Miss', 'Ms', 'Mrs'];
    this.uncommonTitlesMale = ['Dr', 'Sir'];
    this.uncommonTitlesFemale = ['Dr'];
}

TitleType.prototype = Object.assign(Object.create(FieldType.prototype), {
    constructor: TitleType,

    Requirements: ["Gender"],

    generate: function(previous) {
        let current = previous;
        if (typeof previous == 'undefined') current = {};

        let target;
        if (previous.Gender == "Male") {
            if (Math.floor(Math.random() * 9) == 5) {
                target = this.uncommonTitlesMale[Math.floor(Math.random() * this.uncommonTitlesMale.length)];
            } else {
                target = this.maleTitles[Math.floor(Math.random() * this.maleTitles.length)];
            }
        } else {
            if (Math.floor(Math.random() * 9) == 5) {
                target = this.uncommonTitlesFemale[Math.floor(Math.random() * this.uncommonTitlesFemale.length)];
            } else {
                target = this.femaleTitles[Math.floor(Math.random() * this.femaleTitles.length)];
            }
        }
        current.Title = target;

        return current;
    }
});

module.exports = TitleType;
