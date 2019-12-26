const {ProxyTyper, AsyncFunction} = require("../../index");

class Input{
    this.#v1 = null;
    constructor(input = {}) {
        Object.assign(this, input);
        this.value = input.value;
        this.values = input.values;
        this.text = input.text;
        this.date = input.date;
        this.input = input.input;
        this.obj = input.obj;
    }

    async setValue(v1, v2) {
        this.#v1 = {v1, v2};
    }

    getValue() {
        return this.#v1
    }

}

Input.propTypes = {
    value: {type: Number, required: false},
    values: [Number],
    setValue: {type: AsyncFunction, args: [{type: Number}, {type: String, required: false}]},
    getValue: {type: Function},
    text: String,
    date: {type: Date, required: false},
    input: {type: Input, required: false},
    obj: {type: Object, required: false}
};

Input.staticTypes = {
    value: {type: Number, required: false},
    values: [Number],
    setValue: {type: AsyncFunction, args: [{type: Number}, {type: String, required: true}], return: Object},
    text: String,
    date: {type: Date, required: false},
    input: {type: Input, required: false},
    obj: {type: Object, required: false}
};

module.exports = ProxyTyper(Input);