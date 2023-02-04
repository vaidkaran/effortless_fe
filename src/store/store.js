import { configureStore } from "@reduxjs/toolkit";
import pathsReducer from './pathsSlice';

const store = configureStore({
  // turn off serializableCheck since we store setState instance in redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    paths: pathsReducer,
  }
})

export default store;
