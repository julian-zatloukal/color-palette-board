import { createSlice } from "@reduxjs/toolkit";

export const paletteDialogSlice = createSlice({
  name: "paletteDialog",
  initialState: {
    palette: [],
  },
  reducers: {
    updateColorBar: (state, action) => {
      state.palette[action.payload.index] = action.payload.color;
    },
    addColorBar: (state, action) => {
      state.palette.push(action.payload);
    },
    removeColorBar: (state, action) => {
        state.palette.splice(action.payload,1);
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateColorBar, addColorBar, removeColorBar } = paletteDialogSlice.actions;

export default paletteDialogSlice.reducer;
