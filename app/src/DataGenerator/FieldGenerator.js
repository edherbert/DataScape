const typeManager = require('../TypeManager/TypeManager');

function FieldGenerator(){

}

FieldGenerator.prototype = {
  generateData: function(parsedTables){
    //Go through each table and generate it's data

    for(t = 0; t < parsedTables.tables.length; t++){
      parsedTables.tables[t].data = [];

      //Do this based on types.
      //This will avoid me having to do a lookup of the type each time it's needed.
      //Rather than it does all of each type once.
      for(f = 0; f < parsedTables.tables[t].typeOrder.length; f++){
        let type = typeManager.getFieldType(parsedTables.tables[t].typeOrder[f]);
        for(y = 0; y < parsedTables.tables[t].requiredAmmount; y++){
          parsedTables.tables[t].data[y] = type.generate(parsedTables.tables[t].data[y]);
          console.log(parsedTables.tables[t].data[y]);
        }
      }
    }

    return parsedTables;
  }
};

module.exports = FieldGenerator;
