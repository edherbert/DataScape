const Popup = require('./Popup');
const storageManager = require('../StorageManager');
const ConfirmDeletePopup = require('./ConfirmDeletePopup');
//const pageManager = require('./PageManager');

function DatabaseEditPopup(pageManager){
  this.setup(pageManager);
}

DatabaseEditPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseEditPopup,

  speed: 0.4,

  setup: function(pageManager){
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "Database Title:";

    this.databaseTitleInput = document.createElement('input');
    this.databaseTitleInput.value = "";

    let deleteDatabaseButton = document.createElement('div');
    deleteDatabaseButton.id = "deleteDbButton";
    deleteDatabaseButton.innerHTML = "Delete Database";

    let that = this;
    deleteDatabaseButton.onclick = function(e){
      pageManager.popupConfirmDelete(that.dbId, that.dbContainer);
      that.popout();
    }

    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(document.createElement('hr'));
    this.backgroundView.append(deleteDatabaseButton);
  },

  popup: function(dbId, dbContainer){
    Popup.prototype.popup.call(this);

    //Make the title's input equal to the database name.
    this.databaseTitleInput.value = dbId;

    //Store these values for later.
    this.dbId = dbId;
    this.dbContainer = dbContainer;
  },

  backgroundPressed: function(){
    this.popout();

    //If the storage manager can correctly update the database then rename it in the graphcs.
    if(storageManager.renameDatabase(this.dbId, this.databaseTitleInput.value)){
      this.dbContainer.innerHTML = this.databaseTitleInput.value;
    }
  }
});

module.exports = DatabaseEditPopup;
