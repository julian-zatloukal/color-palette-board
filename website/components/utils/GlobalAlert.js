import React, {useEffect} from "react";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

import { useSelector, useDispatch } from "react-redux";
import {
  openAlert,
  closeAlert,
  updateAlertMessage,
  updateAlertSeverity,
  updateAutoHideDuration,
} from "./globalAlertSlice";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function GlobalAlert() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const alertState = useSelector((state) => state.globalAlert.alertState);
  const alertMessage = useSelector((state) => state.globalAlert.alertMessage);
  const alertSeverity = useSelector((state) => state.globalAlert.alertSeverity);
  const autoHideDuration = useSelector((state) => state.globalAlert.autoHideDuration);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    dispatch(closeAlert());

    setOpen(false);
  };

  useEffect(() => {
    if (alertState) {
      handleOpen();
    }
  }, [alertState])

  return (
    <div className={classes.root}>
      <Snackbar open={open} autoHideDuration={autoHideDuration} onClose={handleClose}>
        <Alert onClose={handleClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
