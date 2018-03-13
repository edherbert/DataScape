const View = require('./View');
const storageManager = require('../StorageManager');
const DatabaseCreationPopup = require('./DatabaseCreationPopup');

function DatabaseSelectionView(pageManager){
  this.pageManager = pageManager;
  this.container = document.getElementById("dataBaseSelectionView");

  this.list = document.createElement('ul');
  document.getElementById("dataBaseSelectionView").append(this.list);

  document.getElementById("newDbbutton").onclick = this.createDatabase.bind(this);

  //document.getElementById("deleteDbButton").onclick = this.confirmDelete.bind(this);

  this.updateList();
}

DatabaseSelectionView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: DatabaseSelectionView,

  createDatabase: function(){
    //let title = prompt("What should the database be called?")
    this.pageManager.popupDatabaseCreation(this);
  },

  // confirmDelete: function(){
  //   this.pageManager.popupConfirmDelete(this);
  // },

  addToList: function(dbTitle){
    /*var div = document.createElement('div');
    div.innerHTML = "A database";
    div.className = "DBEntry";
    this.container.appendChild(div);*/
    let newDb = document.createElement('div');
    newDb.className = "DBEntry";
    newDb.innerHTML = dbTitle;

    let editDb = document.createElement('img');
    editDb.className = "DbEditButton";
    editDb.src = "test.png";

    let that = this;
    editDb.onclick = function(e){
      let dbContainer = e.target.parentElement.childNodes[0];

      //let databaseEdit = new DatabaseEditPopup(dbContainer.innerHTML, dbContainer);
      //databaseEdit.popup();
      that.pageManager.popupDatabaseEdit(dbContainer.innerHTML, dbContainer);
    }


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
    let list = storageManager.getDatabasesList();

    for(t = 0; t < list.length; t++){
      this.addToList(list[t]);
    }
  }
});

module.exports = DatabaseSelectionView;
