const View = require('./View');
const structureManager = require('../StructureManager')

function TableEditorView(pageManager){
  this.pageManager = pageManager;

  this.container = document.getElementById("TableEditorView");
  this.tableContainer = document.getElementById("TableEditorTableContainer");
  this.tableTitleInput = document.getElementById("tableTitleField");


  //Create the base of the table, the headers are added during the clear
  this.table = document.createElement('table');
  this.tableContainer.append(this.table);

  this.clearRows();

  this.container.onclick = this.backgroundPressed.bind(this);
  document.getElementById("newRowButton").onclick = this.newRowButtonPressed.bind(this);
}

TableEditorView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: TableEditorView,
  speed: 0.2,

  //Make the view appear as a popup, rather than as something that fills the entire screen.
  popup: function(id){
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
      this.newRow(fieldTypes[r].fieldName, fieldTypes[r].fieldType);
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

  newRow: function(name, fieldType){
    var row = document.createElement('tr');
    var first = document.createElement('td');
    var second = document.createElement('td');

    var input = document.createElement('input');
    input.value = name;
    first.append(input);

    second.innerHTML = fieldType;

    row.append(first);
    row.append(second);
    this.table.append(row);
  },

  popout: function(){
    this.container.style.animation = "fadeOut "+this.speed+"s";

    //Hide after the ammount of time the animation takes. This is just so the user can actually see the animation.
    var that = this;
    setTimeout(function(){
      that.hide();
    }, this.speed * 1000);
  },

  backgroundPressed: function(e){
    //Make the event not fire on a child of the background.
    if(e.target != this.container) return;
    this.pageManager.popoutTableSelection();
  },

  newRowButtonPressed: function(){
    this.newRow();
  }
});

module.exports = TableEditorView;
