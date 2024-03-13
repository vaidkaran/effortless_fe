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
  for(const {testname, testExecutionData} of executionResults) {
    formattedExecutionResults[testname] = [];
    const reqIds = Object.keys(testExecutionData).filter(i => i !== 'savedTestVarsWithValues')
    // eslint-disable-next-line no-loop-func
    reqIds.forEach((reqId) => {
      const testData = {};
      const {testResults} = testExecutionData[reqId];
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
      formattedExecutionResults[testname].push({reqId, results: Object.keys(testData).map((obKey) => testData[obKey])})
    })
  }

  console.log('formattedExecutionResults: ', formattedExecutionResults)

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

  const getRequestsCollapseComp = (testname) => {
    const items = formattedExecutionResults[testname].map(reqData => ({
      key: counter+= 1,
      label: reqData.reqId,
      children: <Table pagination={false} scroll={{y: 250}} columns={columns} dataSource={reqData.results}/>
    }))
    return <Collapse items={items}/>;
  }

  const reqItems = Object.keys(formattedExecutionResults).map((testname) => ({
    key: counter+= 1,
    label: testname,
    children: getRequestsCollapseComp(testname)
    // children: <Collapse items={items}/>
  }));
  console.log('reqItems', reqItems)

  return (
    <div style={{height: '500px', overflowY: 'auto'}}>
      <Collapse items={reqItems}/>
    </div>
  );
};
