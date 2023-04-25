import {createSelector} from '@reduxjs/toolkit';

const getVerifiedParentPaths = createSelector(
  [
    (state) => state[state.selectedFileId].parentPaths,
  ],
  (parentPaths) => Object.keys(parentPaths).filter((path) => parentPaths[path].verified)
);

const getVerifiedVariablePaths = createSelector(
  [
    (state) => state.reqData[state.reqData.selectedFileId].variablePaths,
  ],
  (variablePaths) => Object.keys(variablePaths).filter((path) => variablePaths[path].verified)
);

// not to be exported
const getCreateSelectorFor = (reqDataField) => {
  return createSelector(
  [
    (state) => state.reqData[state.reqData.selectedFileId],
  ],
  (reqData) => reqData[reqDataField]
  )
};

const getMethod = getCreateSelectorFor('method');
const getProtocol = getCreateSelectorFor('protocol');
const getUrl = getCreateSelectorFor('url');
const getQueryParams = getCreateSelectorFor('queryParams');
const getHeaders = getCreateSelectorFor('headers');
const getReqBody = getCreateSelectorFor('reqBody');
const getResBody = getCreateSelectorFor('resBody');


export {
  getVerifiedParentPaths, getVerifiedVariablePaths,
  getMethod, getProtocol, getUrl, getQueryParams, getHeaders, getReqBody, getResBody
}
