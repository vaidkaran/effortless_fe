import { Input, Form, Space, Button } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import {MinusCircleOutlined, PlusCircleTwoTone} from '@ant-design/icons';
import {useRef, useContext} from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { setHeaders, getHeaders } from '../store/reqDataSlice';

export default function Headers() {
  const dispatch = useDispatch();
  const addRef = useRef();
  const {headersFormInstance, appDataRef, selectedFileId} = useContext(GlobalContext);

  const onValuesChange = (changedValues, allValues) => {
    // console.log('onValuesChange headers: ', allValues.headers)
    appDataRef.current[selectedFileId].headers = allValues.headers; 
    dispatch(setHeaders(allValues.headers));
  }

  return (
  <Form form={headersFormInstance} onValuesChange={onValuesChange} style={{padding: 10}} name="dynamic_form_nest_item" autoComplete="off">
    <Form.List name='headers'>
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
