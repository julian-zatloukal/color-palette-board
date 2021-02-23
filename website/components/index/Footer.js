import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        Julián Zatloukal
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: "1rem",
  },
  heroButtons: {
    marginTop: "4rem",
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: "3rem",
  },
}));

export default function Navbar() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  return (
    <footer className={classes.footer}>
      <Typography variant="h6" align="center" gutterBottom>
        Pallete board 
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="textSecondary"
        component="p"
      >
        Small project developed using the MERN stack and Next.js
      </Typography>
      <Copyright />
    </footer>
  );
}
