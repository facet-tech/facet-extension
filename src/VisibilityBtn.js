import React from 'react';
import Button from '@material-ui/core/Button';
import VisibilityRoundedIcon from '@material-ui/icons/VisibilityRounded';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

export default function VisibilityBtn({ visible = false, onClick }) {

    return (
        <Button onClick={onClick} color="primary" aria-label="add">
            {visible ? <VisibilityRoundedIcon /> : <VisibilityOffIcon />}
        </Button>
    );
}