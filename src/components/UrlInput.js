import { Button, Input, Select, Form } from 'antd';


export default function UrlInput({reqFormInstance}) {
  const {Option} = Select;
  const onSend = () => {
    console.log('onSend clicked')
    const result = reqFormInstance.getFieldsValue();
    console.log('result -> ', result);
  }

  return (
    <Form form={reqFormInstance} initialValues={{method: 'GET', protocol: 'http://'}} autoComplete="off">
      <Input.Group compact style={{padding: 10}}>
        <Form.Item name='method'>
          <Select>
            <Option key='get'>GET</Option>
            <Option key='post'>POST</Option>
            <Option key='put'>PUT</Option>
            <Option key='patch'>PATCH</Option>
            <Option key='delete'>DELETE</Option>
            <Option key='head'>HEAD</Option>
          </Select>
        </Form.Item>
        <Form.Item name='protocol'>
          <Select>
            <Option key='http'>http://</Option>
            <Option key='https'>https://</Option>
          </Select>
        </Form.Item>
          <Input placeholder='URL' style={{width: '60%'}} />
          <Button type='primary' onClick={onSend}>Send</Button>
      </Input.Group>
    </Form>
  );
}
