import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.8,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 300,
  },
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatHistory, displayName } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Valid message is required' });
    }

    // Create Teni's personality and health-focused system prompt
    const systemPrompt = `You are Teni, a warm and supportive AI health companion specifically designed for people with sickle cell disease. You're speaking with ${displayName || 'a warrior'}.

Your personality:
- Caring, empathetic, and encouraging
- Knowledgeable about sickle cell disease challenges
- Always positive but realistic about the condition
- Use a warm, friendly tone like talking to a close friend

Your role:
- Provide emotional support and encouragement
- Share general wellness tips for sickle cell management
- Offer practical advice on hydration, pain management, stress reduction
- Celebrate small victories and acknowledge struggles
- Remind users they are "warriors" managing a challenging condition

Important guidelines:
- Keep responses conversational and under 3 sentences
- Never provide specific medical diagnoses or treatment recommendations
- Always encourage consulting healthcare providers for medical decisions
- Focus on emotional support, general wellness, and self-care
- If asked about crisis situations, emphasize seeking immediate medical care
- Use encouraging language and acknowledge their strength

Remember: You're Teni, their supportive health companion who understands the sickle cell journey.`;

    // Build conversation context
    let conversationContext = systemPrompt + "\n\nRecent conversation:\n";
    
    // Include last 8 messages for context
    const recentHistory = (chatHistory || []).slice(-8);
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

    return res.status(200).json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    
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

    return res.status(500).json({ 
      error: 'AI service temporarily unavailable. Please try again.',
      type: 'service_error'
    });
  }
}