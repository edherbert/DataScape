const TestView = require('./TestView');

function PageManager(){

}

PageManager.prototype = {
  constructor: PageManager,

  createViews: function(){
    this.testView = new TestView();
  },

  showTestView: function(){
    this.testView.show();
  }
};

module.exports = new PageManager();
