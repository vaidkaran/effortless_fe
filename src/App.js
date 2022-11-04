// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';

import DockLayout from 'rc-dock'
import { Form, Modal, Input, List } from 'antd';
import {useEffect, useState, useRef} from 'react';
import { GlobalContext } from "./context/GlobalContext";

import FileExplorer from './components/FileExplorer';
import ResponseViewer from "./components/ResponseViewer";
import UrlInput from './components/UrlInput';
import JsonEditor from "./components/JsonEditor";
import Headers from "./components/Headers";
import QueryParams from "./components/QueryParams";
import TestExecutionViewer from "./components/TestExecutionViewer";

import {FileAddTwoTone, SaveFilled, PlaySquareTwoTone, FileDoneOutlined} from '@ant-design/icons';
import {VerifiedIcon} from './icons';
import updateAppDataAndState from "./utils/updateAppDataAndState";
import playTest from "./utils/playTest";

export default function App() {
  /**
   * IMPORTANT: Always update appData when changing values of fields
   */
  const appDataRef = useRef({});
  const [queryParamsFormInstance] = Form.useForm();
  const [headersFormInstance] = Form.useForm();
  const [resBody, setResBody] = useState(null);
  const [reqBody, setReqBody] = useState('');
  const parentPathsRef = useRef({});
  const variablePathsRef = useRef({});
  const [fileData, setFileData] = useState([]);
  const [filename, setFilename] = useState('');
  const [testResultsToDisplay, setTestResultsToDisplay] = useState('');

  const [url, setUrl] = useState();
  const [method, setMethod] = useState();
  const [protocol, setProtocol] = useState();

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isTestExecutionModalOpen, setIsTestExecutionModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState();

  const [rjvReloader, setRjvReloader] = useState(0);

  const defaultMethodRef = useRef('get');
  const defaultProtocolRef = useRef('http://');
  // const defaultUrlRef = useRef('jsonplaceholder.typicode.com/users/1');
  const defaultUrlRef = useRef('localhost:8080/users/1');
  const defaultReqBodyRef = useRef('');
  const defaultResBodyRef = useRef(null);
  const headersInitialValuesRef = useRef([{name: 'Content-Type', value: 'application/json'}]);
  const queryParamsInitialValuesRef = useRef([]);

  const arrayGroupStateInstance = useRef();
  const attributeStoreInstance = useRef();

  useEffect(() => {
    if(!selectedFileId) setIsFileModalOpen(true);
  }, [selectedFileId]);

  const arrayGroupSetState = (setState) => {
    arrayGroupStateInstance.current = setState
  }
  const setAttributeStoreInstance = (storeInstance) => {
    console.log('setting attr store instance in ref: ', storeInstance)
    attributeStoreInstance.current = storeInstance;
  }

  const updateAppState = (fileId) => {
    updateAppDataAndState({fileId, appDataRef, setUrl, defaultUrlRef, setReqBody, defaultReqBodyRef, setResBody, defaultResBodyRef,
    setMethod, defaultMethodRef, setProtocol, defaultProtocolRef, headersFormInstance, headersInitialValuesRef,
    queryParamsFormInstance, queryParamsInitialValuesRef, parentPathsRef, variablePathsRef});
  }

  const showModal = () => {
    setFilename('');
    setIsFileModalOpen(true);
  }
  const fileModalHandleCancel = () => setIsFileModalOpen(false);
  const fileModalHandleOk = () => { // filename is used as fileId
    if(filename.trim() !== '') setFileData([...fileData, {title: filename, key: filename, isLeaf: true}])
    appDataRef.current[filename] = {}
    setSelectedFileId(filename); // also called on file onSelect
    updateAppState(filename); // also called on file onSelect
    setIsFileModalOpen(false);
  }

  const testExecutionModalCancel = () => setIsTestExecutionModalOpen(false);
  const testExecutionModalOk = () => setIsTestExecutionModalOpen(false);

  const saveTest = () => {
    const fileDataCopy = fileData.map((file) => {
      if(file.key === selectedFileId) {
        file.switcherIcon = <VerifiedIcon/>
      }
      return file;
    });
    appDataRef.current[selectedFileId].test = true;
    setFileData(fileDataCopy);
    console.log('fileDataCopy', fileDataCopy)
  }

  const playTestAndDisplayResults = async () => {
    const results = await playTest(appDataRef.current[selectedFileId])
    setTestResultsToDisplay(results);
    setIsTestExecutionModalOpen(true);
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
                {id: 'fileExplorer', maximizable: false, minWidth: 200, title: 'FileExplorer', content: <FileExplorer fileData={fileData}/>},
              ],
              panelLock: {
                panelExtra: () => (
                  <FileAddTwoTone onClick={showModal} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
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
                {id: 'response', title: 'Response', content: <ResponseViewer resBody={resBody} />},
              ],
              panelLock: {
                panelExtra: () => (
                  <>
                  <PlaySquareTwoTone onClick={playTestAndDisplayResults} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
                  <SaveFilled onClick={saveTest} style={{color: 'green', fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
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
    <GlobalContext.Provider value={{
      appDataRef,
      rjvReloader, setRjvReloader,
      updateAppState,
      arrayGroupSetState, arrayGroupStateInstance, setAttributeStoreInstance, attributeStoreInstance,
      queryParamsInitialValuesRef,
      headersFormInstance,
      queryParamsFormInstance,
      headersInitialValuesRef,
      parentPathsRef, variablePathsRef,
      reqBody, setReqBody,
      resBody, setResBody,
      fileData, setFileData,
      url, setUrl,
      method, setMethod, defaultMethodRef,
      protocol, setProtocol, defaultProtocolRef,
      selectedFileId, setSelectedFileId,
    }}>
      <div>
        {(() => {
          if(isFileModalOpen) {
            return (
              <Modal maskClosable={false} title="New File" open={isFileModalOpen} onOk={fileModalHandleOk} onCancel={fileModalHandleCancel}>
                <Input value={filename} onChange={(filename) => setFilename(filename.target.value)} placeholder='Name' style={{width: '60%'}} />
              </Modal>
            )
          } else if(isTestExecutionModalOpen) {
            return (
              <Modal width={'60%'} maskClosable={false} title="Test Execution Results" open={isTestExecutionModalOpen} onOk={testExecutionModalOk} onCancel={testExecutionModalCancel}>
                <TestExecutionViewer testResultsToDisplay={testResultsToDisplay}/>
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
    </GlobalContext.Provider>
  )
}
