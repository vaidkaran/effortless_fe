import {createSlice} from '@reduxjs/toolkit';
import { getDispose, getEnvVarsString, getEnvVarsJson, getEnvVarsAutoCompleteArray, getEnvVarsEditorAutoSuggestArray } from './envDataSelectors';

const defaultEnvVars = {
  // jsonPlaceholderUrl: 'https://jsonplaceholder.typicode.com'
  local: {
    baseUrl: 'http://localhost:8082'
  },
  qa: {
    baseUrl: 'https://tryexpress.onrender.com'
  }
}

const envDataSlice = createSlice({
  name: 'envData',
  // initialState: { envVarsString: '{ "jsonPlaceholderUrl": "https://jsonplaceholder.typicode.com"}', dispose: null },
  initialState: { envVarsString: JSON.stringify(defaultEnvVars, null, 2), dispose: null },
  reducers: {
    setEnvVarsString: (state, action) => {
      state.envVarsString = action.payload;
    },
  },
})


export const {setEnvVarsString} = envDataSlice.actions;

// selectors;
export {getEnvVarsString, getEnvVarsJson, getEnvVarsAutoCompleteArray, getEnvVarsEditorAutoSuggestArray};

export default envDataSlice.reducer;

