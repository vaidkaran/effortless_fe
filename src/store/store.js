import { configureStore } from "@reduxjs/toolkit";
import pathReducer from './pathSlice';
import pathsReducer from './pathsSlice';

const store = configureStore({
  // turn off serializableCheck since we store setState instance in redux
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    path: pathReducer,
    paths: pathsReducer,
  }
})

export default store;
