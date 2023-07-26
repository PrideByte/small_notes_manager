import Element from "../core/default.js";
import TableRow from "./row.js";

export default class TableElement extends Element {
    constructor(data, archived) {
        super({
            parent: document.body,
            element: 'ul',
            classNames: 'notes__wrapper'
        });
        this.archived = archived ?? false;
        this.data = data ?? null;
        this.getActualData();

        this.dataRows = [];

        this.header = new TableRow({
            parent: this.element,
            element: 'li',
            classNames: ['notes__row', 'notes__header'],
            tableHeader: true
        }, this.actualData[0]);

        this.actualData.forEach(dataElement => {
            this.dataRows.push(new TableRow({
                parent: this.element,
                element: 'li',
                classNames: 'notes__row',
            }, dataElement, {
                edit: (e) => { console.log('edit button', this); },
                archive: (e) => {
                    dataElement.switchArchivedStatus();
                    this.getActualData();
                },
                remove: (e) => {
                    this.data.removeElement(dataElement);
                    this.getActualData();
                }
            }))
        });
    }

    getActualData() {
        this.actualData = this.archived
                        ? this.data.showActualData()
                        : this.data.showArchivedData();
    }
}