import DATA from "../database/data.js";

import { DataArray } from "../model/model.js";
import Element from "../core/default.js";
import TableElement from "./table.js";
import StatisticsTableElement from "./statisticsTable.js";
import Modal from "./modal.js";

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
            if (e.type === 'archive' || e.type === 'update') {
                if (e.element.archived) {
                    this.archivedTable.destroy();
                    this.mainTableDataUpdate(this.mainData);
                    this.makeArchiveTable();
                } else {
                    this.mainTable.destroy();
                    this.archivedTableDataUpdate(this.archivedData);
                    this.makeMainTable();
                }
            } else if (e.type === 'remove') {
                if (e.element.archived) {
                    this.archivedTableDataUpdate(this.archivedData);
                } else {
                    this.mainTableDataUpdate(this.mainData);
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
        this.makeNewNoteButton();
        this.makeStatisticsTable();
    }

    makeMainTable() {
        this.mainTable = this.createTable(this.mainSection.element, this.mainData);
    }

    mainTableDataUpdate = (actualData) => {
        this.mainTable.data = actualData;
        this.mainTable.isDataEmpty();
    }

    makeArchiveSection() {
        this.archivedSection = new Element({
            parent: this.element,
            classNames: 'notes__archived'
        });

        this.makeArchiveTable();
    }

    makeArchiveTable() {
        this.archivedTable = this.createTable(this.archivedSection.element, this.archivedData, true);
    }

    archivedTableDataUpdate = (archivedData) => {
        this.archivedTable.data = archivedData;
        this.archivedTable.isDataEmpty();
    }

    createTable(parent, data, archived = false) {
        const newTable = new TableElement({
            element: 'ul',
            classNames: 'notes__list',
            dataFieldsToShow: ['name', 'created', 'category', 'content', 'dates'],
            archived
        }, data, {
            remove: (dataElement) => {
                this.data.removeElement(dataElement);
            }
        });
        parent.prepend(newTable.element);

        return newTable;
    }

    makeNewNoteButton() {
        this.newNoteButton = new Element({
            parent: this.mainSection.element,
            element: 'button',
            classNames: 'notes__addbutton',
            htmlContent: 'Add new note'
        });
        this.newNoteButton.addEvent('onclick', (event) => {
            event.preventDefault();
            new Modal(null, (newElement) => {
                this.data.addElement(newElement);
            });
        });
    }

    makeStatisticsTable() {
        this.statisticsTable = new StatisticsTableElement({
            parent: this.mainSection.element,
            element: 'ul',
            classNames: 'notes__statistics'
        }, this.data);
    }

    sortData() {
        this.mainData = this.data.getActualData();
        this.archivedData = this.data.getArchivedData();
    }
}