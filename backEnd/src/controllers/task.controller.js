
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import dotenv from "dotenv";
// dotenv.config({ path: "../../.env" });

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

//  app.post('/api/parse-voice', async (req, res) => 
    
//     async parseVoice(req,res){
//   try {
//     const { transcript } = req.body;

//     if (!transcript || transcript.trim() === '') {
//       return res.status(400).json({
//         success: false,
//         error: 'Transcript is required'
//       });
//     }

//     // Get the generative model
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // Create a detailed prompt for parsing
//     const prompt = `You are a task parser. Parse the following natural language input into a structured task format.

// Extract these fields:
// - title: A concise task title (required)
// - description: Detailed description if available
// - priority: One of "High", "Medium", "Low", or "None"
// - status: One of "To Do", "In Progress", or "Done"
// - dueDate: ISO 8601 date string if a date/time is mentioned, null otherwise

// Input: "${transcript}"

// Rules:
// 1. If priority is not mentioned, set it to "None"
// 2. If status is not mentioned, set it to "To Do"
// 3. For dates, consider relative terms like "tomorrow", "next week", "in 3 days"
// 4. Current date is ${new Date().toISOString()}
// 5. Return ONLY a valid JSON object with no markdown formatting, no code blocks, no explanations

// Expected format:
// {
//   "title": "string",
//   "description": "string",
//   "priority": "High|Medium|Low|None",
//   "status": "To Do|In Progress|Done",
//   "dueDate": "ISO date string or null"
// }`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     let text = response.text();

//     // Clean the response - remove markdown code blocks if present
//     text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

//     // Parse the JSON response
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch (parseError) {
//       console.error('Failed to parse Gemini response:', text);
//       // Fallback parsing
//       parsed = {
//         title: transcript.substring(0, 100),
//         description: transcript,
//         priority: "None",
//         status: "To Do",
//         dueDate: null
//       };
//     }

//     // Validate and sanitize the parsed data
//     const validPriorities = ["High", "Medium", "Low", "None"];
//     const validStatuses = ["To Do", "In Progress", "Done"];

//     if (!validPriorities.includes(parsed.priority)) {
//       parsed.priority = "None";
//     }

//     if (!validStatuses.includes(parsed.status)) {
//       parsed.status = "To Do";
//     }

//     // Validate dueDate
//     if (parsed.dueDate) {
//       const date = new Date(parsed.dueDate);
//       if (isNaN(date.getTime())) {
//         parsed.dueDate = null;
//       }
//     }

//       return success(res,  {data: {
//         transcript,
//         parsed
//       }});
//   } catch (err) {
//     console.error('Error parsing voice transcript:', err,process.env.GEMINI_API_KEY);
//     return error(res, err.message);
//     // res.status(500).json({
//     //   success: false,
//     //   error: 'Failed to parse transcript',
//     //   details: error.message
//     // });
//   }
// }
// };



import TaskService from "../services/task.service.js";
import { success, created, error } from "../utils/apiResponse.js";
import OpenAI from 'openai';
 import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default {
  async create(req, res) {
    try {
      const task = await TaskService.createTask(req.body);
      return created(res, task);
    } catch (err) {
      return error(res, err.message);
    }
  },

  async update(req, res) {
    try {
      console.log(req.params.id);
      const task = await TaskService.updateTask(req.params.id, req.body);
      if (!task) return error(res, "Task not found", 404);
      return success(res, task);
    } catch (err) {
      return error(res, err.message);
    }
  },

  async updateStatus(req, res) {
    try {
      const task = await TaskService.updateTask(req.params.id, { status: req.body.status });
      if (!task) return error(res, "Task not found", 404);
      return success(res, task);
    } catch (err) {
      return error(res, err.message);
    }
  },

  async delete(req, res) {
    try {
      const task = await TaskService.deleteTask(req.params.id);
      if (!task) return error(res, "Task not found", 404);
      return success(res, task, "Deleted Successfully");
    } catch (err) {
      return error(res, err.message);
    }
  },

  async list(req, res) {
    try {
      const { status, priority, dueDate, search } = req.query;
      const filters = { status, priority, dueDate };
      const tasks = await TaskService.listTasks(filters, search);
      return success(res, tasks);
    } catch (err) {
      return error(res, err.message);
    }
  },

  async getOne(req, res) {
    try {
      const task = await TaskService.getTask(req.params.id);
      if (!task) return error(res, "Task not found", 404);
      return success(res, task);
    } catch (err) {
      return error(res, err.message);
    }
  },

  async parseVoice(req, res) {
    try {
      const { transcript } = req.body;

      // Validation
      if (!transcript || transcript.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Transcript is required'
        });
      }

      console.log('🎤 Parsing transcript:', transcript);
      console.log('🔑 API Key present:', !!process.env.OPENAI_API_KEY);

      // Check if API key exists
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY is not set in environment variables');
      }

      // Create a detailed prompt for parsing
      const systemPrompt = `You are a task parser. Parse natural language input into a structured task format.

Extract these fields:
- title: A concise task title (required)
- description: Detailed description if available
- priority: One of "High", "Medium", "Low", or "None"
- status: One of "To Do", "In Progress", or "Done"
- dueDate: ISO 8601 date string if a date/time is mentioned, null otherwise

Rules:
1. If priority is not mentioned, set it to "None"
2. If status is not mentioned, set it to "To Do"
3. For dates, consider relative terms like "tomorrow", "next week", "in 3 days"
4. Current date is ${new Date().toISOString()}
5. Return ONLY a valid JSON object with no markdown formatting, no code blocks, no explanations

Expected format:
{
  "title": "string",
  "description": "string",
  "priority": "High|Medium|Low|None",
  "status": "To Do|In Progress|Done",
  "dueDate": "ISO date string or null"
}`;

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Fast and cost-effective, or use "gpt-4o" for better results
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: transcript
          }
        ],
        response_format: { type: "json_object" }, // Force JSON response
        temperature: 0.3, // Lower temperature for more consistent parsing
      });

      let text = completion.choices[0].message.content;
      console.log('🤖 GPT raw response:', text);

      // Clean the response - remove markdown code blocks if present
      text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

      console.log('🧹 Cleaned response:', text);

      // Parse the JSON response
      let parsed;
      try {
        parsed = JSON.parse(text);
        console.log('✅ Successfully parsed JSON');
      } catch (parseError) {
        console.error('❌ Failed to parse GPT response as JSON:', text);
        console.error('Parse error:', parseError.message);
        
        // Fallback parsing
        parsed = {
          title: transcript.substring(0, 100),
          description: transcript,
          priority: "None",
          status: "To Do",
          dueDate: null
        };
        console.log('🔄 Using fallback parsing');
      }

      // Validate and sanitize the parsed data
      const validPriorities = ["High", "Medium", "Low", "None"];
      const validStatuses = ["To Do", "In Progress", "Done"];

      if (!validPriorities.includes(parsed.priority)) {
        console.log(`⚠️ Invalid priority "${parsed.priority}", defaulting to "None"`);
        parsed.priority = "None";
      }

      if (!validStatuses.includes(parsed.status)) {
        console.log(`⚠️ Invalid status "${parsed.status}", defaulting to "To Do"`);
        parsed.status = "To Do";
      }

      // Validate dueDate
      if (parsed.dueDate) {
        const date = new Date(parsed.dueDate);
        if (isNaN(date.getTime())) {
          console.log(`⚠️ Invalid date "${parsed.dueDate}", setting to null`);
          parsed.dueDate = null;
        }
      }

      console.log('✅ Final parsed result:', parsed);

      return success(res, {
      
          transcript,
          parsed

      });

    } catch (err) {
      console.error('❌ Error parsing voice transcript:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        apiKey: process.env.OPENAI_API_KEY ? 'Present' : 'Missing'
      });
      return error(res, err.message);
    }
  }
};