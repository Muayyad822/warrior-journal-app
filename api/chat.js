import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 200,
  },
});

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, chatHistory, displayName } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create health-focused system prompt
    const systemPrompt = `You are a supportive AI health companion for ${displayName || 'the user'}, who has sickle cell disease. 

Your role:
- Provide empathetic, helpful responses about sickle cell disease management
- Offer practical advice on pain management, medications, hydration, and wellness
- Be encouraging and supportive while acknowledging their challenges
- Keep responses concise (2-3 sentences max)
- Always remind them to consult healthcare providers for medical decisions
- Use a warm, caring tone

Important guidelines:
- Never provide specific medical diagnoses or treatment recommendations
- Focus on general wellness, emotional support, and self-care strategies
- Acknowledge their strength as a "warrior" managing this condition
- If asked about crisis situations, remind them to seek immediate medical care`;

    // Build conversation context
    let context = systemPrompt + "\n\nConversation history:\n";
    
    const recentHistory = (chatHistory || []).slice(-6);
    recentHistory.forEach(msg => {
      if (msg.sender === 'user') {
        context += `User: ${msg.text}\n`;
      } else {
        context += `Assistant: ${msg.text}\n`;
      }
    });
    
    context += `\nUser: ${message}\n\nPlease respond as the supportive health companion:`;

    // Generate response
    const result = await model.generateContent(context);
    const response = await result.response;
    let aiResponse = response.text().trim();

    // Clean up response
    aiResponse = aiResponse.replace(/\*\*/g, '').replace(/\*/g, '');
    if (!aiResponse.match(/[.!?]$/)) {
      aiResponse += '.';
    }

    res.json({ response: aiResponse });

  } catch (error) {
    console.error('Gemini API error:', error);
    
    if (error.message.includes('quota') || error.message.includes('limit')) {
      res.status(429).json({ error: 'API quota exceeded', fallback: true });
    } else {
      res.status(500).json({ error: 'AI service temporarily unavailable', fallback: true });
    }
  }
}