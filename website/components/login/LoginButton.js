import React, { useEffect } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useRouter } from 'next/router';

import { sendAlert } from "../utils/globalAlertSlice";

import { useDispatch, useSelector } from "react-redux";
import {
  updateUsernameError,
  updatePasswordError,
  updateUserData,
} from "./loginFormSlice";
import {login} from "../utils/apiRequests";
import Cookies from "js-cookie";

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


export default function LoginButton({ reference }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const dispatch = useDispatch();
  const router = useRouter();

  const username = useSelector((state) => state.loginForm.username);
  const password = useSelector((state) => state.loginForm.password);
  const rememberUser = useSelector((state) => state.loginForm.rememberUser);
  const [autoValidate, setAutoValidate] = React.useState(false);

  const validateInput = {
    all: () => {
      let usernameError = validateInput.username(username.value);
      let passwordError = validateInput.password(password.value);
      return usernameError && passwordError;
    },
    username: (username) => {
      if (username === "") {
        dispatch(
          updateUsernameError({
            hasError: true,
            errorMessage: "Complete with your username.",
          })
        );
        return false;
      }

      dispatch(
        updateUsernameError({
          hasError: false,
          errorMessage: "",
        })
      );
      return true;
    },
    password: (password) => {
      if (password === "") {
        dispatch(
          updatePasswordError({
            hasError: true,
            errorMessage: "Complete with your password.",
          })
        );
        return false;
      }

      dispatch(
        updatePasswordError({
          hasError: false,
          errorMessage: "",
        })
      );

      return true;
    },
  };

  useEffect(() => {
    if (autoValidate) validateInput.username(username.value);
  }, [username, validateInput]);

  useEffect(() => {
    if (autoValidate) validateInput.password(password.value);
  }, [password, validateInput]);

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  



  const handleButtonClick = () => {
    setAutoValidate(true);
    if (validateInput.all() && !loading) {
      setSuccess(false);
      setLoading(true);

      login(username.value, password.value)
        .then((token) => {
          setSuccess(true);
          setLoading(false);

          Cookies.set("user-token", token)

          if (rememberUser) {
            localStorage.setItem(
              "remember-user",
              JSON.stringify(username.value)
            );
          } else {
            localStorage.removeItem("remember-user");
          }

          router.push("/");
        })
        .catch((err) => {
          setSuccess(false);
          setLoading(false);
          dispatch(
            sendAlert({
              message: err.message,
              severity: "error",
            })
          );
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
          ref={reference}
        >
          Login
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  );
}
