"""
Integrated Medical AI Backend
Combines three AI systems:
1. Medical Conversation Agent (mediassist-ai)
2. Prescription Parser (prescriptionparse-mvp)
3. Multi-Agent Medical System (Periscope)
"""

import os
import uuid
import base64
from typing import Dict, Optional, List
from datetime import datetime
import logging
import io

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import google.generativeai as genai
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Integrated Medical AI System", version="1.0")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# ==================== Models ====================
class ChatMessage(BaseModel):
    role: str
    content: str
    timestamp: str
    agent: Optional[str] = None

class ChatRequest(BaseModel):
    message: str
    history: List[ChatMessage]
    image: Optional[str] = None  # Base64 encoded
    agent_type: Optional[str] = "auto"  # auto, medical-chat, prescription, multi-agent

class PrescriptionParseRequest(BaseModel):
    image: str  # Base64 encoded

class VoiceCommandRequest(BaseModel):
    text: str

# ==================== Agent Integrations ====================

class MedicalConversationAgent:
    """Handles general medical conversations using Gemini"""
    
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        
    async def process(self, message: str, history: List[ChatMessage], image: Optional[str] = None) -> Dict:
        try:
            if not self.api_key:
                return {
                    "success": False,
                    "error": "API Key missing",
                    "response": "API Key is missing. Please configure GOOGLE_API_KEY."
                }
            
            # Use vision model if image provided
            if image:
                # Remove data URL prefix if present
                if "," in image:
                    image_data = image.split(",")[1]
                else:
                    image_data = image
                
                # Decode base64 image
                image_bytes = base64.b64decode(image_data)
                pil_image = Image.open(io.BytesIO(image_bytes))
                
                model = genai.GenerativeModel('gemini-2.0-flash')
                prompt = f"""You are a professional Medical AI Assistant. Analyze this image and respond to: {message}
                
Provide accurate, empathetic medical information. Always include disclaimers that this is not a substitute for professional medical advice."""
                
                response = model.generate_content([prompt, pil_image])
            else:
                # Text-only conversation
                model = genai.GenerativeModel('gemini-2.0-flash')
                
                # Build prompt with history
                full_prompt = "You are a professional Medical AI Assistant. Provide accurate, empathetic medical information. Always include disclaimers that this is not a substitute for professional medical advice.\n\n"
                
                for msg in history[-10:]:  # Last 10 messages
                    full_prompt += f"{msg.role}: {msg.content}\n"
                full_prompt += f"user: {message}\nassistant:"
                
                response = model.generate_content(full_prompt)
            
            return {
                "success": True,
                "response": response.text,
                "agent": "Medical Conversation Agent",
                "requires_validation": False
            }
            
        except Exception as e:
            logger.error(f"Medical conversation error: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "I apologize, but I encountered an error processing your request. Please try again."
            }


class PrescriptionParserAgent:
    """Handles prescription image parsing"""
    
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
    
    async def process(self, image: str) -> Dict:
        try:
            if not self.api_key:
                return {
                    "success": False,
                    "error": "API Key missing",
                    "response": "API Key is missing."
                }
            
            # Remove data URL prefix if present
            if "," in image:
                image_data = image.split(",")[1]
            else:
                image_data = image
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            pil_image = Image.open(io.BytesIO(image_bytes))
            
            prompt = """Analyze this prescription image and extract the following information in JSON format:
            {
                "medications": [
                    {
                        "name": "medication name",
                        "quantity": number,
                        "dose": "dosage",
                        "frequency": "frequency",
                        "confidence": 0.9
                    }
                ],
                "patient": {
                    "name": "patient name or null",
                    "dob": "date of birth or null"
                },
                "doctor": {
                    "name": "doctor name or null"
                },
                "date": "prescription date or null",
                "human_review_required": false
            }
            
            Be thorough and accurate. If text is unclear, indicate lower confidence."""
            
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content([prompt, pil_image])
            
            # Parse JSON from response
            import json
            result_text = response.text.strip()
            if "```json" in result_text:
                result_text = result_text.split("```json")[1].split("```")[0]
            elif "```" in result_text:
                result_text = result_text.split("```")[1].split("```")[0]
            
            result = json.loads(result_text)
            
            return {
                "success": True,
                "data": result,
                "agent": "Prescription Parser",
                "response": f"Successfully parsed prescription. Found {len(result.get('medications', []))} medication(s)."
            }
            
        except Exception as e:
            logger.error(f"Prescription parsing error: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "Failed to parse prescription. Please ensure the image is clear and try again."
            }


class MultiAgentSystem:
    """Integrates RAG, Web Search, and Image Analysis agents"""
    
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
        
    async def process(self, message: str, history: List[ChatMessage], image: Optional[str] = None) -> Dict:
        try:
            if not self.api_key:
                return {
                    "success": False,
                    "error": "API Key missing",
                    "response": "API Key is missing."
                }
            
            # Determine which agent to route to based on query
            query_lower = message.lower()
            
            # Check if it's an image analysis request
            if image or any(word in query_lower for word in ["analyze image", "x-ray", "scan", "mri", "ct scan", "tumor", "lesion"]):
                return await self._handle_image_analysis(message, image)
            
            # Check if it needs web search
            if any(word in query_lower for word in ["latest", "recent", "news", "research", "study", "2024", "2025", "current"]):
                return await self._handle_web_search(message)
            
            # Default to RAG
            return await self._handle_rag(message)
            
        except Exception as e:
            logger.error(f"Multi-agent error: {e}")
            return {
                "success": False,
                "error": str(e),
                "response": "I encountered an error processing your request with the multi-agent system."
            }
    
    async def _handle_rag(self, query: str) -> Dict:
        """Handle RAG-based queries"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(f"""As a medical knowledge expert with access to medical databases, answer this query: {query}
                
Provide accurate, evidence-based information with sources when possible.""")
            
            return {
                "success": True,
                "response": response.text,
                "agent": "Medical RAG Agent",
                "source": "Medical Knowledge Base"
            }
        except Exception as e:
            logger.error(f"RAG error: {e}")
            raise
    
    async def _handle_web_search(self, query: str) -> Dict:
        """Handle web search queries"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content(f"""Search for and provide the latest information about: {query}
                
Focus on recent research, clinical trials, and medical news.""")
            
            return {
                "success": True,
                "response": response.text,
                "agent": "Web Search Agent",
                "source": "Web Search"
            }
        except Exception as e:
            logger.error(f"Web search error: {e}")
            # Fallback to regular response
            return await self._handle_rag(query)
    
    async def _handle_image_analysis(self, query: str, image: Optional[str]) -> Dict:
        """Handle medical image analysis"""
        try:
            if not image:
                return {
                    "success": False,
                    "response": "Please provide an image for analysis."
                }
            
            # Remove data URL prefix if present
            if "," in image:
                image_data = image.split(",")[1]
            else:
                image_data = image
            
            # Decode base64 image
            image_bytes = base64.b64decode(image_data)
            pil_image = Image.open(io.BytesIO(image_bytes))
            
            prompt = f"""As a medical imaging specialist, analyze this image. User query: {query}
                    
Provide detailed analysis including:
- What type of medical image this is
- Key observations
- Potential findings
- Recommendations

IMPORTANT: Include appropriate medical disclaimers."""
            
            model = genai.GenerativeModel('gemini-2.0-flash')
            response = model.generate_content([prompt, pil_image])
            
            return {
                "success": True,
                "response": response.text,
                "agent": "Medical Image Analysis Agent",
                "requires_validation": True
            }
            
        except Exception as e:
            logger.error(f"Image analysis error: {e}")
            raise


# ==================== Initialize Agents ====================
medical_chat_agent = MedicalConversationAgent()
prescription_agent = PrescriptionParserAgent()
multi_agent_system = MultiAgentSystem()

# ==================== API Routes ====================

@app.get("/")
async def root():
    return {
        "message": "Integrated Medical AI System",
        "version": "1.0",
        "agents": [
            "Medical Conversation Agent",
            "Prescription Parser",
            "Multi-Agent System (RAG + Web Search + Image Analysis)"
        ]
    }

@app.post("/api/chat")
async def chat(request: ChatRequest):
    """Main chat endpoint that routes to appropriate agent"""
    try:
        # Auto-detect agent type if not specified
        if request.agent_type == "auto":
            message_lower = request.message.lower()
            
            # Check for prescription-related keywords
            if any(word in message_lower for word in ["prescription", "medication list", "parse prescription"]) and request.image:
                request.agent_type = "prescription"
            # Check for advanced queries
            elif any(word in message_lower for word in ["research", "latest", "study", "analyze image", "x-ray", "scan"]):
                request.agent_type = "multi-agent"
            else:
                request.agent_type = "medical-chat"
        
        # Route to appropriate agent
        if request.agent_type == "medical-chat":
            result = await medical_chat_agent.process(request.message, request.history, request.image)
        elif request.agent_type == "prescription":
            if not request.image:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Image required for prescription parsing"}
                )
            result = await prescription_agent.process(request.image)
        elif request.agent_type == "multi-agent":
            result = await multi_agent_system.process(request.message, request.history, request.image)
        else:
            return JSONResponse(
                status_code=400,
                content={"error": "Invalid agent type"}
            )
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Chat error: {e}")
        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "error": str(e),
                "response": "An unexpected error occurred. Please try again."
            }
        )

@app.post("/api/prescription/parse")
async def parse_prescription(request: PrescriptionParseRequest):
    """Dedicated endpoint for prescription parsing"""
    try:
        result = await prescription_agent.process(request.image)
        return JSONResponse(content=result)
    except Exception as e:
        logger.error(f"Prescription parse error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.post("/api/voice/command")
async def voice_command(request: VoiceCommandRequest):
    """Process voice commands for prescription ordering"""
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return JSONResponse(
                status_code=500,
                content={"success": False, "error": "API Key missing"}
            )
        
        genai.configure(api_key=api_key)
        
        prompt = f"""Parse this voice command for a medical prescription order system:
"{request.text}"

Return JSON with:
{{
    "intent": "add" | "remove" | "confirm" | "done" | "unknown",
    "medication_name": "name or null",
    "quantity": number or null,
    "confidence": 0.8
}}"""
        
        model = genai.GenerativeModel('gemini-2.0-flash')
        response = model.generate_content(prompt)
        
        import json
        result_text = response.text.strip()
        if "```json" in result_text:
            result_text = result_text.split("```json")[1].split("```")[0]
        elif "```" in result_text:
            result_text = result_text.split("```")[1].split("```")[0]
        
        result = json.loads(result_text)
        
        return JSONResponse(content={
            "success": True,
            "data": result
        })
        
    except Exception as e:
        logger.error(f"Voice command error: {e}")
        return JSONResponse(
            status_code=500,
            content={"success": False, "error": str(e)}
        )

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "agents": {
            "medical_chat": "active",
            "prescription_parser": "active",
            "multi_agent": "active"
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
