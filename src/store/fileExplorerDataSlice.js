import {createSlice, current} from '@reduxjs/toolkit';
import {setUnsetAsTest} from './reqDataSlice';
import {VerifiedIcon} from '../icons';

const fileExplorerDataSlice = createSlice({
  name: 'fileExplorerData',
  initialState: [],
  reducers: {
    addFileToFileExplorer(state, action) {
      const filename = action.payload;
      state.push({title: filename, key: filename, isLeaf: true});
    },
    showSavedIconOnFile(state, action) {
      const selectedFileId = action.payload;
      for (let i=0; i<state.length; i+=1) {
        if (state[i].key === selectedFileId) {
          state[i].switcherIcon = <VerifiedIcon/>
        }
      }
    },
    showUnsavedIconOnFile(state, action) {
      const selectedFileId = action.payload;
      for (let i=0; i<state.length; i+=1) {
        if (state[i].key === selectedFileId) {
          state[i].switcherIcon = undefined;
        }
      }
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(setUnsetAsTest, (state, action) => {
  //       console.log('in ext red')
  //       console.log(Object.keys(state))
  //     })
  // }
  // extraReducers: {
  //   'reqData/setUnsetAsTest': (state, action) => {
  //     console.log('in ext red')
  //     const s = current(state);
  //     console.log(s)
  //   }
  // }
})


export const { addFileToFileExplorer, showSavedIconOnFile, showUnsavedIconOnFile } = fileExplorerDataSlice.actions;

export default fileExplorerDataSlice.reducer;
