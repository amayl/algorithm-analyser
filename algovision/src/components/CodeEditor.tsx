import { Editor } from "@monaco-editor/react";

function CodeEditor() {
  // handle the changes
  const handleEditorChange = (value: string | undefined) => {
    // log every single edit to the console for some reason
    console.log("Current value: ", value);
  };

  // editor config
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
  };

  return (
    // the big boy code editor itself
    <Editor
      width="700px"
      height="400px"
      defaultLanguage="python"
      theme="vs-light"
      onChange={handleEditorChange}
      options={editorOptions}
    />
  );
}

export default CodeEditor;
