import _, { includes } from 'lodash';
import logo from './logo.svg';
import './App.css';
import ReactJson from 'react-json-view';
import { useState } from 'react';


function App() {
  const props = {};
  const [verifiedParentPaths, setVerifiedParentPaths] = useState({});
  const [verifiedData, setVerifiedData] = useState({});

  const addVerifiedData = (key, value) => {
      const printValue = () => {
          // console.log('add verifiedData: ', this.state.verifiedData);
      }
      const data = {};
      data[key] = value;
      // this.setState({verifiedData: {...this.state.verifiedData, ...data}}, printValue)
      setVerifiedData({...verifiedData, ...data}, printValue);
  }
  props.addVerifiedData = addVerifiedData;

  const removeVerifiedData = (key) => {
      const printValue = () => {
          // console.log('remove verifiedData: ', this.state.verifiedData);
      }
      const copy = {...verifiedData};
      delete copy[key];
      // this.setState({verifiedData: copy}, printValue)
      setVerifiedData(copy);
  }
  props.removeVerifiedData = removeVerifiedData;

  /**
   * { path: { explicit: true } }
   */
  const addToVerifiedParentPaths = (pathObject) => {
      if (_.size(pathObject) > 1) throw new Error('cant add multiple parent paths at once')
      const printValue = () => {
          // console.log('add verifiedParentPaths: ', this.state.verifiedParentPaths);
      }

      const pathAlreadyPresent = Object.keys(verifiedParentPaths).some((verifiedParentPath) => verifiedParentPath === Object.keys(pathObject)[0]);

      if(!pathAlreadyPresent) {
          // this.setState({verifiedParentPaths: {...this.state.verifiedParentPaths, ...pathObject}}, printValue)
          setVerifiedParentPaths({...verifiedParentPaths, ...pathObject})
      }
  }
  props.addToVerifiedParentPaths = addToVerifiedParentPaths;

  const removeFromVerifiedParentPaths = (path) => {
      // if (_.size(pathObject) > 1) throw new Error('cant remove multiple parent paths at once')
      const printValue = () => {
        //   console.log('remove verifiedParentPaths: ', this.state.verifiedParentPaths);
      }
      const updatedVerifiedParentPaths = _.cloneDeep(verifiedParentPaths)
      delete updatedVerifiedParentPaths[path]
      // const updatedVerifiedParentPaths = this.state.verifiedParentPaths.filter((item) => item !== path)
      // this.setState({verifiedParentPaths: updatedVerifiedParentPaths}, printValue)
      setVerifiedParentPaths(updatedVerifiedParentPaths);
  }
  props.removeFromVerifiedParentPaths = removeFromVerifiedParentPaths;

  const isSubParentSelected = (path) => {
      // return Object.keys(this.state.verifiedParentPaths).some((verifiedParentPath) => verifiedParentPath.match(new RegExp(`^${path}\..+`)));
      return Object.keys(verifiedParentPaths).some((verifiedParentPath) => verifiedParentPath.match(new RegExp(`^${path}\..+`)));
  }
  props.isSubParentSelected = isSubParentSelected;

  const isChildSelected = (path) => {
      // const {verifiedData, isSubParentSelected} = this.props;
      // const path = this.getPath();
    //   console.log("🚀 ~ file: VariableMeta.js ~ line 183 ~ extends ~ isSubParentSelected", isSubParentSelected)
    //   console.log("🚀 ~ file: VariableMeta.js ~ line 183 ~ extends ~ verifiedData", verifiedData)
    //   console.log("🚀 ~ file: VariableMeta.js ~ line 184 ~ extends ~ path", path)
      const childSelected = Object.keys(verifiedData).some((selectedVarPath) => selectedVarPath.match(new RegExp(`^${path}\..+`)));
    //   console.log("🚀 ~ file: VariableMeta.js ~ line 188 ~ extends ~ childSelected", childSelected)
      // TODO: should only return isChildSelected and not subParent
      return childSelected || isSubParentSelected(path);
  }
  props.isChildSelected = isChildSelected;

  const getSelfSelectionInfo = (path) => {
      // return this.state.verifiedParentPaths[path];
      return verifiedParentPaths[path];
  }
  props.getSelfSelectionInfo = getSelfSelectionInfo;
  
  const inClearState = () => {
      // return _.size(this.state.verifiedData) === 0 && _.size(this.state.verifiedParentPaths) === 0;
      return _.size(verifiedData) === 0 && _.size(verifiedParentPaths) === 0;
  }
  props.inClearState = inClearState;


  const json = {
    a: 1,
    b: {
        k: [
            [
                [
                    'iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii'
                ]
            ]
        ],
        1: 'one',
        c: 3,
        d: [
            'x',
            'y',
            'z'
        ],
        e: [
            {
                x: 11
            },
            {
                y: 22
            },
            {
                z: 33
            },
        ],
    },
  };

  return (
    <div>
        <ReactJson 
            src={json} 
            {...props} 
            // theme='monokai' 
            enableVerifyIcon
            quotesOnKeys={false}
            displayObjectSize={true}
            enableClipboard={false}
            name={'root'}
            size={8}
        />
    </div>
  );
}

export default App;
