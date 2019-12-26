const Input = require("./test/models/input.model");
const {T, ProxyTyper} = require("./index");

class TestController {
}

async function kenan() {
    const value = await (new Input({value: 5,text:"test", values:[8, 9]}));
    //console.log("FIRST",value)
    value.value = 7;
    //console.log("SECOND",value)
    value.values.push(0)
    value.obj = {}
    //console.log("third",value, value.values.length)
    value.values.pop(0)
    console.log(value.setValue(0, "aa"));
    value.values[1] = 34
    value.date = new Date()
    console.log("third",value, value.values.length)
    value.values = [24,234]
    console.log("third",value, value.values.length)
}
kenan()


//const sym = Symbol("onlyUserDefineInputArray");
//console.log(tet['Symbol("onlyUserDefineInputArray")'])

//console.log("TEST", tet)

TestController.funcArgs = {
    onlyUserDefineInput: [String, Number],
    test: [String, Number, Input]
};

TestController.allowNulls = {
    onlyUserDefineInput: [true, false],
    test: [String, Number, Input]
};

console.log("START")
const tet = new TestController()
console.log("START", tet)
async function keno() {
    const input = new Input({value: 45});
    input.setValue(6)
    console.log(await tet.test("22"))
}

//keno()
module.exports = TestController;
