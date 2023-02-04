import {createSlice} from '@reduxjs/toolkit';

const selectedFileSlice = createSlice({
  name: 'selectedFileId',
  initialState: {x: 0, y: 0},
  reducers: {
    addx(state, action) {
      state.x += 1;
    },
    addy(state, action) {
      state.y += 5;
    },
  }
})

export const { addx, addy } = selectedFileSlice.actions;
export default selectedFileSlice.reducer;

