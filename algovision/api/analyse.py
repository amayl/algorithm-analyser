import json
import os
from openai import OpenAI

def handler(request):
    # Handle CORS preflight
    if request.method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            'body': ''
        }
    
    if request.method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        # Parse request body
        if hasattr(request, 'body'):
            body = request.body
        else:
            body = request.get_body()
            
        if isinstance(body, bytes):
            body = body.decode('utf-8')
        
        data = json.loads(body)
        code = data.get("code", "")
        language = data.get("language", "")
        
        if not code:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                'body': json.dumps({'error': 'No code provided'})
            }
        
        # Initialize OpenAI client
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return {
                'statusCode': 500,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json',
                },
                'body': json.dumps({'error': 'OpenAI API key not configured'})
            }
            
        client = OpenAI(api_key=api_key)
        
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
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps(result)
        }
        
    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'error': 'Invalid JSON in request body'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json',
            },
            'body': json.dumps({'error': f'Server error: {str(e)}'})
        }