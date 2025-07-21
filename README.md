# Work-Vibe

A personalized travel and workation web app that helps remote workers find ideal locations based on preferences and AI-curated suggestions.

## Features of Word-Vibe

- **AI Travel Assistant**: Users can enter natural language prompts to get smart city recommendations using Google Gemini API.
- **Prompt Curation**: Saves previous user queries and AI responses in Firestore for personalized future use.
- **For You Page**: Recommends new locations based on user’s history and unseen tags via a second Lambda function.
- **Favorites & Location Cards**: Users can favorite places and view details from a card-based UI.
- **Location Management**: Cities stored in Firestore with filters like vibes, climate, and internet quality.

## Tech Stack

| Frontend    | Backend     | Cloud / APIs      |
|-------------|-------------|-------------------|
| React       | Node.js     | Firebase Firestore|
| Tailwind CSS| AWS Lambda  | Google Gemini API |
| Firebase Auth| Serverless Framework | |


## Environment Variables

- Add `.env` files in `backend/`:
  
GEMINI_API_KEY=your_gemini_api_key
# Frontend
- cd Work-Vibe
- npm install
- npm start

# Backend
- cd gemini-lambda
- npm install
- serverless deploy


