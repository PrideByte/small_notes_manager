export default class Signal {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    removeListener(listener) {
        this.listeners = this.listeners.filter(listenerItem => listenerItem !== listener);
    }

    emit(params) {
        this.listeners.forEach(listener => listener(params));
    }
}