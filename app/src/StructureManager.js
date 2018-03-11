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

  getTableIndexById: function(id){
    for(t = 0; t < this.structure.tables.length; t++){
      if(this.structure.tables[t].tableId == id){
        return t;
      }
    }
  },

  getTableById: function(id){
    return this.structure.tables[this.getTableIndexById(id)];
  },

  replaceTable: function(id, table){
    this.structure.tables[this.getTableIndexById(id)] = table;
  },

  setTableTitle: function(id, title){
    this.structure.tables[this.getTableIndexById(id)].title = title;
  },

  setTableTypes: function(id, types){
    this.structure.tables[this.getTableIndexById(id)].types = types;
  },

  pushTable: function(table){
    this.structure.tables.push(table);
  },

  setTablePosition: function(id, x, y){
    this.structure.tables[this.getTableIndexById(id)].x = x;
    this.structure.tables[this.getTableIndexById(id)].y = y;
  }
};

module.exports = new StructureManager();
