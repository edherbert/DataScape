const View = require('./View');
const DatabaseEditPopup = require('./DatabaseEditPopup');

function DatabaseSelectionView(pageManager){
  this.pageManager = pageManager;
  this.container = document.getElementById("dataBaseSelectionView");

  this.list = document.createElement('ul');
  document.getElementById("dataBaseSelectionView").append(this.list);

  document.getElementById("newDbbutton").onclick = this.createDatabase.bind(this);
}

DatabaseSelectionView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: DatabaseSelectionView,

  createDatabase: function(){
    //This will eventually contain a call to the other managers.
    this.addToList();
  },

  addToList: function(){
    /*var div = document.createElement('div');
    div.innerHTML = "A database";
    div.className = "DBEntry";
    this.container.appendChild(div);*/
    let newDb = document.createElement('div');
    newDb.className = "DBEntry";
    newDb.innerHTML = "new Database";

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

  databaseSelected: function(){
    this.pageManager.loadDatabase();
    this.pageManager.showDiagramView();
  }
});

module.exports = DatabaseSelectionView;
