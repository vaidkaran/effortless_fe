import Editor from "@monaco-editor/react";
import React, { useRef, useState, useEffect } from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getEnvVarsString, setEnvVarsString, getEnvVarsEditorAutoSuggestArray } from "../store/envDataSlice";

export default function EnvEditorModal({closeEnvModal, open}) {
  const dispatch = useDispatch();
  const isContentValidRef = useRef(true);
  const envVarsString = useSelector(getEnvVarsString);
  const [jsonString, setJsonString] = useState('');

  useEffect(() => {
    setJsonString(envVarsString)
  }, [open, envVarsString])


  const envModalCloseHandler = () => {
    closeEnvModal();
  }

  const envModalSaveHandler = () => {
    try {
      JSON.parse(jsonString);
      dispatch(setEnvVarsString(jsonString));
      closeEnvModal();
    } catch(err) {
      message.error('Invalid JSON')
    }
  }

  const handleEditorValidation = (marker) => {
    if (marker.length === 0) {
      isContentValidRef.current = true;
    } else {
      isContentValidRef.current = false;
    }
  }

  const onChangeHandler = (value) => {
    setJsonString(value);
  }

  return (
    <Modal width={'60%'} styles={{body: {height: 500}}} title="Env" open={open} okText='Save' onOk={envModalSaveHandler} onCancel={envModalCloseHandler}>
      <Editor
        options={{suggestOnTriggerCharacters: false, InsertAsSnippet: 'heyy'}}
        defaultLanguage="json"
        onChange={onChangeHandler}
        value={jsonString}
        onValidate={handleEditorValidation}
      />
    </Modal>
  );
}
