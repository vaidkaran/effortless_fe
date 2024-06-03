import { AutoComplete, Button, Select, Space, Flex} from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setMethod, setUrl, setResBody, setResCode, resetResAndPaths,
  getMethod, getUrl, getHeaders, getReqBody, setResHeaders, getSavedTestVarsWithValues, getSavedTestVarsAutoCompleteArray, getQueryParams } from '../store/reqDataSlice';
import { getEnvVarsAutoCompleteArray, getEnvVarsString } from '../store/envDataSlice';
// import sendRequest from '../utils/sendRequest';
import {sendRequest} from 'effortless_test_utils';


export default function UrlInput() {
  const dispatch = useDispatch();
  const {Option} = Select;
  const [methodOpen, setMethodOpen] = useState(false);
  const method = useSelector(getMethod);
  const url = useSelector(getUrl);
  const headers = useSelector(getHeaders);
  const queryParams = useSelector(getQueryParams);
  const reqBody = useSelector(getReqBody);
  const envVarsList = useSelector(getEnvVarsAutoCompleteArray);
  const testVarsList = useSelector(getSavedTestVarsAutoCompleteArray);
  const savedTestVarsWithValues = useSelector(getSavedTestVarsWithValues);
  const envVarsString = useSelector(getEnvVarsString);
  const [autoCompOptions, setAutoCompOptions] = useState([]);

  const onRequestSend = async () => {
    const res = await sendRequest({ url, headers, queryParams, reqBody, method, envVarsString, savedTestVarsWithValues})

    dispatch(setResBody(res.data));
    dispatch(setResCode(res.status));
    dispatch(setResHeaders(res.headers));
  }

  const updateMethod = (method) => {
    dispatch(setMethod(method));
    setMethodOpen(false);
  }

  const onChange = (value) => {
    if(value.match(/(?<!{){{$/)) {
      setAutoCompOptions([...envVarsList, ...testVarsList]);
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
    <Flex gap='small'>
        <Select 
          open={methodOpen} 
          onDropdownVisibleChange={(visible)=>setMethodOpen(visible)} 
          value={method} 
          onChange={updateMethod} 
          style={{flex: 1}}
        >
          <Option value='get'>GET</Option>
          <Option value='post'>POST</Option>
          <Option value='put'>PUT</Option>
          <Option value='patch'>PATCH</Option>
          <Option value='delete'>DELETE</Option>
          <Option value='head'>HEAD</Option>
        </Select>
        <AutoComplete onSelect={onSelect} options={autoCompOptions} value={url} onChange={onChange} placeholder='URL' style={{flex: 15}} />
        <Button type='primary' onClick={onRequestSend} style={{flex: 1}}>Send</Button>
    </Flex>
    </>
  );
}
