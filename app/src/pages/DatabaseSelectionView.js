const View = require('./View');

function DatabaseSelectionView(){
  this.container = document.getElementById("dataBaseSelectionView");

  document.getElementById("newDbbutton").onclick = this.createDatabase.bind(this);
}

DatabaseSelectionView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: DatabaseSelectionView,

  createDatabase: function(){
    //This will eventually contain a call to the other managers.
    this.addToList();
  },

  addToList: function(){
    var div = document.createElement('div');
    div.innerHTML = "A database";
    div.className = "DBEntry";
    this.container.appendChild(div);
  }
});

module.exports = DatabaseSelectionView;
