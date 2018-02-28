const TableParser = require('./TableParser');
const FieldGenerator = require('./FieldGenerator');

function DataGenerator(){
  this.tableParser = new TableParser();
  this.fieldGenerator = new FieldGenerator();

  //This will be removed in the final version.
  //It's just to show what the input could look like.
  this.testJson = {
    tables: [
      {
        name: "requirements",
        requiredAmmount: 10,
        types: [
          {fieldName: "FirstName", fieldType: "FirstName"},
          {fieldName: "Gender", fieldType: "Gender"},
          {fieldName: "SecondName", fieldType: "SecondName"},
          {fieldName: "testKey", fieldType: "ForeignKey", tableId: 1}
        ]
      },
      {
        name: "AnotherTest",
        requiredAmmount: 10,
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
}

DataGenerator.prototype = {
  constructor: DataGenerator,

  generateData: function(){
    let passedTables = this.tableParser.parseStructure(this.testJson);
    console.log(passedTables);
    this.fieldGenerator.generateData(passedTables);
  }
};

module.exports = new DataGenerator;
