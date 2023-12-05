import axios from 'axios';
import { proxyUrl } from '../proxyConfig';
import { getResolvedString } from './index';
import { flatten } from 'flat';

export default async function sendRequest({ url, headers, reqBody, method, envVarsString, savedTestVarsWithValues}) {
  const envVarsJson = JSON.parse(envVarsString)
  const envJsonFlattened = flatten(envVarsJson)
  const formattedHeaders = {};
  headers.forEach(item => (formattedHeaders[item.name] = item.value) );
  const resolvedReqBodyString = reqBody.trim() !== "" ?
    getResolvedString(JSON.stringify(reqBody), { envJsonFlattened, savedTestVarsWithValues }) :
    reqBody;
  let resolvedReqBodyJson;
  if(resolvedReqBodyString) resolvedReqBodyJson = JSON.parse(resolvedReqBodyString);
  const reqOpts = {
    url: proxyUrl,
    headers: {...formattedHeaders, target: getResolvedString(url, { envJsonFlattened, savedTestVarsWithValues })},
    method,
    data: resolvedReqBodyJson,
    validateStatus: (status) => true,
  };
  console.log('reqOpts', reqOpts)
  const res = await axios.request(reqOpts);
  return res;
}
