export default class Element {
    constructor(options = {}) {
        this.events = [];
        
        options.parent = options.parent ?? null;
        options.element = options.element ?? 'div';
        options.htmlContent = options.htmlContent ?? '';
        options.classNames = options.classNames ? [].concat(options.classNames) : [];

        this.parent = options.parent;
        this.element = document.createElement(options.element);
        this.element.innerHTML = options.htmlContent;
        options.classNames.forEach(className => {
            this.element.classList.add(className);
        });

        if (this.parent) {
            this.parent.appendChild(this.element);
        }
    }

    addEvent(eventName, callback) {
        this.events.push(eventName);
        this.element[eventName] = callback;
    }

    update(newHtmlContent) {
        this.element.innerHTML = newHtmlContent;
    }

    destroy() {
        this.events.forEach((eventName) => {
            this.element[eventName] = null;
        });
        this.element.remove();
    }
}