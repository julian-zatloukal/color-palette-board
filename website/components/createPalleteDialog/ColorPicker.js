import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ColorLensIcon from "@material-ui/icons/ColorLens";
import ColorizeIcon from "@material-ui/icons/Colorize";
import Brightness5Icon from "@material-ui/icons/Brightness5";
import Convert from "color-convert";
import { useSelector, useDispatch } from 'react-redux'

import ColorSlider from "./Slider";


const useStyles = makeStyles((theme) => ({}));

export default function Picker({ initialColor, updateColor }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const [value, setValue] = useState(30);
  const palette = useSelector(state => state.paletteDialog.palette);

  useEffect(() => {
    console.log(palette);

  }, [palette])



  const rgbStringToHsl = (rgb) => {
    // let hsl = Convert.rgb.hsl(
    //   parseInt(rgb.substring(1, 3), 16),
    //   parseInt(rgb.substring(3, 5), 16),
    //   parseInt(rgb.substring(5), 16)
    // );


    let hsl = Convert.hex.hsl(rgb);

    return {
      hue: hsl[0],
      saturation: hsl[1],
      lightness: hsl[2],
    };
  };

  const hslValues = useRef({
    hue: 20,
    saturation: 30,
    lightness: 40,
  });

  const [hslValuesInitial, setHslValuesInitial] = useState(
    rgbStringToHsl(initialColor)
  );

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === "" ? "" : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  useEffect(() => {
    setHslValuesInitial(rgbStringToHsl(initialColor));
    console.log(rgbStringToHsl(initialColor))
  }, [initialColor])
  
  // useEffect(() => {
  //   console.log(hslValuesInitial)
  // }, [hslValuesInitial])


  return (
    <Box
      component="div"
      style={{ marginLeft: "2rem", marginRight: "2rem", marginTop: "2rem" }}
    >
      <ColorSlider
        title="Hue"
        icon={<ColorLensIcon />}
        initValue={hslValuesInitial.hue}
        maxValue={360}
        updateValue={(hueValue) => {
          hslValues.current.hue = hueValue;
          updateColor(hslValues.current);
        }}
      />
      <ColorSlider
        title="Saturation"
        icon={<ColorizeIcon />}
        initValue={hslValuesInitial.saturation}
        updateValue={(satValue) => {
          hslValues.current.saturation = satValue;
          updateColor(hslValues.current);
        }}
      />
      <ColorSlider
        title="Lightness"
        icon={<Brightness5Icon />}
        initValue={hslValuesInitial.lightness}
        updateValue={(ligValue) => {
          hslValues.current.lightness = ligValue;
          updateColor(hslValues.current);
        }}
      />
    </Box>
  );
}
