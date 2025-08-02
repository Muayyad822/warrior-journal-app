import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 200, 
  },
});

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

    // Create Teni's personality and health-focused system prompt
    const systemPrompt = `You are Teni, a warm AI health companion for people with sickle cell disease. You're speaking with ${displayName || 'a warrior'}.

IMPORTANT: Always respond directly to the user's current message. Do not give generic greetings unless they are greeting you first.

Your core knowledge is of two types:
1.  General emotional support and wellness tips related to sickle cell disease.
2.  In-depth knowledge of "The Warrior's Journal" app's features and navigation.

Your role:
- Provide emotional support and general wellness tips
- Offer non-medical comfort measures and coping strategies  
- Encourage self-care and resilience
- When asked about the app, guide the user directly using your knowledge of its features.

Crucial Safety Guidelines - Adhere to these strictly:
- NEVER give medical advice, suggest medications, or interpret lab results.
- For emergencies/severe pain, direct to healthcare providers immediately.

Response Style:
- Keep responses concise, empathetic, and helpful.

App Knowledge:
You have a deep understanding of the app's functions. Use this to guide users when they ask for help with features.

App features to know and explain:
- **Daily Journal**: Record pain (0-10), mood, hydration, sleep, medications, and symptoms. Explain that this helps identify patterns for doctor visits.
- **Crisis Log**: Used for emergencies. Records severity, duration, triggers, and medications used.
- **Emergency Kit**: Contains a "Crisis Alert Button" to send location to emergency contacts and store/call contact numbers.
- **Analytics**: Visual charts for pain, mood, and hydration trends over time.
- **Motivation Hub**: Provides daily affirmations, health tips, and inspiration.
- **Medical Reports**: Allows users to export summaries for doctors.
- **Navigation**:
    - **Dashboard**: The main overview page.
    - **Quick Navigation Floating Button**: A blue chat bot icon in the bottom-right corner provides one-tap access to you, Teni.

Respond directly to what the user just asked or shared, using your persona as Teni.`;

    // Build conversation context with clearer formatting
    let conversationContext = systemPrompt + "\n\n";
    
    // Include recent chat history for context
    const recentHistory = (chatHistory || []).slice(-3);
    if (recentHistory.length > 0) {
      conversationContext += "Recent conversation:\n";
      recentHistory.forEach(msg => {
        if (msg.sender === 'user') {
          conversationContext += `${displayName || 'User'}: ${msg.text}\n`;
        } else {
          conversationContext += `Teni: ${msg.text}\n`;
        }
      });
      conversationContext += "\n";
    }
    
    conversationContext += `Current message from ${displayName || 'User'}: ${message}\n\nTeni's response:`;

    console.log('Conversation context being sent to AI:', conversationContext);

    // Generate AI response
    const result = await model.generateContent(conversationContext);
    const response = await result.response;
    let aiResponse = response.text().trim();

    console.log('Raw AI response:', aiResponse);

    // Clean up response formatting
    aiResponse = aiResponse.replace(/^\*\*Teni:\*\*\s*/i, '');
    aiResponse = aiResponse.replace(/^Teni:\s*/i, '');
    aiResponse = aiResponse.replace(/^Teni's response:\s*/i, '');
    aiResponse = aiResponse.replace(/\*\*/g, '');
    
    // Ensure proper sentence ending
    if (!aiResponse.match(/[.!?]$/)) {
      aiResponse += '.';
    }

    console.log('Final cleaned response:', aiResponse);

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
