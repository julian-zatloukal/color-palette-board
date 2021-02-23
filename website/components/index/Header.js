import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Container from "@material-ui/core/Container";

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: "1rem",
  },
  heroButtons: {
    marginTop: "4rem",
  },
}));

export default function Navbar() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  return (
    <div className={classes.heroContent}>
      <Container maxWidth="sm">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          Explore and share new colors
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Explore and share color palettes with Palette Board. Eye-catching
          color compositions are waiting to be used in your projects.
        </Typography>
      </Container>
    </div>
  );
}
