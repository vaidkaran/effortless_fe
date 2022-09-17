import FileExplorer from './components/FileExplorer';
import TestViewer from './components/TestViewer';
import DockLayout from 'rc-dock'

// import "rc-dock/dist/rc-dock-dark.css"; // dark theme
import "rc-dock/dist/rc-dock.css"; // light theme


const defaultLayout = {
  dockbox: {
    mode: 'horizontal',
    children: [
      {
        mode: 'horizontal',
        size: 200,
        panelLock: { panelExtra: ()=>{}},
        children: [
          {
            widthFlex: 200,
            group: 'locked',
            tabs: [
              {id: 'tab1',maximizable: false, minWidth: 200, title: 'FileExplorer', content: <FileExplorer/>},
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
              {id: 'tab1', title: 'Request', content: <TestViewer/>},
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
