import { Input, Form, Space, Button } from 'antd';
import {MinusCircleOutlined, PlusCircleTwoTone} from '@ant-design/icons';

export default function KeyValueDynamicForm({ reqFormInstance, formName }) {
  return (
  <Form form={reqFormInstance} style={{padding: 10}} name="dynamic_form_nest_item" autoComplete="off">
    <Form.List name={formName}>
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
            <Button type="dashed" onClick={() => add()} block icon={<PlusCircleTwoTone style={{fontSize:'20px'}} />}> </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  </Form>
  );
}
