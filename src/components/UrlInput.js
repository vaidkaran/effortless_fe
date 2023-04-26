import axios from 'axios';
import { Button, Input, Select, Form } from 'antd';
import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useDispatch, useSelector } from "react-redux";
import { setMethod, setProtocol, setUrl, setQueryParams, setHeaders,
  getMethod, getProtocol, getUrl, getQueryParams, getHeaders } from '../store/reqDataSlice';


export default function UrlInput() {
  const dispatch = useDispatch();
  const {setResBody, appDataRef, selectedFileId} = useContext(GlobalContext);
  const {Option} = Select;
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const method = useSelector(getMethod);
  const protocol = useSelector(getProtocol);
  const url = useSelector(getUrl);
  const headers = useSelector(getHeaders);
  const queryParams = useSelector(getQueryParams);

  // useEffect(() => console.log('urlInput rendered'))

  const onRequestSend = async () => {
    const {headers: headersArr} = headers;
    const formattedHeaders = {};
    headersArr.forEach(item => (formattedHeaders[item.name] = item.value) );
    // console.log('formattedheaders: ', formattedHeaders)
    const reqOpts = {
      url: `${protocol}${url}`,
      headers: formattedHeaders,
      method,
    };
    const res = await axios.request(reqOpts);
    dispatch(setResBody(res.data));
    // setResBody(res.data);
    // appDataRef.current[selectedFileId].resBody = res.data; // always update the appData
  }

  const updateUrl = (url) => {
    const {value} = url.target;
    dispatch(setUrl(value));
    // setUrl(value);
    // appDataRef.current[selectedFileId].url = value; // always update the appData
  }

  const updateMethod = (method) => {
    dispatch(setMethod(method));
    setMethodOpen(false);
    // appDataRef.current[selectedFileId].method = method; // always update the appData
  }

  const updateProtocol = (protocol) => {
    dispatch(setProtocol(protocol));
    setProtocolOpen(false);
    // appDataRef.current[selectedFileId].protocol = protocol; // always update the appData
  }

  return (
    <Input.Group compact style={{padding: 10}}>
        <Select 
          open={methodOpen} 
          onDropdownVisibleChange={(visible)=>setMethodOpen(visible)} 
          value={method} 
          onChange={updateMethod} 
          // defaultValue={method} 
          // defaultValue={defaultMethodRef.current}
          // defaultValue='get'
        >
          <Option value='get'>GET</Option>
          <Option value='post'>POST</Option>
          <Option value='put'>PUT</Option>
          <Option value='patch'>PATCH</Option>
          <Option value='delete'>DELETE</Option>
          <Option value='head'>HEAD</Option>
        </Select>
        <Select
          open={protocolOpen} 
          onDropdownVisibleChange={(visible)=>setProtocolOpen(visible)} 
          value={protocol} 
          onSelect={updateProtocol} 
          // defaultValue={defaultProtocolRef.current}
          // defaultValue='http://'
        >
          <Option value='http://'>http://</Option>
          <Option value='https://'>https://</Option>
        </Select>
        <Input value={url} onChange={updateUrl} placeholder='URL' style={{width: '60%'}} />
        <Button type='primary' onClick={()=>onRequestSend(selectedFileId)}>Send</Button>
    </Input.Group>
  );
}
