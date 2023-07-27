import Element from "../core/default.js";
import CATEGORIES from "../database/noteCategories.js";

export default class Modal extends Element {
    constructor(data, onUpdate) {
        const options = {
            parent: document.body,
            classNames: 'notes__modal-wrapper'
        };
        super(options);
        this.data = data;
        this.onUpdate = onUpdate;
        const divClass = 'notes__modal-row';
        const labelClass = 'notes__modal-label';
        const inputClass = 'notes__modal-input';
        const fieldsetClass = 'notes__modal-fieldset';
        const selectClass = 'notes__modal-select';

        this.fieldsToEdit = ['name', 'category', 'content']

        this.form = new Element({
            parent: this.element,
            element: 'form',
            classNames: 'notes__modal-form'
        });

        let content = '';
        if (this.data) {
            this.data.forEach(([name, value]) => {
                if (!this.fieldsToEdit.includes(name)) return;
                if (name === 'content') {
                    content += `<div class='${divClass}'><p class='${labelClass}'>Content</p><textarea class='${fieldsetClass}' name='${name}'>${value}</textarea></div>`;
                } else if (name === 'category') {
                    content += `<div class='${divClass}'><p class='${labelClass}'>Category</p><select class='${selectClass}' name='${name}' value='${value}'>${CATEGORIES.reduce((str, element) => str += `<option ${element.name === value ? `selected` : ''} value='${element.name}'>${element.name}</option>`, '')
                        }</select></div>`;
                } else {
                    content += `<div class='${divClass}'><p class='${labelClass}'>Name</p><input class='${inputClass}' name='${name}' value='${value}'></div>`;
                }
            });
            this.form.update(content);
        } else {
            this.fieldsToEdit.forEach(name => {
                if (name === 'content') {
                    content += `<div class='${divClass}'><p class='${labelClass}'>Content</p><textarea class='${fieldsetClass}' name='${name}'></textarea></div>`;
                } else if (name === 'category') {
                    content += `<div class='${divClass}'><p class='${labelClass}'>Category</p><select class='${selectClass}' name='${name}' value=''>${CATEGORIES.reduce((str, element) => str += `<option value='${element.name}'>${element.name}</option>`, '')
                        }</select></div>`;
                } else {
                    content += `<div class='${divClass}'><p class='${labelClass}'>Name</p><input class='${inputClass}' name='${name}' value=''></div>`;
                }
            });
            this.form.update(content);
        }

        this.updateButton = new Element({
            parent: this.form.element,
            element: 'button',
            classNames: 'note__modal-updatebtn',
            htmlContent: this.data ? 'Update note' : 'Add note'
        });
        this.updateButton.addEvent('onclick', this.updatehandler);

        this.cancelButton = new Element({
            parent: this.form.element,
            element: 'button',
            classNames: 'note__modal-cancelbtn',
            htmlContent: 'Cancel'
        });
        this.cancelButton.addEvent('onclick', this.cancelhandler);

        this.addEvent('onclick', (e) => {
            if (this.element === e.target)
                this.cancelhandler(e);
        });
    }

    updatehandler = (e) => {
        e.preventDefault();
        const newData = {};
        if (this.data) {
            this.data.forEach(([name]) => {
                if (!this.fieldsToEdit.includes(name)) return;
                newData[name] = this.form.element.querySelector(`[name=${name}]`).value;
            });
        } else {
            this.fieldsToEdit.forEach(name => {
                if (!this.fieldsToEdit.includes(name)) return;
                newData[name] = this.form.element.querySelector(`[name=${name}]`).value;
            });
        }
        this.onUpdate(newData);
        this.cancelhandler(e);
    }

    cancelhandler = (e) => {
        e.preventDefault();
        this.updateButton.destroy();
        this.cancelButton.destroy();
        this.form.destroy();
        this.destroy();
    }
}