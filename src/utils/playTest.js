import axios from 'axios';
import { expect } from 'chai';
import _ from 'lodash';
import {getVerifiedParentPaths, getVerifiedVariablePathsWithValues} from './paths';
import store from '../store/store';
import { flatten } from 'flat';
import { getFileItem } from '../utils';

import { sendRequest, assertValueInRes, assertPathPresenceInRes, sortPaths } from 'effortless_test_utils';
// const pathSeparator = '.';

// const getValue = (resBody, path) => {
//   let data = _.cloneDeep(resBody);
//   const items = path.split(pathSeparator).slice(1); // remove root

//   for(let i=0; i<items.length; i+=1) {
//     data = data[items[i]];
//   }
//   return data;
// }

const verifyPathsPresence = (resBody, pathsToVerify, testResults) => {
  let testPassed = true;
  // pathsToVerify = _.sortBy(pathsToVerify, [(path) => path.split(pathSeparator).length])
  pathsToVerify = sortPaths(pathsToVerify);
  for(let i=0; i<pathsToVerify.length; i+=1) {
    const testResult = {verificationType: 'existence'};
    try {
      testResult.path = pathsToVerify[i];
      // expect(getValue(resBody, pathsToVerify[i])).to.not.equal(undefined); // assert for presence (null values allowed)
      assertPathPresenceInRes(resBody, pathsToVerify[i]); // throws if fails
      testResult.passed = true;
    } catch(err) {
      testPassed = false;
      testResult.passed = false;
      const {actual, expected, message, operator} = err;
      testResult.errorDetails = {actual, expected, message, operator};
    }
    testResults.push(testResult);
  }
  return testPassed;
}

const verifyValues = (resBody, verifiedVariables, testResults) => {
  let testPassed = true;
  Object.keys(verifiedVariables).forEach((variablePath) => {
    const testResult = {verificationType: 'value'};
    try {
      testResult.path = variablePath;
      // expect(getValue(resBody, variablePath)).to.equal(verifiedVariables[variablePath].value);
      assertValueInRes(resBody, variablePath, verifiedVariables[variablePath].value); // throws if fails
      testResult.passed = true;
    } catch(err) {
      testPassed = false;
      testResult.passed = false;
      const {actual, expected, message, operator} = err;
      testResult.errorDetails = {actual, expected, message, operator};
    }
    testResults.push(testResult);
  })
  return testPassed;
}

export default async function playTest(testFileId) {
  const state = store.getState();
  const { envVarsString } = state.envData;
  const { reqData, fileExplorerData } = state;
  const fileData = getFileItem(fileExplorerData, testFileId)
  if (!fileData) return; // return if a directory is found
  const testname = fileData.title
  const testdata = reqData[testFileId];
  const isTest = testdata.test;
  // const testname = _.find(fileExplorerData, {key: testFileId, isLeaf: true}).title;
  const testExecutionData = {};
  testExecutionData.savedTestVarsWithValues = {};

  if(!isTest) {
    alert(`Can't run ${testFileId}. Not marked as test`);
    return;
  }
  console.log('td.req ', testdata.requests)

  for(const [reqId, reqData] of Object.entries(testdata.requests)) {
    const testResults = [];
    if (reqId === 'selectedReqId') continue;
    const {label, url, method, reqBody, headers, queryParams, parentPaths, variablePaths} = reqData;

    const savedTestVars = Object.keys(variablePaths)
      .filter((path) => variablePaths[path].saved)

    // TODO: if there are no saved vars and no verified parent, then we can skip the iteration
    // if (!isTest && savedTestVars.length === 0) return;

    const res = await sendRequest({ url, headers, queryParams, reqBody, method, envVarsString, savedTestVarsWithValues: testExecutionData.savedTestVarsWithValues})
    const flattenedResBody = flatten({ root: res.data })
    const savedTestVarsWithValues = {};
    for(const testVarPath of savedTestVars) {
      if (flattenedResBody[testVarPath]) {
        // TODO: this testvarpath should contain reqId.
        savedTestVarsWithValues[`${label}.${testVarPath}`] = flattenedResBody[testVarPath];
      } else {
        console.log(`${testVarPath} not found in the resBody of ${reqId}. ResBody: `, res.data);
        // TODO: we should fail the test here since the saved test var wasn't found in the response
      }
    }

    _.merge(testExecutionData.savedTestVarsWithValues, savedTestVarsWithValues);

    // TODO: Also need to verify type of parent and variable
    // const verifiedParentPaths = Object.keys(parentPaths).filter((path) => parentPaths[path].verified);
    const verifiedParentPaths = getVerifiedParentPaths(parentPaths);
    const verifiedVariables = getVerifiedVariablePathsWithValues(variablePaths);
    const verifiedVariablePaths = Object.keys(verifiedVariables);

    const status1 = verifyPathsPresence(res.data, verifiedParentPaths, testResults);
    const status2 = verifyPathsPresence(res.data, verifiedVariablePaths, testResults)
    // TODO: if the presence of a path is false, then all it's children will be false too (no need to check)
    const status3 = verifyValues(res.data, verifiedVariables, testResults)
    const testStatus = status1 && status2 && status3;

    testExecutionData[reqId] = { testResults, url, headers, reqBody, res, flattenedResBody, method, envVarsString, savedTestVars, testStatus}
  }
  // TODO: cosider returning testStatus as well
  return { testname, testExecutionData };
}
