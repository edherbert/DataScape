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
    let outputData = "";
    for(t = 0; t < data.tables.length; t++){
      for(i = 0; i < data.tables[t].done.length; i++){
        console.log(JSON.stringify(data.tables[t].done[i]));
        outputData += JSON.stringify(data.tables[t].done[i]);
        outputData += "<br>";
      }
    }
    outputData = outputData.split('{').join('').split('}').join('').split('"').join(' ');
    this.dataDisplay.innerHTML = outputData;
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = GeneratedDataPopup;
