import { Input, Form, Space, Button } from 'antd';
import {MinusCircleOutlined, PlusCircleTwoTone} from '@ant-design/icons';

export default function Headers({ reqForm }) {

  return (
  <Form form={reqForm} style={{padding: 10}} name="dynamic_form_nest_item" autoComplete="off">
    <Form.List name="headers">
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => (
            <Space
              className='d-flex justify-content-center'
              key={key}
              style={{
                display: 'flex',
                marginBottom: 2,
              }}
              align="baseline"
            >
              <Form.Item
                {...restField}
                name={[name, 'name']}
                rules={[
                  {
                    required: true,
                    message: 'Missing first name',
                  },
                ]}
              >
                <Input placeholder="Header" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'value']}
                rules={[
                  {
                    required: true,
                    message: 'Missing last name',
                  },
                ]}
              >
                <Input placeholder="Value" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusCircleTwoTone />}> </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  </Form>
  );
}
