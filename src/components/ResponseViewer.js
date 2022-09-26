import '../App.css';
import _ from 'lodash';
import ReactJson from 'react-json-view';
import { useState, useRef, useContext } from 'react';
import { Button } from 'react-bootstrap';
import {ResContext} from '../context/GlobalContext'

export default function ResponseViewer() {
  const { resBody, parentPathsRef, variablePathsRef } = useContext(ResContext)
  const props = {};
  const [verifiedData, setVerifiedData] = useState({});

  const pathSeparator = ',,';
  props.pathSeparator = pathSeparator;

  const initParentPath = (path, setState) => {
    if(!parentPathsRef.current[path]) { // path is not present already
      const newPathOb = {}
      newPathOb[path] = {verified: false, setState}
      const newPaths = {...parentPathsRef.current, ...newPathOb};
      parentPathsRef.current = newPaths;
    } else { // remounting - so path already present
      parentPathsRef.current[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
      // reset the previous state
      parentPathsRef.current[path].setState({verified: parentPathsRef.current[path].verified});
    }
  }
  props.initParentPath = initParentPath;

  const initVariablePath = (path, parentPath, variable, setState) => {
    if(!variablePathsRef.current[path]) { // path is not present already
      const newPathOb = {}
      newPathOb[path] = {verified: false, parentPath, variable, setState}
      const newPaths = {...variablePathsRef.current, ...newPathOb};
      variablePathsRef.current = newPaths;
    } else { // remounting - so path already present
      variablePathsRef.current[path].setState = setState; // set the new state to avoid error "can't perform state update on unmounted component"
      // reset the previous state
      [path].setState({verified: variablePathsRef.current[path].verified});
    }

  }
  props.initVariablePath = initVariablePath;

  const addVerifiedData = (key, value) => {
      const data = {};
      data[key] = value;
      setVerifiedData({...verifiedData, ...data});
  }
  props.addVerifiedData = addVerifiedData;

  const removeVerifiedData = (key) => {
      const copy = {...verifiedData};
      delete copy[key];
      setVerifiedData(copy);
  }
  props.removeVerifiedData = removeVerifiedData;


  /**
   * { path: { explicit: true } }
   */
  const addToVerifiedParentPaths = (path, opts={}) => {
      const newParentPaths = _.cloneDeep(parentPathsRef.current)
      newParentPaths[path].verified = true;
      newParentPaths[path].explicit = opts.explicit || false;
      newParentPaths[path].setState({ verified: true });

      Object.keys(newParentPaths).forEach(parentPath => {
          const subParentSelected = !!path.match(new RegExp(`^${parentPath}${pathSeparator}.+`));
          if (subParentSelected && !newParentPaths[parentPath].verified) {
              newParentPaths[parentPath].verified = true;
              newParentPaths[parentPath].explicit = false;
              newParentPaths[parentPath].setState({ verified: true })
          }
      })

      parentPathsRef.current = newParentPaths;
  }
  props.addToVerifiedParentPaths = addToVerifiedParentPaths;

  const addToVerifiedVariablePaths = (path) => {
      const newVariablePaths = _.cloneDeep(variablePathsRef.current)
      newVariablePaths[path].verified = true;
      newVariablePaths[path].setState({ verified: true });
      variablePathsRef.current = newVariablePaths;

      if(!isParentVerified(newVariablePaths[path].parentPath)) addToVerifiedParentPaths(newVariablePaths[path].parentPath);
  }
  props.addToVerifiedVariablePaths = addToVerifiedVariablePaths;

  const removeFromVerifiedParentPaths = (path) => {
    parentPathsRef.current[path].verified = false;
    parentPathsRef.current[path].explicit = false;
    parentPathsRef.current[path].setState({ verified: false })

    const parentPath = Object.keys(parentPathsRef.current).find(parentPath => path.match(new RegExp(`^${parentPath}${pathSeparator}[^${pathSeparator}]+$`)))
    // if parent just above is verified but not explicitly, then remove it from verified paths
    if(parentPath && parentPathsRef.current[parentPath].verified===true && parentPathsRef.current[parentPath].explicit===false) {
        removeFromVerifiedParentPaths(parentPath);
    }
  }
  props.removeFromVerifiedParentPaths = removeFromVerifiedParentPaths;

  const removeFromVerifiedVariablePaths = (path) => {
      const newVariablePaths = _.cloneDeep(variablePathsRef.current)
      newVariablePaths[path].verified = false;
      newVariablePaths[path].setState({ verified: false });
      variablePathsRef.current = newVariablePaths;

      // remove immediate parent from verifiedParentPaths ONLY if it's implicitly verified.
      const {verified, explicit } = parentPathsRef.current[variablePathsRef.current[path].parentPath]
      if(verified && !explicit) removeFromVerifiedParentPaths(newVariablePaths[path].parentPath);
  }
  props.removeFromVerifiedVariablePaths = removeFromVerifiedVariablePaths;

  const canBeRemovedFromVerifiedParentPaths = (path) => {
    const verifiedParentPaths = getVerifiedParentPaths();
    const childAlreadySelected = verifiedParentPaths.some((verifiedParentPath) => verifiedParentPath.match(new RegExp(`^${path}${pathSeparator}.+`)));

    return !childAlreadySelected; // cannot be marked as unverified if child is selected
  }
  props.canBeRemovedFromVerifiedParentPaths = canBeRemovedFromVerifiedParentPaths;

  const getVerifiedParentPaths = () => {
    return Object.keys(parentPathsRef.current).filter((path) => parentPathsRef.current[path].verified);
  }

  const isParentVerified = (path) => {
      if(parentPathsRef.current[path] && parentPathsRef.current[path].verified) return true;
      return false;
  }
  props.isParentVerified = isParentVerified;
  
  const isVariableVerified = (path) => {
      if(variablePathsRef.current[path] && variablePathsRef.current[path].verified) return true;
      return false;
  }
  props.isVariableVerified = isVariableVerified;

  return (
    <>
    {
      resBody !== null ? (
        <div className='scrollable'>
          <ReactJson 
            src={resBody} 
            {...props} 
            theme='light' 
            enableVerifyIcon
            quotesOnKeys={false}
            enableClipboard={false}
            name={'root'}
          />
          <Button onClick={() => console.log(parentPathsRef.current)}> parentPathsRef</Button>
          <Button onClick={() => console.log(variablePathsRef.current)}> variablePathsRef</Button>
        </div>
      ) : (
        <></>
      )
    }
    </>
  );
}
