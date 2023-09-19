import '../App.css';
import {Collapse, Modal} from 'antd';

export default function TestVarsModal({closeTestVarModal, open}) {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  const items = [
    {
      key: '1',
      label: 'This is panel header 1',
      children: <p>{text}</p>,
    },
    {
      key: '2',
      label: 'This is panel header 2',
      children: <p>{text}</p>,
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
    },
    {
      key: '4',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
    },
    {
      key: '5',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
    },
  ]

  return (
    <Modal width={'60%'} bodyStyle={{height: 500}} title="Test Context Variables from Responses"  keyboard={true} cancelButtonProps={{style: {display: 'none'}}} open={open} onCancel={closeTestVarModal} onOk={closeTestVarModal}>
      <div className='scrollable'>
        <Collapse items={items} defaultActiveKey={['1']}/>
      </div>
    </Modal>
  );
}
