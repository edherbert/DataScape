const typeManager = require('../TypeManager/TypeManager');

function TableParser(){

}

TableParser.prototype = {
  constructor: TableParser,

  //Create a list of the field types that should be generated and in what order.
  parseStructure: function(structure){

    //Print out the tables currently available.
    for(i in structure.tables){
      console.log(structure.tables[i]);
    }

    //Just a test to show the type manager working.
    typeManager.getFieldType("TestType").generate("hello");
  }
};

module.exports = TableParser;
