from flask import Flask, request, jsonify
from flask_cors import CORS  
import torch
import json
import numpy as np
from model import NeuralNet
from nltk_utils import bag_of_words, tokenize
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for debugging

# Load model and intents
FILE = "data.pth"
data = torch.load(FILE, map_location=torch.device("cpu"))

# Ensure necessary keys exist
required_keys = ["input_size", "hidden_size", "output_size", "model_state", "tags", "all_words"]
for key in required_keys:
    if key not in data:
        raise KeyError(f"Missing key in model data: {key}")

with open("newdata.json", "r") as f:
    intents = json.load(f)

# Model setup
device = torch.device("cpu")
model = NeuralNet(data["input_size"], data["hidden_size"], data["output_size"]).to(device)
model.load_state_dict(data["model_state"])
model.eval()

@app.route("/chat", methods=["POST"])
def chat():
    try:
        data_request = request.get_json()
        user_message = data_request.get("message", "").strip()

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Tokenize and process input
        sentence = tokenize(user_message)
        X = bag_of_words(sentence, data["all_words"])

        if np.sum(X) == 0:
            return jsonify({"bot": "I'm not sure I understand.", "video_embed": None})

        X = torch.from_numpy(X).float().unsqueeze(0).to(device)  # Ensure correct shape

        # Get chatbot response
        output = model(X)
        _, predicted = torch.max(output, dim=1)  # Use dim=1 for batch processing

        tag = data["tags"][predicted.item()]
        response_text = "Sorry, I didn't understand."
        video_embed = None  # Default value

        # Find the correct intent and check for video_embed
        for intent in intents["intents"]:
            if tag == intent["tag"]:
                response_text = intent["responses"][0]  # Pick the first response
                response_text = random.choice(intent["responses"])
                video_embed = intent.get("video_embed", None)  # 🔥 NEW: Get video embed

        return jsonify({"bot": response_text, "video_embed": video_embed})

    except Exception as e:
        print(f"Error: {e}")  # Print error for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
