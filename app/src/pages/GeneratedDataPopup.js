const View = require('./View');
const storageManager = require('../StorageManager');
const Popup = require('./Popup');

function GeneratedDataPopup(pageManager){
  this.pageManager = pageManager;
  this.setup();
}

GeneratedDataPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: GeneratedDataPopup,

  speed: 0.4,

  setup: function(){
    Popup.prototype.setup.call(this);

    let generatedDataTitle = document.createElement('div');
    generatedDataTitle.innerHTML = "Generated Data:";
    generatedDataTitle.id = "generatedDataTitle";
    generatedDataTitle.style['font-size'] = "15pt";
    generatedDataTitle.style['margin-bottom'] = "0.5em";

    this.dataDisplay = document.createElement('div');
    this.dataDisplay.id = "dataDisplay";

    let closeButton = document.createElement('div');
    closeButton.id = "declineDbButton";
    closeButton.innerHTML = "Close";

    closeButton.style['margin-top'] = "1em";

    let that = this;
    closeButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.style.width = "70%";

    this.backgroundView.append(generatedDataTitle);
    this.backgroundView.append(this.dataDisplay);
    this.backgroundView.append(closeButton);
  },

  popup: function(data){
    Popup.prototype.popup.call(this);

    this.dataDisplay.innerHTML = JSON.stringify(data);
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = GeneratedDataPopup;
