import { Button, Input, Select } from 'antd';


export default function UrlInput() {
  const {Option} = Select;
  return (
    <Input.Group compact style={{padding: 10}}>
      <Select defaultValue='GET'>
        <Option>GET</Option>
        <Option>POST</Option>
        <Option>PUT</Option>
        <Option>PATCH</Option>
        <Option>DELETE</Option>
        <Option>HEAD</Option>
      </Select>
      <Select defaultValue='http://'>
        <Option>http://</Option>
        <Option>https://</Option>
      </Select>
      <Input placeholder='URL' style={{width: '60%'}} />
      <Button type='primary'>Send</Button>
    </Input.Group>
  );
}
