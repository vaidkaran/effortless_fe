import '../App.css';
import { Table, Tabs } from 'antd';
import ReactJson from 'react-json-view';
import { VerifiedIcon, VerifyIcon } from '../icons';
import store from '../store/store';
import { initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified, setUnsetAsTest } from '../store/reqDataSlice';
import { useSelector } from 'react-redux';
import { getResBody } from '../store/reqDataSlice';
import { NavLink } from 'react-bootstrap';

export default function ResponseViewer() {
  const props = {};

  const rjvReloadCounter = useSelector(state => state.rjvReloader.counter);
  const resBody = useSelector(getResBody);

  const resHeaders = useSelector(state => {
    let counter = 0;
    const { selectedFileId } = state.reqData;
    const headers = state.reqData[selectedFileId].resHeaders;
    if(!headers) return;
    return Object.keys(headers).map((name) => {
      counter += 1;
      return { key: counter, header: name, value: headers[name]};
    })
  });

  const pathSeparator = '.';
  props.pathSeparator = pathSeparator;

  props.initParentPaths = initParentPaths;
  props.setParentAsVerified = setParentAsVerified;
  props.setParentAsUnverified = setParentAsUnverified;

  props.initVariablePaths = initVariablePaths;
  props.setVariableAsVerified = setVariableAsVerified;
  props.setVariableAsUnverified = setVariableAsUnverified;
  props.setUnsetAsTest = setUnsetAsTest;

  const shouldCollapse = ({src, namespace, type}) => {
    if (type==='object' && Object.keys(src).length > 20) {
      return true
    }
    if(namespace.length > 3) return true;
    return false
  }

  const onChange = (key) => {
    // console.log(key);
  }

  const resBodyViewer = () => (
    <>
    {
      resBody !== null ? (
        <div className='scrollable' >
          <ReactJson 
            {...props} 
            store={store}
            VerifyIcon={VerifyIcon}
            VerifiedIcon={VerifiedIcon}
            src={resBody} 
            theme='light' 
            enableVerifyIcon
            quotesOnKeys={false}
            enableClipboard={false}
            name={'root'}
            groupArraysAfterLength={50}
            collapseStringsAfterLength={50}
            shouldCollapse={shouldCollapse}
            key={rjvReloadCounter}
          /> 
        </div>
      ) : (
        <></>
      )
    }
    </>
  );

  const columns = [
    {
      title: 'Header',
      dataIndex: 'header',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
  ];

  // const headersData = [
  //   {
  //     key: 1,
  //     name: 'karan',
  //     age: 34,
  //   },
  //   {
  //     key: 2,
  //     name: 'ankur',
  //     age: 36,
  //   }
  // ];

  const tabItems = [
    {
      key: '1',
      label: 'Body',
      children: resBodyViewer(),
    },
    {
      key: '2',
      label: 'Headers',
      children: resHeaders ? <Table pagination={{hideOnSinglePage: true}} columns={columns} dataSource={resHeaders}/> : <></>,
    },
  ];


  return (
    <div className='scrollable' style={{paddingLeft: 10, paddingRight: 10}} >
      <Tabs
        onChange={onChange}
        items={tabItems}
      />
    </div>
  );
}
