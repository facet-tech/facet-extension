import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import useInterval from '../hooks/useInterval';
import { color } from "../constant";

export default function CustomizedProgressBars({ onComplete }) {
    const [progress, setProgress] = React.useState(0);

    useInterval(() => {
        setProgress((oldProgress) => {
            if (oldProgress === 100) {
                return 100;
            }
            const diff = 55;
            return Math.min(oldProgress + diff, 100);
        });
    }, progress >= 100 ? null : 300);
    console.log('progress', progress);
    if (progress >= 0) {
        // onComplete();
        console.log('TRIGGERRING');
        var node = document.getElementsByTagName('html').item(0);
        node.style.visibility = "visible";
    }

    return <div></div>;
}
