import Element from "../core/default.js";

export default class TableRow extends Element {
    constructor(options, data, handlers) {
        super(options);
        this.header = options.header ?? false;
        this.data = data;
        this.cells = [];
        this.handlers = handlers ?? null;

        this.fillCells();

        if (!this.header) {
            this.showManagingButtons();
        }
    }

    fillCells() {
        this.data.forEach(value => {
            this.cells.push(new Element({
                parent: this.element,
                element: this.header ? 'h4' : 'div',
                classNames: 'notes__cell',
                htmlContent: value
            }));

            this.cells[this.cells.length - 1].element.style.width = `${100 / Object.keys(this.data).length}%`;
        });
    }

    removeCells() {
        this.cells.forEach(item => item.destroy());
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
        this.editButton.addEvent('onclick', (e) => {
            console.log(this);
        });

        this.archiveButton = new Element({
            parent: this.buttonsRow.element,
            element: 'button',
            htmlContent: 'Archive note',
            classNames: 'notes__buttons-archive'
        });
        this.archiveButton.addEvent('onclick', (e) => {
            this.handlers?.archive(this);
            this.removeRow();
        });

        this.removeButton = new Element({
            parent: this.buttonsRow.element,
            element: 'button',
            htmlContent: 'Remove note',
            classNames: 'notes__buttons-archive'
        });
        this.removeButton.addEvent('onclick', (e) => {
            this.handlers?.remove(this);
            this.removeRow();
        });
    }

    removeRow() {
        this.removeCells();
        this.buttonsRow.destroy();
        this.destroy();
    }
}