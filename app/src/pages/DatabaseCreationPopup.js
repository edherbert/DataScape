const View = require('./View');
const databaseEditPopup = require('./DatabaseEditPopup');
const storageManager = require('../StorageManager');
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
    this.databaseTitleInput.id = "dbInput";

    let acceptDbButton = document.createElement('div');
    acceptDbButton.id = "acceptDbButton";
    acceptDbButton.innerHTML = "Confirm";

    let declineDbButton = document.createElement('div');
    declineDbButton.id = "declineDbButton";
    declineDbButton.innerHTML = "Cancel";

    let that = this;
    acceptDbButton.onclick = function(e){
      //Do a regex function to check if the title is valid.
      if(that.databaseTitleInput.value.match("^[a-zA-Z1-9_]+$")){
        //Add it to the list.
        that.dbSelectionView.addToList(that.databaseTitleInput.value);
        //Create the database in storage
        storageManager.createDatabase(that.databaseTitleInput.value);
        that.popout();
      }else{
        alert("Enter valid characters only please. Characters must be between a-z and A-Z.");
        that.popout();
      }
    }

    declineDbButton.onclick = function(e){
      that.popout();
    }

    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(acceptDbButton);
    this.backgroundView.append(declineDbButton);
  },

  backgroundPressed: function(){
    this.popout();
  }

});

module.exports = DatabaseCreationPopup;
