import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import "katex/dist/katex.min.css"; // KaTeX styles
import Latex from "react-latex-next"; // ✅ For LaTeX rendering

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
    marginTop: "20px",
  };

  // center the dropdown
  const dropdownStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  };

  // state to hold current code in editor
  const [code, setCode] = useState<string>("");

  // state to hold analysis result
  const [analysis, setAnalysis] = useState<string>("");

  // store the programming languages in an array
  const programmingLanguages: string[] = [
    "Python",
    "JavaScript",
    "TypeScript",
    "Java",
    "C#",
    "C++",
    "Objective-C",
    "Ruby",
    "PHP",
    "VB",
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(
    "Select Programming Language"
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setIsOpen(false);
  };

  // check if the button works for now
  const analyseCode = async () => {
    if (!code) {
      alert("Please enter some code to analyse!");
      return;
    }

    if (selectedLanguage === "Select Programming Language") {
      alert("Please select a programming language!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: selectedLanguage, // Include selected language in the request
        }),
      });

      if (!res.ok) {
        console.error("Failed to analyse code");
        return;
      }

      if (res.status === 429) {
        setAnalysis("Unable to analyse right now");
      }

      const data = await res.json();
      setAnalysis(data.analysis); // Save the result for rendering
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div style={appStyle}>
      <h1 style={titleStyle}>AlgoVision</h1>
      <h3 style={titleStyle}>Paste your algorithm here</h3>

      <div style={dropdownStyle}>
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
          >
            {selectedLanguage}
          </button>

          <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
            {programmingLanguages.map((language, index) => (
              <li key={index}>
                <button
                  className="dropdown-item"
                  onClick={() => handleLanguageSelect(language)}
                >
                  {language}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div style={editorStyle}>
        <CodeEditor
          onChange={setCode}
          language={
            selectedLanguage !== "Select Programming Language"
              ? selectedLanguage
              : "python"
          }
        />
      </div>

      <br />

      <div style={buttonStyle}>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={analyseCode}
        >
          Analyse
        </button>
      </div>

      {/* Display analysis with LaTeX rendering */}
      {analysis && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h2>Analysis Result</h2>

          {/* Render LaTeX for complexity */}

          <Latex>{analysis}</Latex>
        </div>
      )}
    </div>
  );
}

export default App;
