const AsyncFunction = (async () => {}).constructor;

const typeErrorMessage = (name, type, tn) => {
    const typeName = (tn || type.type.name || type.type[0].name);
    if(!Number.isNaN(parseInt(name)))
        name = "[" + name + "]";

    return type.modelName + name + " need to be " + typeName;
};

const typer = ({v, n, t, tn})=>{
    if(Array.isArray(t.type))
        (v || [undefined]).map(iv=> typer({v: iv, n, t:t.type[0], tn: "Array[" + t.type[0].type.name + "]"}));

    if(!t.required && (v === null || v === undefined))
        return v;

    if (t.required && (v === null || v === undefined || v === "" || Number.isNaN(v)))
        throw new TypeError(typeErrorMessage(n, t, tn));

    if(v.constructor === Array)
    {
        if(!Array.isArray(t.type))
            throw new TypeError(typeErrorMessage(n, t, tn));
    }
    else if (v.constructor.name !== t.type.name)
        throw new TypeError(typeErrorMessage(n, t, tn));

    return v;
};

function getAllMethodNames(obj) {
    let methods = new Set();
    while (obj = Reflect.getPrototypeOf(obj)) {
        let keys = Reflect.ownKeys(obj);
        keys.forEach((k) => methods.add(k));
    }
    return methods;
}

const nameFormating = (...args)=>{
    let text = "";
    args.forEach(a=> text += (a.name ? a.name: a.constructor.name) + ".");
    return text.substring(0, text.length - 1);
};

const _propTypes = Symbol("__propTypes__");
const modelHandler = {
    construct(target, args, newTarget) {
        console.log("CONS")
        const propTypes = target[_propTypes] || target.constructor[_propTypes];
        const output = Reflect.construct(target, args, newTarget);

        if(propTypes)
            Object.keys(propTypes).forEach(n=> {
                const t = propTypes[n];
                const v = output[n];
                typer({v, t, n});

                if (t.type === Function || t.type === AsyncFunction) {
                    const type = propTypes[n];
                    type.modelName += n;
                    output[n][_propTypes] = type;
                    output[n] = new Proxy(output[n], modelHandler);
                }else if(Array.isArray(t.type)){
                    const type = propTypes[n].type[0];
                    type.modelName += n;
                    output[n][_propTypes] = type;
                    output[n] = new Proxy(output[n], modelHandler);
                }
            });

        return new Proxy(output, modelHandler);
    },
    apply(func, target, args) {
        let type = func[_propTypes] || func.constructor[_propTypes];
        type.args
            .forEach((p, i) => typer({v: args[i], t: p, n:func.name + " argument " +i}));

        const output = func.apply(target, args);
        if(type.return && type.return.required && (output === null || output === undefined))
            throw new TypeError("Missing return value for function '" + nameFormating(target, func) + "'");
        else if(output === null || output === undefined)
            return output;

        if (output.constructor === Promise)
            return output.then(v => {
                typer({v, t: type.return, n: func.name + " return"});
            });
        else
            typer({v: output, t: type.return, n: func.name + " return"});

        return output;
    },
    set(target, n, v) {
        if (n === _propTypes) {
            target.constructor[n] = v;
            return true;
        }

        const propTypes = target[_propTypes] || target.constructor[_propTypes];
        let t = propTypes[n] || propTypes;

        if(!target[n])
            typer({v, n, t});

        target[n] = v;

        return true;
    }
};

const parsing = (modelName,propTypes, type, req)=> {
    const required = req !== false;
    const keys = Object.keys(propTypes);

    let types = type === Array ? [] : {};
    if (keys.length)
        keys.forEach(key => {
            types[key] = {type: null, required: required, modelName};
            const value = propTypes[key];
            const keys = Object.keys(value);
            if (value.constructor === Object && keys.length) {
                if (value.type && (Array.isArray(value.type) || value.type.constructor === Function)) {
                    const isArray = Array.isArray(value.type);
                    types[key].required = value.required !== false;
                    types[key].type = isArray ? parsing(modelName, value.type, Array, types[key].required) : value.type;
                    if (value.args)
                        types[key].args = parsing(modelName, value.args, value.args.constructor);
                    if (value.return)
                        types[key].return = {type: value.return, required: required, modelName}
                } else if (value.constructor === Array) {
                    types[key].type = parsing(modelName, value, value.constructor);
                } else {
                    throw new TypeError("Unknown type for prop '" + key + "'");
                }
            } else if (value.constructor === Function) {
                types[key] = {type: value, required: required, modelName};
            } else if (value.constructor === Array) {
                types[key].type = parsing(modelName, value, value.constructor);
            } else {
                throw new TypeError("Unknown type for prop '" + key + "'");
            }
        });
    else{
        types = {type: propTypes, modelName, required: true};
    }
    return types;
};

const Model = (model, directType)=> {
    if(!model[_propTypes]) {
        let types = null;
        if (model.propTypes) {
            const modelName = model.name + "->";
            const propTypes = directType || model.propTypes;

            if (model.propTypes)
                delete model.propTypes;
            types = propTypes ? parsing(modelName, propTypes) : null;
        } else if (directType)
            types = {type: directType, modelName: model.constructor.name + "->", required: true};

        if (!types || !Object.keys(types).length)
            throw new TypeError("Please attach propsTypes on selected models like 'model.propTypes'");

        model[_propTypes] = types;
    }

    return new Proxy(model, modelHandler);
};

module.exports.ProxyTyper = Model;
module.exports.AsyncFunction = AsyncFunction;