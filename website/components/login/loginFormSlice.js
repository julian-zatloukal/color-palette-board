import { createSlice } from "@reduxjs/toolkit";

export const loginFormSlice = createSlice({
  name: "loginForm",
  initialState: {
    username: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    password: {
      value: "",
      hasError: false,
      errorMessage: "",
    },
    rememberUser: false,
    userData: null
  },
  reducers: {
    updateUsername: (state, action) => {
      state.username.value = action.payload;
    },
    updateUsernameError: (state, action) => {
      state.username.hasError = action.payload.hasError;
      state.username.errorMessage = action.payload.errorMessage;
    },
    updatePassword: (state, action) => {
      state.password.value = action.payload;
    },
    updatePasswordError: (state, action) => {
      state.password.hasError = action.payload.hasError;
      state.password.errorMessage = action.payload.errorMessage;
    },
    updateRememberUser: (state, action) => {
      state.rememberUser = action.payload;
    },
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const {
  updateUsername,
  updateUsernameError,
  updatePassword,
  updatePasswordError,
  updateRememberUser,
  updateUserData
} = loginFormSlice.actions;

export default loginFormSlice.reducer;
