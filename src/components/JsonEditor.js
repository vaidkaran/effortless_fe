import Editor from "@monaco-editor/react";
import {useContext, useEffect} from 'react';
import { GlobalContext } from '../context/GlobalContext';

export default function JsonEditor() {
  const {reqBody, setReqBody, appDataRef, selectedFileId} = useContext(GlobalContext);

  const onChangeHandler = (value, event) => {
    setReqBody(value)
    appDataRef.current[selectedFileId].reqBody = value;
    console.log("onChangeHandler ~ appDataRef", appDataRef.current)
  }
  useEffect(() => {
    console.log(`rendered with value: ${reqBody}`)
  })

  return (
    <Editor
      options={{suggestOnTriggerCharacters: false}}
      defaultLanguage="json"
      onChange={onChangeHandler}
      value={reqBody}
    />
  );
}
