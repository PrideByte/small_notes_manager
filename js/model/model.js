export class DataModel {
    constructor(dataElement) {
        this.name = dataElement.name ?? 'Unnamed note';
        this.created = dataElement.created ?? Date.now();
        this.category = dataElement.category ?? 'Uncategorized';
        this.content = dataElement.content;
        this.dates = dataElement.dates ?? [];
        this.archived = dataElement.archived ?? false;
    }

    updateContent(newContent) {
        this.content = String(newContent).trim();
    }

    foundDates() {
        this.dates = this.content.match(/(?:[0-2]\d|3[0-1]|(?<=\D)\d)\/(?:0?\d|1[0-2])\/\d{1,4}/g) ?? [];
    }

    switchArchivedStatus() {
        this.archived = !this.archived;
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
        this.values = rawData.reduce((newData, dataElement) => {
            newData.push(new DataModel(dataElement));
            return newData;
        }, []);
    }

    addElement(newElement) {
        this.values.push(newElement);
    }

    removeElement(elementToRemove) {
        this.values = this.values.filter(element => element !== elementToRemove);
    }

    showActualData() {
        return this.values.filter(element => !element.archived);
    }
    
    showArchivedData() {
        return this.values.filter(element => element.archived);
    }
}