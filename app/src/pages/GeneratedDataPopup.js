const View = require('./View');
const storageManager = require('../StorageManager');
const Popup = require('./Popup');

function GeneratedDataPopup(pageManager, generatedData){
  this.pageManager = pageManager;
  this.setup(generatedData);
}

GeneratedDataPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: GeneratedDataPopup,

  speed: 0.4,

  setup: function(generatedData){
    Popup.prototype.setup.call(this);

    let generatedDataTitle = document.createElement('div');
    generatedDataTitle.innerHTML = "Generated Data:";
    generatedDataTitle.id = "generatedDataTitle";

    let dataDisplay = document.createElement('div');
    dataDisplay.id = "dataDisplay";
    console.log(generatedData);
    dataDisplay.innerHTML = JSON.stringify(generatedData);

    let closeButton = document.createElement('div');
    closeButton.id = "declineDbButton";
    closeButton.innerHTML = "Close";

    let that = this;

    closeButton.onclick = function(e){
      that.popout();
    }




    this.backgroundView.append(generatedDataTitle);
    this.backgroundView.append(dataDisplay);
    this.backgroundView.append(closeButton);
  },

});

module.exports = GeneratedDataPopup;
