import axios from 'axios';
import { getResolvedString } from './index';
import { flatten } from 'flat';

export default async function sendRequest({ url, headers, queryParams, reqBody, method, envVarsString, savedTestVarsWithValues}) {
  const envVarsJson = JSON.parse(envVarsString)
  const envJsonFlattened = flatten(envVarsJson)
  const qParamsOb = {};
  queryParams.forEach(i => qParamsOb[i.name] = i.value);
  const formattedHeaders = {};
  headers.forEach(item => (formattedHeaders[item.name] = item.value) );
  const resolvedReqBodyString = reqBody.trim() !== "" ?
    getResolvedString(JSON.stringify(reqBody), { envJsonFlattened, savedTestVarsWithValues }) :
    reqBody;
  let resolvedReqBodyJson;
  if(resolvedReqBodyString) resolvedReqBodyJson = JSON.parse(resolvedReqBodyString);
  const reqOpts = {
    url: getResolvedString(url, { envJsonFlattened, savedTestVarsWithValues }),
    headers: formattedHeaders,
    method,
    data: resolvedReqBodyJson,
    params: qParamsOb,
    validateStatus: (status) => true,
  };
  console.log('reqOpts', reqOpts)
  const res = await axios.request(reqOpts);
  return res;
}
