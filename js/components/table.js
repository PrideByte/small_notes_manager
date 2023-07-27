import Element from "../core/default.js";
import TableRow from "./row.js";

export default class TableElement extends Element {
    constructor(options, data, handlers) {
        super(options);
        this.data = data;
        this.handlers = handlers ?? null;

        this.dataFieldsToShow = ['name', 'created', 'category', 'content', 'dates', 'archived'];

        this.rows = [];

        new TableRow({
            parent: this.element,
            element: 'li',
            classNames: ['notes__row', 'notes__header'],
            header: true
        }, this.dataFieldsToShow);

        data.forEach(element => {
            this.addElement(element);
        });
    }

    addElement(element) {
        this.values = Object.entries(element)
            .filter(([caption]) => this.dataFieldsToShow.includes(caption))
            .map(([caption, value]) => value);

        this.newElement = new TableRow({
            parent: this.element,
            element: 'li',
            classNames: 'notes__row'
        }, this.values, {
            archive: (row) => {
                element.switchArchivedStatus();
            },
            remove: (row) => {
                this.handlers?.remove(element);
            }
        });
        this.rows.push(this.newElement);
    }
}