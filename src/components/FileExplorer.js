import {useEffect, useState} from 'react';
import {createNewFile} from '../store/reqDataSlice';
import {addToFileExplorer} from '../store/fileExplorerDataSlice';
import { Popconfirm, Tooltip, message, Modal, Input, Tree, Switch } from 'antd';
import {FileAddTwoTone, FileOutlined, PlaySquareTwoTone, FolderAddTwoTone} from '@ant-design/icons';
import { useDispatch, useSelector } from "react-redux";
import {setSelectedFileId, renameFile, deleteFile} from '../store/reqDataSlice';
import {reloadRjv} from '../store/rjvReloaderSlice';
import {showSavedIconOnFile, renameFileInExplorer, deleteFileInExplorer, showUnsavedIconOnFile} from '../store/fileExplorerDataSlice';
import {getTestBool} from '../store/reqDataSelectors';
import { Menu, Item, useContextMenu} from 'react-contexify';
import { getKeyString, getFileItem, getAllChildrenFileIds } from '../utils';
import 'react-contexify/ReactContexify.css';
const contextMenuId = 'filesContextMenu';

export default function FileExplorer(props) {
  const [filename, setFilename] = useState('');
  const [foldername, setFoldername] = useState('');
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const selectedFileId = useSelector((state) => state.reqData.selectedFileId);
  const fileExplorerData = useSelector((state) => state.fileExplorerData);
  const isTest = useSelector(getTestBool);
  const dispatch = useDispatch();
  const [checkable, setCheckable] = useState(false);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [checkedTestIds, setCheckedTestIds] = useState([]);

  const { show } = useContextMenu({id: contextMenuId});
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newFilename, setNewFilename] = useState();
  const [nodeInContext, setNodeInContext] = useState();

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

  const playSingleTest = () => {
    props.playTestsAndDisplayResults([nodeInContext.key])
  }

  const renameModalOkHandler = () => {
    const newFilenameKey = getKeyString(newFilename);
    dispatch(renameFileInExplorer({key: nodeInContext.key, newFilename, newFilenameKey}))
    dispatch(renameFile({oldFileId: nodeInContext.key, newFileId: newFilenameKey}))
    setIsRenameModalOpen(false);
    setNewFilename();
    setNodeInContext();
  }

  const modalCancelHandler = () => {
    setIsRenameModalOpen(false);
    setNewFilename();
    setNodeInContext();
  }

  function handleContextMenu({ event, node}){
    setNodeInContext(node);
    show({event})
  }

  const confirmDeleteHandler = (e) => {
    if(fileExplorerData.length === 1) {
      message.error('There must be 1 file atleast. You could rename it or create a new one before deleting it')
      return;
    }
    let fileIdsToDelete;
    const fileItem = getFileItem(fileExplorerData, nodeInContext.key);

    if (!fileItem.isLeaf) fileIdsToDelete = getAllChildrenFileIds(fileItem);
    else fileIdsToDelete = [nodeInContext.key];

    fileIdsToDelete.forEach(key => dispatch(deleteFile(key)))
    dispatch(deleteFileInExplorer(nodeInContext.key));
    setNodeInContext();
    message.success('Deleted successfully')
  }

  const cancelDeletehandler = () => {
    setNodeInContext();
  }

  const showFileModal = () => {
    setFilename('');
    setIsFileModalOpen(true);
  }
  const fileModalCancelHandler = () => setIsFileModalOpen(false);
  const fileModalOkHandler = () => { // filename is used as fileId
    if(filename.trim().length !== 0) {
      const key = getKeyString(filename);
      const opts = { filename, key };
      if(nodeInContext && nodeInContext.isLeaf === false) opts.parentFolder = nodeInContext.key;
      dispatch(createNewFile(key));
      dispatch(addToFileExplorer(opts));
    }
    setIsFileModalOpen(false);
  }

  const showFolderModal = () => {
    setFoldername('');
    setIsFolderModalOpen(true);
  }
  const folderModalCancelHandler = () => setIsFolderModalOpen(false);
  const folderModalOkHandler = () => {
    if(foldername.trim().length !== 0) {
      const opts = { filename: foldername, folder: true, key: getKeyString(foldername)};
      if(nodeInContext && nodeInContext.isLeaf === false) opts.parentFolder = nodeInContext.key;
      dispatch(addToFileExplorer(opts));
    }
    setIsFolderModalOpen(false);
  }

  return (
    <>
      <Modal maskClosable={false} open={isRenameModalOpen} onOk={renameModalOkHandler} onCancel={modalCancelHandler} cancelButtonProps={{style: {display: 'none'}}} keyboard={true}>
        <Input value={newFilename} onPressEnter={renameModalOkHandler} onChange={(name) => setNewFilename(name.target.value)} placeholder='New name' style={{width: '60%'}} />
      </Modal>

      <Modal maskClosable={false} keyboard={true} cancelButtonProps={{style: {display: 'none'}}} open={isFileModalOpen} onOk={fileModalOkHandler} onCancel={fileModalCancelHandler}>
        <Input value={filename} onPressEnter={fileModalOkHandler} onChange={(filename) => setFilename(filename.target.value)} placeholder='New Filename' style={{width: '60%'}} />
      </Modal>

      <Modal maskClosable={false} keyboard={true} cancelButtonProps={{style: {display: 'none'}}} open={isFolderModalOpen} onOk={folderModalOkHandler} onCancel={folderModalCancelHandler}>
        <Input value={foldername} onPressEnter={folderModalOkHandler} onChange={(foldername) => setFoldername(foldername.target.value)} placeholder='New Folder Name' style={{width: '60%'}} />
      </Modal>

      <div className='scrollable'>
        <div>
        <Menu id={contextMenuId}>
          <Item id="run" onClick={playSingleTest}>Run Test</Item>
          <Item id="rename" onClick={()=>{setIsRenameModalOpen(true)}}>Rename</Item>
          <Popconfirm title='Are you sure?' onConfirm={confirmDeleteHandler} onCancel={cancelDeletehandler} okText='Yes' cancelText='No'>
            <Item id="delete">Delete</Item>
          </Popconfirm>
          {nodeInContext && nodeInContext.isLeaf === false ? (
            <>
              <Item id="newFile" onClick={showFileModal}>New File</Item>
              <Item id="newFolder" onClick={showFolderModal}>New Folder</Item>
            </>
          ) : (
            <></>
          )}
        </Menu>
        </div>
        <div style={{marginLeft: 10, marginTop: 5}}>
          Select: <Switch checked={checkable} onChange={setCheckable}/>

          <Tooltip title='New File'>
            <FileAddTwoTone onClick={showFileModal} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
          </Tooltip>

          <Tooltip title='New Folder'>
            <FolderAddTwoTone onClick={showFolderModal} style={{fontSize: '20px', padding: '5px', cursor: 'pointer'}} />
          </Tooltip>
          <br />
          {showActionIcons ? 
            <Tooltip title='Run selected tests'>
              <PlaySquareTwoTone onClick={playMultipleTests} style={{fontSize: 25, cursor: 'pointer'}}/>
            </Tooltip> :
            <></>
          }
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
