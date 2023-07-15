import axios from 'axios';
import { Button, Input, Select, Space} from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setMethod, setUrl, setResBody, setResCode, resetResAndPaths,
  getMethod, getUrl, getHeaders, getReqBody, setResHeaders } from '../store/reqDataSlice';
import { proxyUrl } from '../proxyConfig';


export default function UrlInput() {
  const dispatch = useDispatch();
  const {Option} = Select;
  const [methodOpen, setMethodOpen] = useState(false);
  const method = useSelector(getMethod);
  const url = useSelector(getUrl);
  const headers = useSelector(getHeaders);
  const reqBody = useSelector(getReqBody);

  const onRequestSend = async () => {
    const formattedHeaders = {};
    headers.forEach(item => (formattedHeaders[item.name] = item.value) );
    const reqOpts = {
      url: proxyUrl,
      headers: {...formattedHeaders, target: url},
      method,
      data: reqBody,
      validateStatus: (status) => true,
    };
    const res = await axios.request(reqOpts);
    dispatch(setResBody(res.data));
    dispatch(setResCode(res.status));
    dispatch(setResHeaders(res.headers));
  }

  const updateUrl = (url) => {
    const {value} = url.target;
    dispatch(setUrl(value));
    dispatch(resetResAndPaths());
  }

  const updateMethod = (method) => {
    dispatch(setMethod(method));
    setMethodOpen(false);
  }

  return (
    <Space direction='horizontal' style={{padding: 10}}>
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
        <Input value={url} onChange={updateUrl} placeholder='URL' style={{width: 500}} />
        <Button type='primary' onClick={onRequestSend}>Send</Button>
    </Space>
  );
}
