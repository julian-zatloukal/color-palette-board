import { createSlice } from "@reduxjs/toolkit";

export const userDataSlice = createSlice({
  name: "userData",
  initialState: {
    userData: null,
    isUserLogged: false
  },
  reducers: {
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateIsUserLogged: (state, action) => {
      state.isUserLogged = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
    updateUserData,
    updateIsUserLogged
} = userDataSlice.actions;

export default userDataSlice.reducer;
