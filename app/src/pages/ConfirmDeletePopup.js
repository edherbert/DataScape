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
    console.log(dbId);
    Popup.prototype.setup.call(this);


    this.dbContainer = dbContainer
    this.confirmMessage = document.createElement('div');
    this.confirmMessage.innerHTML = "Are you sure you want to delete the " + dbId + " database?";

    this.confirmButton = document.createElement('div');
    this.confirmButton.id = "acceptDbButton";
    this.confirmButton.innerHTML = "Yes";

    this.cancelButton = document.createElement('div');
    this.cancelButton.id = "declineDbButton";
    this.cancelButton.innerHTML = "No";


    let that = this;
    this.confirmButton.onclick = function(e){

      if(true || confirm("Do you really want to delete this database?")){
        storageManager.removeDatabase(dbId);
        //Remove the child from the list
        that.dbContainer.parentElement.removeChild(that.dbContainer);
        that.popout();
      }

      /*storageManager.removeDatabase(that.dbId);
      //Remove the child from the list
      that.dbContainer.parentElement.removeChild(that.dbContainer);
      that.popout();*/
    }

    this.cancelButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.append(this.confirmMessage);
    //this.backgroundView.append(deleteDatabaseButton);
    this.backgroundView.append(this.confirmButton);
    this.backgroundView.append(this.cancelButton);

    //this.popup();
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
