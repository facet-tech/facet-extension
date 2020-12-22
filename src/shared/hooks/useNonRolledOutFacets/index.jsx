import { useEffect, useState } from "react";
import { setNonRolledOutFacetsHighlighter } from "../../../highlighter";

const useNonRolledOutFacets = (initialValue = []) => {
    const [nonRolledOutFacets, setNonRolledOutFacets] = useState(initialValue);

    useEffect(() => {
        setNonRolledOutFacets(initialValue);
    }, []);

    let setNonRolledOutFacetsValue = (value) => {
        console.log('CHECKMEHAH', value);
        setNonRolledOutFacets(value);
        setNonRolledOutFacetsHighlighter(value);
    };

    return [nonRolledOutFacets, setNonRolledOutFacetsValue];
};

export default useNonRolledOutFacets;