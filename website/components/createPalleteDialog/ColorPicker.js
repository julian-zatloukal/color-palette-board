import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ColorizeIcon from "@material-ui/icons/Colorize";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Convert from "color-convert";
import { useSelector, useDispatch } from "react-redux";
import {
  updateColorBar,
  addColorBar,
  removeColorBar,
  updateSelectedBarId,
  updateIsOnChange,
} from "./paletteDialogSlice";
import { BlockPicker, SliderPicker } from "react-color";

const randomRgbColor = () => {
  let rgb = Convert.hsl.hex(
    Math.floor(Math.random() * Math.floor(360)),
    60,
    60
  );

  return `#${rgb}`;
};

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "0.5rem",
    display: "flex",

    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
  },
}));

export default function Picker({ color, onColorChange }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const dispatch = useDispatch();

  const [colorSwatch, setColorSwatch] = useState(
    Array(12)
      .fill()
      .reduce((acc, v, i) => {
        let randomColor = randomRgbColor();
        while (acc.includes(randomColor)) randomColor = randomRgbColor();
        return acc.concat(randomColor);
      }, [])
  );

  // const onColorChangeHandle = (color) => {
  //   onColorChange(color);
  // };

  const [internalColor, setInternalColor] = useState(color);

  useEffect(() => {
    
    setInternalColor(color);
  }, [color])

  return (
    <Box component="div" className={classes.container}>
      <Box
        style={{
          marginRight: "1rem",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <BlockPicker
          triangle="hide"
          color={color}
          colors={colorSwatch}
          onChangeComplete={(color, event) => onColorChange(color.hex)}
        />
      </Box>
      <Box
        component="div"
        style={{ width: "100%", marginTop: "2rem", position: "relative" }}
      >
        <SliderPicker
          color={internalColor}
          onChange={(result, event) => setInternalColor(result.hex)}
          onChangeComplete={(result, event) => onColorChange(result.hex)}
        />
      </Box>
    </Box>
  );
}
