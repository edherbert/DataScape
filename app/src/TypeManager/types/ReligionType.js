const FieldType = require("../FieldType");

function ReligionType() {
    this.religions = ['Nonreligious', 'Prefer not to say', 'Christianity - Protestant', 'Christianity - Catholic', 'Islam', 'Hinduism', 'Chinese Traditional', 'Buddhism', 'Sikhism', 'Judaism', 'Shinto'];
}

ReligionType.prototype = Object.assign(Object.create(FieldType.prototype), {
    constructor: ReligionType,

    generate: function(previous) {
        let current = previous;
        if (typeof previous == 'undefined') current = {};

        let target = this.religions[Math.floor(Math.random() * this.religions.length)]
        current.Religion = target;

        return current;
    }
});

module.exports = ReligionType;
