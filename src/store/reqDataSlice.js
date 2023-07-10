import {createSlice} from '@reduxjs/toolkit';
import { getVerifiedParentPaths, getVerifiedVariablePaths, 
  getMethod, getUrl, getQueryParams, getHeaders, getReqBody, getResBody, getResCode } from './reqDataSelectors';
import * as pathUtils from '../utils/paths';
const pathSeparator = '.';

const getInitFileData = (opts) => {
  return {
    test:false,
    testname: '',
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/users/1',
    headers: [{name: 'Content-Type', value: 'application/json'}],
    queryParams: [],
    reqBody: '',
    resBody: null,
    resCode: null,
    resHeaders: [],
    parentPaths: {},
    variablePaths: {},
  }
};

const initialState = {
  selectedFileId: 'default',
  default: {
    test:false,
    testname: '',
    method: '',
    url: '',
    headers: [],
    queryParams: [],
    reqBody: '',
    resBody: null,
    resCode: null,
    resHeaders: [],
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
    setSelectedFileId(state, action) {
      const selectedFileId = action.payload;
      state.selectedFileId = selectedFileId;
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
     * resCode
     */
    setResCode(state, action) {
      const resCode = action.payload;
      state[state.selectedFileId].resCode = resCode;
    },

    /*****************************************************************************************************
     * resHeaders
     */
    setResHeaders(state, action) {
      const resHeaders = action.payload;
      state[state.selectedFileId].resHeaders = resHeaders;
    },


    /*****************************************************************************************************
     * test
     */
    setTest(state, action) {
      const testBoolean = action.payload;
      state[state.selectedFileId].test = testBoolean;
    },

    setUnsetAsTest(state, action) {
      const {selectedFileId} = state;
      const verifiedParentPaths = pathUtils.getVerifiedParentPaths(state[selectedFileId].parentPaths);

      if(verifiedParentPaths.includes('root')) {
        reqDataSlice.caseReducers.setTest(state, {payload: true})
        reqDataSlice.caseReducers.setTestname(state, {payload: selectedFileId})
      } else {
        reqDataSlice.caseReducers.setTest(state, {payload: false})
        reqDataSlice.caseReducers.setTestname(state, {payload: ''})
      }
    },

    /*****************************************************************************************************
     * testname
     */
    setTestname(state, action) {
      const testname = action.payload;
      state[state.selectedFileId].testname = testname;
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
      const {path} = action.payload;
      const {selectedFileId} = state;

      const parentPaths = state[selectedFileId].parentPaths;
      const variablePaths = state[selectedFileId].variablePaths;
      const canBeSetAsUnverified = pathUtils.canBeRemovedFromVerifiedParentPaths({path, parentPaths, variablePaths});
      if(!canBeSetAsUnverified) {
        console.log(`Parent: ${path} cannot be set as unverified since a child is already selected`);
        return;
      }

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
    },
    resetResAndPaths(state, action) {
      state[state.selectedFileId].resBody = initialState.default.resBody;
      state[state.selectedFileId].parentPaths = initialState.default.parentPaths;
      state[state.selectedFileId].variablePaths = initialState.default.variablePaths;
    }
  },
  // extraReducers: {
  //   'reqData/'
  // }
})


export const { createNewFile,
  setMethod, setHeaders, setQueryParams, setUrl, setReqBody, setResBody, setResCode, setResHeaders,
  initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified, setSelectedFileId,
  resetResAndPaths,
  setTest, setTestname, setUnsetAsTest,
} = reqDataSlice.actions;

// selectors
export { getVerifiedParentPaths, getVerifiedVariablePaths,
  getMethod, getUrl, getQueryParams, getHeaders, getReqBody, getResBody, getResCode };

export default reqDataSlice.reducer;
