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
    var {ProxyTyper, AsyncFunction} = require("proxy-typer")
    class Test{
        constructor(value, number){
            this.value = value;
            this.number = number;
        }
        
        setValue(val){
            this.text=val;
            return this.text;
        }
        
        async getValue(){
            return this.text;
        }
    }
    
    Test.propTypes = {
        value: String,
        number: Number,
        setValue: {type: Function, args:[{type: Number}]},
        getValue: {type: AsyncFunction, return: String}
    }
    
    const TestModel = ProxyTyper(Test);
    const test = new TestModel("test", 45);
    test.setValue(3)
    test.getValue()
## Example
    TO DO
## TO DO
   - Add support for static props and static functions