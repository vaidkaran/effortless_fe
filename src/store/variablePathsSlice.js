import {createSlice} from '@reduxjs/toolkit';
import { addToVerifiedParentPaths } from './parentPathsSlice';

const variablePathsSlice = createSlice({
  name: 'variablePaths',
  initialState: {},
  reducers: {
    initVariablePath(state, action) {
      const {path, parentPath, variable, setState} = action.payload;
      if(!state[path]) { // path is not present already
        state[path] = {verified: false, parentPath, variable, setState}
      } else { // remounting - so path already present
        state[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state[path].setState({verified: state[path].verified}); // reset the previous state
      }
      // don't need to update the global store since this is the global store
      // updateVariablePathsAppData();
    },
    addToVerifiedVariablePaths(state, action) {
      // from global state pull verifiedParentPaths and use here
      const isParentVerified = (path) => {
        if(state[path] && state[path].verified) return true;
        return false;
      }
      const {path} = action.payload;
      // const newVariablePaths = _.cloneDeep(variablePathsRef.current)
      state[path].verified = true;
      state[path].setState({ verified: true });
      // variablePathsRef.current = newVariablePaths;

      if(!isParentVerified(state[path].parentPath)) addToVerifiedParentPaths(state[path].parentPath);
      // updateVariablePathsAppData();
    }
  }
})

export const { addx, addy } = variablePathsSlice.actions;
export default variablePathsSlice.reducer;
