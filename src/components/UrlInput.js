import axios from 'axios';
import { Button, Input, Select} from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setMethod, setUrl, setResBody,
  getMethod, getUrl, getHeaders } from '../store/reqDataSlice';


export default function UrlInput() {
  const dispatch = useDispatch();
  // const {setResBody, selectedFileId} = useContext(GlobalContext);
  const {Option} = Select;
  const [methodOpen, setMethodOpen] = useState(false);
  const method = useSelector(getMethod);
  const url = useSelector(getUrl);
  const headers = useSelector(getHeaders);

  const onRequestSend = async () => {
    const formattedHeaders = {};
    headers.forEach(item => (formattedHeaders[item.name] = item.value) );
    const reqOpts = {
      url,
      headers: formattedHeaders,
      method,
    };
    const res = await axios.request(reqOpts);
    dispatch(setResBody(res.data));
  }

  const updateUrl = (url) => {
    const {value} = url.target;
    dispatch(setUrl(value));
  }

  const updateMethod = (method) => {
    dispatch(setMethod(method));
    setMethodOpen(false);
  }

  return (
    <Input.Group compact style={{padding: 10}}>
        <Select 
          open={methodOpen} 
          onDropdownVisibleChange={(visible)=>setMethodOpen(visible)} 
          value={method} 
          onChange={updateMethod} 
        >
          <Option value='get'>GET</Option>
          <Option value='post'>POST</Option>
          <Option value='put'>PUT</Option>
          <Option value='patch'>PATCH</Option>
          <Option value='delete'>DELETE</Option>
          <Option value='head'>HEAD</Option>
        </Select>
        <Input value={url} onChange={updateUrl} placeholder='URL' style={{width: '60%'}} />
        <Button type='primary' onClick={onRequestSend}>Send</Button>
    </Input.Group>
  );
}
