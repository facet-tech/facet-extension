import React, { Component, useContext } from 'react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

function Popup() {

    const [state, setState] = React.useState({
        checked: true,
    });

    const handleChange = (event) => {
        setState({ ...state, [event.target.name]: event.target.checked });
    };

    return (
        <div>
            Facet Mode:
            <FormGroup row>
                <FormControlLabel
                    control={<Switch checked={state.checked} onChange={handleChange} name="checkedA" />}
                    label="Secondary"
                />
            </FormGroup>
        </div >
    );
}

export default Popup;