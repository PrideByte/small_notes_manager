import Element from "../core/default.js";
import TableRow from "./row.js";

export default class TableElement extends Element {
    constructor(options, data, handlers) {
        super(options);
        this.data = data;
        this.archived = options.archived;
        this.handlers = handlers ?? null;

        this.dataFieldsToShow = options.dataFieldsToShow;

        this.rows = [];

        new TableRow({
            parent: this.element,
            element: 'li',
            classNames: ['notes__row', 'notes__header'],
            header: true,
            disableManagingButtons: true
        }, this.dataFieldsToShow);

        if (!this.isDataEmpty()) {
            data.forEach(element => {
                this.addElement(element);
            });
        }

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
            classNames: 'notes__row',
            archived: this.archived
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

    isDataEmpty() {
        if (!this.data || !this.data.length) {
            this.showErrorMessage();

            return true;
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