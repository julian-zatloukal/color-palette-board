import { createSlice } from "@reduxjs/toolkit";

export const globalAlertSlice = createSlice({
  name: "globalAlert",
  initialState: {
    alertState: false,
    alertMessage: "message",
    alertSeverity: "success",
    autoHideDuration: 4000,
  },
  reducers: {
    openAlert: (state, action) => {
      state.alertState = true;
    },
    closeAlert: (state, action) => {
      state.alertState = false;
    },
    updateAlertMessage: (state, action) => {
      state.alertMessage = action.payload;
    },
    updateAlertSeverity: (state, action) => {
      state.alertSeverity = action.payload;
    },
    updateAutoHideDuration: (state, action) => {
      state.autoHideDuration = action.payload;
    },
    sendAlert: (state, action) => {
      state.alertState = true;
      state.alertMessage = action.payload.message;
      state.alertSeverity = action.payload.severity;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
    openAlert,
    closeAlert,
    updateAlertMessage,
    updateAlertSeverity,
    updateAutoHideDuration,
    sendAlert
} = globalAlertSlice.actions;

export default globalAlertSlice.reducer;
