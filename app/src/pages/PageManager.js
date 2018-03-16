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
const ForeignKeySelectionPopup = require('./ForeignKeySelectionPopup');
const GeneratedDataPopup = require('./GeneratedDataPopup');
const DataGenerator = require('../DataGenerator/DataGenerator');

function PageManager() {
    //Create new instances of the views it has to manage
    this.testView = new TestView();
    this.diagramView = new DiagramView(this);
    this.dataBaseSelectionView = new DataBaseSelectionView(this);
    this.tableEditorView = new TableEditorView(this);
    this.databaseCreationPopup = new DatabaseCreationPopup(this);
    this.typeSelectionPopup = new TypeSelectionPopup(this);
    this.databaseEditPopup = new DatabaseEditPopup(this);
    this.confirmDeletePopup = new ConfirmDeletePopup(this);
    this.foreignKeySelectionPopup = new ForeignKeySelectionPopup(this);
    this.generatedDataPopup = new GeneratedDataPopup(this);

    //The data generator is created and stored by the page manager.
    this.dataGenerator = new DataGenerator(this);
}

PageManager.prototype = {
    constructor: PageManager,

    showTestView: function() {
        this.testView.show();
    },

    showDiagramView: function(dbName) {
        //If no database could be loaded then don't show the view.
        if (!this.loadDatabase(dbName)) {
            alert("There was a problem loading this database.");
            return;
        }
        this.dataBaseSelectionView.hide();
        this.diagramView.show(dbName);
    },

    showDatabaseSelectionView: function() {
        this.diagramView.hide();
        this.dataBaseSelectionView.show();
    },

    popupTableEditorView: function(id) {
        //Disable editing the graph when it's not active.
        this.diagramView.setGraphEnabled(false);
        this.tableEditorView.popup(id);
    },

    popoutTableSelection: function() {
        //Re-enable graph editing.
        this.diagramView.setGraphEnabled(true);
        this.diagramView.updateTable(this.tableEditorView.currentId);
        this.tableEditorView.popout();
    },

    popupTypeSelection: function(typeContainer) {
        this.typeSelectionPopup.popup(typeContainer);
    },

    popoutTypeSelection: function() {
        this.typeSelectionPopup.popout();
    },

    loadDatabase: function(title) {
        //Load the database into the diagram
        //Set the diagram to not ready (meaning it won't process events when tables are added, as here they're not being added by the user).
        this.diagramView.ready = false;
        //Get the database from storage and check it exists.
        let db = storageManager.retrieveDatabase(title);
        if (db == null) return false;

        //Remove everything from the current diagram.
        this.diagramView.clearDiagram();

        //Add the tables.
        for (i = 0; i < db.tables.length; i++) {
            db.tables[i].tableId = this.diagramView.createTable(db.tables[i]);
        }

        //Add the current tables to the structure manager.
        //This is so the edges can be added correctly (they need tables with mxids to reference).
        structureManager.setStructure(db);

        //Go through the connectors
        for (t = 0; t < db.connectors.length; t++) {
            //Determine the start and destination tables.
            let start = db.tables[db.connectors[t].originTable].tableId;
            let target = db.tables[db.connectors[t].destinationTable].tableId;

            //Get the diagram view to create these edges.
            db.connectors[t].connectorId = this.diagramView.createEdge(db.connectors[t], start, target);
        }

        //Make the diagram view accept events again.
        this.diagramView.ready = true;
        structureManager.setStructure(db);

        return true;
    },

    popupDatabaseEdit: function(dbId, dbContainer) {
        this.databaseEditPopup.popup(dbId, dbContainer);
    },

    popupDatabaseCreation: function(dbSelectionView) {
        //This is so it knows which view to reference.
        this.databaseCreationPopup.dbSelectionView = dbSelectionView;
        this.databaseCreationPopup.popup(this);
    },

    popupConfirmDelete: function(dbId, dbContainer) {
        this.confirmDeletePopup.popup(dbId, dbContainer);
    },

    createDataGenerator: function() {
        this.dataGenerator.generateData(this);
    },

    popupGeneratedData: function(generatedData) {
        //Generate the data and then present it to the user
        let data = this.dataGenerator.generateData();
        this.generatedDataPopup.popup(data);
    },

    popupForeignKeySelection: function(tableId, editPopup) {
        this.foreignKeySelectionPopup.popup(tableId, editPopup);
    },

    dirtyDiagramSaveButton: function() {
        this.diagramView.dirtySaveButton();
    },

};

module.exports = new PageManager();
