const pageManager = require("./pages/PageManager");
const dataGenerator = require("./DataGenerator/DataGenerator")

//pageManager.showDiagramView();
//pageManager.popupTableEditorView();
pageManager.showDatabaseSelectionView();

pageManager.popupTypeSelection();
/*storageManager.setDatabasesList(["New Database", "Something else"]);
console.log(storageManager.getDatabasesList());
storageManager.storeDatabase({title: "testTable"});
console.log(storageManager.retrieveDatabase("testTable"));*/
