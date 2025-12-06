# Integrated Medical AI System

A unified medical AI system that combines three powerful AI agents:

1. **Medical Conversation Agent** - General medical Q&A with empathetic responses
2. **Prescription Parser** - Extract medication details from prescription images
3. **Multi-Agent System** - Advanced analysis with RAG, web search, and image analysis

## Features

- 💬 **Intelligent Chat Interface** - Single unified UI for all AI agents
- 🤖 **Auto-Agent Selection** - Automatically routes queries to the best agent
- 🖼️ **Image Analysis** - Upload medical images, prescriptions, or X-rays
- 🎤 **Voice Input** - Speak your queries naturally
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🔒 **Privacy Focused** - Local processing where possible

## 🚀 Quick Deploy

### ⭐ Recommended: Deploy Everything to Vercel
Deploy both frontend and backend on **one platform**: [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)

### Alternative: Separate Platforms
- **Frontend (Netlify)** + **Backend (Render)**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Architecture

```
integrated-medical-ai/
├── backend/           # FastAPI backend server
│   ├── app.py        # Main application with all agents
│   └── requirements.txt
├── frontend/         # React + TypeScript frontend
│   ├── src/
│   │   ├── App.tsx   # Main chat interface
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
└── .env.example      # Environment configuration
```

## Setup Instructions

### Prerequisites

- Python 3.9+
- Node.js 18+
- Google AI API Key (for Gemini)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   venv\Scripts\activate  # On Windows
   # source venv/bin/activate  # On Mac/Linux
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```

5. Add your API keys to `.env`:
   ```
   GOOGLE_API_KEY=your_actual_api_key_here
   ```

6. Run the backend:
   ```bash
   python app.py
   ```

   Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

   Frontend will run on `http://localhost:3000`

## Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)

2. **Open your browser** to `http://localhost:3000`

3. **Select an agent** from the sidebar:
   - **Auto-Select**: Automatically chooses the best agent
   - **Medical Chat**: General medical conversations
   - **Prescription Parser**: Upload prescription images
   - **Advanced Analysis**: Research, web search, image analysis

4. **Ask questions** or **upload images** through the chat interface

## API Endpoints

- `POST /api/chat` - Main chat endpoint
  - Accepts: message, history, image (base64), agent_type
  - Returns: AI response with agent info

- `POST /api/prescription/parse` - Dedicated prescription parsing
  - Accepts: image (base64)
  - Returns: Parsed prescription data

- `POST /api/voice/command` - Voice command processing
  - Accepts: text
  - Returns: Parsed command intent

- `GET /api/health` - Health check

## Agent Details

### Medical Conversation Agent
- General medical Q&A
- Symptom analysis
- Health advice with disclaimers
- Empathetic responses

### Prescription Parser
- OCR from prescription images
- Extracts: medications, dosages, frequencies
- Structured JSON output
- Confidence scoring

### Multi-Agent System
- **RAG Agent**: Medical knowledge base queries
- **Web Search**: Latest research and news
- **Image Analysis**: Medical image interpretation (X-rays, MRIs, etc.)

## Security & Privacy

⚠️ **Important Disclaimers:**

- This is AI-generated content and should NOT replace professional medical advice
- Always consult healthcare professionals for medical decisions
- Do not share sensitive personal health information
- Images are processed in memory and not stored permanently

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide Icons
- React Markdown

**Backend:**
- FastAPI
- Google Generative AI (Gemini)
- Python 3.9+

## Development

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
```

**Backend:**
```bash
cd backend
# The FastAPI app is production-ready
# Deploy with: uvicorn app:app --host 0.0.0.0 --port 8000
```

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Verify API keys in `.env` file
- Ensure all dependencies are installed

### Frontend won't connect to backend
- Verify backend is running on port 8000
- Check CORS settings in backend
- Ensure proxy is configured in `vite.config.ts`

### Image upload issues
- Check image file size (max 5MB recommended)
- Ensure image format is supported (JPEG, PNG)
- Verify API key has proper permissions

## Contributing

This project integrates three separate AI systems. For improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See individual project licenses for component details

## Acknowledgments

Built by integrating:
- mediassist-ai
- prescriptionparse-mvp
- Periscope Digital Hackathon Team Opus

---

**Made with ❤️ for better healthcare AI**
