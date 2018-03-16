function FieldType() {

}

FieldType.prototype = {
    Requirements: [],

    generate: function(previous) {
        return previous;
    }
};

module.exports = FieldType;
