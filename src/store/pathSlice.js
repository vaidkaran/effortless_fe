import {createSlice} from '@reduxjs/toolkit';

const pathSlice = createSlice({
  name: 'path',
  initialState: {x: 0, y: 0},
  reducers: {
    addx(state, action) {
      state.x += 1;
    },
    addy(state, action) {
      state[action.payload] = 'new key added';
      state.y += 5;
    },
  }
})

export const { addx, addy } = pathSlice.actions;
export default pathSlice.reducer;
