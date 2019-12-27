const {expect} = require("chai");
const {ProxyTyper, AsyncFunction} = require("../index");

class Model{
    value;
    constructor(){

    }

    setValue(value) {
        this.value = value;
        console.log("this", this.value);
        return this.value;
    }
}

describe('create.test.model', async () => {
    it('create model without required fields', async () => {
        Model.propTypes = {
            value: {type: String, required: false}
        };

        const TestModel = ProxyTyper(Model);

        const test = new TestModel();
    });

    it('create model with one prop name with value', async () => {
        Model.propTypes = {
            value: {type: String, required: false}
        };

        const TestModel = ProxyTyper(Model);

        const test = new TestModel();
        test.value = "23";
        expect(test.value).to.equal("23");
    });

    it('create model with one function required field', async () => {
        class ModelTest {
            value;

            constructor() {

            }

            setValue(value) {
                this.value = value;
                return this.value;
            }
        }

        ModelTest.propTypes = {
            value: {type: String, required: false},
            setValue: {type: Function, args: [{type: String}], return: String}
        };

        const TestModel = ProxyTyper(ModelTest);

        const test = new TestModel();
        test.setValue("test");
        expect(test.value).to.equal("test");
    });

    it('create model with array prop', async () => {
        class InnerModel {
            constructor(input = {}) {
                Object.assign(this, input);
            }
        }

        InnerModel.propTypes = {
            value: {type: String, required: true},
            length: {type: Number, required: true},
            values: {type: [Number], required: true}
        };

        const TestModel = ProxyTyper(InnerModel);

        const test = new TestModel({value: "test", length: 4, values: [50]});
        expect(test.value).to.equal("test");
        expect(test.values.length).to.equal(1);
        expect(test.length).to.equal(4);
        test.values.push(56);
        expect(test.values.length).to.equal(2);
    });

    it('create model with array prop and try adding string in array', async () => {
        class InnerModel {
            constructor(input = {}) {
                Object.assign(this, input);
            }
        }

        InnerModel.propTypes = {
            value: {type: String, required: true},
            length: {type: Number, required: true},
            values: {type: [Number], required: true}
        };

        const TestModel = ProxyTyper(InnerModel);

        const test = new TestModel({value: "test", length: 4, values: [50]});
        expect(test.value).to.equal("test");
        expect(test.values.length).to.equal(1);
        expect(test.length).to.equal(4);
        try {
            test.values.push("test");
        } catch (ex) {
            expect(ex.message).to.equal("InnerModel->values[1] need to be Number");
        }

    });

    it('create model with array prop and try to attach new array list', async () => {
        class InnerModel {
            constructor(input = {}) {
                Object.assign(this, input);
            }
        }

        InnerModel.propTypes = {
            value: {type: String, required: true},
            length: {type: Number, required: true},
            values: {type: [Number], required: true}
        };

        const TestModel = ProxyTyper(InnerModel);

        const test = new TestModel({value: "test", length: 4, values: [50, 45]});
        test.value = "asd";
        test.values.push(0);
        test.values.push(45);
        test.values[1] = 45;
        test.values = [45, 56];
    });

    it('create test model to test functions', async () => {
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
            value: String, // is equal to {type: String}
            number: Number, // if prop isn't required then {type: Number, required: false}
            setValue: {type: Function, args: [{type: Number}]}, // if function need to return value then add {return: [Type]}
            getValue: {type: AsyncFunction, return: String}
        };

        const TestModel = ProxyTyper(Test);
        const test = new TestModel("test", 45);
        test.setValue(3);
        test.getValue();

    });
});