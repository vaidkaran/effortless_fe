import {useContext} from 'react';
import 'antd/dist/antd.min.css';
import { Tree } from 'antd';
import {FileContext} from '../context/GlobalContext'


const { DirectoryTree } = Tree;

export default function FileExplorer() {
  const {fileData} = useContext(FileContext)

  const onSelect = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  return (
    <div className='scrollable'>
      <DirectoryTree
        expandAction='doubleClick'
        multiple
        defaultExpandAll
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={fileData}
      />
    </div>
  );
};
