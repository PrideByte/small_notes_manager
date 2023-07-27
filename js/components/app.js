import DATA from "../database/data.js";

import Element from "../core/default.js";
import { DataArray } from "../model/model.js";
import TableElement from "./table.js";

export default class NotesApplication extends Element {
    constructor() {
        super({
            parent: document.body,
            classNames: 'notes__wrapper'
        });

        this.data = new DataArray(DATA);
        this.sortData();
        this.data.onUpdate.addListener((e) => {
            this.sortData();
            if (e.type === 'archive') {
                if (e.element.archived) {
                    this.archivedTable.destroy();
                    this.makeArchiveTable();
                } else {
                    this.mainTable.destroy();
                    this.makeMainTable();
                }
            }
        });

        this.makeMainSection();
        this.makeArchiveSection();
    }

    makeMainSection() {
        this.mainSection = new Element({
            parent: this.element,
            classNames: 'notes__main'
        });

        this.makeMainTable();
    }

    makeMainTable() {
        this.mainTable = new TableElement({
            parent: this.mainSection.element,
            element: 'ul',
            classNames: 'notes__list'
        }, this.mainData, {
            remove: (dataElement) => {
                this.data.removeElement(dataElement);
            }
        });
    }

    makeArchiveSection() {
        this.archivedSection = new Element({
            parent: this.element,
            classNames: 'notes__archived'
        });

        this.makeArchiveTable();
    }

    makeArchiveTable() {
        this.archivedTable = new TableElement({
            parent: this.archivedSection.element,
            element: 'ul',
            classNames: 'notes__list'
        }, this.archivedData, {
            remove: (dataElement) => {
                this.data.removeElement(dataElement);
            }
        });
    }

    sortData() {
        this.mainData = this.data.values.filter(dataElement => !dataElement.archived);
        this.archivedData = this.data.values.filter(dataElement => dataElement.archived);
    }
}