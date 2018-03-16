const typeManager = require('../TypeManager/TypeManager');

function FieldGenerator() {

}

FieldGenerator.prototype = {
    generateData: function(parsedTables) {
        //Go through each table and generate it's data

        for (t = 0; t < parsedTables.tables.length; t++) {
            parsedTables.tables[t].data = [];

            //Traverse the list by types, rather than tables.
            //This will avoid having to jump around through memory as all the types can be batched together.
            for (f = 0; f < parsedTables.tables[t].typeOrder.length; f++) {
                //Store the type so the lookup only has to happen once.
                let type = typeManager.getFieldType(parsedTables.tables[t].typeOrder[f]);
                //Generate it for the required ammount
                for (y = 0; y < parsedTables.tables[t].requiredAmmount; y++) {
                    //Generate the data.
                    parsedTables.tables[t].data[y] = type.generate(parsedTables.tables[t].data[y]);
                }
            }
        }

        return parsedTables;
    }
};

module.exports = FieldGenerator;
