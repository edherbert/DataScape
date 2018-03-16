const Popup = require('./Popup');
const typeManager = require('../TypeManager/TypeManager');

function TypeSelectionPopup(pageManager) {
    this.pageManager = pageManager;

    this.setup();
}

TypeSelectionPopup.prototype = Object.assign(Object.create(Popup.prototype), {
    setup: function() {
        Popup.prototype.setup.call(this);

        let title = document.createElement('div');
        title.innerHTML = "Select a Field Type";

        let container = document.createElement('div');
        container.id = "fieldTypeContainer";

        let list = typeManager.getTypesList();

        for (t = 0; t < list.length; t++) {
            let item = document.createElement('div');
            item.innerHTML = list[t];
            item.id = "TypeListItem";

            let row = Math.floor(t / 3);
            let column = t % 3;

            item.style['grid-row'] = row;
            item.style['grid-column'] = column;

            let that = this;
            item.onclick = function(e) {
                console.log(e.target.innerHTML);
                that.typeContainer.innerHTML = e.target.innerHTML;

                that.pageManager.popoutTypeSelection();
                that.pageManager.dirtyDiagramSaveButton();
            }

            container.append(item);
        }


        this.backgroundView.append(title);
        this.backgroundView.append(container);
    },

    popup: function(typeContainer) {
        Popup.prototype.popup.call(this);
        this.typeContainer = typeContainer;
    },

    backgroundPressed: function() {
        this.pageManager.popoutTypeSelection();
    }
});

module.exports = TypeSelectionPopup;
