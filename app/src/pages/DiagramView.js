const View = require('./View');

function DiagramView(){
  this.container = document.getElementById("DiagramView");

  this.setupMxGraph();
}

constructor: DiagramView,
DiagramView.prototype = Object.assign(Object.create(View.prototype), {

  setupMxGraph: function(){
    this.graph = new mxGraph(document.getElementById("DiagramContainer"));

    new mxRubberband(this.graph);

    var parent = this.graph.getDefaultParent();

    this.graph.getModel().beginUpdate();

    this.graph.setHtmlLabels(true);

    //this.graph.setEnabled(false);


    var v1 = this.graph.insertVertex(parent, null, this.generateTableHTML('Events'), 400, 400, 200, 200, 'fillColor=rgba(0, 0, 0, 0);strokeColor=rgba(0, 0, 0, 0)');
    var v2 = this.graph.insertVertex(parent, null, this.generateTableHTML('Clients'), 100, 100, 200, 200);
    var e1 = this.graph.insertEdge(parent, null, '', v1, v2);

    this.graph.getModel().endUpdate();
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
    console.log(string);
    return string;
  }
});

module.exports = DiagramView;
