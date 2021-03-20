import React, { useState, useEffect, useRef } from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useRouter } from "next/router";

import usePersistedState, {
  getPersistedState,
} from "../utils/usePersistedState";
import RegisterButton from "./RegisterButton";
import produce from "immer";

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

const Register = () => {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const router = useRouter();

  const defaultFieldData = {
    value: "",
    hasError: false,
    errorMessage: "",
  };

  const [username, setUsername] = useState(defaultFieldData);
  const [email, setEmail] = useState(defaultFieldData);
  const [password, setPassword] = useState(defaultFieldData);
  const [confirmPassword, setConfirmPassword] = useState(defaultFieldData);

  const submitButtonRef = useRef();

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

  return (
    <Container component="main" maxWidth="xs" className="mainContent">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form}>
          <TextField
            error={username.hasError}
            helperText={username.errorMessage}
            variant="outlined"
            margin="normal"
            fullWidth
            id="username"
            label="Username"
            name="username"
            onChange={(e) => {
              setUsername(
                produce(username, (draft) => {
                  draft.value = e.target.value;
                })
              );
            }}
          />
          <TextField
            error={email.hasError}
            helperText={email.errorMessage}
            variant="outlined"
            margin="normal"
            fullWidth
            id="email"
            label="Email"
            name="email"
            onChange={(e) => {
              setEmail(
                produce(email, (draft) => {
                  draft.value = e.target.value;
                })
              );
            }}
          />
          <TextField
            error={password.hasError}
            helperText={password.errorMessage}
            variant="outlined"
            margin="normal"
            fullWidth
            name="password"
            label="Password"
            onChange={(e) => {
              setPassword(
                produce(password, (draft) => {
                  draft.value = e.target.value;
                })
              );
            }}
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            error={confirmPassword.hasError}
            helperText={confirmPassword.errorMessage}
            variant="outlined"
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(
                produce(confirmPassword, (draft) => {
                  draft.value = e.target.value;
                })
              );
            }}
            type="password"
            id="confirmPassword"
            autoComplete="current-password"
          />

          <RegisterButton
            reference={submitButtonRef}
            {...{
              username,
              setUsername,
              email,
              setEmail,
              password,
              setPassword,
              confirmPassword,
              setConfirmPassword,
            }}
          />
          <Button
            style={{ width: "100%", marginTop: "1rem" }}
            variant="outlined"
            color="primary"
            onClick={(e) => router.push("/login")}
          >
            Login
          </Button>
        </form>
      </div>
      <Box mt={2}>
        <Copyright />
      </Box>
    </Container>
  );
};

export default Register;
