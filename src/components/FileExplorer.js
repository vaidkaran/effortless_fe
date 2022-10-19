import {useContext} from 'react';
import 'antd/dist/antd.min.css';
import { Tree } from 'antd';
import { GlobalContext } from '../context/GlobalContext';


const { DirectoryTree } = Tree;

export default function FileExplorer() {
  const {attributeStoreInstance, arrayGroupStateInstance, fileData, selectedFileId, setSelectedFileId, updateAppState, rjvReloader, setRjvReloader} = useContext(GlobalContext)

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    setSelectedFileId(fileId)
    updateAppState(fileId);
    setRjvReloader(rjvReloader+1);
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
