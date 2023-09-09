import {createSlice} from '@reduxjs/toolkit';
import { getEnvVars } from './envDataSelectors';

const envDataSlice = createSlice({
  name: 'envData',
  initialState: { envVars: '' },
  reducers: {
    setEnvVars: (state, action) => {
      state.envVars = action.payload;
    }
  },
})


export const {setEnvVars} = envDataSlice.actions;

// selectors;
export {getEnvVars};

export default envDataSlice.reducer;

