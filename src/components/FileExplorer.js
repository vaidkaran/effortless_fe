import {useContext, useState} from 'react';
import 'antd/dist/antd.min.css';
import { Tree, Switch } from 'antd';
import { GlobalContext } from '../context/GlobalContext';
import {FileOutlined, PlaySquareTwoTone} from '@ant-design/icons';



export default function FileExplorer() {
  const {fileData, selectedFileId, setSelectedFileId, updateAppState, rjvReloader, setRjvReloader} = useContext(GlobalContext)
  const [checkable, setCheckable] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    if (fileId === undefined) return // when the already selected file is selected again, don't do anything

    setSelectedFileId(fileId)
    updateAppState(fileId);
    setRjvReloader(rjvReloader+1);
  };

  const onCheck = (keys) => {
    console.log('checkedKeys: ', keys)
    if(keys.length !== 0) setShowActionIcons(true)
    else setShowActionIcons(false)
  }

  return (
    <div className='scrollable'>
      <div style={{marginLeft: 10, marginTop: 5}}>
        Select: <Switch checked={checkable} onChange={setCheckable} />
        <br />
        {showActionIcons ? <PlaySquareTwoTone style={{fontSize: 25}}/> : <></>}
        <br />
      <Tree
        checkable={checkable}
        showLine={{showLeafIcon: <FileOutlined />}} // can show more icons by using showIcon prop and by passing icon to the icon prop; but it will reiside in text area
        defaultExpandAll
        onCheck={onCheck}
        onSelect={onSelect}
        treeData={fileData}
        selectedKeys={[selectedFileId]}
        expandAction='doubleClick'
      />
      </div>
    </div>
  );
};
