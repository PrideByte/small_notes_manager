import CATEGORIES from "../database/noteCategories.js";

import Element from "../core/default.js";
import TableRow from "./row.js";

export default class StatisticsTableElement extends Element {
    constructor(options, data, handlers) {
        super(options);
        this.data = data;
        this.handlers = handlers ?? null;

        this.rows = [];

        new TableRow({
            parent: this.element,
            element: 'li',
            classNames: ['notes__row', 'notes__header'],
            disableManagingButtons: true,
            header: true
        }, ['category', 'active', 'archived']);

        if (!this.isDataEmpty()) {
            this.sortData();

            this.createRows();

            this.data.onUpdate.addListener((e) => {
                this.rows.forEach(row => row.destroy());
                if (!this.isDataEmpty()) {
                    this.sortData();
                    this.createRows();
                }
            });
        }
    }

    createRows() {
        CATEGORIES.forEach(category => {
            this.addElement(category.name);
        });
    }

    addElement(category) {
        if (this.error) {
            this.error.destroy();
            this.error = null;
        }

        this.rows.push(new TableRow({
            parent: this.element,
            element: 'li',
            classNames: 'notes__row',
            disableManagingButtons: true,
        }, [
            category,
            String(this.mainData.filter(dataElement => dataElement.category === category).length),
            String(this.archivedData.filter(dataElement => dataElement.category === category).length)
        ]));
    }

    isDataEmpty() {
        if (!this.data || !this.data.values.length) {
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

    sortData() {
        this.mainData = this.data.getActualData();
        this.archivedData = this.data.getArchivedData();
    }
}