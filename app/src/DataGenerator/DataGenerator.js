const TableParser = require('./TableParser');
const FieldGenerator = require('./FieldGenerator');
const TableLinker = require('./TableLinker');
const structureManager = require('../StructureManager');
const GeneratedDataPopup = require('../pages/GeneratedDataPopup');

function DataGenerator(pageManager){
  //Create new instances of the individual parts of the data generator.
  this.tableParser = new TableParser();
  this.fieldGenerator = new FieldGenerator();
  this.tableLinker = new TableLinker();
  this.generatedDataPopup = new GeneratedDataPopup();
  this.pageManager = pageManager;
}

DataGenerator.prototype = {
  constructor: DataGenerator,

  generateData: function(pageManager){
    //Pass the outputted data through the stages of the generator until the finished version is reached.
    let currentStructure = structureManager.getStructure();

    let parsedTables = this.tableParser.parseStructure(currentStructure);

    let generatedData = this.fieldGenerator.generateData(parsedTables);

    let linkedTables = this.tableLinker.linkTables(generatedData);

    return linkedTables;
  }
};

module.exports = DataGenerator;
