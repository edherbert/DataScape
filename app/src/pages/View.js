function View(){
  this.container = 0;
}

View.prototype = {
  constructor: View,

  //These two functions are also run by popups
  hide: function(){
    this.container.style.visibility = "hidden";
  },

  show: function(){
    this.container.style.visibility = "visible";
  },
};

module.exports = View;
