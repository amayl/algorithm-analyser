import { Editor } from "@monaco-editor/react";

interface CodeEditorProps {
  onChange: (value: string) => void;
  language?: string;
}

function CodeEditor({ onChange, language = "python" }: CodeEditorProps) {
  // handle the changes
  const handleEditorChange = (value: string | undefined) => {
    // log every single edit to the console for some reason
    console.log("Current value: ", value);
    onChange(value || "");
  };

  // editor config
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 14,
  };

  // Map dropdown language names to Monaco editor language identifiers
  const getMonacoLanguage = (selectedLanguage: string): string => {
    const languageMap: { [key: string]: string } = {
      Python: "python",
      JavaScript: "javascript",
      TypeScript: "typescript",
      Java: "java",
      "C#": "csharp",
      "C++": "cpp",
      "Objective-C": "objective-c",
      Ruby: "ruby",
      PHP: "php",
      VB: "vb",
    };

    return languageMap[selectedLanguage] || "python";
  };

  return (
    // the big boy code editor itself
    <Editor
      width="700px"
      height="400px"
      language={getMonacoLanguage(language)}
      theme="vs-dark"
      onChange={handleEditorChange}
      options={editorOptions}
    />
  );
}

export default CodeEditor;
