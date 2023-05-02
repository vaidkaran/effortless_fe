import '../App.css';
import _ from 'lodash';
import ReactJson from 'react-json-view';
import { useState, useEffect, useContext } from 'react';
import { Button } from 'react-bootstrap';
import {GlobalContext} from '../context/GlobalContext'
import { VerifiedIcon, VerifyIcon } from '../icons';
import store from '../store/store';
import { initParentPaths, setParentAsVerified, setParentAsUnverified,
  initVariablePaths, setVariableAsVerified, setVariableAsUnverified } from '../store/reqDataSlice';
import { useSelector } from 'react-redux';
import { getResBody } from '../store/reqDataSlice';

export default function ResponseViewer() {
  const props = {};

  const rjvReloadCounter = useSelector(state => state.rjvReloader.counter);
  const parentPaths = useSelector(state => state.reqData.parentPaths)
  const variablePaths = useSelector(state => state.reqData.variablePaths)
  const resBody = useSelector(getResBody);

  const pathSeparator = '.';
  props.pathSeparator = pathSeparator;

  props.initParentPaths = initParentPaths;
  props.setParentAsVerified = setParentAsVerified;
  props.setParentAsUnverified = setParentAsUnverified;

  props.initVariablePaths = initVariablePaths;
  props.setVariableAsVerified = setVariableAsVerified;
  props.setVariableAsUnverified = setVariableAsUnverified;

  const shouldCollapse = ({src, namespace, type}) => {
    if (type==='object' && Object.keys(src).length > 20) {
      return true
    }
    if(namespace.length > 3) return true;
    return false
  }

  return (
    <>
    {
      resBody !== null ? (
        <div className='scrollable' >
          <ReactJson 
            {...props} 
            store={store}
            VerifyIcon={VerifyIcon}
            VerifiedIcon={VerifiedIcon}
            src={resBody} 
            theme='light' 
            enableVerifyIcon
            quotesOnKeys={false}
            enableClipboard={false}
            name={'root'}
            groupArraysAfterLength={50}
            collapseStringsAfterLength={50}
            shouldCollapse={shouldCollapse}
            key={rjvReloadCounter}
          /> 
          <Button onClick={() => console.log(parentPaths)}> parentPaths</Button>
          <Button onClick={() => console.log(variablePaths)}> variablePaths</Button>
          <Button onClick={() => console.log(store.getState())}> state</Button>
        </div>
      ) : (
        <></>
      )
    }
    </>
  );
}
