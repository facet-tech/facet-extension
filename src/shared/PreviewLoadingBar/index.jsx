import React from "react";
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import LinearProgress from "@material-ui/core/LinearProgress";
import useInterval from '../hooks/useInterval';
import { color } from "../constant";

export default function CustomizedProgressBars({ onComplete }) {

    const useStyles = makeStyles({
        root: {
            width: '100%',
            height: '1.5rem',
        },
        progressLabel: {
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 1,
            maxHeight: "75px", // borderlinearprogress root.height
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            "& span": {
                width: "100%"
            },
            color: color.darkGray
        },
        centered: {
            width: '100%',
        }
    });

    const classes = useStyles();
    const [progress, setProgress] = React.useState(0);

    const BorderLinearProgress = withStyles((theme) => ({
        root: {
            height: 30,
            borderRadius: 5,
            textAlign: 'center'
        },
        colorPrimary: {
            backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
        },
        bar: {
            borderRadius: 5,
            backgroundColor: '#1a90ff',
        },
    }))(LinearProgress);

    useInterval(() => {
        setProgress((oldProgress) => {
            if (oldProgress === 100) {
                return 100;
            }
            const diff = 25;
            return Math.min(oldProgress + diff, 100);
        });
    }, progress >= 100 ? null : 300);

    if (progress >= 100) {
        onComplete();
    }

    return <div className={classes.root}>
        <Grid container spacing={1} justify="space-between">
            <Grid item xs={12} spacing={0}>
                <div className={classes.progressLabel}>
                    <h3 className={classes.centered}>⚡ Loading Facet Preview ⚡</h3>
                </div>
                <BorderLinearProgress variant="determinate" value={progress} style={{ height: "75px" }} />
            </Grid>
        </Grid>
    </div>
}
