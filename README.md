<div align="center">
  <img src="https://cdn.simpleicons.org/instagram/E4405F" alt="Instagram Logo" width="80" />

  # Instagram Clone 📸

  <p>
    <strong>A full-stack, feature-rich Instagram clone built with modern web technologies.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
    <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
    <img src="https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white" alt="Gemini API" />
  </p>
</div>

<br />

## 🌟 Overview
This project is a comprehensive replication of Instagram's core functionality. From a dynamic feed and interactive real-time messaging, to AI-powered chatbots and short-form video reels, this application demonstrates the power of the modern JavaScript ecosystem.

---

## ✨ Key Features

- **🛡️ Secure Authentication**: Full user registration, login, and secure sessions using JSON Web Tokens (JWT) and `bcrypt` password hashing.
- **📱 Dynamic Feed**: Scroll through posts from users you follow. Like, comment, and save your favorite posts.
- **🎬 Real-Time Reels**: A dedicated, scrollable feed for short-form content. Users can upload image/video URLs to instantly publish their own Reels.
- **💬 Real-Time Messaging & Notes**: Private messaging powered by Socket.io. See who's online with live green-dot indicators, watch real-time typing bubbles (`...`), and leave disappearing notes for your friends.
- **🤖 Meta AI Chatbot**: Built-in intelligent assistant powered by Google's **Gemini 1.5 Flash**. Chat directly with "Meta AI" in your DMs—it remembers your conversation context and replies dynamically!
- **🔍 Explore & Search**: Discover new content on the Explore page and search for other users to follow.
- **👤 Custom Profiles**: Manage your personal grid, edit your bio and avatar, and track your followers/following counts.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (via Vite for blazing-fast development)
- **Styling**: Vanilla CSS with modern CSS Variables and glassmorphic aesthetics
- **Icons**: Lucide React
- **API Communication**: Axios
- **Real-Time WebSockets**: Socket.io-client

### Backend
- **Runtime & Framework**: Node.js & Express.js
- **Database ORM**: Prisma
- **Database**: SQLite (Easily swappable to PostgreSQL or MySQL)
- **WebSockets**: Socket.io
- **AI Integration**: `@google/generative-ai`

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- npm or yarn installed globally

### 1. Clone the Repository
```bash
git clone https://github.com/Akj1002/Instagram-Clone.git
cd Instagram-Clone
```

### 2. Setup the Backend
Navigate to the backend directory, install dependencies, and configure your environment variables.
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_super_secret_jwt_key"
GEMINI_API_KEY="your_google_gemini_api_key" # Required for Meta AI
```

Push the database schema and start the server:
```bash
npx prisma db push
npx prisma generate
npm run dev
```
*The backend server will run on `http://localhost:5000`.*

### 3. Setup the Frontend
Open a new terminal instance, navigate to the frontend directory, and start the Vite development server.
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will be accessible at `http://localhost:5173`.*

---

## 💡 Usage Highlights

- **Chatting with Meta AI**: Navigate to the **Messages** tab in the sidebar. Click on the "Meta AI" contact pinned at the top and say hello! Ask it to write a poem or answer a complex question.
- **Creating a Reel**: Open the **Reels** tab and click "Create Reel" in the top right. Paste an image or video URL to see it instantly added to the public Reels feed.
- **Status Indicators**: Open the app in two different browser windows with two different accounts to see the real-time "Online" green dots and typing indicators in action!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](../../issues).

## 📄 License
This project is intended for educational purposes and portfolio demonstration. Feel free to fork, modify, and build upon it!
