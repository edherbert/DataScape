function Popup(){
  this.setup();
}

Popup.prototype = {
  speed: 0.2,

  setup: function(){
    this.container = document.createElement('div');
    this.container.className = "popup";

    let that = this;
    this.container.onclick = function(e){
      if(e.target == that.container) that.backgroundPressed();
    };

    this.backgroundView = document.createElement('div');
    this.backgroundView.className = "popupBackground";

    this.container.appendChild(this.backgroundView);
    document.body.appendChild(this.container);
  },

  popup: function(){
    this.container.style.visibility = "visible";
    this.container.style.animation = "fadeIn "+this.speed+"s";
  },

  popout: function(){
    this.container.style.animation = "fadeOut "+this.speed+"s";

    var that = this;
    setTimeout(function(){
      that.container.style.visibility = "hidden";
    }, this.speed * 1000);
  },

  backgroundPressed: function(){
  }
};

module.exports = Popup;
