import { useState } from "react";
import { setSelectedFacetHighlighter } from "../../../highlighter";
import { defaultFacetName } from "../../constant";

const useSelectedFacet = (initialValue = defaultFacetName) => {
    const [selectedFacet, setSelectedFacet] = useState(initialValue);

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