import Element from "../core/default.js";
import TableRow from "./row.js";

export default class TableElement extends Element {
    constructor(options, data, handlers) {
        super(options);
        this.data = data;
        this.handlers = handlers ?? null;

        this.dataFieldsToShow = options.dataFieldsToShow;

        this.rows = [];

        new TableRow({
            parent: this.element,
            element: 'li',
            classNames: ['notes__row', 'notes__header'],
            header: true
        }, this.dataFieldsToShow);

        this.checkData();

        data.forEach(element => {
            this.addElement(element);
        });
    }

    addElement(element) {
        if (this.error) {
            this.error.destroy();
            this.error = null;
        }

        this.values = Object.entries(element).filter(([caption]) => this.dataFieldsToShow.includes(caption));

        this.newElement = new TableRow({
            parent: this.element,
            element: 'li',
            classNames: 'notes__row'
        }, this.values, {
            edit: (newData) => {
                element.updateContent(newData);
            },
            archive: (row) => {
                element.switchArchivedStatus();
            },
            remove: (row) => {
                this.handlers?.remove(element);
            }
        });
        this.rows.push(this.newElement);
    }

    checkData() {
        if (!this.data || !this.data.length) {
            this.showErrorMessage();

            return;
        }
    }

    showErrorMessage() {
        if (!this.error) {
            this.error = new Element({
                parent: this.element,
                classNames: 'notes__error',
                htmlContent: 'Now data to show!'
            });
        }
    }
}