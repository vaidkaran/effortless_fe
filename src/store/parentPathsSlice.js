import {createSlice} from '@reduxjs/toolkit';
const pathSeparator = '.';

const parentPathsSlice = createSlice({
  name: 'parentPaths',
  initialState: {},
  reducers: {
    addx(state, action) {
      state.x += 1;
    },
    addy(state, action) {
      state.y += 5;
    },
    initParentPath(state, action) {
      const {path, setState} = action.payload;
      if(!state[path]) { // path is not present already
        state[path] = {verified: false, setState} 
      } else { // remounting - so path already present
        state[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state[path].setState({verified: state[path].verified}); // reset the previous state
      }
      // don't need to update the global store since this is the global store
      // updateParentPathsAppData();
    },
    addToVerifiedParentPaths(state, action) {
      const {path, opts} = action.payload;
      state[path].verified = true;
      state[path].explicit = opts.explicit || false;
      state[path].setState({ verified: true });

      Object.keys(state).forEach(parentPath => {
          const subParentSelected = !!path.match(new RegExp(`^${parentPath}${pathSeparator}.+`));
          if (subParentSelected && !state[parentPath].verified) {
              state[parentPath].verified = true;
              state[parentPath].explicit = false;
              state[parentPath].setState({ verified: true })
          }
      })

      // parentPathsRef.current = newParentPaths;
      // updateParentPathsAppData();
    }
  }
})

export const { addx, addy, initParentPath, addToVerifiedParentPaths } = parentPathsSlice.actions;
export default parentPathsSlice.reducer;
