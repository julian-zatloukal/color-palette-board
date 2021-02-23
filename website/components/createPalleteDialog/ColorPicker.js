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

import ColorSlider from "./Slider";

const useStyles = makeStyles((theme) => ({}));

const rgbStringToHsl = (rgb) => {
  let hsl = Convert.hex.hsl(rgb);
  return {
    hue: hsl[0],
    saturation: hsl[1],
    lightness: hsl[2],
  };
};

const hslToRgbString = (hsl) => {
  let rgb = Convert.hsl.hex(hsl.hue, hsl.saturation, hsl.lightness);
  return `#${rgb}`;
};

export default function Picker() {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const [value, setValue] = useState(30);
  const [hslValues, setHslValues] = useState(rgbStringToHsl("#000000"));

  const palette = useSelector((state) => state.paletteDialog.palette);
  const isOnChange = useSelector((state) => state.paletteDialog.isOnChange);
  const selectedBarId = useSelector(
    (state) => state.paletteDialog.selectedBarId
  );

  useEffect(() => {
    if (typeof palette[0] !== "undefined") {
      try {
        let index = palette.findIndex((item) => item.id === selectedBarId);
        setHslValues(rgbStringToHsl(palette[index].color));
      } catch (ex) {}
    }
  }, [isOnChange, selectedBarId]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      updateColorBar({
        id: selectedBarId,
        color: hslToRgbString(hslValues),
      })
    );
  }, [hslValues]);

  return (
    <Box
      component="div"
      style={{ marginLeft: "2rem", marginRight: "2rem", marginTop: "2rem" }}
    >
      <ColorSlider
        title="Hue"
        parameter="hue"
        icon={<ColorLensIcon />}
        initValue={hslValues.hue}
        maxValue={360}
        updateValue={(hueValue) => {
          setHslValues({ ...hslValues, hue: hueValue });
        }}
      />
      <ColorSlider
        title="Saturation"
        parameter="hue"
        icon={<ColorizeIcon />}
        initValue={hslValues.saturation}
        updateValue={(satValue) => {
          setHslValues({ ...hslValues, saturation: satValue });
        }}
      />
      <ColorSlider
        title="Lightness"
        parameter="hue"
        icon={<Brightness5Icon />}
        initValue={hslValues.lightness}
        updateValue={(ligValue) => {
          setHslValues({ ...hslValues, lightness: ligValue });
        }}
      />
    </Box>
  );
}
