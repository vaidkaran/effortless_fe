import { Button, Input, Select, Form } from 'antd';
import { useState } from 'react';


export default function UrlInput({reqFormInstance, onRequestSend}) {
  const [url, setUrl] = useState('');

  const {Option} = Select;

  return (
    <Form form={reqFormInstance} initialValues={{method: 'GET', protocol: 'http://'}} autoComplete="off">
      <Input.Group compact style={{padding: 10}}>
        <Form.Item name='method'>
          <Select>
            <Option value='get'>GET</Option>
            <Option value='post'>POST</Option>
            <Option value='put'>PUT</Option>
            <Option value='patch'>PATCH</Option>
            <Option value='delete'>DELETE</Option>
            <Option value='head'>HEAD</Option>
          </Select>
        </Form.Item>
        <Form.Item name='protocol'>
          <Select>
            <Option value='http://'>http://</Option>
            <Option value='https://'>https://</Option>
          </Select>
        </Form.Item>
          <Input value={url} onChange={(url) => setUrl(url.target.value)} placeholder='URL' style={{width: '60%'}} />
          <Button type='primary' onClick={()=>onRequestSend({reqFormInstance, url})}>Send</Button>
      </Input.Group>
    </Form>
  );
}
