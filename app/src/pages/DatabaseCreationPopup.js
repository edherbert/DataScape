const View = require('./View');
const DatabaseEditPopup = require('./DatabaseEditPopup');
const storageManager = require('../StorageManager')
const Popup = require('./Popup');

function DatabaseCreationPopup(pageManager){
  this.pageManager = pageManager;
  this.setup();
}

DatabaseCreationPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseCreationPopup,

  speed: 0.4,

  setup: function(){
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "What should the database be called?";

    this.databaseTitleInput = document.createElement('input');

    let acceptDbButton = document.createElement('div');
    acceptDbButton.id = "acceptDbButton";
    acceptDbButton.innerHTML = "Confirm";

    let declineDbButton = document.createElement('div');
    declineDbButton.id = "declineDbButton";
    declineDbButton.innerHTML = "Decline";

    let that = this;
    acceptDbButton.onclick = function(e){
      that.dbSelectionView.addToList(that.databaseTitleInput.value);
      storageManager.createDatabase(that.databaseTitleInput.value);
      that.popout();
    }


    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(acceptDbButton);
    this.backgroundView.append(declineDbButton);
  }
});

//   backgroundPressed: function(){
//     this.popout();
//
//     //If the storage manager can correctly update the database then rename it in the graphcs.
//     if(storageManager.renameDatabase(this.dbId, this.databaseTitleInput.value)){
//       this.dbContainer.innerHTML = this.databaseTitleInput.value;
//     }
//   }
// });

module.exports = DatabaseCreationPopup;
