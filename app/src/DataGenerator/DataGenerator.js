const TableParser = require('./TableParser');

function DataGenerator(){
  this.tableParser = new TableParser();

  //This will be removed in the final version.
  //It's just to show what the input could look like.
  this.testJson = {
    tables: [
      {
        name: "requirements",
        types: [
          {fieldName: "FirstName", fieldType: "FirstName"},
          {fieldName: "Gender", fieldType: "Gender"}
        ]
      },
      {
        name: "AnotherTest",
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
  }
};

module.exports = new DataGenerator;
