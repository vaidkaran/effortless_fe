import DockLayout from 'rc-dock'
import { Tooltip, Button } from 'antd';
import {FileAddTwoTone, PlaySquareTwoTone} from '@ant-design/icons';
import FileExplorer from '../components/FileExplorer';
import ResponseViewer from "../components/ResponseViewer";
import UrlInput from '../components/UrlInput';
import JsonEditor from "../components/JsonEditor";
import Headers from "../components/Headers";
import QueryParams from "../components/QueryParams";
import ResponseTitle from "../components/ResponseTitle";

export default function getDefaultLayout ({showEnvModal, showFileModal, playTestsAndDisplayResults, reqDataStateRef}) {
  const reqLayout = {
    dockbox: {
      mode: 'horizontal',
      children: [
        {
          mode: 'vertical',
          size: 1000,
          children: [
            {
              size: 200,
              group: 'locked',
              mode: 'horizontal',
              tabs: [
                {id: 'url', size: 10, title: 'Url', content: <UrlInput/>},
              ],
              panelLock: {
                panelExtra: () => (
                  <>
                    <Button onClick={showEnvModal} type='primary' ghost size="small" style={{margin: 2}}>Edit Env</Button>
                  </>
                )
              }
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

  return {
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
                {id: 'fileExplorer', content: <FileExplorer/>, maximizable: false, minWidth: 200, title: 'FileExplorer'},
              ],
              panelLock: {
                panelExtra: () => (
                  <>
                    <Tooltip title='New file'>
                      <FileAddTwoTone onClick={showFileModal} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
                    </Tooltip>
                  </>
                )
              }
            }
          ]
        },
        {
          mode: 'horizontal',
          size: 2000,
          children: [
            {
              group: 'locked',
              tabs: [
                {
                  id: 'request', 
                  maximizable: false, 
                  minWidth: 200, 
                  title: 'Request', 
                  content: <DockLayout
                    defaultLayout={reqLayout}
                    groups={{locked: { floatable: false, tabLocked: true}}}
                    style={{
                      position: "absolute",
                      left: 10,
                      top: 10,
                      right: 10,
                      bottom: 10,
                    }}
                  />
                },
              ],
              panelLock: {
                panelExtra: () => (
                  <>
                    <Tooltip title='New file'>
                      <Button onClick={showEnvModal} type='primary' ghost size="small" style={{margin: 2}}>Add Request</Button>
                    </Tooltip>
                  </>
                )
              }
            }
          ]
        },
      ]
    }
  };

}