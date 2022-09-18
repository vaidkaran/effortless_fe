import Editor from "@monaco-editor/react";

export default function JsonEditor() {
  const onChangeHandler = (value, event) => {
    console.log('-->', value);
  }

  return (
    <Editor
      options={{suggestOnTriggerCharacters: false}}
      defaultLanguage="json"
      onChange={(onChangeHandler)}
    />
  );
}