import {useContext} from 'react';
import { GlobalContext } from '../context/GlobalContext';
import {CloseCircleFilled, CheckCircleFilled} from '@ant-design/icons';
import { List } from 'antd';



export default function TestExecutionViewer({testResultsToDisplay}) {
  const data = testResultsToDisplay.map((result) => {
    const {verificationType, passed, path, errorDetails} = result;
    return {
      title: `${verificationType}: ${passed ? 'Passed' : 'Failed'} for ${path}`,
      avatar: passed ? <CheckCircleFilled style={{color: 'green'}}/> : <CloseCircleFilled style={{color: 'red'}}/>
    }
  })

  return (
    <div style={{height: '500px', overflowY: 'auto'}}>
      <List
        itemLayout='horizontal'
        dataSource={data}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={item.title}
              avatar={item.avatar}
            />
          </List.Item>
        )}
      />
    </div>
  );
};
