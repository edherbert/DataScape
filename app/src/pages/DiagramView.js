const View = require('./View');
const dataGenerator = require('../DataGenerator/DataGenerator')
const structureManager = require('../StructureManager')
const storageManager = require('../StorageManager')

function DiagramView(pageManager) {
    this.container = document.getElementById("DiagramView");
    this.pageManager = pageManager;

    this.saveButton = document.getElementById("saveDatabaseButton");

    document.getElementById("createTableButton").onclick = this.createTableButton.bind(this);
    document.getElementById("returnToSelectionButton").onclick = this.returnToSelection.bind(this);
    document.getElementById("generateDataButton").onclick = this.generateDataButtonPressed.bind(this);
    this.saveButton.onclick = this.saveDatabasePressed.bind(this);

    this.setupMxGraph();
}

constructor: DiagramView,
    DiagramView.prototype = Object.assign(Object.create(View.prototype), {
        //Used to determine whether the diagram should react to insertions and deletions or not.
        //If the diagram is being loaded then this would be set to false.
        ready: false,

        currentDbName: "",

        setupMxGraph: function() {
            //The image that appears when mousing over a table.
            mxConnectionHandler.prototype.connectImage = new mxImage('connector.gif', 16, 16);
            //Create the graph
            this.graph = new mxGraph(document.getElementById("DiagramContainer"));
            //Can the graph contain connectors (edges)
            this.graph.setConnectable(true);
            //Enable rubber band selection.
            this.rubberband = new mxRubberband(this.graph);
            //Store a reference to the parent. This is sort of like the root element.
            var parent = this.graph.getDefaultParent();

            //Allow cells to contain html tags.
            //These will then be interpreted as html, rather than as a label.
            this.graph.setHtmlLabels(true);
            //Don't create edges unless they're attached to something
            this.graph.setAllowDanglingEdges(false);

            //Styles for the table
            var tableStyle = new Object();
            //Hard edges
            tableStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
            tableStyle[mxConstants.STYLE_OPACITY] = 0;
            //Allow the table to fill the entire thing.
            tableStyle[mxConstants.STYLE_OVERFLOW] = 'fill';
            //Don't let the user change the label.
            tableStyle[mxConstants.STYLE_EDITABLE] = 0;
            //Register this style in the stylesheet
            this.graph.getStylesheet().putCellStyle('TABLE_STYLE', tableStyle);

            //Same for edges
            var edgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();
            //Hard edges
            edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
            edgeStyle[mxConstants.STYLE_EDGE] = "elbowEdgeStyle";
            edgeStyle[mxConstants.STYLE_STROKECOLOR] = "black";
            this.graph.getStylesheet().putCellStyle('EDGE_STYLE', edgeStyle);

            this.addCallbacks();
        },

        addCallbacks: function() {
            var that = this;
            var keyHandler = new mxKeyHandler(this.graph);
            //46 is the delete key.
            keyHandler.bindKey(46, function(evt) {
                if (that.graph.isEnabled()) {
                    //Remove the selected cells.
                    that.graph.removeCells();
                }
            });

            //Double click to bring up the table editor popup.
            this.graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt) {
                var cell = evt.getProperty('cell');
                if (cell != null && !cell.edge) {
                    that.pageManager.popupTableEditorView(cell.getId());
                }
            });

            this.graph.addListener(mxEvent.CELLS_ADDED, function(sender, evt) {
                console.log("Cell Added");
                //Change the colour of the save button.
                that.dirtySaveButton();

                if (evt.properties.cells[0].edge && that.ready) {
                    let edge = evt.properties.cells[0];
                    //The added cell is an edge, so add it to the structure manager.
                    //You don't have to do this for the tables as they are added on the button press.
                    structureManager.addEdge(edge.source.id, edge.target.id);
                }
            });

            this.graph.addListener(mxEvent.CELLS_MOVED, function(sender, evt) {
                console.log("Cell Moved");
                that.dirtySaveButton();

                for (t = 0; t < evt.properties.cells.length; t++) {
                    //Don't do anything if an edge is moved, as their position is dependant on the tables they're connected to.
                    if (evt.properties.cells[t].edge) continue;

                    //Register the move with the structure manager.
                    structureManager.setTablePosition(evt.properties.cells[t].id, evt.properties.cells[t].geometry.x, evt.properties.cells[t].geometry.y);
                }
            });

            this.graph.addListener(mxEvent.CELLS_RESIZED, function(sender, evt) {
                console.log("Cell Resized");
                that.dirtySaveButton();

                for (t = 0; t < evt.properties.cells.length; t++) {
                    if (evt.properties.cells[t].edge) continue; //Again, don't do the edges.

                    structureManager.setTableSize(evt.properties.cells[t].id, evt.properties.cells[t].geometry.width, evt.properties.cells[t].geometry.height);
                }
            });

            this.graph.addListener(mxEvent.CELLS_REMOVED, function(sender, evt) {
                console.log("Cell deleted");
                that.dirtySaveButton();

                if (this.ready) {
                    //Remove the cells from the structure manager.
                    //They don't need to be removed from the diagram as they'll already be removed at this point.
                    for (t = 0; t < evt.properties.cells.length; t++) {
                        structureManager.removeTable(evt.properties.cells[t].id);
                    }
                }
            });
        },

        createTableButton: function() {
            //Temporary data.
            let tableData = {
                title: "New table",
                requiredAmmount: 10,
                x: 100,
                y: 100,
                width: 200,
                height: 200,
                types: []
            };
            //Create the table and then set it's mxid.
            tableData.tableId = this.createTable(tableData);

            if (this.ready) {
                //Add the table to the structure manager.
                structureManager.pushTable(tableData);
            }
        },

        createTable: function(e) {
            //Add the table to the graph. This has nothing to do with the storage manager
            this.graph.getModel().beginUpdate();
            let table = this.graph.insertVertex(this.graph.getDefaultParent(), null, this.generateTableHTML(e), e.x, e.y, e.width, e.height, 'TABLE_STYLE');
            this.graph.getModel().endUpdate();

            return table.getId();
        },

        createEdge: function(e, source, target) {
            //Create an edge and return it's mxid.
            this.graph.getModel().beginUpdate();
            let edge = this.graph.insertEdge(this.graph.getDefaultParent(), null, '', this.graph.getModel().getCell(source), this.graph.getModel().getCell(target), 'EDGE_STYLE');
            this.graph.getModel().endUpdate();

            return edge.getId();
        },

        returnToSelection: function() {
            //Leave the diagram editor.
            this.pageManager.showDatabaseSelectionView();
        },

        generateDataButtonPressed: function() {
            //Callback for the data generation popup.
            this.pageManager.popupGeneratedData();
        },

        generateTableHTML: function(table) {
            //Generate html code for a table based on it's values and then return it.
            var string = '';
            string += '<table>';
            string += '<tr><th>' + table.title + '</th></tr>';

            for (count = 0; count < table.types.length; count++) {
                string += '<tr><td>' + table.types[count].fieldName + '</td></tr>';
            }

            string += '</table>';

            return string;
        },

        setGraphEnabled: function(enabled) {
            this.graph.setEnabled(enabled);
        },

        updateTable: function(id) {
            //Set the table html of a certain table.
            let cell = this.graph.getModel().getCell(id);

            this.graph.getModel().setValue(cell, this.generateTableHTML(structureManager.getTableById(id)));
            this.graph.refresh();
        },

        dirtySaveButton: function() {
            this.saveButton.style.backgroundColor = "#ED8291";
        },

        cleanSaveButton: function() {
            this.saveButton.style.backgroundColor = "#bcbcbc";
        },

        saveDatabasePressed: function() {
            //Save the database
            this.cleanSaveButton();

            //Update the storage manager.
            storageManager.saveDatabaseStructure(this.currentDbName);
        },

        show: function(dbName) {
            //Make the diagram visible
            this.cleanSaveButton();
            this.currentDbName = dbName;
            this.container.style.visibility = "visible";
            this.setGraphEnabled(true);
            this.graph.getModel().setVisible(this.graph.getDefaultParent(), true);
        },

        hide: function() {
            this.container.style.visibility = "hidden";
            this.setGraphEnabled(false);
            this.graph.getModel().setVisible(this.graph.getDefaultParent(), false);
        },

        clearDiagram: function() {
            //Remove all the cells in the diagram.
            this.graph.removeCells(this.graph.getChildVertices(this.graph.getDefaultParent()));
        }
    });

module.exports = DiagramView;
