const TestView = require('./TestView');
const DiagramView = require('./DiagramView');
const DataBaseSelectionView = require('./DatabaseSelectionView');
const TableEditorView = require('./TableEditorView');
const dateGenerator = require('../DataGenerator/DataGenerator');
const structureManager = require('../StructureManager');
const storageManager = require('../StorageManager');
const DatabaseCreationPopup = require('./DatabaseCreationPopup');
const TypeSelectionPopup = require('./TypeSelectionPopup');
const DatabaseEditPopup = require('./DatabaseEditPopup');
const ConfirmDeletePopup = require('./ConfirmDeletePopup');
const ForeignKeySelectionPopup = require('./ForeignKeySelectionPopup');
const GeneratedDataPopup = require('./GeneratedDataPopup');

function PageManager(){
  this.testView = new TestView();
  this.diagramView = new DiagramView(this);
  this.dataBaseSelectionView = new DataBaseSelectionView(this);
  this.tableEditorView = new TableEditorView(this);
  this.databaseCreationPopup = new DatabaseCreationPopup(this);
  this.typeSelectionPopup = new TypeSelectionPopup(this);
  this.databaseEditPopup = new DatabaseEditPopup(this);
  this.confirmDeletePopup = new ConfirmDeletePopup(this);
  this.foreignKeySelectionPopup = new ForeignKeySelectionPopup(this);
  this.generatedDataPopup = new GeneratedDataPopup(this);
}

PageManager.prototype = {
  constructor: PageManager,

  showTestView: function(){
    this.testView.show();
  },

  showDiagramView: function(dbName){
    //If no database could be loaded then don't show the view.
    if(!this.loadDatabase(dbName)) {
      alert("There was a problem loading this database.");
      return;
    }
    this.dataBaseSelectionView.hide();
    this.diagramView.show(dbName);
  },

  showDatabaseSelectionView: function(){
    this.diagramView.hide();
    this.dataBaseSelectionView.show();
  },

  popupTableEditorView: function(id){
    this.diagramView.setGraphEnabled(false);
    this.tableEditorView.popup(id);
  },

  popoutTableSelection: function(){
    this.diagramView.setGraphEnabled(true);
    this.diagramView.updateTable(this.tableEditorView.currentId);
    this.tableEditorView.popout();
  },

  popupTypeSelection: function(typeContainer){
    this.typeSelectionPopup.popup(typeContainer);
  },

  popoutTypeSelection: function(){
    this.typeSelectionPopup.popout();
  },

  loadDatabase: function(title){
    this.diagramView.ready = false;
    let db = storageManager.retrieveDatabase(title);
    if(db == null) return false;

    this.diagramView.clearDiagram();

    for(i = 0; i < db.tables.length; i++){
      db.tables[i].tableId = this.diagramView.createTable(db.tables[i]);
    }

    structureManager.setStructure(db);

    for(t = 0; t < db.connectors.length; t++){
      let start = db.tables[db.connectors[t].originTable].tableId;
      let target = db.tables[db.connectors[t].destinationTable].tableId;

      db.connectors[t].connectorId = this.diagramView.createEdge(db.connectors[t], start, target);
    }

    this.diagramView.ready = true;
    structureManager.setStructure(db);

    return true;
  },

  popupDatabaseEdit: function(dbId, dbContainer){
    this.databaseEditPopup.popup(dbId, dbContainer);
  },

  popupDatabaseCreation: function(dbSelectionView){
    this.databaseCreationPopup.dbSelectionView = dbSelectionView;
    this.databaseCreationPopup.popup(this);
  },

  popupConfirmDelete: function(dbId, dbContainer){
   this.confirmDeletePopup.popup(dbId, dbContainer);
  },

  popupGeneratedData: function(generatedData){
    this.generatedDataPopup.popup(generatedData);
  },

  popupForeignKeySelection: function(tableId, editPopup){
    this.foreignKeySelectionPopup.popup(tableId, editPopup);
  },


  dirtyDiagramSaveButton: function(){
    this.diagramView.dirtySaveButton();
  },

};

module.exports = new PageManager();
