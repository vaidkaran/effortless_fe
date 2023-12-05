import Editor from "@monaco-editor/react";
import React, {useRef, useEffect} from 'react';
import _ from 'lodash';
import { useDispatch, useSelector } from "react-redux";
import {setReqBody} from '../store/reqDataSlice';
import { getEnvVarsString, setEnvVarsString, getEnvVarsEditorAutoSuggestArray } from "../store/envDataSlice";
import { getSavedTestVarsEditorAutoSuggestArray, getReqBody } from "../store/reqDataSlice";
// import store from '../store/store';

export default function JsonEditor({jsonEditorDisposeRef, jsonEditorRef}) {
  const reqBody = useSelector(getReqBody);
  const dispatch = useDispatch();
  // const editorRef = useRef(null);
  const envVarsCompletionItems = useSelector(getEnvVarsEditorAutoSuggestArray);
  const testVarsCompletionItems = useSelector(getSavedTestVarsEditorAutoSuggestArray);

  useEffect(() => {
    // console.log("🚀 ~ file: JsonEditor.js:60 ~ JsonEditor ~ envVarsCompletionItems:", envVarsCompletionItems)

    // if(_.isEmpty(envVarsCompletionItems) && _.isEmpty(testVarsCompletionItems)) return;
      const completionItems = [...envVarsCompletionItems, ...testVarsCompletionItems];

      const suggestions = (range) => (
        completionItems.map((item) => (
          {range, ...item}
        ))
      )

      if (jsonEditorDisposeRef.current) {
        jsonEditorDisposeRef.current(); // invoke dispose fn
      }

    if(jsonEditorRef.current) { // editorRef is set on editor mount which happens after useEffect
      const {dispose} = jsonEditorRef.current.languages.registerCompletionItemProvider("json", {
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
      jsonEditorDisposeRef.current = dispose;

    }
  }, [jsonEditorRef, jsonEditorDisposeRef, envVarsCompletionItems, testVarsCompletionItems])

  const onChangeHandler = (value, event) => {
    dispatch(setReqBody(value));
  }
  
  const onMountHandler = (editor, monaco) => {
    jsonEditorRef.current = monaco;
  }

  return (
    <Editor
      onMount={onMountHandler}
      height='80vh'
      options={{suggestOnTriggerCharacters: false}}
      defaultLanguage="json"
      onChange={onChangeHandler}
      value={reqBody}
    />
  );
}
