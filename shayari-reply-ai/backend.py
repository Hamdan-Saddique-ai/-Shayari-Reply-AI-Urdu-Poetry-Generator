"""
Shayari Reply AI - Backend API
Requires: pip install flask flask-cors openai python-dotenv
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_shayari_prompt(user_input, mood, style, emoji_mode):
    mood_map = {
        "auto": "understand and match the mood automatically",
        "sad": "express deep sadness and melancholy",
        "love": "express passionate love and romance",
        "angry": "express anger and disappointment",
        "motivational": "inspire and motivate the user"
    }
    
    return f"""You are a professional Urdu poet (Shayar). Convert the user's sentence into meaningful, emotional Urdu shayari.

User sentence: "{user_input}"
Mood: {mood_map.get(mood, 'match naturally')}
Style: {style}

Requirements:
1. Write 2-4 lines of beautiful Urdu poetry
2. Must match the mood and essence of user's input
3. Use simple but deep Urdu words
4. Add rhyme (qafiya and radif) if possible
5. Make it emotional, human-like, and natural
6. {'Add 1-2 relevant emojis at the end' if emoji_mode else 'No emojis'}
7. Respond ONLY with the shayari text, no explanations or extra text

Example format (Urdu script):
دل کے در پہ تیری یادوں کا کارواں ہے،
ہر شام تیرے نام سے روشن ہے۔
تو نے جو چھوا ہے اپنی وفا سے،
ہر زخم پہ اب ایک نیا جہاں ہے۔
"""

@app.route('/api/generate', methods=['POST'])
def generate_shayari():
    try:
        data = request.json
        user_input = data.get('input', '')
        mood = data.get('mood', 'auto')
        style = data.get('style', 'romantic')
        emoji_mode = data.get('emoji', True)
        
        if not user_input:
            return jsonify({'error': 'Input is required'}), 400
        
        # Generate prompt
        prompt = generate_shayari_prompt(user_input, mood, style, emoji_mode)
        
        # Call OpenAI API
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a professional Urdu poet and shayari writer. Write only in Urdu script."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=200
        )
        
        shayari = response.choices[0].message.content.strip()
        
        return jsonify({
            'success': True,
            'shayari': shayari,
            'input': user_input,
            'mood': mood,
            'style': style
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'message': 'Shayari AI is running!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)