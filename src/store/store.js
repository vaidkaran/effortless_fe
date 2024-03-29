import { configureStore } from "@reduxjs/toolkit";
import reqDataReducer from './reqDataSlice';
import rjvReloaderReducer from './rjvReloaderSlice';
import fileExplorerDataReducer from './fileExplorerDataSlice';
import envDataSlice from "./envDataSlice";

const store = configureStore({
  // turn off serializableCheck since we store setState instance in redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    reqData: reqDataReducer,
    rjvReloader: rjvReloaderReducer,
    fileExplorerData: fileExplorerDataReducer,
    envData: envDataSlice
  }
})

export default store;
