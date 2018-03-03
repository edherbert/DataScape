const View = require('./View');

function TableEditorView(){
  this.container = document.getElementById("TableEditorView");
  this.tableContainer = document.getElementById("TableEditorTableContainer");
  this.tableTitleInput = document.getElementById("tableTitleField");

  //Create the base of the table, including the actual table and the headers.
  this.table = document.createElement('table');
  this.tableContainer.append(this.table);

  var heading = document.createElement('tr');
  var heading1 = document.createElement('th');
  heading1.innerHTML = "Field Name";
  var heading2 = document.createElement('th');
  heading2.innerHTML = "Field Type";

  heading.append(heading1);
  heading.append(heading2);
  this.table.append(heading);

  this.container.onclick = this.backgroundPressed.bind(this);
  document.getElementById("newRowButton").onclick = this.newRowButtonPressed.bind(this);
}

TableEditorView.prototype = Object.assign(Object.create(View.prototype), {
  constructor: TableEditorView,
  speed: 0.2,

  //Make the view appear as a popup, rather than as something that fills the entire screen.
  popup: function(){
    this.show();
    this.tableTitleInput.value = "Table Title";

    this.container.style.animation = "fadeIn "+this.speed+"s";
  },

  popout: function(){
    this.container.style.animation = "fadeOut "+this.speed+"s";

    //Hide after the ammount of time the animation takes. This is just so the user can actually see the animation.
    var that = this;
    setTimeout(function(){
      that.hide();
    }, this.speed * 1000);
  },

  backgroundPressed: function(e){
    //Make the event not fire on a child of the background.
    if(e.target != this.container) return;
    this.popout();
  },

  newRowButtonPressed: function(){
    var row = document.createElement('tr');
    var first = document.createElement('td');
    var second = document.createElement('td');

    var input = document.createElement('input');
    first.append(input);
    second.innerHTML = "Field Type";

    row.append(first);
    row.append(second);
    this.table.append(row);
  }
});

module.exports = TableEditorView;
