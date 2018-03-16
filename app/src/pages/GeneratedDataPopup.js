const View = require('./View');
const storageManager = require('../StorageManager');
const Popup = require('./Popup');

function GeneratedDataPopup(pageManager) {
    this.pageManager = pageManager;
    this.setup();
}

GeneratedDataPopup.prototype = Object.assign(Object.create(Popup.prototype), {
    constructor: GeneratedDataPopup,

    speed: 0.4,

    setup: function() {
        Popup.prototype.setup.call(this);

        let generatedDataTitle = document.createElement('div');
        generatedDataTitle.innerHTML = "Generated Data:";
        generatedDataTitle.id = "generatedDataTitle"; //set up the title element for data popup
        generatedDataTitle.style['font-size'] = "15pt";
        generatedDataTitle.style['margin-bottom'] = "0.5em";

        this.dataDisplay = document.createElement('div');
        this.dataDisplay.id = "dataDisplay"; //set up the data display element for data popup

        let closeButton = document.createElement('div');
        closeButton.id = "declineDbButton"; //set up the close button element for data popup
        closeButton.innerHTML = "Close";

        closeButton.style['margin-top'] = "1em";

        let that = this;
        closeButton.onclick = function(e) { //when close button is clicked, close the popup
            that.popout();
        }

        this.backgroundView.style.width = "70%";

        this.backgroundView.append(generatedDataTitle);
        this.backgroundView.append(this.dataDisplay); //append elements to the index.html
        this.backgroundView.append(closeButton);
    },

    popup: function(data) {
        Popup.prototype.popup.call(this);
        let outputData = "";
        for (t = 0; t < data.tables.length; t++) {
            for (i = 0; i < data.tables[t].done.length; i++) {
                outputData += JSON.stringify(data.tables[t].done[i]); //convert the generated data JSON object into a string
                outputData += "<br>";
            }
        }
        outputData = outputData.split('{').join('').split('}').join('').split('"').join(' '); //remove unwanted characters
        this.dataDisplay.innerHTML = outputData;
    },

    backgroundPressed: function() {
        this.popout(); //when the user clicks away from the popup, close the popup
    }

});

module.exports = GeneratedDataPopup;
