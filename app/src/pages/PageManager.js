const TestView = require('./TestView');
const DiagramView = require('./DiagramView');
const DataBaseSelectionView = require('./DatabaseSelectionView')
const TableEditorView = require('./TableEditorView')
const dateGenerator = require('../DataGenerator/DataGenerator')
const structureManager = require('../StructureManager')

function PageManager(){
  this.testView = new TestView();
  this.diagramView = new DiagramView(this);
  this.dataBaseSelectionView = new DataBaseSelectionView(this);
  this.tableEditorView = new TableEditorView(this);
}

PageManager.prototype = {
  constructor: PageManager,

  showTestView: function(){
    this.testView.show();
  },

  showDiagramView: function(){
    this.dataBaseSelectionView.hide();
    this.diagramView.show();
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

  loadDatabase: function(){
    let testJson = {
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
    };

    for(i = 0; i < testJson.tables.length; i++){
      testJson.tables[i].tableId = this.diagramView.createTable(testJson.tables[i]);
    }
    structureManager.setStructure(testJson);

  }
};

module.exports = new PageManager();
