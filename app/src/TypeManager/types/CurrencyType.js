const FieldType = require("../FieldType");

function CurrencyType() {
    this.currency = ['Baht', 'US Dollar', 'Yen', 'Korean Won', 'Pound', 'Euro', 'Rupee', 'Yuan'];
}

CurrencyType.prototype = Object.assign(Object.create(FieldType.prototype), {
    constructor: CurrencyType,

    generate: function(previous) {
        let current = previous;
        if (typeof previous == 'undefined') current = {};

        let target = this.currency[Math.floor(Math.random() * this.currency.length)]
        current.Currency = target;

        return current;
    }
});

module.exports = CurrencyType;
