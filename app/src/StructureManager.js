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
    //Get the table's array index from it's mxid.
    for(t = 0; t < this.structure.tables.length; t++){
      if(this.structure.tables[t].tableId == id){
        return t;
      }
    }
  },

  getTableById: function(id){
    //Return the table json by id.
    return this.structure.tables[this.getTableIndexById(id)];
  },

  replaceTable: function(id, table){
    //Override the table data with new data.
    this.structure.tables[this.getTableIndexById(id)] = table;
  },

  setTableTitle: function(id, title){
    this.structure.tables[this.getTableIndexById(id)].title = title;
  },

  setTableTypes: function(id, types){
    //Set the list of field types to use in this table.
    this.structure.tables[this.getTableIndexById(id)].types = types;
  },

  pushTable: function(table){
    //Add a new table json to the list.
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
  },

  addEdge: function(source, target){
    //Create a new edge and add it to the list.
    let newEdge = {originTable: 0, destinationTable: 0, type: "One to many"};
    newEdge.originTable = this.getTableIndexById(source);
    newEdge.destinationTable = this.getTableIndexById(target);

    this.structure.connectors.push(newEdge);
  }
};

module.exports = new StructureManager();
