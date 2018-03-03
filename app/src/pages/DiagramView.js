const View = require('./View');
const dataGenerator = require('../DataGenerator/DataGenerator')

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

    var v1 = this.graph.insertVertex(parent, null, this.generateTableHTML('Events'), 400, 400, 200, 200, 'TABLE_STYLE');
    var v2 = this.graph.insertVertex(parent, null, this.generateTableHTML('Clients'), 100, 100, 200, 200, 'TABLE_STYLE');
    //var e1 = this.graph.insertEdge(parent, null, '', v1, v2, 'EDGE_STYLE');

    var that = this;
    this.graph.addListener(mxEvent.DOUBLE_CLICK, function(sender, evt){
      	var cell = evt.getProperty('cell');
        if(cell!=null){
          //console.log(cell.id);
          //console.log(cell.getValue());

          that.pageManager.popupTableEditorView();
        }
    });

    this.graph.getModel().endUpdate();
  },

  createTableButton: function(){
    this.graph.getModel().beginUpdate();
    var v1 = this.graph.insertVertex(this.graph.getDefaultParent(), null, this.generateTableHTML('Events'), 10, 10, 200, 200, 'TABLE_STYLE');
    this.graph.getModel().endUpdate();
  },

  returnToSelection: function(){
    this.pageManager.showDatabaseSelectionView();
  },

  generateDataButtonPressed: function(){
      dataGenerator.generateData();
  },

  generateTableHTML: function(tableTitle){
    var string = '';
    string += '<table>';
    string += '<tr><th>'+tableTitle+'</th></tr>';
    string += '<tr><td>Pk</td></tr>';
    string += '<tr><td>Name</td></tr>';
    string += '<tr><td>Date</td></tr>';
    string += '<tr><td>Email</td></tr>';
    string += '</table>';

    //string = '<table><tr><th>Company</th></tr><tr><th>Hello</th></tr></table>';
    //console.log(string);
    return string;
  },

  show: function(){
    this.container.style.visibility = "visible";
    this.graph.setEnabled(true);
    this.graph.getModel().setVisible(this.graph.getDefaultParent(), true);
  },

  hide: function(){
    this.container.style.visibility = "hidden";
    this.graph.setEnabled(false);
    this.graph.getModel().setVisible(this.graph.getDefaultParent(), false);
  }
});

module.exports = DiagramView;
