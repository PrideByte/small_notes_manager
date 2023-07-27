import Element from "../core/default.js";

export default class TableRow extends Element {
    constructor(options, data, actions) {
        super(options);
        this.cellsToShow = ['name', 'created', 'category', 'content', 'dates'];

        this.data = data;
        this.cells = [];
        this.tableHeader = options.tableHeader;
        this.actions = actions;

        if (!this.tableHeader) {
            this.createDataRow();
        }

        this.showRow();

        if (!this.tableHeader) {
            this.showManagingButtons();
        }
    }

    showRow() {
        Object.entries(this.data).forEach(([caption, value]) => {
            this.cells.push(new Element({
                parent: this.tableHeader ? this.element : this.dataRow.element,
                element: this.tableHeader ? 'h4' : 'div',
                classNames: 'notes__cell',
                htmlContent: this.tableHeader ? caption : value
            }));

            this.cells[this.cells.length - 1].element.style.width = `${100 / Object.keys(this.data).length}%`;
        });
    }

    showManagingButtons() {
        this.buttonsRow = new Element({
            parent: this.element,
            element: 'div',
            classNames: 'notes__buttons'
        });

        this.editButton = new Element({
            parent: this.buttonsRow.element,
            element: 'button',
            htmlContent: 'Edit note',
            classNames: 'notes__buttons-edit'
        });
        this.editButton.addEvent('onclick', this.actions.edit);
        
        this.archiveButton = new Element({
            parent: this.buttonsRow.element,
            element: 'button',
            htmlContent: 'Archive note',
            classNames: 'notes__buttons-archive'
        });
        this.archiveButton.addEvent('onclick', (e) => {
            this.actions.archive(e);
            this.destroyDataRow();
            this.createDataRow();
            this.showRow();
            // this.destroy();
        });
        
        this.removeButton = new Element({
            parent: this.buttonsRow.element,
            element: 'button',
            htmlContent: 'Remove note',
            classNames: 'notes__buttons-archive'
        });
        this.removeButton.addEvent('onclick', (e) => {
            this.actions.remove(e);
            this.destroy();
        });
    }

    createDataRow() {
        this.dataRow = new Element({
            parent: this.element,
            element: null,
            classNames: 'notes__data'
        });
        this.element.prepend(this.dataRow.element);
    }

    destroyDataRow() {
        this.dataRow.destroy();
    }
}