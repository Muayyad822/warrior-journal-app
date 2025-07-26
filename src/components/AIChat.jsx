import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast'; 
import { useHealthData } from '../context/HealthDataContext';

function AIChat() {
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking'); // 'checking', 'ready', 'fallback'
  const { getDisplayName } = useHealthData();

  const messagesEndRef = useRef(null);

  // API endpoint configuration
  const API_BASE_URL = import.meta.env.VITE_API_URL || '';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Check API health
  useEffect(() => {
    async function checkApiHealth() {
      try {
        // Check if we're in development or production
        const healthEndpoint = API_BASE_URL ? `${API_BASE_URL}/api/health` : '/api/health';
        
        const response = await fetch(healthEndpoint);
        if (response.ok) {
          setApiStatus('ready');
          toast.success('AI chat service ready!', { id: 'api-check' });
        } else {
          throw new Error('API health check failed');
        }
      } catch (error) {
        console.warn('API not available, using fallback responses:', error);
        setApiStatus('fallback');
        toast.success('Health companion ready with smart responses!', { id: 'api-check' });
      }
    }
    
    checkApiHealth();
  }, []);

  // Enhanced intent-based response system
  const getSmartHealthResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    const displayName = getDisplayName();
    
    // More sophisticated keyword matching
    const painKeywords = ['pain', 'hurt', 'ache', 'crisis', 'episode', 'severe', 'unbearable'];
    const medicationKeywords = ['medication', 'medicine', 'pills', 'dose', 'prescription', 'hydroxyurea'];
    const emotionalKeywords = ['scared', 'worried', 'anxious', 'depressed', 'alone', 'frustrated'];
    
    const painScore = painKeywords.filter(word => message.includes(word)).length;
    const medScore = medicationKeywords.filter(word => message.includes(word)).length;
    const emotionalScore = emotionalKeywords.filter(word => message.includes(word)).length;
    
    // Multi-topic responses
    if (painScore > 0 && emotionalScore > 0) {
      return `I understand you're dealing with both physical pain and emotional stress, ${displayName}. This combination is really challenging. For immediate pain relief, follow your crisis plan and consider your prescribed medications. For the emotional aspect, try deep breathing or reach out to your support network. You're incredibly strong for managing both. 💙`;
    }
    
    if (painScore > 0 && medScore > 0) {
      return `Managing pain with medications requires careful balance, ${displayName}. Track your pain levels (1-10) and medication timing in your journal. If pain persists above 7/10 despite medication, contact your healthcare provider. Remember to stay hydrated and rest. Your proactive approach to pain management is commendable. 🩺`;
    }
    
    if (painScore > 0) {
      return `I understand you're experiencing pain, ${displayName}. Remember to follow your crisis action plan, stay hydrated, and don't hesitate to contact your healthcare provider if the pain is severe (8/10 or higher). You're stronger than you know, and this will pass. 💙`;
    }
    
    if (message.includes('medication') || message.includes('medicine') || message.includes('pills')) {
      return `Managing medications can be challenging, ${displayName}. Use your daily journal to track medications and any side effects. Always take them as prescribed and discuss any concerns with your healthcare team. Consistency is key to managing your health effectively.`;
    }
    
    if (message.includes('hydration') || message.includes('water') || message.includes('drink')) {
      return `Great question about hydration! Staying well-hydrated is crucial for managing sickle cell disease. Aim for 8-10 glasses of water daily, and increase during hot weather or activity. Track your hydration in your daily journal - your body will thank you! 💧`;
    }
    
    if (message.includes('stress') || message.includes('anxiety') || message.includes('worried') || message.includes('scared')) {
      return `It's completely normal to feel stressed or anxious about your health, ${displayName}. Consider deep breathing exercises, gentle meditation, or talking to someone you trust. Remember, you're not alone in this journey - your healthcare team and support network are here for you. 🌟`;
    }
    
    if (message.includes('exercise') || message.includes('activity') || message.includes('workout')) {
      return `Physical activity can be beneficial when done safely! Gentle exercises like walking, swimming, or stretching can improve circulation and mood. Always listen to your body and consult your healthcare provider about what activities are right for you. Start slow and build gradually.`;
    }
    
    if (message.includes('tired') || message.includes('fatigue') || message.includes('exhausted')) {
      return `Fatigue is common with chronic conditions, ${displayName}. Prioritize quality sleep (7-9 hours), pace your activities, and don't feel guilty about resting when needed. Your body is working hard, and rest is part of healing. Track your energy levels in your journal.`;
    }
    
    if (message.includes('food') || message.includes('diet') || message.includes('nutrition')) {
      return `Nutrition plays a vital role in managing your health! Focus on whole foods, plenty of fruits and vegetables, and foods rich in folic acid. Stay hydrated and consider discussing any dietary concerns with a nutritionist familiar with sickle cell disease.`;
    }
    
    if (message.includes('support') || message.includes('help') || message.includes('alone')) {
      return `You're never alone in this journey, ${displayName}. This app is here to support you, and there are many resources available - from healthcare teams to support groups to family and friends. Reaching out shows strength, not weakness. You're doing great by taking charge of your health! 🛡️`;
    }
    
    // General supportive responses
    const supportiveResponses = [
      `Thank you for sharing that with me, ${displayName}. Managing your health journey takes courage and strength. I'm here to provide support and information. What would you like to know more about?`,
      `I'm here to help support your wellness journey, ${displayName}. While I can provide general information and encouragement, always consult your healthcare provider for medical decisions. How can I assist you today?`,
      `Your proactive approach to health management is inspiring, ${displayName}! Keep using your journal to track patterns and share insights with your healthcare team. What aspect of your health journey would you like to discuss?`,
      `Every day you're taking positive steps for your health, ${displayName}. That's something to be proud of! I'm here to provide support, information, and encouragement. What's on your mind today?`
    ];
    
    return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
  };

  // Handle message sending via API
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) {
      return;
    }

    const userMessage = inputText.trim();
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      let aiResponse;
      
      if (apiStatus === 'ready') {
        try {
          // Use existing API endpoint structure
          const chatEndpoint = API_BASE_URL ? `${API_BASE_URL}/api/chat` : '/api/chat';
          
          const response = await fetch(chatEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: userMessage,
              chatHistory: chatHistory,
              displayName: getDisplayName()
            }),
          });

          const data = await response.json();

          if (response.ok) {
            aiResponse = data.response;
          } else if (data.fallback) {
            aiResponse = getSmartHealthResponse(userMessage);
            if (response.status === 429) {
              toast.error("Daily AI limit reached. Using enhanced responses.");
            }
          } else {
            throw new Error(data.error || 'API request failed');
          }
          
        } catch (apiError) {
          console.warn('API call failed, using fallback:', apiError.message);
          aiResponse = getSmartHealthResponse(userMessage);
          toast.error("AI temporarily unavailable. Using smart responses.");
        }
      } else {
        // Use enhanced fallback responses
        aiResponse = getSmartHealthResponse(userMessage);
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiResponse }]);

    } catch (error) {
      console.error("Message handling error:", error);
      const fallbackResponse = getSmartHealthResponse(userMessage);
      setChatHistory((prev) => [...prev, { sender: 'ai', text: fallbackResponse }]);
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

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">AI Health Companion</h2>

      {/* Chat Display Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-inner mb-4">
        {chatHistory.length === 0 && !isLoading ? (
          <div className="text-center text-gray-500 space-y-2">
            <p className="italic">
              Hi {getDisplayName()}! I'm here to support your health journey. 
            </p>
            <p className="text-sm">
              Ask me about pain management, medications, wellness tips, or just chat for emotional support!
            </p>
            {apiStatus === 'checking' && (
              <p className="text-xs text-blue-500">🤖 Checking AI chat service...</p>
            )}
            {apiStatus === 'fallback' && (
              <p className="text-xs text-amber-500">💡 Using enhanced health-specific responses</p>
            )}
            {apiStatus === 'ready' && (
              <p className="text-xs text-green-500">✅ AI chat service ready!</p>
            )}
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div key={index} className={`mb-3 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-3 rounded-lg max-w-[85%] ${
                msg.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-sm' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-sm'
              }`}>
                {msg.text}
              </span>
            </div>
          ))
        )}
        {isLoading && (
          <div className="text-center text-gray-500 mt-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-pulse">💭</div>
              <p>AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex mt-auto">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isLoading ? "AI is thinking..." : "Ask about your health, get support, or just chat..."}
          disabled={isLoading}
          className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={isLoading || !inputText.trim()}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-500 text-center mt-3">
        **Disclaimer:** This AI provides general information and support, not medical advice. Always consult healthcare professionals for medical decisions.
      </p>
    </div>
  );
}

export default AIChat;
