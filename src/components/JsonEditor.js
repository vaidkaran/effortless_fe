import Editor from "@monaco-editor/react";
import React, {useRef, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";
import {setReqBody} from '../store/reqDataSlice';
import { getEnvVarsString, setEnvVarsString, getEnvVarsEditorAutoSuggestArray } from "../store/envDataSlice";

export default function JsonEditor() {
  const reqData = useSelector((state) => state.reqData);
  const dispatch = useDispatch();
  const completionItems = useSelector(getEnvVarsEditorAutoSuggestArray);
  const editorRef = useRef(null);

  const onChangeHandler = (value, event) => {
    dispatch(setReqBody(value));
  }
  
  useEffect(() => {
    if(editorRef.current) { // editorRef is set on editor mount which happens after useEffect
      const suggestions = (range) => (
        completionItems.map((item) => (
          {range, ...item}
        ))
      )

      editorRef.current.languages.registerCompletionItemProvider("json", {
        provideCompletionItems: function (model, position) {
          var word = model.getWordUntilPosition(position);
          var range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          };
          return {
            suggestions: suggestions(range)
          };
        },
      })
    }
  }, [completionItems])

  const onMountHandler = (editor, monaco) => {
    editorRef.current = monaco;
  }

  return (
    <Editor
      onMount={onMountHandler}
      height='80vh'
      options={{suggestOnTriggerCharacters: false}}
      defaultLanguage="json"
      onChange={onChangeHandler}
      value={reqData[reqData.selectedFileId].reqBody}
    />
  );
}
