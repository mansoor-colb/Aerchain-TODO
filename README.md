# 🎯 AI-Powered Task Manager with Voice Input

> A full-stack task management application featuring voice-to-task conversion, and AI-powered natural language processing.

[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green.svg)](https://www.mongodb.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-purple.svg)](https://openai.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

---

## ✨ Features

### 🎤 Voice-to-Task Conversion
- Real-time speech recognition using Web Speech API
- AI-powered natural language parsing with OpenAI GPT-4o-mini
- Automatic extraction of task details (title, priority, due date)
- Live transcription with interim results display


### 🗓️ Smart Task Management
- Create, read, update, delete (CRUD) operations
- Priority levels (High, Medium, Low, None)
- Status tracking (To Do, In Progress, Done)
- Search and filter capabilities

### 🤖 AI Features
- Natural language date parsing ("tomorrow", "next week", "in 3 days")
- Intelligent priority detection from context
- Task summarization from long descriptions

### 🎨 Modern UI/UX
- Responsive design with TailwindCSS
- Beautiful component library using shadcn/ui
- Real-time updates and notifications
- Calendar view with drag-and-drop
- Dark mode support

### Voice Task Creation Example:
```
User says: "Create a high priority task to review code by tomorrow at 5 PM"

AI parses to:
{
  "title": "Review code",
  "description": "Create a high priority task to review code",
  "priority": "High",
  "status": "To Do",
  "dueDate": "2025-12-07T17:00:00.000Z"
}
```

## 🛠 Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** Sonner (toast notifications)
- **Date Picker:** React-Day-Picker
- **Carousel:** Embla Carousel

### Backend
- **Runtime:** Node.js (v20+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **AI Service:** OpenAI API (GPT-4o-mini)
- **Architecture:** Layered (Controllers → Services → Models)

### DevOps & Tools
- **Version Control:** Git
- **Package Manager:** npm
- **Environment Management:** dotenv
- **API Testing:** Postman / curl
- **Logging:** Custom middleware with console.log

---

## 📦 Prerequisites

Before running this project, ensure you have:

| Requirement | Version | Check Command |
|------------|---------|---------------|
| 🟦 **Node.js** | 20+ | `node -v` |
| 🟩 **npm** | Latest | `npm -v` |
| 🟧 **MongoDB** | 6+ | MongoDB Atlas  |
| 🟪 **OpenAI API Key** | - | [Get Key](https://platform.openai.com/api-keys) |

### Additional Requirements
- Modern browser with Web Speech API support (Chrome, Edge recommended)
- Git for version control
- Code editor (VS Code recommended)
---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone [https://github.com/](https://github.com/mansoor-colb/Aerchain-TODO.git)
cd Aerchain-TODO
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables

### Backend `.env`

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=5000
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority
# OpenAI API
OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

`

### Frontend `.env`

Create a `.env.local` file in the `frontend/` directory:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:8080

```

---

## 🏃 Running the Application

### Development Mode

#### Terminal 1: Start Backend

```bash
cd backend
npm run dev
```

**Output:**
```
🚀 Server running on http://localhost:5000
✅ MongoDB connected
```

#### Terminal 2: Start Frontend

```bash
cd frontend
npm run dev
```

**Output:**
```
  VITE v5.0.0  ready in 500 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Access the Application

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:5000



## 🎯 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Parse Voice Transcript

Convert natural language voice input to structured task data.

**POST** `/tasks/parse-voice`

**Request Body:**
```json
{
  "transcript": "Create a high priority task to review code by tomorrow at 5 PM"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transcript": "Create a high priority task to review code by tomorrow at 5 PM",
    "parsed": {
      "title": "Review code",
      "description": "Create a high priority task to review code",
      "priority": "High",
      "status": "To Do",
      "dueDate": "2025-12-07T17:00:00.000Z"
    }
  }
}
```

#### 2. Create Task

**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, Eggs, Bread",
  "priority": "Medium",
  "status": "To Do",
  "dueDate": "2025-12-10T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67531a2f9e8b2c1d4f5a6789",
    "title": "Buy groceries",
    "description": "Milk, Eggs, Bread",
    "priority": "Medium",
    "status": "To Do",
    "dueDate": "2025-12-10T10:00:00.000Z",
    "createdAt": "2025-12-06T10:30:00.000Z",
    "updatedAt": "2025-12-06T10:30:00.000Z"
  }
}
```

#### 3. Get All Tasks

**GET** `/api/tasks`

**Query Parameters:**
- `status` - Filter by status (To Do, In Progress, Done)
- `priority` - Filter by priority (High, Medium, Low, None)
- `search` - Search in title and description
- `dueDate` - Filter by due date

**Example:**
```
GET /api/tasks
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "67531a2f9e8b2c1d4f5a6789",
      "title": "Review code",
      "description": "Review PR #234",
      "priority": "High",
      "status": "To Do",
      "dueDate": "2025-12-07T17:00:00.000Z"
    }
  ]
}
```

#### 4. Get Single Task

**GET** `/api/tasks/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67531a2f9e8b2c1d4f5a6789",
    "title": "Buy groceries",
    "description": "Milk, Eggs, Bread",
    "priority": "Medium",
    "status": "To Do",
    "dueDate": "2025-12-10T10:00:00.000Z"
  }
}
```

#### 5. Update Task

**PUT** `/api/tasks/:id`

**Request Body:**
```json
{
  "status": "Done",
  "priority": "High"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "67531a2f9e8b2c1d4f5a6789",
    "title": "Buy groceries",
    "status": "Done",
    "priority": "High"
  }
}
```

#### 6. Update Task Status Only

**PUT** `/api/tasks/:id/status`

**Request Body:**
```json
{
  "status": "In Progress"
}
```

#### 7. Delete Task

**DELETE** `/api/tasks/:id`

**Response:**
```json
{
  "success": true,
  "message": "Deleted Successfully",
  "data": {
    "_id": "67531a2f9e8b2c1d4f5a6789"
  }
}
```

#### 8. Health Check

**GET** `/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-06T12:00:00.000Z"
}
```

---


## 🤖 AI Integration

### OpenAI GPT-4o-mini

This project uses OpenAI's GPT-4o-mini model for natural language processing.

#### Features Powered by AI:

1. **Voice Transcript Parsing**
   - Converts natural language to structured task data
   - Extracts title, description, priority, status, and due date

2. **Date/Time Interpretation**
   - Understands relative dates: "tomorrow", "next week", "in 3 days"
   - Converts to ISO 8601 format for database storage

3. **Priority Detection**
   - Automatically detects priority from context
   - Keywords: "urgent", "important", "high priority"


#### Example AI Prompt:

```javascript
const systemPrompt = `You are a task parser. Parse natural language input into structured task format.

Extract these fields:
- title: A concise task title (required)
- description: Detailed description if available
- priority: One of "High", "Medium", "Low", or "None"
- status: One of "To Do", "In Progress", or "Done"
- dueDate: ISO 8601 date string if mentioned, null otherwise

Rules:
1. If priority is not mentioned, set it to "None"
2. If status is not mentioned, set it to "To Do"
3. For dates, consider relative terms like "tomorrow", "next week"
4. Current date is ${new Date().toISOString()}
5. Return ONLY valid JSON`;
```



## 🎨 Design Decisions

### Architecture Choices

#### 1. Layered Backend Architecture
```
Routes → Controllers → Services → Models → Database
```

**Benefits:**
- Separation of concerns
- Easy to test and maintain
- Scalable structure
- Clear data flow

#### 2. AI Processing in Backend
**Why backend, not frontend?**
- Consistent error handling
- API key security
- Rate limiting control
- Centralized logging

#### 3. Web Speech API for Frontend
**Why client-side speech recognition?**
- Real-time user feedback
- Reduced server load
- Better user experience
- No audio file uploads

#### 4. MongoDB for Database
**Benefits:**
- Flexible schema for tasks
- Easy to add new fields
- Good for rapid development
- Native JSON support



---




#### Test API Endpoints

Using curl:

```bash
# Test parse endpoint
curl -X POST http://localhost:5000/api/parse-voice \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Buy milk tomorrow morning"}'

# Test create task
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "priority": "High",
    "status": "To Do"
  }'

# Test get tasks
curl http://localhost:5000/api/tasks
```


<div align="center">

### ⭐ Star this repo if you found it helpful!

Made with ❤️ and ☕ by [Your Name]

</div>
