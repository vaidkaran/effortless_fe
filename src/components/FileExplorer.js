import {useContext, useState} from 'react';
import 'antd/dist/antd.min.css';
import { Tree, Switch } from 'antd';
import { GlobalContext } from '../context/GlobalContext';
import {FileOutlined, PlaySquareTwoTone} from '@ant-design/icons';
import { NavLink } from 'react-bootstrap';
import playTest from '../utils/playTest';



export default function FileExplorer() {
  const {appDataRef, fileData, selectedFileId, setSelectedFileId, updateAppState, rjvReloader, setRjvReloader, playTestsAndDisplayResults} = useContext(GlobalContext)
  const [checkable, setCheckable] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [checkedTests, setCheckedTests] = useState([]);

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    if (fileId === undefined) return // when the already selected file is selected again, don't do anything

    setSelectedFileId(fileId)
    updateAppState(fileId);
    setRjvReloader(rjvReloader+1);
  };

  const onCheck = (keys) => { // keys are test names
    if(keys.length !== 0) setShowActionIcons(true)
    else setShowActionIcons(false)
    setCheckedTests(keys);
  }

  const playMultipleTests = () => {
    const testDataArray = []
    for(const fileId of checkedTests) {
      testDataArray.push(appDataRef.current[fileId])
    }
    playTestsAndDisplayResults(testDataArray)
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
