const View = require('./View');

function TestView(){
  this.container = document.getElementById("testView");

  //Call a callback function on press.
  document.getElementById("testButton").onclick = this.buttonPressed.bind(this);
}

TestView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: TestView,

  buttonPressed: function(){
    this.hide();

    //You need to store a reference to is because the scope for setTimeout is different.
    var that = this;
    setTimeout(function(){
      that.show();
    }, 2000);
  }
});

module.exports = TestView;
