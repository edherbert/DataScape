const TestView = require('./TestView');
const DiagramView = require('./DiagramView');
const DataBaseSelectionView = require('./DatabaseSelectionView')

function PageManager(){
  this.testView = new TestView();
  this.diagramView = new DiagramView();
  this.dataBaseSelectionView = new DataBaseSelectionView();
}

PageManager.prototype = {
  constructor: PageManager,

  showTestView: function(){
    this.testView.show();
  },

  showDiagramView: function(){
    this.diagramView.show();
  },

  showDatabaseSelectionView: function(){
    this.dataBaseSelectionView.show();
  }
};

module.exports = new PageManager();
