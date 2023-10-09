import {createSlice} from '@reduxjs/toolkit';
import { getDispose, getEnvVarsString, getEnvVarsJson, getEnvVarsAutoCompleteArray, getEnvVarsEditorAutoSuggestArray } from './envDataSelectors';

const envDataSlice = createSlice({
  name: 'envData',
  initialState: { envVarsString: '{}', dispose: null },
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

