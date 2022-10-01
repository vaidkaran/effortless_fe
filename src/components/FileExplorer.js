import {useContext} from 'react';
import 'antd/dist/antd.min.css';
import { Tree } from 'antd';
import { GlobalContext } from '../context/GlobalContext';


const { DirectoryTree } = Tree;

export default function FileExplorer() {
  const {fileData, setSelectedFileId, updateStateVariablesWithAppData} = useContext(GlobalContext)

  const onSelect = (keys, info) => {
    const fileId = keys[0];
    setSelectedFileId(fileId)
    updateStateVariablesWithAppData(fileId);
  };

  return (
    <div className='scrollable'>
      <DirectoryTree
        expandAction='doubleClick'
        defaultExpandAll
        onSelect={onSelect}
        treeData={fileData}
      />
    </div>
  );
};
