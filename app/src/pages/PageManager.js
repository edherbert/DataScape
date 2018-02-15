const TestView = require('./TestView');
const DiagramView = require('./DiagramView');

function PageManager(){
  this.testView = new TestView();
  this.diagramView = new DiagramView();
}

PageManager.prototype = {
  constructor: PageManager,

  showTestView: function(){
    this.testView.show();
  },

  showDiagramView: function(){
    this.diagramView.show();
  }
};

module.exports = new PageManager();
