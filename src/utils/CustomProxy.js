function CustomProxy(array, observerFunctions) {
    if (!("Proxy" in window)) {
        console.warn("Your browser doesn't support Proxies.");
        return;
    }

    var proxy = new Proxy(array, {
        get(target, prop) {
            // add functions to trigger callbacks
            if (prop === 'filter' || prop === 'push') {
                triggerCallbacks(observerFunctions, target);
            }
            return target[prop];
        },
    });
    return proxy;
}

const triggerCallbacks = (observerFunctions, value) => {
    observerFunctions && observerFunctions.forEach(fn => {
        fn(value);
    })
}

export default CustomProxy;
