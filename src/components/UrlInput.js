import axios from 'axios';
import { AutoComplete, Menu, Dropdown, Button, Input, Select, Space} from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setMethod, setUrl, setResBody, setResCode, resetResAndPaths,
  getMethod, getUrl, getHeaders, getReqBody, setResHeaders } from '../store/reqDataSlice';
import { proxyUrl } from '../proxyConfig';
// import { Menu, Item, useContextMenu} from 'react-contexify';
const contextMenuId = 'envVarMenu';


export default function UrlInput() {
  // const { show } = useContextMenu({id: contextMenuId});
  const dispatch = useDispatch();
  const {Option} = Select;
  const [methodOpen, setMethodOpen] = useState(false);
  const method = useSelector(getMethod);
  const url = useSelector(getUrl);
  const headers = useSelector(getHeaders);
  const reqBody = useSelector(getReqBody);
  const [autoCompOptions, setAutoCompOptions] = useState([]);

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

  // const updateUrl = (event) => {
  //   const {value} = event.target;
  //   if(value.match(/(?<!{){{$/)) {
  //   }
  //   dispatch(setUrl(value));
  //   dispatch(resetResAndPaths());
  // }

  const updateMethod = (method) => {
    dispatch(setMethod(method));
    setMethodOpen(false);
  }

  const envVars = [
    {
      label: <>
        <span style={{color: 'blue'}}> {'{{x}}'} </span> &nbsp;
        <span style={{fontStyle: 'italic'}}> https://jsonplaceholder.typicode.com </span>
      </>,
      value: 'x'
    },
    {
      value: 'y'
    },
    {
      label: <p style={{color: 'blue', fontStyle: 'italic', fontWeight: 'bold'}}>hello</p>,
      value: 'z'
    }
  ]

  const onChange = (value) => {
    if(value.match(/(?<!{){{$/)) {
      setAutoCompOptions(envVars);
    } else {
      setAutoCompOptions([]);
    }
    dispatch(setUrl(value));
    dispatch(resetResAndPaths());
  }

  const onSelect = (data) => {
    const editedUrl = url.replace(/{{$/, '');
    const newUrl = `${editedUrl}{{${data}}}`
    dispatch(setUrl(newUrl));
  }


  return (
    <>
    {/* <div className='scrollable'>
      <Menu id={contextMenuId}>
        <Item id="rename" onClick={()=>{console.log('yeeeeeeeeeeeeeeeee')}}>Rename</Item>
        <Item id="delete">Delete</Item>
      </Menu>
    </div> */}

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
      {/* <Dropdown menu={menuItems}> */}
        <AutoComplete onSelect={onSelect} options={autoCompOptions} value={url} onChange={onChange} placeholder='URL' style={{width: 500}} />
      {/* </Dropdown> */}
        <Button type='primary' onClick={onRequestSend}>Send</Button>
    </Space>
    </>
  );
}
