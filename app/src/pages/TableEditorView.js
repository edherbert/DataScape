const View = require('./View');
const structureManager = require('../StructureManager');

function TableEditorView(pageManager){
  this.pageManager = pageManager;

  this.container = document.getElementById("TableEditorView");
  this.tableContainer = document.getElementById("TableEditorTableContainer");
  this.tableTitleInput = document.getElementById("tableTitleField");

  let that = this;
  this.tableTitleInput.oninput = function(){
    that.changeMade();
  };

  this.currentId = 0;

  this.nameBoxes = [];
  this.typeBoxes = [];

  //Create the base of the table, the headers are added during the clear
  this.table = document.createElement('table');
  this.tableContainer.append(this.table);

  this.clearRows();

  this.container.onclick = this.backgroundPressed.bind(this);
  document.getElementById("newRowButton").onclick = this.newRowButtonPressed.bind(this);
  document.getElementById("addForeignKeyButton").onclick = this.ForeignKeyButtonPressed.bind(this);
}

TableEditorView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: TableEditorView,
  speed: 0.2,

  //Make the view appear as a popup, rather than as something that fills the entire screen.
  popup: function(id){
    this.currentId = id;
    let table = structureManager.getTableById(id);
    if(!table) return;

    this.setupRows(table.types);
    this.tableTitleInput.value = table.title;

    this.show();
    this.container.style.animation = "fadeIn "+this.speed+"s";
  },

  setupRows: function(fieldTypes){
    this.clearRows();
    for(r = 0; r < fieldTypes.length; r++){
      let foreignKey = false;
      if(fieldTypes[r].fieldType == "Foreign Key") foreignKey = true;
      this.newRow(fieldTypes[r].fieldName, fieldTypes[r].fieldType, foreignKey);
    }
  },

  clearRows: function(){
    while (this.table.firstChild) {
      this.table.removeChild(this.table.firstChild);
    }

    var heading = document.createElement('tr');
    var heading1 = document.createElement('th');
    heading1.innerHTML = "Field Name";
    var heading2 = document.createElement('th');
    heading2.innerHTML = "Field Type";

    heading.append(heading1);
    heading.append(heading2);
    this.table.append(heading);
  },

  newRow: function(name, fieldType, foreignKey, tableId){
    var row = document.createElement('tr');
    var first = document.createElement('td');
    var second = document.createElement('td');

    var third = document.createElement('td');
    let image = document.createElement('img');
    image.src = "cross.png";
    image.className = "FieldRemoveCross";
    third.append(image);

    let nameInput = document.createElement('input');
    nameInput.value = name;
    first.append(nameInput);

    let typeButton = document.createElement('div');
    typeButton.innerHTML = fieldType;
    typeButton.className = "FieldTypeButton";
    second.append(typeButton);

    let that = this;
    if(!foreignKey){
      typeButton.onclick = function(e){
        that.pageManager.popupTypeSelection(e.target);
      }
    }else{
      typeButton.tableId = tableId;
      typeButton.style['background-color'] = "#82D47F";
      typeButton.style['cursor'] = "default";
    }

    image.onclick = function(e){
      //Get the parent's parent of the clicked element (the row) and remove it.
      let targetRow = e.target.parentElement.parentElement;
      that.table.removeChild(targetRow);

      //Remove it from the name and type boxes.
      for(t = 0; t < that.nameBoxes.length; t++){
        //Check if the name box's row is the same as the one to delete.
        if(that.nameBoxes[t].parentElement.parentElement == targetRow){
          that.nameBoxes.splice(t, 1);
          that.typeBoxes.splice(t, 1);
          break;
        }
      }
      that.changeMade();
    }

    this.nameBoxes.push(nameInput);
    this.typeBoxes.push(typeButton);

    row.append(first);
    row.append(second);
    row.append(third);
    this.table.append(row);
  },

  updateStructureManager: function(){
    let tempTable = [];

    for(t = 0; t < this.nameBoxes.length; t++){
      let data = {fieldName: this.nameBoxes[t].value, fieldType: this.typeBoxes[t].innerHTML};

      if(this.typeBoxes[t].innerHTML == "Foreign Key"){
        data.tableId = this.typeBoxes[t].tableId;
      }
      tempTable.push(data);
    }

    structureManager.setTableTitle(this.currentId, this.tableTitleInput.value);
    structureManager.setTableTypes(this.currentId, tempTable);
  },

  popout: function(){
    this.currentId = 0;
    this.container.style.animation = "fadeOut "+this.speed+"s";

    this.nameBoxes = [];
    this.typeBoxes = [];

    //Hide after the ammount of time the animation takes. This is just so the user can actually see the animation.
    var that = this;
    setTimeout(function(){
      that.hide();
    }, this.speed * 1000);
  },

  backgroundPressed: function(e){
    //Make the event not fire on a child of the background.
    if(e.target != this.container) return;
    this.updateStructureManager();
    this.pageManager.popoutTableSelection();
  },

  newRowButtonPressed: function(){
    this.newRow("", "Field Type", false);
    this.changeMade();
  },

  ForeignKeyButtonPressed: function(){
    this.pageManager.popupForeignKeySelection(this.currentId, this);
    this.changeMade();
  },

  changeMade: function(){
    this.pageManager.dirtyDiagramSaveButton();
  }
});

module.exports = TableEditorView;
