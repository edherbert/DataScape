const TableParser = require('./TableParser');
const FieldGenerator = require('./FieldGenerator');
const TableLinker = require('./TableLinker');

function DataGenerator(){
  this.tableParser = new TableParser();
  this.fieldGenerator = new FieldGenerator();
  this.tableLinker = new TableLinker();

  //This will be removed in the final version.
  //It's just to show what the input could look like.
  this.testJson = {
    tables: [
      {
        name: "requirements",
        requiredAmmount: 10,
        types: [
          {fieldName: "SecondName", fieldType: "SecondName"},
          {fieldName: "Gender", fieldType: "Gender"},
          {fieldName: "Gender_Second", fieldType: "Gender"},
          {fieldName: "FirstName", fieldType: "FirstName"},
          {fieldName: "testKey", fieldType: "ForeignKey", tableId: 1}
        ]
      },
      {
        name: "AnotherTest",
        requiredAmmount: 10,
        types: [
          {fieldName: "FirstName", fieldType: "Gender"},
          {fieldName: "Postcode", fieldType: "Postcode"},
          {fieldName: "Postcode", fieldType: "Postcode"},
		  {fieldName: "Colour", fieldType: "Colour"},
		  {fieldName: "Boolean", fieldType: "Boolean"},
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

  generateData: function(){
    let parsedTables = this.tableParser.parseStructure(this.testJson);
    //console.log(parsedTables);
    let generatedData = this.fieldGenerator.generateData(parsedTables);

    let linkedTables = this.tableLinker.linkTables(generatedData);

    for(t = 0; t < linkedTables.tables.length; t++){
      for(i = 0; i < linkedTables.tables[t].done.length; i++){
        console.log(linkedTables.tables[t].done[i]);        
      }
    }
  }
};

module.exports = new DataGenerator;
