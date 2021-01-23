/**
 * @param {arr} the array of paths
 * @param {withoutFacetizer} boolean variable
 */
// TODO change to single input not array

const parsePath = (arr, addFacetExtensionDiv = true) => {
    if (arr === null || !arr || arr.length === 0) {
        return [];
    }
    var newPayload = [];
    for (var i = 0; i < arr.length; i++) {
        var split1 = arr[i].split('>');
        var secondPathWithoutFacetizer = computeWithOrWithoutFacetizer(arr[i], addFacetExtensionDiv);
        split1[1] = secondPathWithoutFacetizer;
        newPayload.push(split1.join('>'));
    }
    return newPayload[0];
}

let computeWithOrWithoutFacetizer = (strPath, addFacetExtensionDiv = true) => {
    var splitStr = strPath.split('>');
    var secondPathSplit = (splitStr.length > 1 && splitStr[1].split(':nth-of-type')) || [];
    if ((secondPathSplit.length < 2 && !secondPathSplit[0].includes('div') && !addFacetExtensionDiv) || !secondPathSplit[0].includes('div')) {
        return splitStr[1];
    }
    var regExp = /\(([^)]+)\)/;
    var matches = regExp.exec(secondPathSplit[1]);
    const currNumber = matches ? parseInt(matches[1]) : 1;
    const wantedNumber = addFacetExtensionDiv ? currNumber + 1 : currNumber - 1;
    let result;
    if (wantedNumber <= 1) {
        result = `${secondPathSplit[0]}`;
    } else {
        result = `${secondPathSplit[0]}:nth-of-type(${wantedNumber})`;
    }
    return result;
}

const getElementNameFromPath = (path) => {
    const splitArr = path.split('>');
    if (splitArr.length === 0) {
        return 'element';
    }
    const str = splitArr[splitArr.length - 1];
    return str.length > 15 ? `${str.substring(0, 15)}...` : splitArr[splitArr.length - 1];
}

export { getElementNameFromPath };
export default parsePath;