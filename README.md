# proxy-typer

Runtime javascript proptypes check, only for user defined classes. \
Implemented using ES6 features (Proxy and Symbol)

## Install
    npm install proxy-typer --save

## Supported types
   - Number
   - String
   - Date
   - Object
   - Function
   - AsyncFunction
   - Array
   - User Defined [Custom class]
    
## Description

## How to use
    const {ProxyTyper, AsyncFunction} = require("proxy-typer");
    
    class UserDefined{
        this.#v1 = null;
        constructor(input = {}) {
            //Object.assign(this, input); 
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
    
    UserDefined.propTypes = {
        value: {type: Number, required: false},
        values: [Number],
        setValue: {type: AsyncFunction, args: [{type: Number}, {type: String, required: false}]},
        getValue: {type: Function, return: Object},
        text: String,
        date: {type: Date, required: false},
        input: {type: Input, required: false},
        obj: {type: Object, required: false}
    };
    
    module.exports = ProxyTyper(UserDefined);
## Example
    TO DO
## TO DO
   - Add support for static props and static functions