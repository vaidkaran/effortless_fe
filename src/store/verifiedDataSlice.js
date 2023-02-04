import {createSlice} from '@reduxjs/toolkit';

const verifiedDataSlice = createSlice({
  name: 'verifiedData',
  initialState: {},
  reducers: {
    addx(state, action) {
      state.x += 1;
    },
    addy(state, action) {
      state.y += 5;
    },
    addVerifiedData(state, action) {
      const {key, value} = action.payload;
      state[key] = value;
    },
    removeVerifiedData(state, action) {
      const {key} = action.payload;
      delete state[key];
    }
  }
})

export const { addx, addy } = verifiedDataSlice.actions;
export default verifiedDataSlice.reducer;
