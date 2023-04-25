import { configureStore } from "@reduxjs/toolkit";
import reqDataReducer from './reqDataSlice';

const store = configureStore({
  // turn off serializableCheck since we store setState instance in redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    reqData: reqDataReducer,
  }
})

export default store;
