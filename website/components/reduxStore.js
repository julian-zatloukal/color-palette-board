/* eslint-disable no-underscore-dangle */

import { configureStore } from '@reduxjs/toolkit'
import paletteDialogReducer from './createPalleteDialog/paletteDialogSlice'

export default configureStore({
  reducer: {
      paletteDialog: paletteDialogReducer
  }
})