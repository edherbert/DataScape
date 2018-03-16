function TableLinker() {

}

TableLinker.prototype = {
    linkTables: function(previous) {
        for (t = 0; t < previous.tables.length; t++) {
            //Go through all tables are create an intermediate place to store the finished data.
            previous.tables[t].done = [];
            //Go through the tables for the ammount of data that would be generated.
            for (i = 0; i < previous.tables[t].requiredAmmount; i++) {
                //Temporary place to store the data before it's pushed.
                let temp = {};

                //Go over all the types in the table.
                for (x = 0; x < previous.tables[t].types.length; x++) {
                    let fieldType = previous.tables[t].types[x].fieldType;
                    //If the value is a foreign key then assign it a value between the bounds.
                    if (fieldType == "Foreign Key") {
                        //Get the table that the foreign key references and get it's size.
                        //Then generate a random number between that. This will be used as the foreign key.

                        //temp[previous.tables[t].types[x].fieldName] = Math.floor(Math.random() * randomAmmount);
                    } else {
                        //Assign temp the generated value under it's desired name.
                        //If a table has the same name for a field twice this will make it only appear once.
                        temp[previous.tables[t].types[x].fieldName] = previous.tables[t].data[i][fieldType];
                    }
                }
                //Push the new value into the json.
                previous.tables[t].done.push(temp);
            }
            //At this point the generated data can be deleted to conserve memory.
            delete previous.tables[t].data;
        }

        return previous;
    }
};

module.exports = TableLinker;
