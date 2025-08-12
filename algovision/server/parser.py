from flask import Flask, request, jsonify
from flask_cors import CORS
import ast

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyse', methods=['POST'])
def analyse_code():
    data = request.get_json()
    code = data.get('code', '')

    try:
        tree = ast.parse(code)
        num_funcs = len([node for node in ast.walk(tree) if isinstance(node, ast.FunctionDef)])
        num_loops = len([node for node in ast.walk(tree) if isinstance(node, (ast.For, ast.While))])
        num_lines = len(code.splitlines())
        
        result = {
            "complexity": "TBD",  # Your complexity logic here
            "suggestions": [],
            "metrics": {
                "lines": num_lines,
                "functions": num_funcs,
                "loops": num_loops
            }
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
