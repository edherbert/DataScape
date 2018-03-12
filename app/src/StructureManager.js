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
    let tableIndex = this.getTableIndexById(id);
    this.structure.tables[tableIndex].x = x;
    this.structure.tables[tableIndex].y = y;
  },

  setTableSize: function(id, width, height){
    let tableIndex = this.getTableIndexById(id);
    this.structure.tables[tableIndex].width = width;
    this.structure.tables[tableIndex].height = height;
  },

  removeTable: function(id){
    let tableIndex = this.getTableIndexById(id);
    this.structure.tables.splice(tableIndex, 1);
  }
};

module.exports = new StructureManager();
