const Popup = require('./Popup');
const structureManager = require('../StructureManager');

function ForeignKeySelectionPopup(pageManager){
  this.setup(pageManager);
}

ForeignKeySelectionPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: ForeignKeySelectionPopup,

  listObjects: [],

  setup: function(pageManager){
    this.pageManager = pageManager;
    Popup.prototype.setup.call(this);

    let title = document.createElement('div');
    title.innerHTML = "Select a table";
    title.style.fontSize = "15pt";

    this.backgroundView.append(title);
  },

  popup: function(tableId, editPopup){
    //Remove all the elements that are already in the popup based on the list.
    for(t = 0; t < this.listObjects.length; t++){
      this.listObjects[t].parentNode.removeChild(this.listObjects[t]);
    }
    //Set the list to empty after they've been removed.
    this.listObjects = [];

    Popup.prototype.popup.call(this);

    //Re-add the elements based on the structure.
    let structure = structureManager.getStructure();

    for(t = 0; t < structure.tables.length; t++){
      //Don't include the currently edited table into the list.
      if(structure.tables[t].tableId == tableId) continue;

      let elem = document.createElement('div');
      elem.className = "tableEntry";
      elem.innerHTML = structure.tables[t].title;

      let that = this;
      elem.onclick = function(){
        that.popout();

        editPopup.newRow("", "Foreign Key", true);
      };

      this.backgroundView.append(elem);

      this.listObjects.push(elem);
    }
  },

  backgroundPressed: function(){
    this.popout();
  }
});

module.exports = ForeignKeySelectionPopup;
