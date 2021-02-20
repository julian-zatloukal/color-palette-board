import React, { useState, useEffect, useRef } from "react";
import clsx from "clsx";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Cookies from 'js-cookie';

import { green } from "@material-ui/core/colors";

import { useRouter } from 'next/router'
import usePersistedState, {
  getPersistedState,
  setPersistedState,
} from "../utils/usePersistedState";

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      Julián Zatloukal
      {" " + new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const Login = () => {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberUser, setRememberUser] = useState(false);
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();


  useEffect(() => {
    
    if (getPersistedState("palette-board-remember-user", undefined)) {
      setUsername(getPersistedState("palette-board-remember-user", ""));
      passwordInputRef.current.focus();
    } else{
      usernameInputRef.current.focus();
    }
  }, [])


  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

  const LoginButton = ({ onClick, alertCallback }) => {
    const useStyles = makeStyles((theme) => ({
      root: {
        marginTop: "1rem",
        alignItems: "center",
      },
      wrapper: {
        position: "relative",
      },
      buttonSuccess: {
        backgroundColor: green[500],
        "&:hover": {
          backgroundColor: green[700],
        },
      },
      buttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12,
      },
    }));

    var themeContext = useTheme();
    const classes = useStyles(themeContext);
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const buttonClassname = clsx({
      [classes.buttonSuccess]: success,
    });

    const handleButtonClick = () => {
      if (!loading) {
        setSuccess(false);
        setLoading(true);
        onClick()
          .then(() => {
            setSuccess(true);
            setLoading(false);
          })
          .catch((err) => {
            setSuccess(false);
            setLoading(false);
            alertCallback(err.message);
          });
      }
    };

    return (
      <div className={classes.root}>
        <div className={classes.wrapper}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={buttonClassname}
            disabled={loading}
            onClick={handleButtonClick}
          >
            Ingresar
          </Button>
          {loading && (
            <CircularProgress size={24} className={classes.buttonProgress} />
          )}
        </div>
      </div>
    );
  };

  const tryLogin = async (event) => {
    let originUrl = process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
      ? process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
      : window.location.origin + "/api/";

    var res = await fetch(originUrl + "login", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((response) => {
        if (response.status >= 400 && response.status < 600) {
          throw new Error("Could not establish connection to server.");
        }
        return response;
      })
      .then((res) => res.json())
      .catch((error) => {
        console.log(error);
      });

    if (!res) {
      throw new Error("Could not establish connection to server.");
    }

    if (res.status === "OK") {
      Cookies.set('palette-board-token', res.token);

      if(rememberUser){
        window.localStorage.setItem(
          "palette-board-remember-user",
          JSON.stringify(username)
        );
      } else {
        if (window.localStorage.getItem("palette-board-remember-user")){
          window.localStorage.removeItem("palette-board-remember-user");
        }
      }
      
      router.push("/");
    } else {
      throw new Error("Usuario o contraseña incorrecto.");
    }
  };

  const [alertOpen, setAlertOpen] = useState(false);
  const [alertDialog, setAlertDialog] = useState("Error");

  const showAlert = (message) => {
    setAlertDialog(message);
    setAlertOpen(true);
  };

  const handleAlertClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setAlertOpen(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Snackbar
        open={alertOpen}
        autoHideDuration={3000}
        onClose={handleAlertClose}
      >
        <Alert onClose={handleAlertClose} severity="error">
          {alertDialog}
        </Alert>
      </Snackbar>

      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingreso
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            value={username}
            inputRef={usernameInputRef}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            
          />
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            value={password}
            inputRef={passwordInputRef}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={
              <Checkbox
                value="remember"
                color="primary"
                onChange={(e, isChecked, val) => {
                  setRememberUser(isChecked);
                }}
              />
            }
            label="Recordar usuario"
          />
          <LoginButton
            alertCallback={(message) => showAlert(message)}
            className={classes.submit}
            onClick={(event) => tryLogin(event)}
          />
        </form>
      </div>
      <Box mt={2}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Login;
