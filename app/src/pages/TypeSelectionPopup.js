const Popup = require('./Popup');
const typeManager = require('../TypeManager/TypeManager');

function TypeSelectionPopup(pageManager){
  this.pageManager = pageManager;

  this.setup();
}

TypeSelectionPopup.prototype = Object.assign(Object.create(Popup.prototype), {
  setup: function(){
    Popup.prototype.setup.call(this);

    let title = document.createElement('div');
    title.innerHTML = "Select a Field Type";

    let container = document.createElement('div');
    container.id = "fieldTypeContainer";

    //Get a list of the available field types
    let list = typeManager.getTypesList();

    //Iterate over the list and add them to the container.
    for(t = 0; t < list.length; t++){
      let item = document.createElement('div');
      item.innerHTML = list[t];
      item.id = "TypeListItem";

      let row = Math.floor(t / 3);
      let column = t % 3;

      //Use a css grid to position the items.
      item.style['grid-row'] = row;
      item.style['grid-column'] = column;

      let that = this;
      item.onclick = function(e){
        //Set the name of the type as the lable of the container.
        that.typeContainer.innerHTML = e.target.innerHTML;

        that.pageManager.popoutTypeSelection();
        that.pageManager.dirtyDiagramSaveButton();
      }

      container.append(item);
    }

    //AA-D80073

    this.backgroundView.append(title);
    this.backgroundView.append(container);
  },

  popup: function(typeContainer){
    Popup.prototype.popup.call(this);
    this.typeContainer = typeContainer;
  },

  backgroundPressed: function(){
    this.pageManager.popoutTypeSelection();
  }
});

module.exports = TypeSelectionPopup;
