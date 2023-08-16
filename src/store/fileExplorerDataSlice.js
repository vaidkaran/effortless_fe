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
    addToFileExplorer(state, action) {
      const {filename, key, parentFolder, folder} = action.payload;
      const folderOpts = folder ? {isLeaf: false, selectable: false} : {};
      if(!parentFolder) {
        state.push({title: filename, key, isLeaf: true, ...folderOpts});
        return;
      }

      const getParentObject = (s) => {
        for(let i=0; i<s.length; i+=1) {
          if(s[i].key === parentFolder) {
            return s[i];
          } else if(s[i].children) {
            const ob = getParentObject(s[i].children);
            if(ob) return ob;
          }
        }
        return;
      }
      
      const parentObject = getParentObject(state);
      if (!parentObject.children) parentObject.children = [];
      parentObject.children.push({title: filename, key, isLeaf: true, ...folderOpts})
    },
    renameFileInExplorer(state, action) {
      const {key, newFilename, newFilenameKey} = action.payload

      const index = getFileIndex(state, newFilename);
      if(index !== undefined) {
        return;
      }

      const i = getFileIndex(state, key);
      state[i].key = newFilenameKey;
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


export const { addToFileExplorer, renameFileInExplorer, deleteFileInExplorer, deleteFile, showSavedIconOnFile, showUnsavedIconOnFile} = fileExplorerDataSlice.actions;

export default fileExplorerDataSlice.reducer;
