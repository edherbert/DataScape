function StructureManager(){
  this.structure = {};
}

StructureManager.prototype = {
  constructor: StructureManager,

  getStructure: function(){
    return this.structure
  },

  setStructure: function(s){
    this.structure = s;
  },

  getTableById: function(id){
    for(t = 0; t < this.structure.tables.length; t++){
      if(this.structure.tables[t].tableId == id){
        return this.structure.tables[t];
      }
    }
  },

  pushTable: function(table){
    this.structure.tables.push(table);
  }
};

module.exports = new StructureManager();
