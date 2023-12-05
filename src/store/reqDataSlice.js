import {createSlice} from '@reduxjs/toolkit';
import { getVerifiedParentPaths, getVerifiedVariablePaths, getSavedTestVarsWithValues, getSavedTestVars, getSavedTestVarsAutoCompleteArray, getSavedTestVarsEditorAutoSuggestArray, getSelectedReqId,
  getMethod, getUrl, getQueryParams, getHeaders, getReqBody, getResBody, getResHeaders, getResCode } from './reqDataSelectors';
import * as pathUtils from '../utils/paths';
import { getSelectedFileAndReq } from '../utils';
const pathSeparator = '.';

const defaultReqData = {
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

const getInitFileData = (opts) => {
  return {
    requests: {
      selectedReqId: 1,
      1: {
        label: 'Req1',
        ...defaultReqData,
      }
    }
  }
};

const reqDataSlice = createSlice({
  name: 'reqData',
  initialState: {},
  reducers: {
    createNewFile(state, action) {
      const fileId = action.payload;
      state[fileId] = getInitFileData()
      state['selectedFileId'] = fileId;
    },

    renameFile(state, action) {
      const {oldFileId, newFileId} = action.payload;
      const fileData = state[oldFileId];
      delete state[oldFileId];

      state[newFileId] = fileData;
      state['selectedFileId'] = newFileId;
    },

    deleteFile(state, action) {
      const fileId = action.payload;
      delete state[fileId];

      if(state.selectedFileId === fileId) {
        const files = Object.keys(state).filter(file => file !== 'selectedFileId');
        state['selectedFileId'] = files[0];
      }
    },

    /*****************************************************************************************************
     * request
     */
    createNewReq(state, action) {
      const {selectedFileId} = state;
      const key = Object.keys(state[selectedFileId].requests).length;
      const label = `Req${key}`;
      state[selectedFileId].requests[key] = { label, ...defaultReqData };
      state[selectedFileId].requests.selectedReqId = key;
    },

    setSelectedReqId(state, action) {
      const selectedReqId = action.payload;
      const {selectedFileId} = state;
      state[selectedFileId].requests.selectedReqId = selectedReqId;
    },

    deleteReq(state, action) {
      const reqId = action.payload;
      const {selectedFileId} = state;
      delete state[selectedFileId].requests[reqId];
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
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].method = method;
    },

    /*****************************************************************************************************
     * url
     */
    setUrl(state, action) {
      const url = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].url = url;
    },

    /*****************************************************************************************************
     * headers
     */
    setHeaders(state, action) {
      const headers = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].headers = headers;
    },

    /*****************************************************************************************************
     * queryParams
     */
    setQueryParams(state, action) {
      const queryParams = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].queryParams = queryParams;
    },

    /*****************************************************************************************************
     * reqBody
     */
    setReqBody(state, action) {
      const reqBody = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].reqBody = reqBody;
    },

    /*****************************************************************************************************
     * resBody
     */
    setResBody(state, action) {
      const resBody = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].resBody = resBody;
    },

    /*****************************************************************************************************
     * resCode
     */
    setResCode(state, action) {
      const resCode = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].resCode = resCode;
    },

    /*****************************************************************************************************
     * resHeaders
     */
    setResHeaders(state, action) {
      const resHeaders = action.payload;
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].resHeaders = resHeaders;
    },

    /*****************************************************************************************************
     * test
     */
    setTest(state, action) {
      const testBoolean = action.payload;
      const {selectedFileId} = getSelectedFileAndReq(state);
      state[selectedFileId].test = testBoolean;
      reqDataSlice.caseReducers.setTestname(state, {payload: selectedFileId})
    },

    setUnsetAsTest(state, action) {
      const {selectedFileId, selectedReq} = getSelectedFileAndReq(state);
      const verifiedParentPaths = pathUtils.getVerifiedParentPaths(selectedReq.parentPaths);

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
      const {selectedFileId} = getSelectedFileAndReq(state);
      state[selectedFileId].testname = testname;
    },

    /*****************************************************************************************************
     * Parent & Variable paths
     */

    initParentPaths(state, action) {
      const {path, setState} = action.payload;
      const {selectedFileId, selectedReqId, selectedReq} = getSelectedFileAndReq(state);
      if(!selectedReq.parentPaths[path]) { // path is not present already
        state[selectedFileId].requests[selectedReqId].parentPaths[path] = {verified: false, setState}
      } else { // remounting - so path already present
        state[selectedFileId].requests[selectedReqId].parentPaths[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state[selectedFileId].requests[selectedReqId].parentPaths[path].setState({verified: selectedReq.parentPaths[path].verified}); // reset the previous state
      }
    },
    setParentAsVerified(state, action) {
      const {path, explicit} = action.payload;
      const {selectedFileId, selectedReqId, selectedReq} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].parentPaths[path].verified = true;
      state[selectedFileId].requests[selectedReqId].parentPaths[path].explicit = explicit || false;
      state[selectedFileId].requests[selectedReqId].parentPaths[path].setState({ verified: true });

      Object.keys(selectedReq.parentPaths).forEach(parentPath => {
        const subParentSelected = !!path.match(new RegExp(`^${parentPath}${pathSeparator}.+`));
        if (subParentSelected && !selectedReq.parentPaths[parentPath].verified) {
          state[selectedFileId].requests[selectedReqId].parentPaths[parentPath].verified = true;
          state[selectedFileId].requests[selectedReqId].parentPaths[parentPath].explicit = false;
          state[selectedFileId].requests[selectedReqId].parentPaths[parentPath].setState({ verified: true })
        }
      })
    },
    initVariablePaths(state, action) {
      const {path, parentPath, variable, setState} = action.payload;
      const {selectedFileId, selectedReqId, selectedReq} = getSelectedFileAndReq(state);
      if(!selectedReq.variablePaths[path]) { // path is not present already
        state[selectedFileId].requests[selectedReqId].variablePaths[path] = {saved: false, verified: false, parentPath, variable, setState}
      } else { // remounting - so path already present
        state[selectedFileId].requests[selectedReqId].variablePaths[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
        state[selectedFileId].requests[selectedReqId].variablePaths[path].setState({verified: selectedReq.variablePaths[path].verified, saved: selectedReq.variablePaths[path].saved}); // reset the previous state
      }
    },
    setVariableAsVerified(state, action) {
      const {selectedFileId, selectedReqId, selectedReq} = getSelectedFileAndReq(state);
      const isParentVerified = (path) => {
        if(selectedReq.parentPaths[path] && selectedReq.parentPaths[path].verified) return true;
        return false;
      }
      const {path} = action.payload;
      state[selectedFileId].requests[selectedReqId].variablePaths[path].verified = true;
      state[selectedFileId].requests[selectedReqId].variablePaths[path].setState({ verified: true });
      if(!isParentVerified(selectedReq.variablePaths[path].parentPath)) {
        reqDataSlice.caseReducers.setParentAsVerified(state, {payload: {path: selectedReq.variablePaths[path].parentPath}});
      }
    },
    setParentAsUnverified(state, action) {
      const {path} = action.payload;
      const {selectedFileId, selectedReqId, selectedReq} = getSelectedFileAndReq(state);

      const parentPaths = selectedReq.parentPaths;
      const variablePaths = selectedReq.variablePaths;
      const canBeSetAsUnverified = pathUtils.canBeRemovedFromVerifiedParentPaths({path, parentPaths, variablePaths});
      if(!canBeSetAsUnverified) {
        console.log(`Parent: ${path} cannot be set as unverified since a child is already selected`);
        return;
      }

      state[selectedFileId].requests[selectedReqId].parentPaths[path].verified = false;
      state[selectedFileId].requests[selectedReqId].parentPaths[path].explicit = false;
      state[selectedFileId].requests[selectedReqId].parentPaths[path].setState({ verified: false })

      const parentPath = Object.keys(selectedReq.parentPaths).find(parentPath => path.match(new RegExp(`^${parentPath}${pathSeparator}[^${pathSeparator}]+$`)))
      // if parent just above is verified but not explicitly, then remove it from verified paths
      if(parentPath && selectedReq.parentPaths[parentPath].verified===true && selectedReq.parentPaths[parentPath].explicit===false) {
        reqDataSlice.caseReducers.setParentAsUnverified(state, {payload: {path: parentPath}});
      }
    },
    setVariableAsUnverified(state, action) {
      const {selectedFileId, selectedReqId, selectedReq} = getSelectedFileAndReq(state);
      const {path} = action.payload;
      state[selectedFileId].requests[selectedReqId].variablePaths[path].verified = false;
      state[selectedFileId].requests[selectedReqId].variablePaths[path].setState({ verified: false });

      // remove immediate parent from verifiedParentPaths ONLY if it's implicitly verified.
      const {verified, explicit } = selectedReq.parentPaths[selectedReq.variablePaths[path].parentPath]
      if(verified && !explicit) reqDataSlice.caseReducers.setParentAsUnverified(state, {payload: { path: selectedReq.variablePaths[path].parentPath}});
    },
    setVariableAsSaved(state, action) {
      const {selectedReq} = getSelectedFileAndReq(state);
      const {path} = action.payload;
      selectedReq.variablePaths[path].saved = true;
      selectedReq.variablePaths[path].setState({ saved: true });
    },
    setVariableAsUnsaved(state, action) {
      const {selectedReq} = getSelectedFileAndReq(state);
      const {path} = action.payload;
      selectedReq.variablePaths[path].saved = false;
      selectedReq.variablePaths[path].setState({ saved: false });
    },
    resetResAndPaths(state, action) {
      const {selectedFileId, selectedReqId} = getSelectedFileAndReq(state);
      state[selectedFileId].requests[selectedReqId].resBody = defaultReqData.resBody;
      state[selectedFileId].requests[selectedReqId].parentPaths = defaultReqData.parentPaths;
      state[selectedFileId].requests[selectedReqId].variablePaths = defaultReqData.variablePaths;
    },
    setAllAsVerified(state, action) {
      // set all parents as verified
      const {selectedFileId, selectedReq} = getSelectedFileAndReq(state);

      const {parentPaths} = selectedReq;
      Object.keys(parentPaths).forEach((path) => {
        parentPaths[path].verified = true;
        parentPaths[path].explicit = true;
        parentPaths[path].setState({verified: true})
      })

      // set all variables as verified
      const {variablePaths} = selectedReq;
      Object.keys(variablePaths).forEach((path) => {
        variablePaths[path].verified = true;
        variablePaths[path].setState({ verified: true });
      });

      // set as test if not already
      reqDataSlice.caseReducers.setTest(state, {payload: true})
      reqDataSlice.caseReducers.setTestname(state, {payload: selectedFileId})
    },
  },
})


export const { createNewFile, renameFile, deleteFile,
  createNewReq, setSelectedReqId,
  setMethod, setHeaders, setQueryParams, setUrl, setReqBody, setResBody, setResCode, setResHeaders,
  initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified, setVariableAsSaved, setVariableAsUnsaved,
  setSelectedFileId,
  setAllAsVerified,
  resetResAndPaths,
  setTest, setTestname, setUnsetAsTest,
} = reqDataSlice.actions;

// selectors
export { getVerifiedParentPaths, getVerifiedVariablePaths, getSavedTestVarsWithValues, getSavedTestVars, getSavedTestVarsAutoCompleteArray, getSavedTestVarsEditorAutoSuggestArray, getSelectedReqId,
  getMethod, getUrl, getQueryParams, getHeaders, getReqBody, getResBody, getResHeaders, getResCode };

export default reqDataSlice.reducer;
