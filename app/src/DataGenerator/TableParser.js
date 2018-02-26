const typeManager = require('../TypeManager/TypeManager');

function TableParser(){

}

TableParser.prototype = {
  constructor: TableParser,

  parseStructure: function(structure){
    for(t = 0; t < structure.tables.length; t++){
      requirements = [];
      for(i = 0; i < structure.tables[t].types.length; i++){
        requirements.push(""+structure.tables[t].types[i].fieldType);
      }

      //console.log(requirements);
      for(i = 0; i < requirements.length; i++){
        if(!this.checkIfListed(requirements[i])){
          this.traverseRequirements(requirements[i]);
          this.done.push(requirements[i]);
        }
      }

      structure.tables[t].typeOrder = this.done;

      //console.log(this.done);
      //Reset the done list after use.
      this.done = [];

      //console.log(typeManager.getRequirements("FirstName"));
    }
    return structure;
  },
  done: [],

  traverseRequirements: function(requirements){
    var newRequirements = typeManager.getRequirements(requirements);
    //Determine if there are any requirements to traverse.
    if(newRequirements.length <= 0){
      //console.log("Empty");
    }else{
      for(y = 0; y < newRequirements.length; y++){
        //Go through them. Check if any of them are undefined (null)
        if(newRequirements[y] == undefined) {
          console.log("undefined in the table parser.");
          continue;
        }
        //If it's not already in the list then add it.
        //If it's already in the list then don't bother traversing it either.
        if(!this.checkIfListed(newRequirements[y])){
          this.traverseRequirements(newRequirements[y]);
          this.done.push(newRequirements[y]);
        }
      }
    }
  },

  //Check if a requirement exists in the done list.
  checkIfListed: function(val){
    var exists = false;
    for(z = 0; z < this.done.length; z++){
      if(val == this.done[z]){
        exists = true;
        break;
      }
    }

    return exists;
  }
};

module.exports = TableParser;
