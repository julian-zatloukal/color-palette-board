import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Convert from "color-convert";



import { useSelector, useDispatch } from "react-redux";
import { updateFromHsl, updateIsOnChange } from "./paletteDialogSlice";

import { useRef } from "react";

const useStyles = makeStyles((theme) => ({}));

const rgbStringToHsl = (rgb) => {
  let hsl = Convert.hex.hsl(rgb);
  return {
    hue: hsl[0],
    saturation: hsl[1],
    lightness: hsl[2],
  };
};

export default function ColorSlider({
  title,
  parameter,
  icon,
  maxValue = 100,
  initValue,
  updateValue,
}) {
  var themeContext = useTheme();
  const dispatch = useDispatch();
  const classes = useStyles(themeContext);
  const [value, setValue] = useState(initValue);

  const isOnChange = useSelector((state) => state.paletteDialog.isOnChange);
  const selectedBarId = useSelector((state) => state.paletteDialog.selectedBarId);
  const palette = useSelector((state) => state.paletteDialog.palette);


  useEffect(() => {
    console.log("click")
    try{
      let index = palette.findIndex(
        (item) => item.id === selectedBarId
      );
      setValue(rgbStringToHsl(palette[index])[parameter]);
    }catch(ex){
      
    }
    
  }, [isOnChange]);

  useEffect(() => {
    dispatch(
      updateFromHsl({
        parameter: parameter,
        value: value,
      })
    );
  }, [value]);

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

  return (
    <Box component="div">
      <Typography id="input-slider" gutterBottom>
        {title}
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item>{icon}</Grid>
        <Grid item xs>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            max={maxValue}
          />
        </Grid>
        <Grid item>
          <Input
            className={classes.input}
            value={value}
            margin="dense"
            onChange={handleInputChange}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: maxValue,
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
