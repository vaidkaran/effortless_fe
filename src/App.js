import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Layout, Modal, Tabs, Menu } from 'antd';
import {useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";

import TestExecutionViewer from "./components/TestExecutionViewer";
import EnvEditorModal from "./components/EnvEditorModal";
import TestVarsModal from "./components/TestVarsModal";

import playTest from "./utils/playTest";

import {createNewFile} from '../src/store/reqDataSlice';
import {addToFileExplorer} from '../src/store/fileExplorerDataSlice';
import FileExplorer from "./components/FileExplorer";
import ReqTabs from "./components/ReqTabs";
import { SiDotenv } from "react-icons/si";
import { HiVariable } from "react-icons/hi";
import { getKeyString } from './utils';

const { Sider, Content } = Layout;

export default function App() {
  // needed a global variable to keep dispose fn and invoke on each re-render
  const jsonEditorDisposeRef = useRef(null);
  const jsonEditorRef = useRef(null);
  const dispatch = useDispatch();

  const fileExplorerData = useSelector((state) => state.fileExplorerData);
  // create a new default file for start since there should be atleast 1 file at all times
  if(fileExplorerData.length < 1) {
    const filename = 'default';
    const key = getKeyString(filename);
    dispatch(createNewFile(key));
    dispatch(addToFileExplorer({key, filename}));
  }

  const reqDataStateCurrentValue = useSelector((state) => state.reqData);
  const reqDataStateRef = useRef();

  useEffect(() => {
    reqDataStateRef.current = reqDataStateCurrentValue;
  }, [reqDataStateCurrentValue]);


  const [siderCollapsed, setSiderCollapsed] = useState(true);
  const [testResultsToDisplay, setTestResultsToDisplay] = useState('');

  const [isTestExecutionModalOpen, setIsTestExecutionModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);
  const [isTestVarModalOpen, setIsTestVarModalOpen] = useState(false);


  const testExecutionModalCancel = () => setIsTestExecutionModalOpen(false);
  const testExecutionModalOk = () => setIsTestExecutionModalOpen(false);

  // accepts array of fileIds
  const playTestsAndDisplayResults = async (testFileIds) => {
    const executionResults = [];
    for(const testFileId of testFileIds) {
      const resultData = await playTest(reqDataStateRef.current[testFileId]);
      if(resultData) {
        executionResults.push(resultData);
      } else {
        alert(`Can't run ${testFileId}. Not marked as test`)
      }
    }
    if(executionResults.length > 0) {
      setTestResultsToDisplay(executionResults);
      setIsTestExecutionModalOpen(true);
    }
  }

  const showEnvModal = () => setIsEnvModalOpen(true);
  const closeEnvModal = () => setIsEnvModalOpen(false);

  const showTestVarModal = () => setIsTestVarModalOpen(true);
  const closeTestVarModal = () => setIsTestVarModalOpen(false);


  const siderMenuItems = [
    {
      key: 'envVars',
      icon: <SiDotenv size={20}/>,
      label: 'Env Variables',
    },
    {
      key: 'testVars',
      icon: <HiVariable size={20}/>,
      label: 'Test Variables',
    },
  ];

  const siderMenuOnClickHandler = ({key}) => {
    if(key === 'envVars') showEnvModal(true)
    if(key === 'testVars') showTestVarModal(true)
  };


  return (
    <div>
      <Modal width={'60%'} maskClosable={false} title="Test Execution Results" footer={null} open={isTestExecutionModalOpen} onOk={testExecutionModalOk} onCancel={testExecutionModalCancel}>
        <TestExecutionViewer executionResults={testResultsToDisplay}/>
      </Modal>

      <EnvEditorModal closeEnvModal={closeEnvModal} open={isEnvModalOpen}/>
      <TestVarsModal closeTestVarModal={closeTestVarModal} open={isTestVarModalOpen}/>

      <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={siderCollapsed} onCollapse={(value)=>setSiderCollapsed(value)} collapsedWidth={50} >
          <Menu theme='dark' onClick={siderMenuOnClickHandler} items={siderMenuItems}/>
        </Sider>
        <Content style={{backgroundColor: 'white'}}>
          <PanelGroup direction="horizontal">
            <Panel defaultSize={10} minSize={10}>
              <FileExplorer/>
            </Panel>
            <PanelResizeHandle style={{width: 5, backgroundColor: 'grey', marginLeft: 10, marginRight: 10}}/>

            <Panel defaultSize={90} minSize={60}>
              <ReqTabs jsonEditorDisposeRef={jsonEditorDisposeRef} jsonEditorRef={jsonEditorRef}/>
            </Panel>
          </PanelGroup>
        </Content>
      </Layout>



    </div>
  )
}
