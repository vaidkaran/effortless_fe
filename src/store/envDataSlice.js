import {createSlice} from '@reduxjs/toolkit';
import { getEnvVarsString, getEnvVarsJson, getEnvVarsAutoCompleteArray } from './envDataSelectors';

const envDataSlice = createSlice({
  name: 'envData',
  initialState: { envVarsString: '{}' },
  reducers: {
    setEnvVarsString: (state, action) => {
      state.envVarsString = action.payload;
    }
  },
})


export const {setEnvVarsString} = envDataSlice.actions;

// selectors;
export {getEnvVarsString, getEnvVarsJson, getEnvVarsAutoCompleteArray};

export default envDataSlice.reducer;

