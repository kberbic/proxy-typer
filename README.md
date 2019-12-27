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
   - Function
   - AsyncFunction
   - Array
   - User Defined [Custom class]
    
## Description

## How to use
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
    TO DO
## TO DO
   - Add support for static props and static functions