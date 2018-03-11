const View = require('./View');
const DatabaseEditPopup = require('./DatabaseEditPopup');
const storageManager = require('../StorageManager')
const Popup = require('./Popup');

function DatabaseSelectionView(pageManager){
  this.pageManager = pageManager;
  this.container = document.getElementById("dataBaseSelectionView");

  this.list = document.createElement('ul');
  document.getElementById("dataBaseSelectionView").append(this.list);

  //document.getElementById("newDbbutton").onclick = this.createDatabase.bind(this);

  this.updateList();
}

DatabaseCreationPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  constructor: DatabaseCreationPopup,

  speed: 0.4,

  setup: function(){
    Popup.prototype.setup.call(this);

    let databaseTitle = document.createElement('div');
    databaseTitle.innerHTML = "What should the database be called?";

    this.databaseTitleInput = document.createElement('input');
    let title = this.databaseTitleInput.value;
    storageManager.createDatabase(title);
    this.addToList(title);
  },

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

    editDb.onclick = function(e){
      let dbContainer = e.target.parentElement.childNodes[0];

      let databaseEdit = new DatabaseEditPopup(dbContainer.innerHTML, dbContainer);
      databaseEdit.popup();
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
