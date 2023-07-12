import {createSlice, current} from '@reduxjs/toolkit';
import {setUnsetAsTest} from './reqDataSlice';
import {VerifiedIcon} from '../icons';
import { KeyOutlined } from '@ant-design/icons';

const getFileIndex = (state, key) => {
  for (let i=0; i<state.length; i+=1) {
    if (state[i].key === key) {
      return i;
    }
  }
}

const fileExplorerDataSlice = createSlice({
  name: 'fileExplorerData',
  initialState: [],
  reducers: {
    addFileToFileExplorer(state, action) {
      const filename = action.payload;
      state.push({title: filename, key: filename, isLeaf: true});
    },
    renameFileInExplorer(state, action) {
      const {key, newFilename} = action.payload

      const index = getFileIndex(state, newFilename);
      if(index !== undefined) {
        console.log('New filename already exists');
        return;
      }

      const i = getFileIndex(state, key);
      state[i].key = newFilename;
      state[i].title = newFilename;
    },
    deleteFileInExplorer(state, action) {
      const key = action.payload;
      const i = getFileIndex(state, key);
      state.splice(i, 1);
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


export const { addFileToFileExplorer, renameFileInExplorer, deleteFileInExplorer, deleteFile, showSavedIconOnFile, showUnsavedIconOnFile } = fileExplorerDataSlice.actions;

export default fileExplorerDataSlice.reducer;
