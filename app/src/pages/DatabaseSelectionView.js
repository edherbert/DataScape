const View = require('./View');
const storageManager = require('../StorageManager');
const DatabaseCreationPopup = require('./DatabaseCreationPopup');

function DatabaseSelectionView(pageManager){
  this.pageManager = pageManager;
  this.container = document.getElementById("dataBaseSelectionView");

  //Create the list that'll contain the databases.
  this.list = document.createElement('ul');

  document.getElementById("dataBaseSelectionView").append(this.list);
  document.getElementById("newDbbutton").onclick = this.createDatabase.bind(this);

  this.updateList();
}

DatabaseSelectionView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: DatabaseSelectionView,

  createDatabase: function(){
    this.pageManager.popupDatabaseCreation(this);
  },

  addToList: function(dbTitle){
    let newDb = document.createElement('div');
    newDb.className = "DBEntry";
    newDb.innerHTML = dbTitle;

    let editDb = document.createElement('img');
    editDb.className = "DbEditButton";
    editDb.src = "test.png";

    let that = this;
    editDb.onclick = function(e){
      //Get a reference to the list container and pass it into the popup
      let dbContainer = e.target.parentElement.childNodes[0];

      that.pageManager.popupDatabaseEdit(dbContainer.innerHTML, dbContainer);
    }

    //Add a callback for when the button is clicked.
    newDb.onclick = this.databaseSelected.bind(this);

    let listItem = document.createElement('li');
    listItem.className = "DbSelectionList"
    listItem.append(newDb);

    listItem.append(editDb);

    this.list.appendChild(listItem);
  },

  databaseSelected: function(e){
    this.pageManager.showDiagramView(e.target.innerHTML);
  },

  updateList: function(){
    //Add the contents of the storage manager to the list
    let list = storageManager.getDatabasesList();

    for(t = 0; t < list.length; t++){
      this.addToList(list[t]);
    }
  }
});

module.exports = DatabaseSelectionView;
