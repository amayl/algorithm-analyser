from http.server import BaseHTTPRequestHandler
import json
from openai import OpenAI
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Set CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Read the request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            code = data.get("code", "")
            language = data.get("language", "")
            
            # Initialize OpenAI client
            client = OpenAI(api_key=os.getenv("API_KEY"))
            
            input_text = f"""
You are a strict assistant that analyses code complexity.
Follow these rules:
1. Analyse the given {language} code for Time Complexity and Space Complexity.
2. Output ONLY in the following format:
$$
\\text{{Time Complexity: }} O(your_complexity_here)
$$
$$
\\text{{Space Complexity: }} O(your_complexity_here)
$$

Reasoning:
<your reasoning>

Suggestions for optimisation:
<your suggestions for optimising>

3. Use proper LaTeX notation for Big-O, e.g., O(n^2).
4. Do NOT include any extra text or explanation beyond this format.
5. If the code is invalid or ambiguous, respond with:
$$
\\text{{Time Complexity: Unknown}}
$$
$$
\\text{{Space Complexity: Unknown}}
$$

Here is the {language} code to analyse:
{code}
"""
            
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": input_text}],
                max_tokens=500,
                temperature=0
            )
            
            result = {"analysis": response.choices[0].message.content}
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            error_response = {"error": str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_OPTIONS(self):
        # Handle preflight CORS requests
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()