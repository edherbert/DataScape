const TableParser = require('./TableParser');

function DataGenerator(){
  this.tableParser = new TableParser();

  this.testJson = {
    tables: [
      {
        name: "requirements",
        types: [
          {fieldName: "First Name", fieldType: "FirstName"},
          {fieldName: "Gender", fieldType: "Gender"}
        ]
      },
      {
        name: "AnotherTest",
        types: [
          {fieldName: "address", fieldType: "Address"},
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
    this.tableParser.parseStructure(this.testJson);
  }
};

module.exports = new DataGenerator;
