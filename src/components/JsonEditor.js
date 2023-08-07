import Editor from "@monaco-editor/react";
import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import {setReqBody} from '../store/reqDataSlice';

export default React.memo(function JsonEditor() {
  const reqData = useSelector((state) => state.reqData);
  const dispatch = useDispatch();

  const onChangeHandler = (value, event) => {
    dispatch(setReqBody(value));
  }

  return (
    <Editor
      height='80vh'
      options={{suggestOnTriggerCharacters: false}}
      defaultLanguage="json"
      onChange={onChangeHandler}
      value={reqData[reqData.selectedFileId].reqBody}
    />
  );
})
