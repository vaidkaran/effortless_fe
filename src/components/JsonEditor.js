import Editor from "@monaco-editor/react";
import React, {useContext} from 'react';
import { GlobalContext } from '../context/GlobalContext';

export default React.memo(function JsonEditor() {
  const {reqBody, setReqBody, appDataRef, selectedFileId} = useContext(GlobalContext);

  const onChangeHandler = (value, event) => {
    setReqBody(value)
    appDataRef.current[selectedFileId].reqBody = value;
  }

  return (
    <Editor
      options={{suggestOnTriggerCharacters: false}}
      defaultLanguage="json"
      onChange={onChangeHandler}
      value={reqBody}
    />
  );
})
