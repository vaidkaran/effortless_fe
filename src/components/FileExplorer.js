import {useContext} from 'react';
import 'antd/dist/antd.min.css';
import { Tree } from 'antd';
import { GlobalContext } from '../context/GlobalContext';


const { DirectoryTree } = Tree;

export default function FileExplorer() {
  const {attributeStoreInstance, arrayGroupStateInstance, fileData, selectedFileId, setSelectedFileId, updateAppState} = useContext(GlobalContext)

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    setSelectedFileId(fileId)
    updateAppState(fileId);
    if(arrayGroupStateInstance.current) arrayGroupStateInstance.current({expanded: []});
    if(attributeStoreInstance.current) attributeStoreInstance.current.resetStore();
  };

  return (
    <div className='scrollable'>
      <DirectoryTree
        expandAction='doubleClick'
        defaultExpandAll
        onSelect={onSelect}
        treeData={fileData}
        selectedKeys={[selectedFileId]}
      />
    </div>
  );
};
