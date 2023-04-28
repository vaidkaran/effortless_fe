import { Input, Form, Space, Button } from 'antd';
import {MinusCircleOutlined, PlusCircleTwoTone} from '@ant-design/icons';
import {useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setQueryParams, getQueryParams } from '../store/reqDataSlice';

export default function QueryParams() {
  const dispatch = useDispatch();
  const addRef = useRef();
  const queryParams = useSelector(getQueryParams)
  const [queryParamsFormInstance] = Form.useForm();

  queryParamsFormInstance.setFieldsValue({queryParams: queryParams})

  const onValuesChange = (changedValues, allValues) => {
    dispatch(setQueryParams(allValues.queryParams));
  }

  return (
  <Form form={queryParamsFormInstance} onValuesChange={onValuesChange} style={{padding: 10}} name="dynamic_form_nest_item" autoComplete="off">
    <Form.List name='queryParams'>
      {(fields, { add, remove }) => {
        addRef.current = add;
        return <>
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
      }}
    </Form.List>
  </Form>
  );
}
