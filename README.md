# proxy-typer

Runtime javascript proptypes check, only for user defined classes. \
Implemented using ES6 features (Proxy and Symbol) >=8.0.0

## Install
    npm install proxy-typer --save

## Supported types
   - Number
   - String
   - Date
   - Object
   - Boolena
   - Function
   - AsyncFunction
   - Array
   - User Defined [Custom class]
    
## Description

### How to set type on prop

##### Value need to be number and it's required
    Model.propTypes = {
        exampleProp: Number
    };
    
##### Value need to be string and it's required
    Model.propTypes = {
        exampleProp: {type: String, required: true} 
    };
    
##### Value can be any type that is possible to cast in to number (parseInt)
    
    Model.propTypes = {
        exampleProp: {type: Number, required: true, cast: parseInt} 
    };
    
### How to set type on function

##### Need to be function, first argument need to be number [required], second argument need to be string [required] and function need to return some object 
    Model.propTypes = {
        setValue: {type: Function, args: [Number, String], return: Object};
    }

##### Need to be function, first argument need to be number [required], second argument need to be string and function can not return any value
    Model.propTypes = {

        setValue: {type: Function, args: [{type: Number}, {type: String, required: false}]};
    }    

##### Need to be async function, first argument need to be number [required], second argument need to be string [required], cast arguments in correct types and return some string
    Model.propTypes = {
        setValue: {type: AsyncFunction, args: [Number, String], cast: (...args)=> [...args], return: String};
    }

## How to use
    const {ProxyTyper, AsyncFunction} = require("proxy-typer");
    class Test {
            constructor(value, number) {
                this.value = value;
                this.number = number;
            }

            setValue(val) {
                this.number = val;
                return this.number;
            }

            async getValue() {
                return this.number.toString();
            }
        }

        Test.propTypes = {
            value: String, // is same like {type: String}
            number: Number, // if prop isn't required then {type: Number, required: false}
            setValue: {type: Function, args: [{type: Number}]}, // if function need to return value then add {return: [Type]}
            getValue: {type: AsyncFunction, return: String}
        };

        const TestModel = ProxyTyper(Test);
        const test = new TestModel("test", 45);
        test.setValue(3);
        test.getValue();
## Example
- [Test Model](https://runkit.com/kberbic/proxy-typer-class-example)
- [Test Model with cast](https://runkit.com/kberbic/proxy-typer-class-example-with-cast)

## TO DO
   - Add support for static props and static functions