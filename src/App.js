// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';

import DockLayout from 'rc-dock'
import { Form, Modal, Input } from 'antd';
import {useState, useRef} from 'react';
import { GlobalContext } from "./context/GlobalContext";

import FileExplorer from './components/FileExplorer';
import ResponseViewer from "./components/ResponseViewer";
import UrlInput from './components/UrlInput';
import JsonEditor from "./components/JsonEditor";
import Headers from "./components/Headers";
import QueryParams from "./components/QueryParams";

import {FileAddTwoTone} from '@ant-design/icons';
import updateAppDataAndState from "./utils/updateAppDataAndState";

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

  const [url, setUrl] = useState();
  const [method, setMethod] = useState();
  const [protocol, setProtocol] = useState();

  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState();

  const defaultMethodRef = useRef('get');
  const defaultProtocolRef = useRef('http://');
  const defaultUrlRef = useRef('');
  const defaultReqBodyRef = useRef('');
  const defaultResBodyRef = useRef(null);
  const headersInitialValuesRef = useRef([{name: 'Content-Type', value: 'application/json'}]);
  const queryParamsInitialValuesRef = useRef([]);

  const updateAppState = (fileId) => {
    updateAppDataAndState({fileId, appDataRef, setUrl, defaultUrlRef, setReqBody, defaultReqBodyRef, setResBody, defaultResBodyRef,
    setMethod, defaultMethodRef, setProtocol, defaultProtocolRef, headersFormInstance, headersInitialValuesRef,
    queryParamsFormInstance, queryParamsInitialValuesRef});
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
              ]
            }
          ]
        }
      ]
    }
  };

  return (
    <GlobalContext.Provider value={{
      appDataRef,
      updateAppState,
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
        {isFileModalOpen ? (
          <Modal title="Basic Modal" open={isFileModalOpen} onOk={fileModalHandleOk} onCancel={fileModalHandleCancel}>
            <Input value={filename} onChange={(filename) => setFilename(filename.target.value)} placeholder='URL' style={{width: '60%'}} />
          </Modal>
        ) : (
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
        )}
      </div>
    </GlobalContext.Provider>
  )
}
