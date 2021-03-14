import React, { useState, useEffect, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useSelector, useDispatch } from "react-redux";

import {
  updateUsername,
  updatePassword,
  updateRememberUser,
} from "./loginFormSlice";
import usePersistedState, {
  getPersistedState,
} from "../utils/usePersistedState";
import LoginButton from "./LoginButton";

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
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

const Login = () => {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const dispatch = useDispatch();

  const username = useSelector((state) => state.loginForm.username);
  const password = useSelector((state) => state.loginForm.password);

  const [rememberUser, setRememberUser] = useState(false);
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();
  const submitButtonRef = useRef();

  useEffect(() => {
    if (getPersistedState("palette-board-remember-user", undefined)) {
      dispatch(updateUsername(getPersistedState("palette-board-remember-user", "")));
      dispatch(updatePassword(""));
      passwordInputRef.current.focus();
    } else {
      dispatch(updateUsername(""));
      dispatch(updatePassword(""));
      usernameInputRef.current.focus();
    }
  }, []);


  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        submitButtonRef.current.click();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  useEffect(() => {
    dispatch(updateRememberUser(rememberUser));
  }, [rememberUser,dispatch])

  return (
    <Container component="main" maxWidth="xs" className="mainContent">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Ingreso
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            error={username.hasError}
            helperText={username.errorMessage}
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Usuario"
            name="username"
            value={username.value}
            inputRef={usernameInputRef}
            onChange={(e) => {
              dispatch(updateUsername(e.target.value));
            }}
          />
          <TextField
            error={password.hasError}
            helperText={password.errorMessage}
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            value={password.value}
            inputRef={passwordInputRef}
            onChange={(e) => {
              dispatch(updatePassword(e.target.value));
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
          <LoginButton className={classes.submit} reference={submitButtonRef} />
        </form>
      </div>
      <Box mt={2}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Login;
