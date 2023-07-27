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
                    this.data.onArchivedDataUpdate.removeListener(this.archivedTableDataUpdate);
                    this.makeArchiveTable();
                } else {
                    this.mainTable.destroy();
                    this.data.onActualDataUpdate.removeListener(this.mainTableDataUpdate);
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
        this.mainTable = this.createTable(this.mainSection.element, this.mainData);
        this.data.onActualDataUpdate.addListener(this.mainTableDataUpdate);
    }

    mainTableDataUpdate = (actualData) => {
        this.mainTable.data = actualData;
        this.mainTable.checkData();
    }

    makeArchiveSection() {
        this.archivedSection = new Element({
            parent: this.element,
            classNames: 'notes__archived'
        });

        this.makeArchiveTable();
    }

    makeArchiveTable() {
        this.archivedTable = this.createTable(this.archivedSection.element, this.archivedData);
        this.data.onArchivedDataUpdate.addListener(this.archivedTableDataUpdate);
    }

    archivedTableDataUpdate = (archivedData) => {
        this.archivedTable.data = archivedData;
        this.archivedTable.checkData();
    }

    createTable(parent, data) {
        return new TableElement({
            parent,
            element: 'ul',
            classNames: 'notes__list',
            dataFieldsToShow: ['name', 'created', 'category', 'content', 'dates', 'archived']
        }, data, {
            remove: (dataElement) => {
                this.data.removeElement(dataElement);
            }
        });
    }

    sortData() {
        this.mainData = this.data.getActualData();
        this.archivedData = this.data.getArchivedData();
    }
}