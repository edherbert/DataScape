const View = require('./View');
const Popup = require('./Popup');
const storageManager = require('../StorageManager');

function ConfirmDeletePopup(dbId, dbContainer){
  console.log(this)
  this.setup(dbId, dbContainer);
}

ConfirmDeletePopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: ConfirmDeletePopup,

  speed: 0.4,

  setup: function(dbId, dbContainer){
    this.dbId = dbId;
    this.dbContainer = dbContainer;
    Popup.prototype.setup.call(this);

    let confirmMessage = document.createElement('div');
    confirmMessage.innerHTML = "Are you sure you want to delete the " + dbId + " database?";

    let confirmButton = document.createElement('div');
    confirmButton.id = "acceptDbButton";
    confirmButton.innerHTML = "Yes";

    let cancelButton = document.createElement('div');
    cancelButton.id = "declineDbButton";
    cancelButton.innerHTML = "No";


    let that = this;
    confirmButton.onclick = function(e){
      if(true || confirm("Do you really want to delete this database?")){
        storageManager.removeDatabase(dbId);
        //Remove the child from the list
        that.dbContainer.parentElement.removeChild(that.dbContainer);
        that.popout();
      }
    }

    cancelButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.append(confirmMessage);
    //this.backgroundView.append(deleteDatabaseButton);
    this.backgroundView.append(confirmButton);
    this.backgroundView.append(cancelButton);

    this.popup();
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = ConfirmDeletePopup;
