import { Table, Tag } from 'antd';
import { Collapse } from 'antd';
const {Panel} = Collapse;


const getTag = (passed) => {
  const result = passed ? 'Passed' : 'Failed';
  const color = result === 'Passed' ? 'green' : 'red';
  return(<Tag color={color}>{result}</Tag>);
}


export default function TestExecutionViewer({executionResults}) {
  let counter=0;
  let keyCounter = 0;
  const formattedExecutionResults = {};
  const testData = {};
  for(const {testname, testResults} of executionResults) {
    // eslint-disable-next-line no-loop-func
    testResults.forEach((singleVerificationResult) => {
      const {verificationType, passed, path, errorDetails} = singleVerificationResult;
      if(testData[path]) {
        testData[path][verificationType] = getTag(passed);
      } else {
        testData[path] = {key: keyCounter += 1 }
        testData[path].property = path;
        testData[path][verificationType] = getTag(passed);
      }
    })
    console.log('--', testData)
    formattedExecutionResults[testname] = Object.keys(testData).map((obKey) => testData[obKey]);
  }

  console.log(formattedExecutionResults)

  const columns = [
    {
      title: 'Property',
      dataIndex: 'property',
      key: 'property'
    },
    {
      title: 'Existence',
      dataIndex: 'existence',
      key: 'existence'
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value'
    },
  ]

  const getTableData = (params) => {
    
  }



  return (
    <div style={{height: '500px', overflowY: 'auto'}}>
      <Collapse>
      {Object.keys(formattedExecutionResults).map(testname => 
        <Panel header={testname} key={counter+=1}>
            <Table pagination={false} scroll={{y: 250}} columns={columns} dataSource={formattedExecutionResults[testname]}/>
        </Panel>
      )}
      </Collapse>
    </div>
  );
};
