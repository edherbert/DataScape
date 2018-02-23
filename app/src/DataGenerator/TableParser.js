const typeManager = require('../TypeManager/TypeManager');

function TableParser(){

}

TableParser.prototype = {
  constructor: TableParser,

  //Create a list of the field types that should be generated and in what order.
  parseStructure: function(structure){

    /*for(t = 0; t < structure.tables.length; t++){
      requirements = [];
      for(i = 0; i < structure.tables[t].types.length; i++){
        requirements.push(""+structure.tables[t].types[i].fieldType);
      }
      console.log(typeManager.getRequirements("FirstName"));
      //console.log(requirements[0]);

      //Trace through the requirements
      console.log(" ");
      this.traverseRequirements(requirements);
      //console.log(typeManager.getFieldType(requirements[i]).Requirements);
    }*/

    //Just a test to show the type manager working.
    //typeManager.getFieldType("TestType").generate("hello");
  },

  traverseRequirements: function(requirements){
    console.log(requirements);
    //if(requirements == []) return requirements;
    //if(requirements == []) return;
    for(i = 0; i < requirements.length; i++){
      //if(requirements[i] == "Postcode") continue;
      this.traverseRequirements([] + typeManager.getRequirements(requirements[i]));
      console.log(requirements[i]);
      //console.log(requirements[i]);
    }
    //console.log(requirements);
    //return other.concat(requirements);
  }
};

module.exports = TableParser;
