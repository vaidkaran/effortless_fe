import {createSlice} from '@reduxjs/toolkit';
import { getVerifiedParentPaths, getVerifiedVariablePaths, 
  getMethod, getProtocol, getUrl, getQueryParams, getHeaders, getReqBody, getResBody } from './reqDataSelectors';
const pathSeparator = '.';

const getInitFileData = (opts) => {
  return {
    protocol: 'http://',
    method: 'GET',
    url: 'jsonplaceholder.typicode.com/users/1',
    headers: [{name: 'Content-Type', value: 'application/json'}],
    queryParams: [],
    reqBody: {},
    resBody: {},
    parentPaths: {},
    variablePaths: {},
  }
};

const initialState = {
  selectedFileId: 'default',
  default: {
    protocol: '',
    method: '',
    url: '',
    headers: [],
    queryParams: [],
    reqBody: {},
    resBody: {},
    parentPaths: {},
    variablePaths: {},
  }
}

const reqDataSlice = createSlice({
  name: 'reqData',
  initialState,
  reducers: {
    createNewFile(state, action) {
      const fileId = action.payload;
      state[fileId] = getInitFileData()
      state['selectedFileId'] = fileId;
    },

    /*****************************************************************************************************
     * selectedFileId
     */
    setSelectedFileIdd(state, action) {
      const selectedFileId = action.payload;
      console.log('selectedFileid is: ', selectedFileId)
      state.selectedFileId = selectedFileId;
    },

    /*****************************************************************************************************
     * protocol
     */
    setProtocol(state, action) {
      const protocol = action.payload;
      state[state.selectedFileId].protocol = protocol;
    },

    /*****************************************************************************************************
     * method
     */
    setMethod(state, action) {
      const method = action.payload;
      state[state.selectedFileId].method = method;
    },

    /*****************************************************************************************************
     * url
     */
    setUrl(state, action) {
      const url = action.payload;
      state[state.selectedFileId].url = url;
    },

    /*****************************************************************************************************
     * headers
     */
    setHeaders(state, action) {
      const headers = action.payload;
      state[state.selectedFileId].headers = headers;
    },

    /*****************************************************************************************************
     * queryParams
     */
    setQueryParams(state, action) {
      const queryParams = action.payload;
      state[state.selectedFileId].queryParams = queryParams;
    },

    /*****************************************************************************************************
     * reqBody
     */
    setReqBody(state, action) {
      const reqBody = action.payload;
      state[state.selectedFileId].reqBody = reqBody;
    },

    /*****************************************************************************************************
     * resBody
     */
    setResBody(state, action) {
      const resBody = action.payload;
      state[state.selectedFileId].resBody = resBody;
    },

    /*****************************************************************************************************
     * Parent & Variable paths
     */

    initParentPaths(state, action) {
      const {path, setState} = action.payload;
      const {selectedFileId} = state;
      if(!state[selectedFileId].parentPaths[path]) { // path is not present already
        state[selectedFileId].parentPaths[path] = {verified: false, setState}
      } else { // remounting - so path already present
        state[selectedFileId].parentPaths[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state[selectedFileId].parentPaths[path].setState({verified: state[selectedFileId].parentPaths[path].verified}); // reset the previous state
      }
    },
    setParentAsVerified(state, action) {
      const {path, explicit} = action.payload;
      const {selectedFileId} = state;
      state[selectedFileId].parentPaths[path].verified = true;
      state[selectedFileId].parentPaths[path].explicit = explicit || false;
      state[selectedFileId].parentPaths[path].setState({ verified: true });

      Object.keys(state[selectedFileId].parentPaths).forEach(parentPath => {
        const subParentSelected = !!path.match(new RegExp(`^${parentPath}${pathSeparator}.+`));
        if (subParentSelected && !state[selectedFileId].parentPaths[parentPath].verified) {
          state[selectedFileId].parentPaths[parentPath].verified = true;
          state[selectedFileId].parentPaths[parentPath].explicit = false;
          state[selectedFileId].parentPaths[parentPath].setState({ verified: true })
        }
      })
    },
    initVariablePaths(state, action) {
      const {path, parentPath, variable, setState} = action.payload;
      const {selectedFileId} = state;
      if(!state[selectedFileId].variablePaths[path]) { // path is not present already
        state[selectedFileId].variablePaths[path] = {verified: false, parentPath, variable, setState}
      } else { // remounting - so path already present
        state[selectedFileId].variablePaths[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state[selectedFileId].variablePaths[path].setState({verified: state[selectedFileId].variablePaths[path].verified}); // reset the previous state
      }
    },
    setVariableAsVerified(state, action) {
      const {selectedFileId} = state;
      const isParentVerified = (path) => {
        if(state[selectedFileId].parentPaths[path] && state[selectedFileId].parentPaths[path].verified) return true;
        return false;
      }
      const {path} = action.payload;
      state[selectedFileId].variablePaths[path].verified = true;
      state[selectedFileId].variablePaths[path].setState({ verified: true });
      if(!isParentVerified(state[selectedFileId].variablePaths[path].parentPath)) {
        reqDataSlice.caseReducers.setParentAsVerified(state, {payload: {path: state[selectedFileId].variablePaths[path].parentPath}});
      }
    },
    setParentAsUnverified(state, action) {
      const {selectedFileId} = state;
      const {path} = action.payload;
      state[selectedFileId].parentPaths[path].verified = false;
      state[selectedFileId].parentPaths[path].explicit = false;
      state[selectedFileId].parentPaths[path].setState({ verified: false })

      const parentPath = Object.keys(state[selectedFileId].parentPaths).find(parentPath => path.match(new RegExp(`^${parentPath}${pathSeparator}[^${pathSeparator}]+$`)))
      // if parent just above is verified but not explicitly, then remove it from verified paths
      if(parentPath && state[selectedFileId].parentPaths[parentPath].verified===true && state[selectedFileId].parentPaths[parentPath].explicit===false) {
        reqDataSlice.caseReducers.setParentAsUnverified(state, {payload: {path: parentPath}});
      }
    },
    setVariableAsUnverified(state, action) {
      const {selectedFileId} = state;
      const {path} = action.payload;
      state[selectedFileId].variablePaths[path].verified = false;
      state[selectedFileId].variablePaths[path].setState({ verified: false });

      // remove immediate parent from verifiedParentPaths ONLY if it's implicitly verified.
      const {verified, explicit } = state[selectedFileId].parentPaths[state[selectedFileId].variablePaths[path].parentPath]
      if(verified && !explicit) reqDataSlice.caseReducers.setParentAsUnverified(state, {payload: { path: state[selectedFileId].variablePaths[path].parentPath}});
    }
  }
})


export const { createNewFile,
  setMethod, setProtocol, setHeaders, setQueryParams, setUrl, setReqBody, setResBody,
  initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified, setSelectedFileIdd,
} = reqDataSlice.actions;

// selectors
export { getVerifiedParentPaths, getVerifiedVariablePaths,
  getMethod, getProtocol, getUrl, getQueryParams, getHeaders, getReqBody, getResBody };

export default reqDataSlice.reducer;
