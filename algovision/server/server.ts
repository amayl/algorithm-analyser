import express from 'express';
import cors from 'cors';

const app = express();

// Configure CORS properly
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // parse JSON bodies

app.post('/analyze', (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Fake analysis for demonstration
  const lines = code.split('\n').length;
  const functions = (code.match(/function\s+\w+/g) || []).length;
  const loops = (code.match(/for\s*\(|while\s*\(/g) || []).length;

  // Placeholder complexity calculation
  const complexity = "O(n)";

  const result = {
    complexity,
    suggestions: ["Add more comments", "Avoid deep nesting"],
    metrics: {
      lines,
      functions,
      loops,
    },
  };

  res.json(result);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});