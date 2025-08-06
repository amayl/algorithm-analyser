import type React from "react";
import CodeEditor from "./components/CodeEditor";

function App() {
  // Dark theme app container
  const appStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "20px",
  };

  // css stored in variables for the elements
  // look at me im so smart
  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    letterSpacing: "0.5px",
    color: "#ffffff",
  };

  // make the code editor look pretty
  const editorStyle = {
    width: "700px",
    height: "400px",
    margin: "0 auto",
    border: "2px solid #404040",
    borderRadius: "8px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
    backgroundColor: "#2d2d2d",
  };

  // get that button in the middle
  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  return (
    <div style={appStyle}>
      <h1 style={titleStyle}>AlgoVision</h1>
      <h3 style={titleStyle}>Paste your algorithm here</h3>

      <div style={editorStyle}>
        <CodeEditor />
      </div>

      <br />

      <div style={buttonStyle}>
        <button type="button" className="btn btn-primary btn-lg">
          Analyse
        </button>
      </div>
    </div>
  );
}

export default App;
