const TestView = require('./TestView');
const DiagramView = require('./DiagramView');
const DataBaseSelectionView = require('./DatabaseSelectionView')
const TableEditorView = require('./TableEditorView')

function PageManager(){
  this.testView = new TestView();
  this.diagramView = new DiagramView(this);
  this.dataBaseSelectionView = new DataBaseSelectionView();
  this.tableEditorView = new TableEditorView();
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
  },

  popupTableEditorView: function(){
    this.tableEditorView.popup();
  }
};

module.exports = new PageManager();
