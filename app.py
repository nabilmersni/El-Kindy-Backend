from flask import Flask, request, jsonify
import nltk
import random
from nltk.chat.util import Chat, reflections
from chatgpt import get_response 
app = Flask(__name__)
# Télécharger les données NLTK nécessaires
nltk.download('punkt')
nltk.download('wordnet')

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_input = data['message']
    response = get_response(user_input)  # Utilisez la fonction get_response pour obtenir une réponse
    return jsonify({'response': response})  # Retournez la réponse au format JSON

if __name__ == '__main__':
    app.run(debug=True)











