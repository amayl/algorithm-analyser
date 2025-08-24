from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyse', methods=['POST'])
def analyse_code():
    data = request.get_json()
    code = data.get('code', '')

    input_text = rf"""
You are a strict assistant that analyses code complexity.
Follow these rules:
1. Analyse the given code for Time Complexity and Space Complexity.
2. Output ONLY in the following format:
$$
\text{{Time Complexity: }} <your analysis>
$$
$$
\text{{Space Complexity: }} <your analysis>
$$

3. Use proper LaTeX notation for Big-O, e.g., \( O(n^2) \).
4. Do NOT include any extra text or explanation beyond this format.
5. If the code is invalid or ambiguous, respond with:
$$
\text{{Time Complexity: Unknown}}
$$
$$
\text{{Space Complexity: Unknown}}
$$

Here is the code to analyse:
{code}
"""



    try:
        client = OpenAI(api_key="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")
        response = client.responses.create(
            top_p=1,
            max_output_tokens=300,
            temperature=0,
            model="gpt-3.5-turbo",
            input=input_text
        )

        result = {
           "analysis": response.output_text
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
