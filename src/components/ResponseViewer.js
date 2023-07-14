import '../App.css';
import { FloatButton, Table, Tabs } from 'antd';
import ReactJson from 'react-json-view';
import { VerifiedIcon, VerifyIcon } from '../icons';
// import { PiListChecksBold } from "react-icons/pi";
import { BsCheckAll } from "react-icons/bs";
import { VscCheckAll } from "react-icons/vsc";
import store from '../store/store';
import { initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified, setUnsetAsTest, setAllAsVerified } from '../store/reqDataSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getResBody } from '../store/reqDataSlice';

export default function ResponseViewer() {
  const props = {};

  const dispatch = useDispatch();
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
          <FloatButton onClick={()=>{dispatch(setAllAsVerified())}} tooltip='Select All' style={{backgroundColor: 'dodgerblue'}} icon={<VscCheckAll style={{color: 'blue'}}/>}/>
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
