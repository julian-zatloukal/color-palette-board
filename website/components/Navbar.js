import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import PaletteIcon from "@material-ui/icons/Palette";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: "1rem",
  },
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Navbar() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <PaletteIcon className={classes.icon} />
          <Typography variant="h6" className={classes.title}>
            Palette Board
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
