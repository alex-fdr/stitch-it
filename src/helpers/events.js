class EventEmitter {
    constructor() {
        this.pool = {};
    }

    on(name, listener) {
        if (!this.has(name)) {
            this.pool[name] = [];
        }

        this.pool[name].push(listener);
        return this;
    }

    once(name, listener) {
        if (!this.has(name)) {
            this.pool[name] = [];
        }

        const id = this.pool[name].length;

        this.pool[name].push((...params) => {
            listener(...params);
            this.pool[name].splice(id, 1);
        });

        return this;
    }

    off(name) {
        if (this.has(name)) {
            delete this.pool[name];
        }

        return this;
    }

    emit(name, ...params) {
        if (this.has(name)) {
            const listeners = this.pool[name];
            for (const callback of listeners) {
                callback(...params);
            }
        }
        return this;
    }

    has(name) {
        return typeof this.pool[name] !== 'undefined';
    }
}

export const events = new EventEmitter();
