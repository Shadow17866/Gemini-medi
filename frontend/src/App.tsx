import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send, Image as ImageIcon, Mic, Menu, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// Types
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agent?: string;
  image?: string;
  requiresValidation?: boolean;
}

interface ApiResponse {
  success: boolean;
  response: string;
  agent?: string;
  error?: string;
  requires_validation?: boolean;
  data?: any;
}

// Agent configurations
const AGENTS = [
  { id: 'auto', name: 'Auto-Select', icon: '🤖', description: 'Automatically selects the best agent' },
  { id: 'medical-chat', name: 'Medical Chat', icon: '💬', description: 'General medical conversations' },
  { id: 'prescription', name: 'Prescription Parser', icon: '💊', description: 'Parse prescription images' },
  { id: 'multi-agent', name: 'Advanced Analysis', icon: '🔬', description: 'RAG, Web Search & Image Analysis' }
];

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '# Welcome to Integrated Medical AI System\n\nI combine three powerful AI systems to assist you:\n\n**💬 Medical Conversation Agent** - Answer medical questions with empathy and accuracy\n\n**💊 Prescription Parser** - Extract medication details from prescription images\n\n**🔬 Advanced Multi-Agent System** - Medical research, web search, and image analysis\n\n---\n\n**How can I help you today?**',
      timestamp: new Date(),
      agent: 'System'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Toggle voice input
  const toggleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if ((!inputText.trim() && !selectedImage) || isLoading) return;

    const userMessageId = uuidv4();
    const userMessage: Message = {
      id: userMessageId,
      role: 'user',
      content: inputText.trim() || 'Analyze this image',
      timestamp: new Date(),
      image: imagePreview || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    const currentImage = imagePreview;
    removeImage();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages.slice(-10).map(m => ({
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
            agent: m.agent
          })),
          image: currentImage,
          agent_type: selectedAgent
        })
      });

      const data: ApiResponse = await response.json();

      if (data.success) {
        const assistantMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          agent: data.agent,
          requiresValidation: data.requires_validation
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        const errorMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `❌ Error: ${data.error || 'Failed to process request'}`,
          timestamp: new Date(),
          agent: 'System'
        };
        setMessages(prev => [...prev, errorMessage]);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: '❌ Failed to connect to the server. Please ensure the backend is running.',
        timestamp: new Date(),
        agent: 'System'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">Medical AI</h1>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden text-white hover:bg-white/20 p-2 rounded"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-blue-100 text-sm mt-2">Integrated AI Assistant</p>
          </div>

          {/* Agent Selection */}
          <div className="p-6 border-b">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Select Agent</h2>
            <div className="space-y-2">
              {AGENTS.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedAgent === agent.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{agent.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{agent.name}</div>
                      <div className="text-xs text-gray-600 mt-1">{agent.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="p-6 flex-1 overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Features</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Medical conversations & advice</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Prescription image parsing</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Medical image analysis</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Web search for latest research</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>RAG-based knowledge retrieval</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden mr-4 p-2 hover:bg-gray-100 rounded"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {AGENTS.find(a => a.id === selectedAgent)?.name || 'Chat'}
              </h2>
              <p className="text-sm text-gray-500">
                {AGENTS.find(a => a.id === selectedAgent)?.description}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border shadow-sm'
                }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="rounded mb-2 max-w-xs"
                  />
                )}
                
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}

                <div className={`flex items-center justify-between mt-2 text-xs ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  <span>{message.agent && `${message.agent} • `}{message.timestamp.toLocaleTimeString()}</span>
                  {message.requiresValidation && (
                    <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                      Review Recommended
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border shadow-sm rounded-lg p-4 flex items-center space-x-3">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-gray-600">Processing...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t bg-white p-4">
          {imagePreview && (
            <div className="mb-3 relative inline-block">
              <img src={imagePreview} alt="Preview" className="rounded-lg max-h-32" />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={16} />
              </button>
            </div>
          )}
          
          <div className="flex items-end space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="p-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Attach image"
            >
              <ImageIcon size={20} />
            </button>
            
            <button
              onClick={toggleVoiceInput}
              disabled={isLoading}
              className={`p-3 rounded-lg transition-colors disabled:opacity-50 ${
                isListening ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
              title="Voice input"
            >
              <Mic size={20} />
            </button>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a medical question or describe symptoms..."
              disabled={isLoading}
              className="flex-1 resize-none border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              rows={1}
              style={{ minHeight: '50px', maxHeight: '150px' }}
            />
            
            <button
              onClick={handleSendMessage}
              disabled={isLoading || (!inputText.trim() && !selectedImage)}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Send message"
            >
              <Send size={20} />
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            AI-generated responses may contain errors. Always consult healthcare professionals.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
