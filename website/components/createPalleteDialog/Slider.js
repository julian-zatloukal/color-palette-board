import React, { useState, useEffect } from "react";
import { useTheme } from "@material-ui/core/styles";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Input from "@material-ui/core/Input";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

import useDidMountEffect from "../../utils/useDidMountEffect";
import { useRef } from "react";

const useStyles = makeStyles((theme) => ({}));

export default function ColorSlider({ title, icon, maxValue=100, initValue, updateValue }) {
  var themeContext = useTheme();
  const classes = useStyles(themeContext);
  const [value, setValue] = useState(initValue);

  const isInitial = useRef(true);

  useEffect(() => {
    if (!isInitial.current){
      updateValue(value);
    } else {
      isInitial.current = false;
    }
    
  }, [value]);

  useEffect(() => {
    setValue(initValue);
    isInitial.current = true;
  }, [initValue]);



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
