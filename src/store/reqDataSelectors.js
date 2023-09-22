import {createSelector} from '@reduxjs/toolkit';
import { omit } from 'lodash';
import { getSelectedFileAndReq } from '../utils';

const getVerifiedParentPaths = createSelector(
  [
    (state) => {
      const testData = state.reqData[state.reqData.selectedFileId];
      const { selectedReqId } = testData.requests;
      return testData[selectedReqId].parentPaths;
    }
  ],
  (parentPaths) => Object.keys(parentPaths).filter((path) => parentPaths[path].verified)
);

const getVerifiedVariablePaths = createSelector(
  [
    (state) => {
      const testData = state.reqData[state.reqData.selectedFileId];
      const { selectedReqId } = testData.requests;
      return testData[selectedReqId].variablePaths;
    }
  ],
  (variablePaths) => Object.keys(variablePaths).filter((path) => variablePaths[path].verified)
);

const getSavedTestVars = createSelector(
  [
    (state) => {
      const { requests } = state.reqData[state.reqData.selectedFileId];
      return omit(requests, ['selectedReqId'])
    }
  ],
  (requests) => {
    const data = [];
    for (const [reqId, reqData] of Object.entries(requests)) {
      const {variablePaths, label} = reqData;
      const savedTestVars = Object.keys(variablePaths).filter((path) => variablePaths[path].saved)
      data.push({reqId, label, savedTestVars})
    }
    return data;
  }
);

const getSavedTestVarsAutoCompleteArray = createSelector(
  [
    getSavedTestVars,
  ],
  (testVarsData) => {
    const arr = [];
    testVarsData.forEach(({reqId, label, savedTestVars}) => {
      savedTestVars.forEach((testVar) => {
        arr.push({
          label: <>
            <span style={{color: 'blue'}}> {`{{${label}.${testVar}}}`} </span> &nbsp;
          </>,
          value: testVar
        })
      });
    })
    return arr;
  }
);

const getSelectedReqId = createSelector(
  [
    (state) => {
      const { selectedFileId } = state.reqData;
      return state.reqData[selectedFileId].requests;
    }
  ],
  (requests) => requests.selectedReqId
);

const getResHeaders = createSelector(
  [
    (state) => {
      const {selectedReq} = getSelectedFileAndReq(state.reqData);
      return selectedReq;
    }
  ],
  (reqData) => {
    let counter = 0;
    const headers = reqData.resHeaders;
    if(!headers) return;
    return Object.keys(headers).map((name) => {
      counter += 1;
      return { key: counter, header: name, value: headers[name]};
    })
  }
);

// not to be exported
const getCreateSelectorFor = (reqDataField) => {
  return createSelector(
  [
    (state) => {
      const {selectedReq} = getSelectedFileAndReq(state.reqData);
      return selectedReq;
    }
  ],
  (reqData) => reqData[reqDataField]
  )
};

const getMethod = getCreateSelectorFor('method');
const getUrl = getCreateSelectorFor('url');
const getQueryParams = getCreateSelectorFor('queryParams');
const getHeaders = getCreateSelectorFor('headers');
const getReqBody = getCreateSelectorFor('reqBody');
const getResBody = getCreateSelectorFor('resBody');
const getResCode = getCreateSelectorFor('resCode');
const getTestBool = getCreateSelectorFor('test');


export {
  getVerifiedParentPaths, getVerifiedVariablePaths, getSavedTestVars, getSavedTestVarsAutoCompleteArray,
  getSelectedReqId,
  getMethod, getUrl, getQueryParams, getHeaders, getReqBody, getResBody, getResHeaders, getResCode, getTestBool
}
