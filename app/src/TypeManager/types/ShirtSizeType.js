const FieldType = require("../FieldType");

function ShirtSizeType(){
  this.shirtSizes = ['3S', '2S', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];
}

ShirtSizeType.prototype = Object.assign(Object.create(FieldType.prototype), {
  constructor: ShirtSizeType,

  generate: function(previous){
    let current = previous;
    if(typeof previous == 'undefined') current = {};

    let target = this.shirtSizes[Math.floor(Math.random() * this.shirtSizes.length)]
    current['Shirt Size'] = target;

    return current;
  }
});

module.exports = ShirtSizeType;
