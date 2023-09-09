import Editor from "@monaco-editor/react";
import React, { useRef, useState } from 'react';
import { Modal, message } from 'antd';
import { useDispatch, useSelector } from "react-redux";
import { getEnvVars, setEnvVars } from "../store/envDataSlice";

export default function EnvEditorModal({showEnvModal, closeEnvModal, open}) {
  const dispatch = useDispatch();
  const isContentValidRef = useRef(true);
  const jsonString = useSelector(getEnvVars);


  const envModalCloseHandler = () => {
    closeEnvModal();
  }

  const envModalSaveHandler = () => {
    try {
      const json = JSON.parse(jsonString);
      console.log(json)
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
    dispatch(setEnvVars(value));
  }

  return (
    <Modal width={'60%'} bodyStyle={{height: 500}} title="Env" open={open} okText='Save' onOk={envModalSaveHandler} onCancel={envModalCloseHandler}>
      <Editor
        options={{suggestOnTriggerCharacters: false}}
        defaultLanguage="json"
        onChange={onChangeHandler}
        value={jsonString}
        onValidate={handleEditorValidation}
      />
    </Modal>
  );
}

