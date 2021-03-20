import React, { useState, useEffect } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { green } from "@material-ui/core/colors";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import produce from "immer";
import emailValidator from "email-validator";

import { sendAlert } from "../utils/globalAlertSlice";
import { useDispatch, useSelector } from "react-redux";
import { register, login } from "../utils/apiRequests";

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

export default function RegisterButton({
  reference,
  username,
  setUsername,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const router = useRouter();
  const dispatch = useDispatch();
  const [autoValidate, setAutoValidate] = useState(false);

  const validateInput = {
    all: () => {
      return ![
        validateInput.username(),
        validateInput.email(),
        validateInput.password(),
        validateInput.confirmPassword(),
      ].includes(false);
    },
    username: () => {
      if (username.value === "") {
        setUsername(
          produce(username, (draft) => {
            draft.hasError = true;
            draft.errorMessage = "Complete with your username.";
          })
        );
        return false;
      }

      setUsername(
        produce(username, (draft) => {
          draft.hasError = false;
          draft.errorMessage = "";
        })
      );
      return true;
    },
    email: () => {
      if (email.value === "") {
        setEmail(
          produce(email, (draft) => {
            draft.hasError = true;
            draft.errorMessage = "Complete with your email.";
          })
        );
        return false;
      } else if (!emailValidator.validate(email.value)) {
        setEmail(
          produce(email, (draft) => {
            draft.hasError = true;
            draft.errorMessage = "Invalid email address.";
          })
        );
        return false;
      }

      setEmail(
        produce(email, (draft) => {
          draft.hasError = false;
          draft.errorMessage = "";
        })
      );

      return true;
    },
    password: () => {
      if (password.value === "") {
        setPassword(
          produce(password, (draft) => {
            draft.hasError = true;
            draft.errorMessage = "Complete with your password.";
          })
        );
        return false;
      }

      setPassword(
        produce(password, (draft) => {
          draft.hasError = false;
          draft.errorMessage = "";
        })
      );
      return true;
    },
    confirmPassword: () => {
      if (confirmPassword.value === "") {
        setConfirmPassword(
          produce(confirmPassword, (draft) => {
            draft.hasError = true;
            draft.errorMessage = "Complete with your password again.";
          })
        );
        return false;
      } else if (confirmPassword.value !== password.value) {
        setConfirmPassword(
          produce(confirmPassword, (draft) => {
            draft.hasError = true;
            draft.errorMessage = "Password confirmation doesn't match.";
          })
        );
        return false;
      }

      setConfirmPassword(
        produce(confirmPassword, (draft) => {
          draft.hasError = false;
          draft.errorMessage = "";
        })
      );
      return true;
    },
  };

  useEffect(() => {
    if (autoValidate) validateInput.username();
  }, [username, validateInput]);

  useEffect(() => {
    if (autoValidate) validateInput.email();
  }, [email, validateInput]);

  useEffect(() => {
    if (autoValidate) validateInput.password();
  }, [password, validateInput]);

  useEffect(() => {
    if (autoValidate) validateInput.confirmPassword();
  }, [confirmPassword, validateInput]);

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
      register(username.value, email.value, password.value)
        .then((token) => {
          login(username.value, password.value)
            .then((token) => {
              Cookies.set("user-token", token);

              router.push("/");
            })
            .finally(() => {
              setSuccess(true);
              setLoading(false);
            });
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
          Register
        </Button>
        {loading && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
      </div>
    </div>
  );
}
