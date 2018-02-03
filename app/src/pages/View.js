function View(){
  this.container = 0;
}

View.prototype = {
  constructor: View,

  hide: function(){
    this.container.style.visibility = "hidden";
  },

  show: function(){
    this.container.style.visibility = "visible";
  },
};

module.exports = View;
