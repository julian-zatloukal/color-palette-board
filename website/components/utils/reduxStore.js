/* eslint-disable no-underscore-dangle */

import { configureStore } from "@reduxjs/toolkit";
import globalAlertReducer from "../utils/globalAlertSlice";
import userDataReducer from "../utils/userDataSlice";
import loginFormReducer from "../login/loginFormSlice";

export default configureStore({
  reducer: {
    globalAlert: globalAlertReducer,
    userData: userDataReducer,
    loginForm: loginFormReducer,
  },
});
