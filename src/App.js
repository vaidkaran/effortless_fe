// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';

import DockLayout from 'rc-dock'
import { Form, Modal, Input } from 'antd';
import {useState, useRef} from 'react';
// import ResContext from './context/ResContext';
// import FileContext from './context/FileContext';
import { ResContext, FileContext, GlobalContext } from "./context/GlobalContext";

import FileExplorer from './components/FileExplorer';
import ResponseViewer from "./components/ResponseViewer";
import UrlInput from './components/UrlInput';
import JsonEditor from "./components/JsonEditor";
import Headers from "./components/Headers";
import QueryParams from "./components/QueryParams";

import {sendRequest} from './utils/reqUtils';

import {FileAddTwoTone} from '@ant-design/icons';

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
  const headersInitialValuesRef = useRef([{name: 'Content-Type', value: 'application/json'}]);
  const queryParamsInitialValuesRef = useRef([]);

  const updateStateVariablesWithAppData = (fileId) => {
    console.log('appDataRef: ', appDataRef.current)
    appDataRef.current[fileId].url ? setUrl(appDataRef.current[fileId].url) : setUrl('')
    appDataRef.current[fileId].reqBody ? setReqBody(appDataRef.current[fileId].reqBody) : setReqBody('')
    appDataRef.current[fileId].method ? setMethod(appDataRef.current[fileId].method) : setMethod(defaultMethodRef.current)
    appDataRef.current[fileId].protocol ? setProtocol(appDataRef.current[fileId].protocol) : setProtocol(defaultProtocolRef.current)
    appDataRef.current[fileId].headers ? 
      headersFormInstance.setFieldsValue({headers: appDataRef.current[fileId].headers}) :
      headersFormInstance.setFieldsValue({headers: headersInitialValuesRef.current});
    appDataRef.current[fileId].queryParams ? 
      queryParamsFormInstance.setFieldsValue({queryParams: appDataRef.current[fileId].queryParams}) :
      queryParamsFormInstance.setFieldsValue({queryParams: queryParamsInitialValuesRef.current});
  }

  const showModal = () => {
    setFilename('');
    setIsFileModalOpen(true);
  }
  const fileModalHandleCancel = () => setIsFileModalOpen(false);
  const fileModalHandleOk = () => {
    if(filename.trim() !== '') setFileData([...fileData, {title: filename, key: filename, isLeaf: true}])
    appDataRef.current[filename] = {}
    setSelectedFileId(filename);
    setIsFileModalOpen(false);
  }

  const defaults = {
    headers: [{name: 'Content-Type', value: 'application/json'}],
  }

  const onRequestSend = async ({url}) => {
    const res = await sendRequest({defaults, url})
    console.log('setting data: ', res.data)
    setResBody(res.data)
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
                {id: 'request', size: 10, title: 'Request', content: <UrlInput onRequestSend={onRequestSend}/>},
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
      updateStateVariablesWithAppData,
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
      <ResContext.Provider value={{resBody, parentPathsRef, variablePathsRef}}>
        <FileContext.Provider value={{fileData}}>
          <div>
            <Modal title="Basic Modal" open={isFileModalOpen} onOk={fileModalHandleOk} onCancel={fileModalHandleCancel}>
              <Input value={filename} onChange={(filename) => setFilename(filename.target.value)} placeholder='URL' style={{width: '60%'}} />
            </Modal>

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
        </FileContext.Provider>
      </ResContext.Provider>
    </GlobalContext.Provider>
  )
}
