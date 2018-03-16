const FieldType = require("../FieldType");

function CountyType() {
    //this.cities = ['Reading', 'London', 'Oxford', 'Cambridge', 'Portsmouth', 'Exeter', 'Plymouth', 'Brighton', 'Blackpool', 'Birmingham', 'Tiverton', 'Aberdeen', 'Swansea', 'Cardiff', 'Dorchester'];
}

CountyType.prototype = Object.assign(Object.create(FieldType.prototype), {
    constructor: CountyType,

    Requirements: ["City"],

    generate: function(previous) {
        let current = previous;
        if (typeof previous == 'undefined') current = {};

        let city = previous.City;
        let target = "null";

        if (city == "Reading") {
            target = "Berkshire";
        } else if (city == "London") {
            target = "Greater London";
        } else if (city == "Oxford") {
            target = "Oxfordshire";
        } else if (city == "Cambridge") {
            target = "Cambridgeshire";
        } else if (city == "Portsmouth") {
            target = "Hampshire";
        } else if (city == "Plymouth" || city == "Exeter" || city == "Tiverton") {
            target = "Devon";
        } else if (city == "Brighton") {
            target = "East Sussex";
        } else if (city == "Blackpool") {
            target = "Lancashire";
        } else if (city == "Birmingham") {
            target = "Warwickshire";
        } else if (city == "Aberdeen") {
            target = "Aberdeenshire";
        } else if (city == "Swansea") {
            target = "West Glamorgan";
        } else if (city == "Cardiff") {
            target = "South Glamorgan";
        } else if (city == "Dorchester") {
            target = "Dorset";
        }

        current.County = target;

        return current;
    }
});

module.exports = CountyType;
