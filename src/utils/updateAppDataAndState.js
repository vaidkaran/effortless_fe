
export default function updateAppDataAndState({fileId, 
appDataRef, 
setUrl, defaultUrlRef, 
setReqBody, defaultReqBodyRef, 
setResBody, defaultResBodyRef,
setMethod, defaultMethodRef,
setProtocol, defaultProtocolRef, 
headersFormInstance, headersInitialValuesRef, 
queryParamsFormInstance, queryParamsInitialValuesRef}) {
  // console.log('appDataRef: ', appDataRef.current)
  const {url, reqBody, resBody, method, protocol, headers, queryParams} = appDataRef.current[fileId];

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

  // headers
  // const headersSetFieldsFn = headersFormInstance.setFieldsValue.bind(headersFormInstance);
  const headersSetFieldsFn = headersFormInstance.setFieldsValue;
  // if(headers) console.log('------------->', headers)
  headers ? set('headers', headersSetFieldsFn, {headers: headers.headers}) : set('headers', headersSetFieldsFn, {headers: headersInitialValuesRef.current});
  // headers ? headersFormInstance.setFieldsValue({headers}) : headersFormInstance.setFieldsValue({headers: headersInitialValuesRef.current});

  // queryParams
  // const queryParamsSetFieldsFn = queryParamsFormInstance.setFieldsValue.bind(queryParamsFormInstance);
  const queryParamsSetFieldsFn = queryParamsFormInstance.setFieldsValue;
  queryParams ? set('queryParams', queryParamsSetFieldsFn, {queryParams: queryParams.queryParams}) : set('queryParams', queryParamsSetFieldsFn, {queryParams: queryParamsInitialValuesRef.current});
  // queryParams ? queryParamsFormInstance.setFieldsValue({queryParams}) : queryParamsFormInstance.setFieldsValue({queryParams: queryParamsInitialValuesRef.current});

}