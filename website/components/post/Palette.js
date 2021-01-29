import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  hideButton: {
    marginRight: "1rem",
  },
  palleteContainer: {
    padding: 0,
  },
}));

export default function Palette({ colors }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);

  return (
    <CardContent className={classes.palleteContainer}>
      <div style={{ width: "100%", height: "120px" }}>
        <Box
          css={{ height: "100%" }}
          display="flex"
          flexDirection="row"
          bgcolor="background.paper"
        >
          {colors.map((color, i) => (
            <Box key={i} css={{ width: "100%" }} bgcolor={color}></Box>
          ))}
        </Box>
      </div>
    </CardContent>
  );
}
