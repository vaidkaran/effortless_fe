import axios from 'axios';
import { Button, Input, Select, Form } from 'antd';
import { useEffect, useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useDispatch } from "react-redux";


export default function UrlInput() {
  const dispatch = useDispatch();
  const {url, setUrl, setResBody, protocol, setProtocol, defaultProtocolRef, method, setMethod, defaultMethodRef, appDataRef, selectedFileId} = useContext(GlobalContext);
  const {Option} = Select;
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

  // useEffect(() => console.log('urlInput rendered'))

  const onRequestSend = async () => {
    const {headers: {headers}, url, method, protocol} = appDataRef.current[selectedFileId];
    const formattedHeaders = {};
    headers.forEach(item => (formattedHeaders[item.name] = item.value) );
    // console.log('formattedheaders: ', formattedHeaders)
    const reqOpts = {
      url: `${protocol}${url}`,
      headers: formattedHeaders,
      method,
    };
    const res = await axios.request(reqOpts);
    setResBody(res.data);
    appDataRef.current[selectedFileId].resBody = res.data; // always update the appData
  }

  const updateUrl = (url) => {
    const {value} = url.target;
    setUrl(value);
    appDataRef.current[selectedFileId].url = value; // always update the appData
  }

  const updateMethod = (method) => {
    setMethod(method);
    setMethodOpen(false);
    appDataRef.current[selectedFileId].method = method; // always update the appData
  }

  const updateProtocol = (protocol) => {
    setProtocol(protocol);
    setProtocolOpen(false);
    appDataRef.current[selectedFileId].protocol = protocol; // always update the appData
  }

  return (
    <Input.Group compact style={{padding: 10}}>
        <Select 
          open={methodOpen} 
          onDropdownVisibleChange={(visible)=>setMethodOpen(visible)} 
          value={method} 
          onChange={updateMethod} 
          defaultValue={defaultMethodRef.current}
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
          defaultValue={defaultProtocolRef.current}
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
