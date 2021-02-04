import styled from 'styled-components';
import FacetImage from '../shared/FacetImage';
import MarginTop from '../shared/MarginTop';
import Loading from '../shared/Loading';
import facetLogo from '../static/images/facet_main_logo.svg'

const TopDiv = styled.div`
    padding: 1rem;
`;

const GridDiv = styled.div`
    display: grid;
    grid-template-columns: 80% 10% 10%;
    align-items: center;
    justify-content: center;
`;

export default () => {
    return <TopDiv>
        <GridDiv>
            <div>
                <FacetImage title="facet" href="https://facet.run/" src={facetLogo} />
            </div>
        </GridDiv>
        <MarginTop value=".5rem" />
        <Loading />
    </TopDiv>;
}