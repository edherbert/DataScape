const Popup = require('./Popup');
const storageManager = require('../StorageManager');
const ConfirmDeletePopup = require('./ConfirmDeletePopup');
//const pageManager = require('./PageManager');

function DatabaseEditPopup(dbId, dbContainer){
  this.setup(dbId, dbContainer);
}

DatabaseEditPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseEditPopup,

  speed: 0.4,

  setup: function(dbId, dbContainer){
    this.dbId = dbId;
    this.dbContainer = dbContainer;
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "Database Title:";

    this.databaseTitleInput = document.createElement('input');
    this.databaseTitleInput.value = dbId;

    let deleteDatabaseButton = document.createElement('div');
    deleteDatabaseButton.id = "deleteDbButton";
    deleteDatabaseButton.innerHTML = "Delete Database";

    let that = this;
    deleteDatabaseButton.onclick = function(e){
      let deletePopup = new ConfirmDeletePopup(that.dbId, that.dbContainer)
      // if(confirm("Do you really want to delete this database?")){
      //   storageManager.removeDatabase(dbId);
      //   //Remove the child from the list
      //   that.dbContainer.parentElement.removeChild(that.dbContainer);
      //   that.popout();
      // }
      console.log(that)
      that.popout();
      //pageManager.popupConfirmDelete(dbId, dbContainer);
    }

    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(document.createElement('hr'));
    this.backgroundView.append(deleteDatabaseButton);
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
