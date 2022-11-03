import axios from 'axios';
import { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { expect } from 'chai';
import _ from 'lodash';

const pathSeparator = ',,';

const getValue = (res, path) => {
  let data = res.data;
  const items = path.split(pathSeparator).slice(1); // remove root

  for(let i=0; i<items.length; i+=1) {
    data = data[items[i]];
  }
  return data;
}

const verifyPathsPresence = (res, pathsToVerify, testResults) => {
  pathsToVerify = _.sortBy(pathsToVerify, [(path) => path.split(pathSeparator).length])
  for(let i=0; i<pathsToVerify.length; i+=1) {
    const testResult = {verificationType: 'existence'};
    try {
      testResult.path = pathsToVerify[i];
      expect(getValue(res, pathsToVerify[i])).to.not.equal(undefined); // assert for presence (null values allowed)
      testResult.passed = true;
    } catch(err) {
      testResult.passed = false;
      const {actual, expected, message, operator} = err;
      testResult.errorDetails = {actual, expected, message, operator};
    }
    testResults.push(testResult);
  }
}

const verifyValues = (res, verifiedVariables, testResults) => {
  Object.keys(verifiedVariables).forEach((variablePath) => {
    const testResult = {verificationType: 'value'};
    try {
      testResult.path = variablePath;
      expect(getValue(res, variablePath)).to.equal(verifiedVariables[variablePath].value);
      testResult.passed = true;
    } catch(err) {
      testResult.passed = false;
      const {actual, expected, message, operator} = err;
      testResult.errorDetails = {actual, expected, message, operator};
    }
    testResults.push(testResult);
  })
}

export default async function playTest(appData) {
  if(!appData.test) {
    console.log(':::::WARNING::::: this not marked as a test');
    return;
  }
  const {url, protocol, reqBody, method, headers: {headers}, queryParams: {queryParams}, parentPaths, variablePaths} = appData;
  const testResults = [];

  const formattedHeaders = {};
  headers.forEach(item => (formattedHeaders[item.name] = item.value) );
  
  const reqOpts = {
    url: `${protocol}${url}`,
    headers: formattedHeaders,
    method,
  };

  const res = await axios.request(reqOpts);
  // TODO: Also need to verify type of parent and variable
  const verifiedParentPaths = Object.keys(parentPaths).filter((path) => parentPaths[path].verified);
  const verifiedVariables = {};
  Object.keys(variablePaths).forEach((path) => {
    if(variablePaths[path].verified) {
      verifiedVariables[path] = {value: variablePaths[path].variable.value};
    }
  })
  const verifiedVariablePaths = Object.keys(verifiedVariables);

  verifyPathsPresence(res, verifiedParentPaths, testResults);
  verifyPathsPresence(res, verifiedVariablePaths, testResults)
  // TODO: if the presence of a path is false, then all it's children will be false too (no need to check)
  verifyValues(res, verifiedVariables, testResults)
  console.log(testResults)
  return testResults;

  // console.log('verifiedVariablePaths ', verifiedVariablePaths)
  // console.log('variablePaths ', variablePaths)
  // setIsTestExecutionModalOpen(true);
}
