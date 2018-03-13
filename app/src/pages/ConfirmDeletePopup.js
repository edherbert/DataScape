const View = require('./View');
const Popup = require('./Popup');
const storageManager = require('../StorageManager');

function ConfirmDeletePopup(){
  this.setup();
}

ConfirmDeletePopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: ConfirmDeletePopup,

  speed: 0.4,

  setup: function(){
    Popup.prototype.setup.call(this);

    this.confirmMessage = document.createElement('div');
    this.confirmMessage.innerHTML = "";

    let confirmButton = document.createElement('div');
    confirmButton.id = "acceptDbButton";
    confirmButton.innerHTML = "Yes";

    let cancelButton = document.createElement('div');
    cancelButton.id = "declineDbButton";
    cancelButton.innerHTML = "No";


    let that = this;
    confirmButton.onclick = function(e){
      storageManager.removeDatabase(that.dbId);
      //Remove the child from the list
      that.dbContainer.parentElement.removeChild(that.dbContainer);
      that.popout();
    }

    cancelButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.append(this.confirmMessage);
    this.backgroundView.append(confirmButton);
    this.backgroundView.append(cancelButton);
  },

  popup: function(dbId, dbContainer){
    console.log(dbId);
    Popup.prototype.popup.call(this);
    this.dbId = dbId;
    this.dbContainer = dbContainer;

    this.confirmMessage.innerHTML = "Are you sure you want to delete the " + this.dbId + " database?";
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = ConfirmDeletePopup;
