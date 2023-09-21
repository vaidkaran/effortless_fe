import '../App.css';
import {Collapse, Modal} from 'antd';
import { useSelector } from "react-redux";
import {getSavedTestVars} from '../store/reqDataSlice';

export default function TestVarsModal({closeTestVarModal, open}) {
  const savedTestVars = useSelector(getSavedTestVars);


  // const getChildrenComp = (testVars) => {
  //   return(
  //     <p>
  //       {testVars.map(testVar => <p>{testVar}</p>)}
  //     </p>
  //   )
  // }

  const items = [];
  savedTestVars.forEach(({reqId, label, savedTestVars: testVars}) => {
    if(testVars.length > 0) {
      items.push({
        key: reqId,
        label,
        children: testVars.map(testVar => <p key={testVar}>{testVar}</p>)
      })
    }
  })


  console.log('00', items)
  return (
    <Modal width={'60%'} bodyStyle={{height: 500}} title="Test Context Variables from Responses"  keyboard={true} cancelButtonProps={{style: {display: 'none'}}} open={open} onCancel={closeTestVarModal} onOk={closeTestVarModal}>
      <div className='scrollable'>
        <Collapse items={items}/>
      </div>
    </Modal>
  );
}
