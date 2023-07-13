// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';

import DockLayout from 'rc-dock'
import { Modal, Input, Tooltip } from 'antd';
import {useEffect, useState, useRef} from 'react';
import { useDispatch, useSelector } from "react-redux";

import FileExplorer from './components/FileExplorer';
import ResponseViewer from "./components/ResponseViewer";
import UrlInput from './components/UrlInput';
import JsonEditor from "./components/JsonEditor";
import Headers from "./components/Headers";
import QueryParams from "./components/QueryParams";
import ResponseTitle from "./components/ResponseTitle";
import TestExecutionViewer from "./components/TestExecutionViewer";

import {FileAddTwoTone, SaveFilled, PlaySquareTwoTone} from '@ant-design/icons';
import playTest from "./utils/playTest";

import {setTest, setTestname, createNewFile} from '../src/store/reqDataSlice';
import {addFileToFileExplorer, showSavedIconOnFile} from '../src/store/fileExplorerDataSlice';

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

  const showModal = () => {
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

  const saveTest = () => {
    const {selectedFileId} = reqDataStateRef.current;
    dispatch(setTest(true));
    dispatch(setTestname(selectedFileId));
    dispatch(showSavedIconOnFile(selectedFileId));
  }

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

  const defaultLayout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'horizontal',
          size: 200,
          children: [
            {
              group: 'locked',
              tabs: [
                {id: 'fileExplorer', maximizable: false, minWidth: 200, title: 'FileExplorer', content: <FileExplorer playTestsAndDisplayResults={playTestsAndDisplayResults}/>},
              ],
              panelLock: {
                panelExtra: () => (
                  <>
                    <Tooltip title='New file'>
                      <FileAddTwoTone onClick={showModal} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                )
              }
            }
          ]
        },
        {
          mode: 'vertical',
          size: 1000,
          children: [
            {
              size: 200,
              group: 'locked',
              mode: 'horizontal',
              tabs: [
                {id: 'request', size: 10, title: 'Request', content: <UrlInput/>},
              ]
            },
            {
              size: 1000,
              group: 'locked',
              tabs: [
                {id: 'body', title: 'JSON', content: <JsonEditor/>},
                {id: 'query', title: 'Query', content: <QueryParams/>},
                {id: 'headers', title: 'Headers', content: <Headers/>},
              ]
            }
          ]
        },
        {
          mode: 'horizontal',
          size: 1000,
          children: [
            {
              group: 'locked',
              tabs: [
                {id: 'response', title: <ResponseTitle/>, content: <ResponseViewer/>},
              ],
              panelLock: {
                panelExtra: () => (
                  <>
                  <Tooltip title='Run test'>
                    <PlaySquareTwoTone onClick={()=>playTestsAndDisplayResults([reqDataStateRef.current.selectedFileId])} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
                  </Tooltip>
                  </>
                )
              }
            }
          ]
        }
      ]
    }
  };

  return (
    <div>
      {(() => {
        if(isFileModalOpen) {
          return (
            <Modal maskClosable={false} keyboard={true} cancelButtonProps={{style: {display: 'none'}}} open={isFileModalOpen} onOk={fileModalHandleOk} onCancel={fileModalHandleCancel}>
              <Input value={filename} onPressEnter={fileModalHandleOk} onChange={(filename) => setFilename(filename.target.value)} placeholder='Name filename' style={{width: '60%'}} />
            </Modal>
          )
        } else if(isTestExecutionModalOpen) {
          return (
            <Modal width={'60%'} maskClosable={false} title="Test Execution Results" footer={null} open={isTestExecutionModalOpen} onOk={testExecutionModalOk} onCancel={testExecutionModalCancel}>
              <TestExecutionViewer executionResults={testResultsToDisplay}/>
            </Modal>
          )
        } else {
          return <DockLayout
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
        }
      })()}
    </div>
  )
}
