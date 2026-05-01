import { useState, useEffect, useRef } from 'react';
import { useHealthData } from '../context/HealthDataContext';
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

function AIChat() {
  const { aiChatHistory, addChatMessage, clearChatHistory, getDisplayName } = useHealthData();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiChatHistory]);

  // Welcome message when chat opens and history is empty
  useEffect(() => {
    if (aiChatHistory.length === 0) {
      const welcomeMessage = {
        sender: 'ai',
        text: `Hi ${getDisplayName()}! I'm Teni, your health companion. I'm here to support you on your sickle cell journey. How are you feeling today?`,
        timestamp: new Date().toISOString()
      };
      addChatMessage(welcomeMessage);
    }
  }, [aiChatHistory.length, getDisplayName, addChatMessage]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      sender: 'user',
      text: inputText.trim(),
      timestamp: new Date().toISOString()
    };

    addChatMessage(userMessage);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // We pass the updated history (including the user message we just added)
        body: JSON.stringify({
          message: userMessage.text,
          chatHistory: [...aiChatHistory, userMessage],
          displayName: getDisplayName()
        }),
      });

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch (jsonError) {
            throw new Error(`HTTP ${response.status}: Server returned non-JSON error`);
          }
        } else {
          throw new Error(`HTTP ${response.status}: Server error`);
        }
        
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Server returned invalid JSON response');
      }
      
      const aiMessage = {
        sender: 'ai',
        text: data.response,
        timestamp: data.timestamp || new Date().toISOString()
      };

      addChatMessage(aiMessage);

    } catch (error) {
      console.error('Chat error:', error);
      
      if (error.message.includes('quota')) {
        toast.error('Daily AI limit reached. Please try again tomorrow.');
      } else if (error.message.includes('rate_limit')) {
        toast.error('Please wait a moment before sending another message.');
      } else if (error.message.includes('safety')) {
        toast.error('Message blocked. Please rephrase your question.');
      } else if (error.message.includes('configuration') || error.message.includes('config')) {
        toast.error('AI Service not configured. Please check API Key.');
      } else if (error.message.includes('Failed to fetch')) {
        toast.error('Connection error. Please check your internet and try again.');
      } else if (error.message.includes('JSON')) {
        toast.error('Server communication error. Please try again.');
      } else {
        toast.error(error.message || 'AI service unavailable. Please try again later.');
      }

      const errorMessage = {
        sender: 'ai',
        text: "I'm having trouble responding right now. Please try again in a moment, or feel free to continue journaling your health data.",
        timestamp: new Date().toISOString(),
        isError: true
      };
      addChatMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear your entire chat history?")) {
      clearChatHistory();
      toast.success('Chat history cleared');
    }
  };

  const quickPrompts = [
    "How can I manage my pain today?",
    "Tips for staying hydrated?",
    "What should be in my emergency kit?"
  ];

  const handleQuickPromptClick = (prompt) => {
    setInputText(prompt);
    // Optionally automatically send it or let user edit:
    // setInputText is sufficient to put it in the box. Focus the input:
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full pt-2 pb-6 px-2 sm:px-4 md:px-6 lg:px-8">
      <div className="glass-card flex flex-col h-full w-full shadow-2xl overflow-hidden rounded-[2.5rem] border border-white/40 bg-slate-50/30">
        
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-2xl px-6 py-4 flex justify-between items-center flex-shrink-0 border-b border-white/50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] z-10">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-primary-500/30">
                T
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-800 leading-tight tracking-tight">Teni</h3>
              <p className="text-sm text-primary-600 font-medium">AI Health Companion</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleClearChat}
              className="text-slate-400 hover:text-red-500 transition-colors p-3 rounded-full hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 flex items-center gap-2"
              title="Clear Chat History"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 relative">
          {aiChatHistory.map((message, index) => {
            const isUser = message.sender === 'user';
            return (
              <div
                key={index}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-secondary-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mr-3 flex-shrink-0 mt-auto mb-1">
                    T
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-5 py-3.5 text-[15px] leading-relaxed shadow-sm relative ${
                    isUser
                      ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-3xl rounded-br-sm'
                      : message.isError
                      ? 'bg-red-50 text-red-700 border border-red-100 rounded-3xl rounded-bl-sm'
                      : 'bg-white/90 backdrop-blur-md text-slate-800 border border-white/60 rounded-3xl rounded-bl-sm shadow-[0_4px_15px_rgb(0,0,0,0.03)]'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            );
          })}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-500 to-secondary-400 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm mr-3 flex-shrink-0 mt-auto mb-1">
                T
              </div>
              <div className="bg-white/90 backdrop-blur-md border border-white/60 text-slate-800 px-5 py-4 rounded-3xl rounded-bl-sm shadow-[0_4px_15px_rgb(0,0,0,0.03)] text-sm relative">
                <div className="flex space-x-1.5 items-center h-4">
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts & Input */}
        <div className="relative flex-shrink-0 px-4 sm:px-8 pb-6 pt-2">
          {/* Quick Prompts */}
          {aiChatHistory.length < 3 && (
            <div className="flex flex-wrap gap-2 mb-4 justify-center">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickPromptClick(prompt)}
                  className="bg-white/80 backdrop-blur-md border border-primary-100 text-primary-700 hover:bg-primary-50 hover:border-primary-300 text-[13px] font-medium px-4 py-2 rounded-full transition-all shadow-[0_4px_10px_rgb(0,0,0,0.03)] hover:shadow-[0_6px_15px_rgb(0,0,0,0.06)] hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="relative bg-white/90 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-[2rem] p-2 flex items-end">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Teni..."
              className="flex-1 px-5 py-3.5 bg-transparent focus:outline-none text-[15px] text-slate-700 resize-none min-h-[52px] max-h-[120px] placeholder-slate-400"
              disabled={isLoading}
              rows="1"
              aria-label="Type your message to Teni"
              style={{ overflow: 'hidden' }}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="bg-gradient-to-r from-primary-600 to-secondary-500 hover:opacity-90 disabled:opacity-50 disabled:from-slate-300 disabled:to-slate-300 disabled:shadow-none text-white rounded-full transition-all shadow-[0_4px_15px_rgb(177,45,83,0.3)] hover:shadow-[0_8px_20px_rgb(177,45,83,0.4)]
                         focus:outline-none focus:ring-4 focus:ring-primary-200
                         w-[44px] h-[44px] flex items-center justify-center hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0 mb-1 mr-1"
              aria-label="Send message to Teni"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="text-center text-[11px] font-medium text-slate-400 mt-3 tracking-wide uppercase">
            Teni is an AI assistant. Not for medical diagnosis.
          </p>
        </div>

      </div>
    </div>
  );
}

export default AIChat;



