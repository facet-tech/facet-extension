function CustomProxy(array) {
    if (!("Proxy" in window)) {
        console.warn("Your browser doesn't support Proxies.");
        return;
    }

    // a proxy for our array
    var proxy = new Proxy(array, {
        apply: function (target, thisArg, argumentsList) {
            return thisArg[target].apply(this, argumentsList);
        },
        deleteProperty: function (target, property) {
            console.log("Deleted %s", property);
            return true;
        },
        set: function (target, property, value, receiver) {
            target[property] = value;
            console.log("Set %s to %o", property, value);
            return true;
        }
    });
    return proxy;
}

export default CustomProxy;
