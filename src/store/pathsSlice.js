import {createSlice, createSelector} from '@reduxjs/toolkit';
const pathSeparator = '.';

const pathsSlice = createSlice({
  name: 'paths',
  initialState: { parentPaths: {}, variablePaths: {} },
  reducers: {
    initParentPaths(state, action) {
      const {path, setState} = action.payload;
      if(!state.parentPaths[path]) { // path is not present already
        state.parentPaths[path] = {verified: false, setState}
      } else { // remounting - so path already present
        state.parentPaths[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state.parentPaths[path].setState({verified: state.parentPaths[path].verified}); // reset the previous state
      }
    },
    setParentAsVerified(state, action) {
      const {path, explicit} = action.payload;
      state.parentPaths[path].verified = true;
      state.parentPaths[path].explicit = explicit || false;
      state.parentPaths[path].setState({ verified: true });

      Object.keys(state.parentPaths).forEach(parentPath => {
        const subParentSelected = !!path.match(new RegExp(`^${parentPath}${pathSeparator}.+`));
        if (subParentSelected && !state.parentPaths[parentPath].verified) {
          state.parentPaths[parentPath].verified = true;
          state.parentPaths[parentPath].explicit = false;
          state.parentPaths[parentPath].setState({ verified: true })
        }
      })
    },
    initVariablePaths(state, action) {
      const {path, parentPath, variable, setState} = action.payload;
      if(!state.variablePaths[path]) { // path is not present already
        state.variablePaths[path] = {verified: false, parentPath, variable, setState}
      } else { // remounting - so path already present
        state.variablePaths[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state.variablePaths[path].setState({verified: state.variablePaths[path].verified}); // reset the previous state
      }
    },
    setVariableAsVerified(state, action) {
      const isParentVerified = (path) => {
        if(state.parentPaths[path] && state.parentPaths[path].verified) return true;
        return false;
      }
      const {path} = action.payload;
      state.variablePaths[path].verified = true;
      state.variablePaths[path].setState({ verified: true });
      if(!isParentVerified(state.variablePaths[path].parentPath)) {
        pathsSlice.caseReducers.setParentAsVerified(state, {payload: {path: state.variablePaths[path].parentPath}});
      }
    },
    setParentAsUnverified(state, action) {
      const {path} = action.payload;
      state.parentPaths[path].verified = false;
      state.parentPaths[path].explicit = false;
      state.parentPaths[path].setState({ verified: false })

      const parentPath = Object.keys(state.parentPaths).find(parentPath => path.match(new RegExp(`^${parentPath}${pathSeparator}[^${pathSeparator}]+$`)))
      // if parent just above is verified but not explicitly, then remove it from verified paths
      if(parentPath && state.parentPaths[parentPath].verified===true && state.parentPaths[parentPath].explicit===false) {
        pathsSlice.caseReducers.setParentAsUnverified(state, {payload: {path: parentPath}});
      }
    },
    setVariableAsUnverified(state, action) {
      const {path} = action.payload;
      state.variablePaths[path].verified = false;
      state.variablePaths[path].setState({ verified: false });

      // remove immediate parent from verifiedParentPaths ONLY if it's implicitly verified.
      const {verified, explicit } = state.parentPaths[state.variablePaths[path].parentPath]
      if(verified && !explicit) pathsSlice.caseReducers.setParentAsUnverified(state, {payload: { path: state.variablePaths[path].parentPath}});
    }
  }
})

const getVerifiedParentPaths = createSelector(
  [
    (state) => state.parentPaths,
  ],
  (parentPaths) => Object.keys(parentPaths).filter((path) => parentPaths[path].verified)
);

const getVerifiedVariablePaths = createSelector(
  [
    (state) => state.variablePaths,
  ],
  (variablePaths) => Object.keys(variablePaths).filter((path) => variablePaths[path].verified)
);


export const { initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified,
} = pathsSlice.actions;

export { getVerifiedParentPaths, getVerifiedVariablePaths };

export default pathsSlice.reducer;
