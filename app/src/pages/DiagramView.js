const View = require('./View');
const dataGenerator = require('../DataGenerator/DataGenerator')
const structureManager = require('../StructureManager')

function DiagramView(pageManager){
  this.container = document.getElementById("DiagramView");
  this.pageManager = pageManager;

  document.getElementById("createTableButton").onclick = this.createTableButton.bind(this);
  document.getElementById("returnToSelectionButton").onclick = this.returnToSelection.bind(this);
  document.getElementById("generateDataButton").onclick = this.generateDataButtonPressed.bind(this);

  this.setupMxGraph();
}

constructor: DiagramView,
DiagramView.prototype = Object.assign(Object.create(View.prototype), {

  setupMxGraph: function(){
		mxConnectionHandler.prototype.connectImage = new mxImage('connector.gif', 16, 16);

    this.graph = new mxGraph(document.getElementById("DiagramContainer"));

    this.graph.setConnectable(true);

    this.rubberband = new mxRubberband(this.graph);
    //this.rubberband.defaultOpacity = 1;

    //this.graph.guidesEnabled = true;

    var parent = this.graph.getDefaultParent();

    this.graph.getModel().beginUpdate();

    this.graph.setHtmlLabels(true);
    this.graph.setAllowDanglingEdges(false);

    var tableStyle = new Object();
    tableStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_RECTANGLE;
    tableStyle[mxConstants.STYLE_OPACITY] = 0;
    tableStyle[mxConstants.STYLE_OVERFLOW] = 'fill';
    tableStyle[mxConstants.STYLE_EDITABLE] = 0;
    //tableStyle[mxConstants.STYLE_RESIZABLE] = 0;
    this.graph.getStylesheet().putCellStyle('TABLE_STYLE',tableStyle);

    var edgeStyle = this.graph.getStylesheet().getDefaultEdgeStyle();
    edgeStyle[mxConstants.STYLE_SHAPE] = mxConstants.SHAPE_CONNECTOR;
    edgeStyle[mxConstants.STYLE_EDGE] = "elbowEdgeStyle";
    edgeStyle[mxConstants.STYLE_STROKECOLOR] = "black";
    this.graph.getStylesheet().putCellStyle('EDGE_STYLE',edgeStyle);

    //var v1 = this.graph.insertVertex(parent, null, this.generateTableHTML('Events'), 400, 400, 200, 200, 'TABLE_STYLE');
    //var v2 = this.graph.insertVertex(parent, null, this.generateTableHTML('Clients'), 100, 100, 200, 200, 'TABLE_STYLE');
    //var e1 = this.graph.insertEdge(parent, null, '', v1, v2, 'EDGE_STYLE');

    var that = this;
    var keyHandler = new mxKeyHandler(this.graph);
    keyHandler.bindKey(46, function(evt)
    {
      if (that.graph.isEnabled())
      {
        that.graph.removeCells();
      }
    });
    this.graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
      	var cell = evt.getProperty('cell');
        if(cell!=null){
          //console.log(cell.id);
          //console.log(cell.getValue());

          that.pageManager.popupTableEditorView(cell.getId());
        }
    });

    this.graph.getModel().endUpdate();
  },

  createTableButton: function(){
    let tableData = {title: "New table", requiredAmmount: 10, x: 100, y: 100, width: 200, height: 200, types: []};
    tableData.tableId = this.createTable(tableData);

    structureManager.pushTable(tableData);
  },

  createTable: function(e){
    this.graph.getModel().beginUpdate();
    var table = this.graph.insertVertex(this.graph.getDefaultParent(), null, this.generateTableHTML(e), e.x, e.y, e.width, e.height, 'TABLE_STYLE');
    this.graph.getModel().endUpdate();

    return table.getId();
  },

  returnToSelection: function(){
    this.pageManager.showDatabaseSelectionView();
  },

  generateDataButtonPressed: function(){
      dataGenerator.generateData();
  },

  generateTableHTML: function(table){
    var string = '';
    string += '<table>';
    string += '<tr><th>'+table.title+'</th></tr>';

    for(count = 0; count < table.types.length; count++){
      string += '<tr><td>'+table.types[count].fieldName+'</td></tr>';
    }

    string += '</table>';

    //string = '<table><tr><th>Company</th></tr><tr><th>Hello</th></tr></table>';
    //console.log(string);
    return string;
  },

  setGraphEnabled: function(enabled){
    this.graph.setEnabled(enabled);
  },

  updateTable: function(id){
    let cell = this.graph.getModel().getCell(id);

    this.graph.getModel().setValue(cell, this.generateTableHTML(structureManager.getTableById(id)));
    this.graph.refresh();
  },

  show: function(){
    this.container.style.visibility = "visible";
    this.setGraphEnabled(true);
    this.graph.getModel().setVisible(this.graph.getDefaultParent(), true);
  },

  hide: function(){
    this.container.style.visibility = "hidden";
    this.setGraphEnabled(false);
    this.graph.getModel().setVisible(this.graph.getDefaultParent(), false);
  }
});

module.exports = DiagramView;
