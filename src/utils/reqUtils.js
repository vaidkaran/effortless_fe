import axios from 'axios';

const sendRequest = async ({reqFormInstance, defaults, url}) => {
  const {protocol, headers, method} = reqFormInstance.getFieldsValue();

  const headersToFormat = headers || defaults.headers;
  const mapped = headersToFormat.map(item => ({ [item.name]: item.value }) );
  const headersParam = Object.assign({}, ...mapped );
  
  const reqOpts = {
    url: `${protocol}${url}`,
    headers: headersParam,
    method,
  };

  const res = await axios.request(reqOpts);
  return res;
}

export {
  sendRequest
}