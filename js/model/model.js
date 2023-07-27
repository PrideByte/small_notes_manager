import Signal from "../core/signal.js";

export class DataModel {
    constructor(dataElement) {
        this.name = dataElement.name ?? 'Unnamed note';
        this.created = dataElement.created ?? Date.now();
        this.category = dataElement.category ?? 'Uncategorized';
        this.content = dataElement.content;
        this.dates = dataElement.dates ?? [];
        this.archived = dataElement.archived ?? false;

        this.foundDates();

        this.onUpdate = new Signal();
    }

    // updateContent(newContent) {
    //     this.name = newContent.name.trim();
    //     this.category = newContent.category;
    //     this.content = newContent.content.trim();
    //     this.foundDates();

    //     this.onUpdate.emit(this);
    // }

    foundDates() {
        this.dates = this.content.match(/(?:[0-2]\d|3[0-1]|(?<=\D)\d)\/(?:0?\d|1[0-2])\/\d{1,4}/g) ?? [];
    }

    switchArchivedStatus() {
        this.archived = !this.archived;
        this.onUpdate.emit({
            type: 'archive',
            element: this
        });
    }

    getCellsToShow(cellList) {
        return cellList.reduce((cellsToShow, cell) => {
            cellsToShow[cell] = this[cell];
            return cellsToShow;
        }, {});
    }
}

export class DataArray {
    constructor(rawData) {
        this.onUpdate = new Signal();
        this.onActualDataUpdate = new Signal();
        this.onArchivedDataUpdate = new Signal();

        this.values = rawData.reduce((newData, dataElement) => {
            const newElement = new DataModel(dataElement);
            newElement.onUpdate.addListener((e) => {this.onUpdate.emit(e)});
            newData.push(newElement);
            return newData;
        }, []);
    }

    addElement(newElement) {
        this.values.push(newElement);
        this.onUpdate.emit({
            type: 'add',
            element: newElement
        });
    }
    
    removeElement(elementToRemove) {
        this.values = this.values.filter(element => element !== elementToRemove);
        this.onUpdate.emit({
            type: 'remove',
            element: elementToRemove
        });
    }

    getActualData() {
        const actualData = this.values.filter(dataElement => !dataElement.archived);
        this.onActualDataUpdate.emit(actualData);
        return actualData;
    }
    
    getArchivedData() {
        const archivedData = this.values.filter(dataElement => dataElement.archived);
        this.onArchivedDataUpdate.emit(archivedData);
        return archivedData;
    }
}