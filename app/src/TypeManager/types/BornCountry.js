const FieldType = require("../FieldType");

function CountryType(){
  this.country = ['England', 'Scoland', 'Ireland', 'Poland', 'India', 'Pakistan', 'Germany', 'South Africa', 'United State', 'Australia', 'China'];
}

CountryType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: CountryType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = this.country[Math.floor(Math.random() * this.country.length)]
    current['Born Country'] = target;

    return current;
  }
});

module.exports = CountryType;
