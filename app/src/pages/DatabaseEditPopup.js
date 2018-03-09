const Popup = require('./Popup');

function DatabaseEditPopup(dbId, dbContainer){
  this.setup(dbId, dbContainer);
}

DatabaseEditPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseEditPopup,

  speed: 0.7,

  setup: function(dbId, dbContainer){
    this.dbContainer = dbContainer;
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "Database Title:";

    this.databaseTitleInput = document.createElement('input');
    this.databaseTitleInput.value = dbId;

    let deleteDatabaseButton = document.createElement('div');
    deleteDatabaseButton.id = "deleteDbButton";
    deleteDatabaseButton.innerHTML = "Delete Database";

    this.backgroundView.append(databaseTitle);
    this.backgroundView.append(this.databaseTitleInput);
    this.backgroundView.append(document.createElement('hr'));
    this.backgroundView.append(deleteDatabaseButton);
  },

  backgroundPressed: function(){
    this.popout();
    this.dbContainer.innerHTML = this.databaseTitleInput.value;
  }
});

module.exports = DatabaseEditPopup;
