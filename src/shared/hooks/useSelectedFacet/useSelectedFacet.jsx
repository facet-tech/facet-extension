import { useState, useEffect } from "react";
import { setSelectedFacetHighlighter } from "../../../highlighter";

const useSelectedFacet = () => {
    const [selectedFacet, setSelectedFacet] = useState('');

    // proxying request to highlighter object
    let setSelectedFacetValue = (value) => {
        setSelectedFacet(value);
        setSelectedFacetHighlighter(value);
    };

    return [
        selectedFacet,
        setSelectedFacetValue
    ];
};

export default useSelectedFacet;