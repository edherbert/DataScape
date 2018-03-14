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

function PageManager(){
  this.testView = new TestView();
  this.diagramView = new DiagramView(this);
  this.dataBaseSelectionView = new DataBaseSelectionView(this);
  this.tableEditorView = new TableEditorView(this);
  this.databaseCreationPopup = new DatabaseCreationPopup(this);
  this.typeSelectionPopup = new TypeSelectionPopup(this);
  this.databaseEditPopup = new DatabaseEditPopup(this);
  this.confirmDeletePopup = new ConfirmDeletePopup(this);
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
    console.log("Clearning");
    this.diagramView.clearDiagram();


    /*let testJson = {
      tables: [
        {
          title: "requirements",
          requiredAmmount: 10,
          x: 100,
          y: 200,
          width: 200,
          height: 200,
          types: [
            {fieldName: "SecondName", fieldType: "SecondName"},
            {fieldName: "Gender", fieldType: "Gender"},
            {fieldName: "Gender_Second", fieldType: "Gender"},
            {fieldName: "FirstName", fieldType: "FirstName"},
            {fieldName: "testKey", fieldType: "ForeignKey", tableId: 1}
          ]
        },
        {
          title: "AnotherTest",
          requiredAmmount: 10,
          x: 500,
          y: 300,
          width: 200,
          height: 200,
          types: [
            {fieldName: "FirstName", fieldType: "Gender"},
            {fieldName: "Postcode", fieldType: "Postcode"},
            {fieldName: "Postcode", fieldType: "Postcode"}
          ]
        },
      ],
      connectors: [
        {originTable: 0, destinationTable: 1, type: "One to many"}
      ]
    };*/

    console.log("Tables");
    for(i = 0; i < db.tables.length; i++){
      db.tables[i].tableId = this.diagramView.createTable(db.tables[i]);
    }

    structureManager.setStructure(db);

    console.log("Edges");
    for(t = 0; t < db.connectors.length; t++){
      console.log(t);

      let start = db.tables[db.connectors[t].originTable].tableId;
      let target = db.tables[db.connectors[t].destinationTable].tableId;
      //console.log(db.connectors[t]);

      //destinationTable
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


  dirtyDiagramSaveButton: function(){
    this.diagramView.dirtySaveButton();
  },

};

module.exports = new PageManager();
