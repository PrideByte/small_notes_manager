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
        this.dates = this.content.match(/(?:(?<=\D)(?:[0-2]\d|3[0-1])|(?<=\D)\d)\/(?:0?\d|1[0-2])\/\d{1,4}(?=\D)|(?:(?<=\D)(?:[0-2]\d|3[0-1])|(?<=\D)\d)\.(?:0?\d|1[0-2])\.\d{1,4}(?=\D)/g) ?? [];
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
            newData.push(this.createNewItem(dataElement));
            return newData;
        }, []);
    }

    createNewItem(newData) {
        const newItem = new DataModel(newData);
        newItem.onUpdate.addListener((e) => {this.onUpdate.emit(e)});
        return newItem;
    }

    addElement(newData) {
        this.values.push(this.createNewItem(newData));
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