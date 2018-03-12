const Popup = require('./Popup');

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

    for(t = 0; t < 100; t++){
      let thing = document.createElement('div');
      thing.innerHTML = "hello";

      let row = Math.floor(t / 3);
      let column = t % 3;
      console.log(row + "   " + column);
      thing.style['grid-row'] = row;
      thing.style['grid-column'] = column;
      thing.style['background-color'] = "red";
      container.append(thing);
    }


    this.backgroundView.append(title);
    this.backgroundView.append(container);
  },

  backgroundPressed: function(){
    this.pageManager.popoutTypeSelection();
  }
});

module.exports = TypeSelectionPopup;
