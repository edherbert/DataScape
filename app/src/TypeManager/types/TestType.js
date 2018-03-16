const FieldType = require("../FieldType");

function TestType() {

}

TestType.prototype = Object.assign(Object.create(FieldType.prototype), {
    constructor: TestType,

    generate: function(previous) {
        let current = previous;
        if (typeof previous == 'undefined') current = {};
        current.Test = "This is a test";

        return current;
    }
});

module.exports = TestType;
