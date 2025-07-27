import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 150, 
  },
});

// Simple response cache (in production, use Redis)
const responseCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Common responses cache for frequently asked questions
const getCommonResponses = (displayName) => ({
  'how are you': "I'm here and ready to support you! How are you feeling today, warrior?",
  'hello': `Hello ${displayName || 'warrior'}! I'm Teni, your health companion. How can I support you today?`,
  'hi': `Hi there! I'm so glad you're here. How are you doing today?`,
  'pain': "I understand pain can be really challenging. Remember to stay hydrated, rest when needed, and don't hesitate to reach out to your healthcare team if it gets severe.",
  'crisis': "If you're experiencing a crisis, please seek immediate medical attention. In the meantime, try to stay calm, hydrate, and use your pain management techniques.",
});

function getCachedResponse(message, displayName) {
  const normalizedMessage = message.toLowerCase().trim();
  const commonResponses = getCommonResponses(displayName);
  
  // Check for exact common responses
  for (const [key, response] of Object.entries(commonResponses)) {
    if (normalizedMessage.includes(key)) {
      return response;
    }
  }
  
  // Check cache
  const cacheKey = normalizedMessage;
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.response;
  }
  
  return null;
}

function setCachedResponse(message, response) {
  const cacheKey = message.toLowerCase().trim();
  responseCache.set(cacheKey, {
    response,
    timestamp: Date.now()
  });
}

// Add rate limiting storage (in production, use Redis or database)
const userRequests = new Map();

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatHistory, displayName } = req.body;

    // Validate request body exists
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is required' });
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Valid message is required' });
    }

    // Check if GEMINI_API_KEY exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return res.status(500).json({ 
        error: 'AI service configuration error',
        type: 'config_error'
      });
    }

    // Rate limiting: 15 requests per 5 minutes per user
    const userKey = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    if (!userRequests.has(userKey)) {
      userRequests.set(userKey, []);
    }
    
    const userRequestTimes = userRequests.get(userKey);
    // Remove requests older than 5 minutes
    const recentRequests = userRequestTimes.filter(time => now - time < fiveMinutes);
    
    if (recentRequests.length >= 15) {
      return res.status(429).json({ 
        error: 'Too many requests. Please wait a moment before trying again.',
        type: 'rate_limit'
      });
    }
    
    // Add current request time
    recentRequests.push(now);
    userRequests.set(userKey, recentRequests);

    // Check for cached response first
    const cachedResponse = getCachedResponse(message, displayName);
    if (cachedResponse) {
      return res.status(200).json({ 
        response: cachedResponse,
        timestamp: new Date().toISOString(),
        cached: true
      });
    }

    // Create Teni's personality and health-focused system prompt
    const systemPrompt = `You are Teni, a warm and supportive AI health companion for people with sickle cell disease. You're speaking with ${displayName || 'a warrior'}.

Your role: Provide emotional support, general wellness tips, and encouragement. Keep responses brief (1-2 sentences), empathetic, and never give medical diagnoses. Always encourage consulting healthcare providers for medical decisions.`;

    // Build conversation context - reduced to last 4 messages for efficiency
    let conversationContext = systemPrompt + "\n\nRecent conversation:\n";
    
    // Include last 4 messages for context (reduced from 8)
    const recentHistory = (chatHistory || []).slice(-4);
    recentHistory.forEach(msg => {
      if (msg.sender === 'user') {
        conversationContext += `${displayName || 'User'}: ${msg.text}\n`;
      } else {
        conversationContext += `Teni: ${msg.text}\n`;
      }
    });
    
    conversationContext += `\n${displayName || 'User'}: ${message}\n\nTeni:`;

    // Generate AI response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    let aiResponse = response.text().trim();

    // Clean up response formatting
    aiResponse = aiResponse.replace(/^\*\*Teni:\*\*\s*/i, '');
    aiResponse = aiResponse.replace(/^Teni:\s*/i, '');
    aiResponse = aiResponse.replace(/\*\*/g, '');
    
    // Ensure proper sentence ending
    if (!aiResponse.match(/[.!?]$/)) {
      aiResponse += '.';
    }

    // Cache the response for future use
    setCachedResponse(message, aiResponse);

    return res.status(200).json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Ensure we always return JSON
    res.setHeader('Content-Type', 'application/json');
    
    // Return specific error types
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({ 
        error: 'API quota exceeded. Please try again later.',
        type: 'quota_exceeded'
      });
    }
    
    if (error.message?.includes('safety') || error.message?.includes('blocked')) {
      return res.status(400).json({ 
        error: 'Message blocked by safety filters. Please rephrase your question.',
        type: 'safety_filter'
      });
    }

    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        error: 'AI service configuration error.',
        type: 'config_error'
      });
    }

    // Generic error fallback
    return res.status(500).json({ 
      error: 'AI service temporarily unavailable. Please try again.',
      type: 'service_error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
