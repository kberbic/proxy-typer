const {expect} = require("chai");
const {ProxyTyper} = require("../index");

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
        class ModelTest{
            value;
            constructor(){

            }

            setValue(value) {
                this.value = value;
                return this.value;
            }
        }

        ModelTest.propTypes = {
            value: {type: String, required: false},
            setValue: {type: Function, args:[{type: String}], return: String}
        };

        const TestModel = ProxyTyper(ModelTest);

        const test = new TestModel();
        test.setValue("test");
        expect(test.value).to.equal("test");
    });

    it('create model with array prop', async () => {
        class InnerModel{
            constructor(input = {}){
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
        class InnerModel{
            constructor(input = {}){
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
        try{
            test.values.push("test");
        }catch (ex){
            expect(ex.message).to.equal("InnerModel->values[1] need to be Number");
        }

    });

    it('create array with proxy typer', async () => {
        let array = ProxyTyper([], String);
        array.push("test")
    });
});