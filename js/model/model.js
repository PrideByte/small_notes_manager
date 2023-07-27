import Signal from "../core/signal.js";

export class DataModel {
    constructor(dataElement) {
        this.name = dataElement.name ?? 'Unnamed note';
        this.created = dataElement.created ?? new Date().toLocaleDateString('en-GB');
        this.category = dataElement.category ?? 'Uncategorized';
        this.content = dataElement.content;
        this.dates = dataElement.dates ?? [];
        this.archived = dataElement.archived ?? false;

        this.foundDates();

        this.onUpdate = new Signal();
    }

    updateContent(newContent) {
        this.name = newContent.name ? newContent.name.trim() : this.name;
        this.category = newContent.category ? newContent.category : this.category;
        this.content = newContent.content ? newContent.content.trim() : this.content;
        this.foundDates();

        this.onUpdate.emit({
            type: 'update',
            element: this
        });
    }

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

    addElement(newData) {
        const newItem = new DataModel(newData);
        newItem.onUpdate.addListener((e) => {this.onUpdate.emit(e)});
        this.values.push(newItem);
        this.onUpdate.emit({
            type: 'update',
            element: newData
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