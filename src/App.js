// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme
import 'bootstrap/dist/css/bootstrap.min.css';

import DockLayout from 'rc-dock'

import FileExplorer from './components/FileExplorer';
import TestViewer from './components/TestViewer';
import UrlInput from './components/UrlInput';
import JsonEditor from "./components/JsonEditor";


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
              {id: 'fileExplorer',maximizable: false, minWidth: 200, title: 'FileExplorer', content: <FileExplorer/>},
            ]
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
              {id: 'query', title: 'Query', content: <TestViewer/>},
              {id: 'headers', title: 'Headers', content: <TestViewer/>},
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
              {id: 'response', title: 'Response', content: <></>},
            ]
          }
        ]
      }
    ]
  }
};


export default function App() {
  return (
    <div>
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
