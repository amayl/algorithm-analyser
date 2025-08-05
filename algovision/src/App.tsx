import type React from "react";

function App() {
  // css stored in variables for the elements
  const titleStyle: React.CSSProperties = {
    textAlign: "center",
    fontFamily: "Helvetica, Arial, sans-serif",
    fontWeight: "bold",
    marginBottom: "1.5rem",
    letterSpacing: "0.5px",
  };

  return (
    <>
      <h1 style={titleStyle}>AlgoVision</h1>
      <h3 style={titleStyle}>Paste your algorithm here</h3>
    </>
  );
}

export default App;
