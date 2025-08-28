import React, { useState } from "react";
import CodeEditor from "./components/CodeEditor";
import "katex/dist/katex.min.css";
import Latex from "react-latex-next";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const appStyle: React.CSSProperties = {
    minHeight: "100vh",
    backgroundColor: "#1a1a1a",
    color: "#ffffff",
    padding: "20px",
  };

  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    color: "#ffffff",
  };

  const editorStyle = {
    width: "700px",
    height: "400px",
    margin: "0 auto",
    border: "2px solid #404040",
    borderRadius: "8px",
    backgroundColor: "#2d2d2d",
  };

  const buttonStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
  };

  const dropdownStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  };

  const [code, setCode] = useState<string>("");
  const [analysis, setAnalysis] = useState<string>("");
  const [complexityFunction, setComplexityFunction] = useState<string>("");

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
          language: selectedLanguage,
        }),
      });

      if (!res.ok) {
        console.error("Failed to analyse code");
        return;
      }

      const data = await res.json();
      setAnalysis(data.analysis);

      // ✅ Extract Big-O notation from GPT output
      const match = data.analysis.match(/O\((.*?)\)/);
      if (match) {
        setComplexityFunction(match[1]); // e.g., n^2, log n
      } else {
        setComplexityFunction(""); // Reset if not found
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // ✅ Generate data for complexity graph
  const inputSizes = [10, 100, 500, 1000, 2000];
  const computeComplexity = (func: string, n: number) => {
    if (!func) return 0;
    if (func.includes("n^2")) return n ** 2;
    if (func.includes("n^3")) return n ** 3;
    if (func.includes("log n")) return Math.log2(n);
    if (func.includes("n log n")) return n * Math.log2(n);
    if (func.includes("n")) return n;
    return n; // Default linear
  };

  const complexityData = inputSizes.map((n) =>
    computeComplexity(complexityFunction, n)
  );

  const chartData = {
    labels: inputSizes.map((n) => `n=${n}`),
    datasets: [
      {
        label: `Time Complexity: O(${complexityFunction || "?"})`,
        data: complexityData,
        borderColor: "#4cafef",
        backgroundColor: "rgba(76, 175, 239, 0.3)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
      },
      y: {
        ticks: { color: "#fff" },
      },
    },
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

      {/* Analysis Card */}
      {analysis && (
        <div
          className="card"
          style={{
            marginTop: "30px",
            marginLeft: "auto",
            marginRight: "auto",
            maxWidth: "700px",
            backgroundColor: "#2d2d2d",
            color: "#ffffff",
            border: "1px solid #404040",
            borderRadius: "12px",
          }}
        >
          <div className="card-body">
            <h2 className="card-title text-center">Analysis Result</h2>
            <div
              style={{ fontSize: "1rem", lineHeight: "1.6", color: "#d1d1d1" }}
            >
              <Latex>{analysis}</Latex>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Complexity Graph */}
      {complexityFunction && (
        <div style={{ marginTop: "30px", maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ textAlign: "center" }}>Complexity Growth</h2>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default App;
