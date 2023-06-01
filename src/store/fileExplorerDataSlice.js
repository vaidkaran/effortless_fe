import {createSlice} from '@reduxjs/toolkit';
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
  }
})


export const { addFileToFileExplorer, showSavedIconOnFile } = fileExplorerDataSlice.actions;

export default fileExplorerDataSlice.reducer;
