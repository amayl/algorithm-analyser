from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/analyse', methods=['POST'])
def analyse_code():
    data = request.get_json()
    code = data.get('code', '')

    try:
        client = OpenAI(api_key="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")
        response = client.responses.create(
            model="gpt-4o",
            input=f"give me an analysis of the time and space complexity of this following code:\n {code}"
        )

        result = {
           response
        }
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
