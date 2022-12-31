import {CloseCircleFilled, CheckCircleFilled} from '@ant-design/icons';
import { List } from 'antd';
import { Collapse } from 'antd';
const {Panel} = Collapse;



// export default function TestExecutionViewer({testname, results}) {
export default function TestExecutionViewer({executionResults}) {
  let counter=0;
  const formattedExecutionResults = {};
  for(const {testname, testResults} of executionResults) {
    formattedExecutionResults[testname] = testResults.map((singleVerificationResult) => {
      const {verificationType, passed, path, errorDetails} = singleVerificationResult;
      return {
        // title: `${verificationType}: ${passed ? 'Passed' : 'Failed'} for ${path.replace(',,', ' > ')}`,
        title: `${verificationType}: ${passed ? 'Passed' : 'Failed'} for ${path}`,
        avatar: passed ? <CheckCircleFilled style={{color: 'green'}}/> : <CloseCircleFilled style={{color: 'red'}}/>,
      }
    })
  }
  console.log('formattedExecutionResults: ', formattedExecutionResults)

  return (
    <div style={{height: '500px', overflowY: 'auto'}}>
      <Collapse>
      {Object.keys(formattedExecutionResults).map(testname => 
        <Panel header={testname} key={counter+=1}>
            <List
              key={counter+=1}
              itemLayout='horizontal'
              dataSource={formattedExecutionResults[testname]}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={item.title}
                    avatar={item.avatar}
                  />
                </List.Item>
              )}
            />
        </Panel>
      )}
      </Collapse>
    </div>
  );
};
