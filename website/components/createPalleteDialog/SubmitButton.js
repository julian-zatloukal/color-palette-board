import React from "react";
import Button from "@material-ui/core/Button";
import Cookies from "js-cookie";

import { useDispatch, useSelector } from "react-redux";
import {
  openAlert,
  updateAlertMessage,
  sendAlert,
} from "../utils/globalAlertSlice";

export default function SubmitButton({ callback }) {
  const dispatch = useDispatch();
  const palette = useSelector((state) => state.paletteDialog.palette);

  const submit = async () => {
    let rawPalette = palette.reduce((acc, v, i) => acc.concat(v.color), []);

    let originUrl = process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
      ? process.env.NEXT_PUBLIC_API_ROOT_ENDPOINT
      : window.location.origin + "/api/";

    const createPost = await (
      await fetch(`${originUrl}posts/create`, {
        method: "POST",
        headers: new Headers({
          Authorization: `Bearer ${Cookies.get("palette-board-token")}`,
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          palette: rawPalette,
        }),
      })
    ).json();

    dispatch(
      sendAlert({
        severity: "success",
        message: "Post created successfully.",
      })
    );

    callback();
  };

  return (
    <Button onClick={submit} color="primary">
      Sumbit
    </Button>
  );
}
