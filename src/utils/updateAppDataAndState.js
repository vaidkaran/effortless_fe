
export default function updateAppDataAndState({fileId, 
appDataRef, 
setUrl, defaultUrlRef, 
setReqBody, defaultReqBodyRef, 
setResBody, defaultResBodyRef,
setMethod, defaultMethodRef,
setProtocol, defaultProtocolRef, 
headersFormInstance, headersInitialValuesRef, 
queryParamsFormInstance, queryParamsInitialValuesRef,
parentPathsRef, variablePathsRef}) {
  const {url, reqBody, resBody, method, protocol, headers, queryParams, parentPaths, variablePaths} = appDataRef.current[fileId];

  const set = (propertyName, setStateFn, valueToSet) => {
    setStateFn(valueToSet);
    appDataRef.current[fileId][propertyName] = valueToSet;
  }

  // url
  url ? set('url', setUrl, url) : set('url', setUrl, defaultUrlRef.current);

  // request
  reqBody ? set('reqBody', setReqBody, reqBody) : set('reqBody', setReqBody, defaultReqBodyRef.current);

  // response
  resBody ? set('resBody', setResBody, resBody) : set('resBody', setResBody, defaultResBodyRef.current);

  // method
  method ? set('method', setMethod, method) : set('method', setMethod, defaultMethodRef.current);

  // protocol
  protocol ? set('protocol', setProtocol, protocol) : set('protocol', setProtocol, defaultProtocolRef.current);

  // parentPaths
  parentPathsRef.current = parentPaths ? parentPaths : {};

  // variablePaths
  variablePathsRef.current = variablePaths ? variablePaths : {};

  // headers
  const headersSetFieldsFn = headersFormInstance.setFieldsValue;
  headers ? set('headers', headersSetFieldsFn, {headers: headers.headers}) : set('headers', headersSetFieldsFn, {headers: headersInitialValuesRef.current});

  // queryParams
  const queryParamsSetFieldsFn = queryParamsFormInstance.setFieldsValue;
  queryParams ? set('queryParams', queryParamsSetFieldsFn, {queryParams: queryParams.queryParams}) : set('queryParams', queryParamsSetFieldsFn, {queryParams: queryParamsInitialValuesRef.current});

}