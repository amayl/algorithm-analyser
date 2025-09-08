from openai import OpenAI
import os
import json

def handler(request, response):
    if request.method != "POST":
        return response.status(405).json({"error": "Method not allowed"})

    try:
        data = request.json()
        code = data.get("code", "")
        language = data.get("language", "")

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

        Reasoning:
        <your reasoning>

        Suggestions for optimisation:
        <your suggestions for optimising>

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

        client = OpenAI(api_key=os.getenv("API_KEY"))
        response_openai = client.responses.create(
            model="gpt-3.5-turbo",
            input=input_text,
            temperature=0,
            top_p=1,
            max_output_tokens=300
        )

        return response.status(200).json({
            "analysis": response_openai.output_text
        })

    except Exception as e:
        return response.status(500).json({"error": str(e)})
