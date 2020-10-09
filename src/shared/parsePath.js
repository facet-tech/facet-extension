import { computeWithOrWithoutFacetizer } from "../highlighter.js";

export default (arr, withoutFacetizer = true) => {
    if (arr === null || !arr || arr.length === 0) {
        return [];
    }
    var newPayload = [];
    for (var i = 0; i < arr.length; i++) {
        var split1 = arr[i].split('>');
        var secondParthWithoutFacetizer = computeWithOrWithoutFacetizer(arr[i], withoutFacetizer);
        split1[1] = secondParthWithoutFacetizer;
        newPayload.push(split1.join('>'));
    }
    return newPayload;
}