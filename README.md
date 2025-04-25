# Medexa - Medical Device Assistant Chatbot

Medexa is an AI-powered chatbot designed to provide information about medical devices and equipment. It can answer questions, provide explanations, and show instructional videos to help users understand how various medical devices work.

## Features

- **Interactive Chat Interface**: Ask questions about medical devices and get detailed responses
- **Video Demonstrations**: Watch instructional videos for certain medical devices
- **User Authentication**: Register and login to save your chat history
- **Voice Input**: Use speech recognition to ask questions
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

### Frontend
- Next.js
- React
- CSS
- JavaScript

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication

### AI/ML
- Python
- Flask
- PyTorch
- NLTK

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Python (v3.8 or higher)
- MongoDB

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/medexa.git
   cd medexa
   ```

2. Install frontend dependencies
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies
   ```
   cd ../backend
   npm install
   ```

4. Install Python dependencies
   ```
   pip install -r requirements.txt
   ```

5. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     DB_CONNECT=mongodb://localhost:27017/chatbot
     JWT_SECRET=your_jwt_secret
     ```

### Running the Application

1. Start the MongoDB server
   ```
   mongod
   ```

2. Start the backend server
   ```
   cd backend
   node server.js
   ```

3. Start the Flask API
   ```
   python api.py
   ```

4. Start the frontend development server
   ```
   cd frontend
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`
<<<<<<< HEAD

## Usage
=======
 Usage
>>>>>>> 9f86634aecd312762b381de48b4f3d183051146c

- **Guest Mode**: Click "Start Chat as Guest" to use the chatbot without logging in
- **Register**: Create an account to save your chat history
- **Login**: Access your saved chat history
- **Ask Questions**: Type your question about medical devices in the chat input
- **Voice Input**: Click the microphone button to use speech recognition
- **View History**: Click the menu button to view your chat history

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Medical device information sourced from reputable medical resources
- Video content from educational medical channels
