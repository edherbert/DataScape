const typeManager = require('../TypeManager/TypeManager');

function TableParser() {

}

TableParser.prototype = {
    constructor: TableParser,

    parseStructure: function(structure) {
        for (t = 0; t < structure.tables.length; t++) {
            requirements = [];
            //Go through the tables and make a list of the requirements.
            for (i = 0; i < structure.tables[t].types.length; i++) {
                //Push as a string.
                requirements.push("" + structure.tables[t].types[i].fieldType);
            }

            for (i = 0; i < requirements.length; i++) {
                //If the requirement is a normal field type (not a foreign Key).
                if (requirements[i] != "Foreign Key") {
                    if (!this.checkIfListed(requirements[i])) {
                        //Go through the requirements and add them to the list.
                        this.traverseRequirements(requirements[i]);
                        this.done.push(requirements[i]);
                    }
                }
            }

            structure.tables[t].typeOrder = this.done;

            //Reset the done list after use.
            this.done = [];
        }
        return structure;
    },
    done: [],

    traverseRequirements: function(requirements) {
        //Recursively search the requirement tree until the leaf nodes are found.
        var newRequirements = typeManager.getRequirements(requirements);
        //Determine if there are any requirements to traverse.
        if (newRequirements.length <= 0) {
            //console.log("Empty");
        } else {
            for (y = 0; y < newRequirements.length; y++) {
                //Go through them. Check if any of them are undefined (null)
                if (newRequirements[y] == undefined) {
                    console.log("undefined in the table parser.");
                    continue;
                }
                //If it's not already in the list then add it.
                //If it's already in the list then don't bother traversing it either.
                if (!this.checkIfListed(newRequirements[y])) {
                    this.traverseRequirements(newRequirements[y]);
                    this.done.push(newRequirements[y]);
                }
            }
        }
    },

    //Check if a requirement exists in the done list.
    checkIfListed: function(val) {
        var exists = false;
        for (z = 0; z < this.done.length; z++) {
            if (val == this.done[z]) {
                exists = true;
                break;
            }
        }

        return exists;
    }
};

module.exports = TableParser;
