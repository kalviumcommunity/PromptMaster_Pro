const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// In-memory storage for prompts and templates (in production, use a database)
let prompts = [];
let templates = [
  {
    id: 'zero-shot',
    name: 'Zero-Shot Prompting',
    description: 'Give instructions without examples',
    template: 'You are {{role}}. {{task}} Always respond in {{format}} format.'
  },
  {
    id: 'one-shot',
    name: 'One-Shot Prompting',
    description: 'Provide one example before the task',
    template: 'Example:\n{{example}}\n\nNow perform this task: {{task}}'
  },
  {
    id: 'multi-shot',
    name: 'Multi-Shot Prompting',
    description: 'Provide multiple examples before the task',
    template: 'Examples:\n{{examples}}\n\nNow perform this task: {{task}}'
  },
  {
    id: 'chain-of-thought',
    name: 'Chain-of-Thought Prompting',
    description: 'Encourage step-by-step reasoning',
    template: 'Think step by step and then provide your final answer: {{task}}'
  }
];

// Gemini AI Integration
async function getAvailableModels() {
  try {
    const response = await axios.get(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.models;
  } catch (error) {
    console.error('Gemini API ListModels Error:', error.response?.data || error.message);
    throw new Error('Failed to list Gemini AI models');
  }
}

async function callGeminiAPI(prompt, context = '') {
  try {
    // Get available models
    const models = await getAvailableModels();
    // Find a model that supports generateContent (example: 'models/text-bison-001')
    // Exclude models that are for embeddings or unsupported
    const model = models.find(m => 
      (m.name.includes('bison') || m.name.includes('text')) &&
      !m.name.includes('embedding') &&
      !m.name.includes('embed')
    );
    if (!model) {
      throw new Error('No suitable Gemini AI model found');
    }

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{
            text: context ? `${context}\n\n${prompt}` : prompt
          }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    throw new Error('Failed to get response from Gemini AI');
  }
}

// Routes

// Get all templates
app.get('/api/templates', (req, res) => {
  res.json(templates);
});

// Process prompt
app.post('/api/process-prompt', async (req, res) => {
  try {
    const { prompt, promptType, format, examples, role, context } = req.body;
    
    let processedPrompt = prompt;
    
    // Apply prompt engineering techniques
    switch (promptType) {
      case 'zero-shot':
        processedPrompt = `You are ${role}. ${prompt} Always respond in ${format} format.`;
        break;
      case 'one-shot':
        processedPrompt = `Example:\n${examples}\n\nNow perform this task: ${prompt}`;
        break;
      case 'multi-shot':
        processedPrompt = `Examples:\n${examples}\n\nNow perform this task: ${prompt}`;
        break;
      case 'chain-of-thought':
        processedPrompt = `Think step by step and then provide your final answer: ${prompt}`;
        break;
    }

    const response = await callGeminiAPI(processedPrompt, context);
    
    // Save prompt history
    const promptRecord = {
      id: Date.now().toString(),
      originalPrompt: prompt,
      processedPrompt: processedPrompt,
      response: response,
      timestamp: new Date().toISOString(),
      promptType: promptType,
      format: format
    };
    
    prompts.push(promptRecord);
    
    res.json({
      success: true,
      response: response,
      promptId: promptRecord.id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get prompt history
app.get('/api/prompts', (req, res) => {
  res.json(prompts.reverse()); // Return most recent first
});

// Upload file for RAG
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    success: true,
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: req.file.path
  });
});

// Get prompt by ID
app.get('/api/prompts/:id', (req, res) => {
  const prompt = prompts.find(p => p.id === req.params.id);
  if (!prompt) {
    return res.status(404).json({ error: 'Prompt not found' });
  }
  res.json(prompt);
});

// Serve main application
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.listen(PORT, () => {
  console.log(`PromptMaster Pro server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the application`);
});
