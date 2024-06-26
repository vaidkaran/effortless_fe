import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import UrlInput from "./UrlInput";
import ResponseViewer from "./ResponseViewer";
import ReqBodyHeadersQuery from "./ReqBodyHeadersQuery";
import { Layout, Tabs } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { createNewReq, getSelectedReqId, setSelectedReqId } from '../store/reqDataSlice';
import { reloadRjv } from "../store/rjvReloaderSlice";
const { Content } = Layout;

export default function ReqTabs({jsonEditorDisposeRef, jsonEditorRef}) {
  const reqLayout = (
    <div>
      <PanelGroup direction="horizontal" style={{minHeight: '100vh', position: 'absolute'}}>
        <Panel defaultSize={50} minSize={30}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={10} minSize={10}>
              <UrlInput/>
            </Panel>
            <PanelResizeHandle style={{height: 5, backgroundColor: 'grey', marginTop: 10, marginBottom: 10}}/>
            <Panel defaultSize={90} minSize={20}>
              <ReqBodyHeadersQuery jsonEditorDisposeRef={jsonEditorDisposeRef} jsonEditorRef={jsonEditorRef}/>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle style={{width: 5, backgroundColor: 'grey', marginLeft: 10, marginRight: 10}}/>
        <Panel defaultSize={50} minSize={20}>
          <ResponseViewer/>
        </Panel>
      </PanelGroup>
    </div>
  )
  const dispatch = useDispatch();
  const rjvReloadCounter = useSelector(state => state.rjvReloader.counter);
  const selectedReqId = useSelector(getSelectedReqId);
  // cannot create a selector for this because of adding children; doesn't work if this is done via a selector function
  const items = useSelector((state) => {
    const { selectedFileId } = state.reqData;
    const requests = state.reqData[selectedFileId].requests;
    const list = [];
    for (const [key, value] of Object.entries(requests)) {
      if(key === 'selectedReqId') continue;

      list.push({key, label: value.label, children: reqLayout})
    }
    return list;

  })

  const onChange = (newActiveKey) => {
    dispatch(setSelectedReqId(newActiveKey));
    dispatch(reloadRjv());
  };

  const add = () => {
    dispatch(createNewReq());
  };

  const remove = (targetKey) => {
  };

  const onEdit = (targetKey, action) => {
    if (action === 'add') {
      add();
    } else {
      remove(targetKey);
    }
  };

  return (
    <Tabs
      key={rjvReloadCounter}
      type="editable-card"
      onChange={onChange}
      activeKey={selectedReqId.toString()}
      onEdit={onEdit}
      items={items}
    />
  )
}