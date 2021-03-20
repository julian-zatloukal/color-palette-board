import React from "react";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import {
  openAlert,
  updateAlertMessage,
  sendAlert,
} from "../utils/globalAlertSlice";
import { submitPost } from "../utils/apiRequests";

export default function SubmitButton({ callback, palette }) {
  const dispatch = useDispatch();

  const submit = async () => {
    let paletteData = palette.reduce((acc, v, i) => acc.concat(v.color), []);

    submitPost(paletteData)
      .then(() => {
        dispatch(
          sendAlert({
            severity: "success",
            message: "Post created successfully.",
          })
        );
      })
      .catch((error) => {
        dispatch(
          sendAlert({
            severity: "error",
            message: error.message,
          })
        );
      })
      .finally(() => {
        callback();
      });
  };

  return (
    <Button onClick={submit} color="primary">
      Sumbit
    </Button>
  );
}
