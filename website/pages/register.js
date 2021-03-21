import React from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import Register from "../components/register";

const useStyles = makeStyles((theme) => ({
  root: {},
}));

export default function Component() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  return <Register/>;
}
