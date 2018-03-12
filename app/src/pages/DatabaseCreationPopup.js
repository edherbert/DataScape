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
    console.log("hello");
    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "What should the database be called?";

    this.databaseTitleInput = document.createElement('input');
    //let title = this.databaseTitleInput.value;
    //storageManager.createDatabase(title);
    this.backgroundView.append(databaseTitle);
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
