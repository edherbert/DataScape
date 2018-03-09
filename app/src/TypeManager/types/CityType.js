const FieldType = require("../FieldType");

function CityType(){
  this.cities = ['Reading', 'London', 'Oxford', 'Cambridge', 'Portsmouth', 'Exeter', 'Plymouth', 'Brighton', 'Blackpool', 'Birmingham', 'Tiverton', 'Aberdeen', 'Swansea', 'Cardiff', 'Dorchester'];
}

CityType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: CityType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = "";
    target = this.cities[Math.floor(Math.random() * this.cities.length)]
    current.City = target;

    return current;
  }
});

module.exports = CityType;
