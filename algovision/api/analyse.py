from starlette.responses import JSONResponse
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("API_KEY"))

async def handler(request):
    try:
        data = await request.json()
        code = data.get("code", "")

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

        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": input_text}],
            max_tokens=300,
            temperature=0
        )

        result = {"analysis": response.choices[0].message.content}
        return JSONResponse(result)

    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
