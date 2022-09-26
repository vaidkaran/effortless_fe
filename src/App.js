// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';

import DockLayout from 'rc-dock'
import { Form, Modal, Input } from 'antd';
import {useState, useRef} from 'react';
// import ResContext from './context/ResContext';
// import FileContext from './context/FileContext';
import { ResContext, FileContext } from "./context/GlobalContext";

import FileExplorer from './components/FileExplorer';
import ResponseViewer from "./components/ResponseViewer";
import UrlInput from './components/UrlInput';
import JsonEditor from "./components/JsonEditor";
import KeyValueDynamicForm from "./components/KeyValueDynamicForm";
import {sendRequest} from './utils/reqUtils';

import {FileAddTwoTone} from '@ant-design/icons';

export default function App() {
  const [resBody, setResBody] = useState(null);
  const parentPathsRef = useRef({});
  const variablePathsRef = useRef({});
  const [fileData, setFileData] = useState([]);
  const [filename, setFilename] = useState('');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);

  const showModal = () => {
    setFilename('');
    setIsFileModalOpen(true);
  }
  const fileModalHandleCancel = () => setIsFileModalOpen(false);
  const fileModalHandleOk = () => {
    if(filename.trim() !== '') setFileData([...fileData, {title: filename, key: filename, isLeaf: true}])
    setIsFileModalOpen(false);
  }

  const defaults = {
    headers: [{name: 'Content-Type', value: 'application/json'}],
  }

  const onRequestSend = async ({url}) => {
    const res = await sendRequest({reqFormInstance, defaults, url})
    console.log('setting data: ', res.data)
    setResBody(res.data)
  }
  const [reqFormInstance] = Form.useForm();


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
                {id: 'request', size: 10, title: 'Request', content: <UrlInput onRequestSend={onRequestSend} reqFormInstance={reqFormInstance}/>},
              ]
            },
            {
              size: 1000,
              group: 'locked',
              tabs: [
                {id: 'body', title: 'JSON', content: <JsonEditor reqFormInstance={reqFormInstance}/>},
                {id: 'query', title: 'Query', content: <KeyValueDynamicForm formName={'queryParams'} reqFormInstance={reqFormInstance}/>},
                {id: 'headers', title: 'Headers', content: <KeyValueDynamicForm defaults={[{name: 'Content-Type', value: 'application/json'}]} formName={'headers'} reqFormInstance={reqFormInstance}/>},
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
  )
}
