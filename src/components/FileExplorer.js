import {useContext, useState} from 'react';
import 'antd/dist/antd.min.css';
import { Tree, Switch } from 'antd';
import { GlobalContext } from '../context/GlobalContext';
import {FileOutlined, PlaySquareTwoTone} from '@ant-design/icons';
import { useDispatch } from "react-redux";
import {setSelectedFileIdd} from '../store/reqDataSlice';
import {reloadRjv} from '../store/rjvReloaderSlice';



export default function FileExplorer() {
  const dispatch = useDispatch();
  const {fileData, selectedFileId, setSelectedFileId, updateAppState, playTestsAndDisplayResults} = useContext(GlobalContext)
  const [checkable, setCheckable] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [checkedTestIds, setCheckedTestIds] = useState([]);

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    if (fileId === undefined) return // when the already selected file is selected again, don't do anything

    dispatch(reloadRjv());
    dispatch(setSelectedFileIdd(fileId));
    setSelectedFileId(fileId);
    updateAppState(fileId);
  };

  const onCheck = (keys) => { // keys are test names
    if(keys.length !== 0) setShowActionIcons(true)
    else setShowActionIcons(false)
    setCheckedTestIds(keys);
  }

  const playMultipleTests = () => {
    playTestsAndDisplayResults(checkedTestIds)
  }

  return (
    <div className='scrollable'>
      <div style={{marginLeft: 10, marginTop: 5}}>
        Select: <Switch checked={checkable} onChange={setCheckable} />
        <br />
        {showActionIcons ? <PlaySquareTwoTone onClick={playMultipleTests} style={{fontSize: 25, cursor: 'pointer'}}/> : <></>}
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
