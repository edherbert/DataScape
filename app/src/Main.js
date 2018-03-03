const pageManager = require("./pages/PageManager");
const dataGenerator = require("./DataGenerator/DataGenerator")

pageManager.showDiagramView();
pageManager.popupTableEditorView();
//pageManager.showDatabaseSelectionView();

dataGenerator.generateData();
