import DATA from "./database/data.js";

import TableElement from "./components/table.js";
import { DataModel, DataArray } from "./model/model.js";
import Element from "./core/default.js";

window.addEventListener("DOMContentLoaded", () => {
    const classifiedData = new DataArray(DATA);

    if (classifiedData.length === 0) {
        new Element({
            htmlContent: 'No rows to show!',
            classNames: 'notes__error'
        });
        return;
    }

    const mainTable = new TableElement(classifiedData, true);
    const archivedTable = new TableElement(classifiedData, false);
});