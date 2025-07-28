# CodeArena – AI-Powered DSA Learning Platform

A full-stack platform for mastering Data Structures and Algorithms with AI assistance, competitive coding duels, and progress tracking. Built using Next.js, React, Node.js, Express, and MongoDB.

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- TailwindCSS 4
- Monaco Editor for code editing
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Passport.js for Google OAuth

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/codearena.git
   cd codearena
   ```

2. Install dependencies for both client and server
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. Create a `.env` file in the server directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. Start the development servers
   ```bash
   # Start the backend server
   cd server
   npm run dev

   # In a new terminal, start the frontend
   cd client
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
├── client/                 # Frontend Next.js application
│   ├── public/             # Static assets
│   └── src/                # Source files
│       ├── app/            # Next.js app router
│       ├── components/     # Reusable components
│       ├── context/        # React context providers
│       └── lib/            # Utility functions and API services
│
└── server/                 # Backend Express application
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── models/             # Mongoose models
    └── routes/             # API routes
```

---

## 🚀 Features
- 🧠 Practice DSA questions from a custom problem database
- 🤖 AI Assistant for real-time help with hints, explanations, and code optimization
- ⚔️ Coding Duels to challenge friends or random opponents in real-time competitions
- 🌐 Multi-language Support for Python, JavaScript, Java, C++, and more
- 📊 Dashboard to track progress, view statistics, and identify areas for improvement
- 🔐 Secure authentication with JWT and Google OAuth integration
- 💻 Modern UI built with Next.js + TailwindCSS

---
