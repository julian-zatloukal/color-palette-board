import { createSlice } from "@reduxjs/toolkit";
import Convert from "color-convert";

export const paletteDialogSlice = createSlice({
  name: "paletteDialog",
  initialState: {
    palette: [],
    selectedBarId: "bar-0",
    isOnChange: false,
  },
  reducers: {
    updateColorBar: (state, action) => {
      try {
        let index = state.palette.findIndex(
          (item) => item.id === action.payload.id
        );
        state.palette[index].color = action.payload.color;
      } catch (ex) {}
    },
    updateAllColorBars: (state, action) => {
        state.palette = action.payload
      },
    addColorBar: (state, action) => {
      state.palette.push({
        id: action.payload.id,
        color: action.payload.color,
      });
    },
    removeColorBar: (state, action) => {
      state.palette.splice(action.payload, 1);
    },
    updateSelectedBarId: (state, action) => {
      state.selectedBarId = action.payload;
    },
    updateIsOnChange: (state, action) => {
      state.isOnChange = action.payload;
    },
    updateFromHsl: (state, action) => {
      try {
        let index = state.palette.findIndex(
          (item) => item.id === state.selectedBarId
        );

        let hsl = Convert.hex.hsl(state.palette[index].color);

        let rgb = "";

        if (action.payload.parameter==='hue') {
          rgb = `#${Convert.hsl.hex(action.payload.value, hsl[1], hsl[2])}`;
        } else if (action.payload.parameter==='saturation') {
          rgb = `#${Convert.hsl.hex(hsl[0], action.payload.value, hsl[2])}`;
        } else if (action.payload.parameter==='lightness') {
          rgb = `#${Convert.hsl.hex(hsl[0], hsl[1], action.payload.value)}`;
        }

        

        state.palette[index].color = rgb;
      } catch (ex) {
        // console.log(ex)
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateColorBar,
  addColorBar,
  removeColorBar,
  updateSelectedBarId,
  updateIsOnChange,
  updateAllColorBars,
  updateFromHsl
} = paletteDialogSlice.actions;

export default paletteDialogSlice.reducer;
