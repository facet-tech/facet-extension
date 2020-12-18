import { useEffect, useState } from "react";
import { setFacetMapHighlighter } from "../../../highlighter";

const defaultVal = new Map([['Facet-1', []]]);

const useSelectedFacet = (initialValue = new Map()) => {
    const [facetMap, setFacetMap] = useState(defaultVal);

    useEffect(() => {
        console.log('MONO ONCE @useSelectedFacet');
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