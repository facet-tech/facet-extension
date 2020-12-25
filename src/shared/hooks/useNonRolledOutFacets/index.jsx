import { useEffect, useState } from "react";
import { setNonRolledOutFacetsHighlighter } from "../../../highlighter";
import { defaultFacetName } from "../../constant";

const useNonRolledOutFacets = (initialValue = [defaultFacetName]) => {
    const [nonRolledOutFacets, setNonRolledOutFacets] = useState(initialValue);

    useEffect(() => {
        setNonRolledOutFacets(initialValue);
        setNonRolledOutFacetsHighlighter(initialValue);
    }, []);

    let setNonRolledOutFacetsValue = (value) => {
        setNonRolledOutFacets(value);
        setNonRolledOutFacetsHighlighter(value);
    };

    return [nonRolledOutFacets, setNonRolledOutFacetsValue];
};

export default useNonRolledOutFacets;