/* eslint-disable no-underscore-dangle */

import { configureStore } from "@reduxjs/toolkit";
import paletteDialogReducer from "../createPalleteDialog/paletteDialogSlice";
import globalAlertReducer from "../utils/globalAlertSlice";
import userDataReducer from "../utils/userDataSlice";

export default configureStore({
  reducer: {
    paletteDialog: paletteDialogReducer,
    globalAlert: globalAlertReducer,
    userData: userDataReducer,
  },
});
