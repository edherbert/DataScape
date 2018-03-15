const TableParser = require('./TableParser');
const FieldGenerator = require('./FieldGenerator');
const TableLinker = require('./TableLinker');
const structureManager = require('../StructureManager');
const GeneratedDataPopup = require('../pages/GeneratedDataPopup');

function DataGenerator(pageManager){
  this.tableParser = new TableParser();
  this.fieldGenerator = new FieldGenerator();
  this.tableLinker = new TableLinker();
  this.generatedDataPopup = new GeneratedDataPopup();
  this.pageManager = pageManager;

  //This will be removed in the final version.
  //It's just to show what the input could look like.
  /*this.testJson = {
    tables: [
      {
        title: "requirements",
        requiredAmmount: 10,
        types: [
          {fieldName: "SecondName", fieldType: "Second Name"},
          {fieldName: "Gender", fieldType: "Gender"},
          {fieldName: "Gender_Second", fieldType: "Gender"},
          {fieldName: "FirstName", fieldType: "First Name"},
          {fieldName: "testKey", fieldType: "ForeignKey", tableId: 1}
        ]
      },
      {
        title: "AnotherTest",
        requiredAmmount: 10,
        types: [
          {fieldName: "FirstName", fieldType: "Gender"},
          {fieldName: "Postcode", fieldType: "Postcode"},
          {fieldName: "Postcode", fieldType: "Postcode"},
    		  {fieldName: "Colour", fieldType: "Random Colour"},
    		  {fieldName: "Boolean", fieldType: "Boolean"},

          {fieldName: "title", fieldType: "Title"},
          {fieldName: "email", fieldType: "Email"},
          {fieldName: "City", fieldType: "City"},
          {fieldName: "Age", fieldType: "Age"},
          {fieldName: "BornCountry", fieldType: "Born Country"}
        ]
      },
    ],
    connectors: [
      {originTable: 0, destinationTable: 1, type: "One to many"}
    ]
  };*/

  this.testJson = {
    tables: [
      {
        title: "requirements",
        requiredAmmount: 10,
        types: [
          {fieldName: "SecondName", fieldType: "Second Name"},
          {fieldName: "Gender", fieldType: "Gender"},
          {fieldName: "Gender_Second", fieldType: "Gender"},
          {fieldName: "FirstName", fieldType: "First Name"},
          {fieldName: "testKey", fieldType: "ForeignKey", tableId: 1}
        ]
      },
      {
        title: "AnotherTest",
        requiredAmmount: 10,
        types: [
          {fieldName: "FirstName", fieldType: "Gender"},
          {fieldName: "Postcode", fieldType: "Postcode"},
          {fieldName: "Postcode", fieldType: "Postcode"},
    		  {fieldName: "Colour", fieldType: "Random Colour"},
    		  {fieldName: "Boolean", fieldType: "Boolean"},

          {fieldName: "title", fieldType: "Title"},
          {fieldName: "email", fieldType: "Email"},
          {fieldName: "City", fieldType: "City"},
          {fieldName: "Age", fieldType: "Age"},
          {fieldName: "BornCountry", fieldType: "Born Country"},
        ]
      },
    ],
    connectors: [
      {originTable: 0, destinationTable: 1, type: "One to many"}
    ]
  };
}

DataGenerator.prototype = {
  constructor: DataGenerator,

  generateData: function(pageManager){
    let currentStructure = structureManager.getStructure();

    let parsedTables = this.tableParser.parseStructure(currentStructure);

    //console.log(parsedTables);
    let generatedData = this.fieldGenerator.generateData(parsedTables);

    let linkedTables = this.tableLinker.linkTables(generatedData);

    let data = "";
    for(t = 0; t < linkedTables.tables.length; t++){
      for(i = 0; i < linkedTables.tables[t].done.length; i++){
        console.log(linkedTables.tables[t].done[i]);
        //pageManager.popupGeneratedData.popup(linkedTables.tables[t].done[i]);
        data.concat(linkedTables.tables[t].done[i]);
      }
    }
    pageManager.popupGeneratedData(data);
  }
};

module.exports = DataGenerator;
