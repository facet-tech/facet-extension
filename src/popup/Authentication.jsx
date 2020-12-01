import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PopupContext from './PopupContext';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import isValidEmail from './isValidEmail';
import AppContext from '../AppContext';

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: '100%',
        minWidth: 120
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        width: '100%',
    },
    span: {
        fontSize: '1.2rem',
    }
}));

const GridDiv = styled.div`
    display: grid;
    row-gap: .3rem;
    align-items: center;
    padding: 1rem;
`;

export default () => {
    const classes = useStyles();
    const { setSelectedWayOfLogin, login, email, setEmail } = useContext(AppContext);

    return <div>
        {/* <form> */}
        <GridDiv>
            <div className={classes.span}>
                <span >Please enter your email:</span>
            </div>
            <div>
                <TextField
                    error={!isValidEmail(email)}
                    helperText={!isValidEmail(email) ? 'Please insert a valid email.' : ''}
                    className={classes.button}
                    onChange={(e) => { setEmail(e.target.value) }}
                    id="outlined-basic"
                    variant="outlined" type='email'
                    placeholder="example@email.com" />
            </div>
            <div>
                <Button
                    // type="submit"
                    disabled={!isValidEmail(email)}
                    style={{ width: '100%' }}
                    onClick={() => login()}
                    variant="contained"
                    color="secondary"
                    size="small">Login
                </Button>
            </div>
        </GridDiv>
        {/* </form> */}
    </div>
}