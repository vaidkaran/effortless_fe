// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';

import DockLayout from 'rc-dock'
import { Modal, Input } from 'antd';
import {useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";

import TestExecutionViewer from "./components/TestExecutionViewer";
import EnvEditorModal from "./components/EnvEditorModal";

import playTest from "./utils/playTest";

import {createNewFile} from '../src/store/reqDataSlice';
import {addFileToFileExplorer} from '../src/store/fileExplorerDataSlice';
import getDefaultLayout from "./utils/getDefaultLayout";

export default function App() {
  const dispatch = useDispatch();

  const fileExplorerData = useSelector((state) => state.fileExplorerData);
  const reqDataStateCurrentValue = useSelector((state) => state.reqData);
  const reqDataStateRef = useRef();

  useEffect(() => {
    reqDataStateRef.current = reqDataStateCurrentValue;
  }, [reqDataStateCurrentValue]);

  useEffect(() => {
    if(fileExplorerData.length < 1) {
      dispatch(createNewFile('default'));
      dispatch(addFileToFileExplorer('default'));
    }
  }, [reqDataStateRef,fileExplorerData, dispatch]);


  const [filename, setFilename] = useState('');
  const [testResultsToDisplay, setTestResultsToDisplay] = useState('');

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isTestExecutionModalOpen, setIsTestExecutionModalOpen] = useState(false);
  const [isEnvModalOpen, setIsEnvModalOpen] = useState(false);

  const showFileModal = () => {
    setFilename('');
    setIsFileModalOpen(true);
  }
  const fileModalHandleCancel = () => setIsFileModalOpen(false);
  const fileModalHandleOk = () => { // filename is used as fileId
    if(filename.trim().length !== 0) {
      dispatch(createNewFile(filename));
      dispatch(addFileToFileExplorer(filename));
    }
    setIsFileModalOpen(false);
  }

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

  const showEnvModal = () => {
    setIsEnvModalOpen(true);
  }
  const closeEnvModal = () => {
    setIsEnvModalOpen(false);
  }

  const defaultLayout = getDefaultLayout({showFileModal, playTestsAndDisplayResults, reqDataStateRef, showEnvModal});


  return (
    <div>
      <Modal maskClosable={false} keyboard={true} cancelButtonProps={{style: {display: 'none'}}} open={isFileModalOpen} onOk={fileModalHandleOk} onCancel={fileModalHandleCancel}>
        <Input value={filename} onPressEnter={fileModalHandleOk} onChange={(filename) => setFilename(filename.target.value)} placeholder='Name filename' style={{width: '60%'}} />
      </Modal>

      <Modal width={'60%'} maskClosable={false} title="Test Execution Results" footer={null} open={isTestExecutionModalOpen} onOk={testExecutionModalOk} onCancel={testExecutionModalCancel}>
        <TestExecutionViewer executionResults={testResultsToDisplay}/>
      </Modal>

      <EnvEditorModal showEnvModal={showEnvModal} closeEnvModal={closeEnvModal} open={isEnvModalOpen}/>

      <DockLayout
        defaultLayout={defaultLayout}
        groups={{locked: { floatable: false, tabLocked: true}}}
        style={{
          position: "absolute",
          left: 10,
          top: 10,
          right: 10,
          bottom: 10,
        }}
      />
    </div>
  )
}
