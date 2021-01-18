import { useEffect, useState } from "react";
import { setFacetMapHighlighter } from "../../../highlighter";
import { defaultFacetName } from '../../constant'

const defaultVal = new Map([[defaultFacetName, []]]);

const useSelectedFacet = (initialValue = new Map()) => {
    const [facetMap, setFacetMap] = useState(defaultVal);

    useEffect(() => {
        setFacetMapHighlighter(initialValue);
    }, []);

    // proxying request to highlighter object
    let setSelectedFacetValue = (value) => {
        setFacetMap(value);
        setFacetMapHighlighter(value);
    };

    return [facetMap, setSelectedFacetValue];
};

export default useSelectedFacet;