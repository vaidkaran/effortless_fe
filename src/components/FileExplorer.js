import {useEffect, useState} from 'react';
import 'antd/dist/antd.min.css';
import { Modal, Input, Tree, Switch } from 'antd';
import {FileOutlined, PlaySquareTwoTone} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import {setSelectedFileId, renameFile} from '../store/reqDataSlice';
import {reloadRjv} from '../store/rjvReloaderSlice';
import {showSavedIconOnFile, renameFileInExplorer, showUnsavedIconOnFile} from '../store/fileExplorerDataSlice';
import {getTestBool} from '../store/reqDataSelectors';
import { Menu, Item, useContextMenu} from 'react-contexify';
import 'react-contexify/ReactContexify.css';
const contextMenuId = 'filesContextMenu';



export default function FileExplorer(props) {
  const selectedFileId = useSelector((state) => state.reqData.selectedFileId);
  const fileExplorerData = useSelector((state) => state.fileExplorerData);
  const isTest = useSelector(getTestBool);
  const dispatch = useDispatch();
  const [checkable, setCheckable] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [checkedTestIds, setCheckedTestIds] = useState([]);

  const { show } = useContextMenu({id: contextMenuId});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newFilename, setNewFilename] = useState();
  const [fileChangeId, setFileChangeId] = useState();

  useEffect(() => {
    if (isTest) {
      dispatch(showSavedIconOnFile(selectedFileId));
    } else {
      dispatch(showUnsavedIconOnFile(selectedFileId));
    }
  }, [isTest, dispatch, selectedFileId]);

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    if (fileId === undefined) return // when the already selected file is selected again, don't do anything

    dispatch(reloadRjv());
    dispatch(setSelectedFileId(fileId));
  };

  const onCheck = (keys) => { // keys are test names
    if(keys.length !== 0) setShowActionIcons(true)
    else setShowActionIcons(false)
    setCheckedTestIds(keys);
  }

  const playMultipleTests = () => {
    props.playTestsAndDisplayResults(checkedTestIds)
  }

  const modalOkHandler = () => {
    dispatch(renameFileInExplorer({key: fileChangeId, newFilename}))
    dispatch(renameFile({oldFileId: fileChangeId, newFileId: newFilename}))
    setIsModalOpen(false);
    setNewFilename();
    setFileChangeId();
  }

  const modalCancelHandler = () => {
    setIsModalOpen(false);
    setNewFilename();
    setFileChangeId();
  }

  function handleContextMenu({ event, node}){
    setFileChangeId(node.key);
    show({event})
  }

  return (
    <>
      {isModalOpen ? (
        <Modal maskClosable={false} open={isModalOpen} onOk={modalOkHandler} onCancel={modalCancelHandler} cancelButtonProps={{style: {display: 'none'}}} keyboard={true}>
          <Input value={newFilename} onPressEnter={modalOkHandler} onChange={(name) => setNewFilename(name.target.value)} placeholder='New name' style={{width: '60%'}} />
        </Modal>
      ) :
      <></>}
      <div className='scrollable'>
        <div>
        <Menu id={contextMenuId}>
          <Item id="rename" onClick={()=>{setIsModalOpen(true)}}>Rename</Item>
          <Item id="delete" onClick={()=>{}}>Delete</Item>
        </Menu>
        </div>
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
          onRightClick={({event, node}) => handleContextMenu({event, node})}
          treeData={fileExplorerData}
          selectedKeys={[selectedFileId]}
          expandAction='doubleClick'
        />
        </div>
      </div>
    </>
  );
};
