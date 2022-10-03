// import axios from 'axios';
// import { useContext } from 'react';
// import { GlobalContext } from '../context/GlobalContext';

// const sendRequest = async () => {
//   const {appDataRef} = useContext(GlobalContext);

//   const headersToFormat = headers || defaults.headers;
//   const mapped = headersToFormat.map(item => ({ [item.name]: item.value }) );
//   const headersParam = Object.assign({}, ...mapped );
  
//   const reqOpts = {
//     url: `${protocol}${url}`,
//     headers: headersParam,
//     method,
//   };

//   const res = await axios.request(reqOpts);
//   return res;
// }

// export {
//   sendRequest
// }