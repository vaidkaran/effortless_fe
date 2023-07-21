import Editor from "@monaco-editor/react";
import React, { useRef, useState } from 'react';
import { Modal, message } from 'antd';

// export default React.memo(function EnvEditor() {
export default function EnvEditorModal({showEnvModal, closeEnvModal, open}) {
  const [jsonValue, setJsonValue] = useState('');
  const isContentValidRef = useRef(true);


  const envModalCloseHandler = () => {
    closeEnvModal();
  }

  const envModalSaveHandler = () => {
    try {
      const json = JSON.parse(jsonValue);
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

  return (
    <Modal width={'60%'} bodyStyle={{height: 500}} title="Env" open={open} okText='Save' onOk={envModalSaveHandler} onCancel={envModalCloseHandler}>
      <Editor
        options={{suggestOnTriggerCharacters: false}}
        defaultLanguage="json"
        onChange={(value) => setJsonValue(value)}
        value={jsonValue}
        onValidate={handleEditorValidation}
      />
    </Modal>
  );
}

