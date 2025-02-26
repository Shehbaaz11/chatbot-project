import torch
import torch.nn as nn
import torch.optim as optim
import numpy as np
from model import NeuralNet
from nltk_utils import tokenize, stem, bag_of_words
import json

# Load intents file
with open("intents.json", "r") as f:
    intents = json.load(f)

all_words = []
tags = []
x_train = []
y_train = []

# Preprocess training data
for intent in intents["intents"]:
    tag = intent["tag"]
    tags.append(tag)
    for pattern in intent["patterns"]:
        words = tokenize(pattern)
        all_words.extend(words)
        x_train.append(words)
        y_train.append(tag)

# Stem and remove duplicates
ignore_words = ["?", "!", ",", "."]
all_words = sorted(set(stem(w) for w in all_words if w not in ignore_words))
tags = sorted(set(tags))

# Create training data
X_train = [bag_of_words(sentence, all_words) for sentence in x_train]
y_train = [tags.index(label) for label in y_train]
X_train = np.array(X_train)
y_train = np.array(y_train)

# Model parameters
input_size = len(X_train[0])
hidden_size = 8
output_size = len(tags)
model = NeuralNet(input_size, hidden_size, output_size)

# Training setup
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

epochs = 1000
for epoch in range(epochs):
    optimizer.zero_grad()
    output = model(torch.tensor(X_train, dtype=torch.float32))
    loss = criterion(output, torch.tensor(y_train, dtype=torch.long))
    loss.backward()
    optimizer.step()
    
    if (epoch + 1) % 100 == 0:
        print(f"Epoch [{epoch+1}/{epochs}], Loss: {loss.item():.4f}")

# Save trained model and data
print("Training complete. Saving model...")
data = {
    "model_state": model.state_dict(),
    "input_size": input_size,
    "hidden_size": hidden_size,
    "output_size": output_size,
    "all_words": all_words,
    "tags": tags
}
torch.save(data, "data.pth")
print("Model saved as data.pth")
