import { Button, Input, Select, Form } from 'antd';
import { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';


export default function UrlInput({reqFormInstance, onRequestSend}) {
  const {url, setUrl, protocol, setProtocol, defaultProtocolRef, method, setMethod, defaultMethodRef, appDataRef, selectedFileId} = useContext(GlobalContext);
  const {Option} = Select;
  const [protocolOpen, setProtocolOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);

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
        <Button type='primary' onClick={()=>onRequestSend({reqFormInstance, url})}>Send</Button>
    </Input.Group>
  );
}
