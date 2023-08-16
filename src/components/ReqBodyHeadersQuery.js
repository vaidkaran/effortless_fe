import { Tabs } from 'antd';
import JsonEditor from "../components/JsonEditor";
import Headers from "../components/Headers";
import QueryParams from "../components/QueryParams";

export default function ReqBodyHeadersQuery() {
  const onChange = () => {}

  const tabItems = [
    {
      key: '1',
      label: 'Body',
      children: <JsonEditor/>,
    },
    {
      key: '2',
      label: 'Headers',
      children: <Headers/>,
    },
    {
      key: '3',
      label: 'QueryParams',
      children: <QueryParams/>,
    },
  ];


  return (
    <div className='scrollable' style={{height: '100vh', paddingLeft: 10, paddingRight: 10}} >
      <Tabs
        onChange={onChange}
        items={tabItems}
      />
    </div>
  );
}