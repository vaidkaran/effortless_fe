import {createSlice} from '@reduxjs/toolkit';

const rjvReloaderSlice = createSlice({
  name: 'rjvReloader',
  initialState: { counter: 0 },
  reducers: {
    reloadRjv(state, action) {
      state.counter += 1;
    },
  }
})


export const { reloadRjv } = rjvReloaderSlice.actions;

export default rjvReloaderSlice.reducer;
