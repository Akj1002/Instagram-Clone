# Instagram Clone 📸

A full-stack, feature-rich Instagram clone built with modern web technologies. This application replicates the core functionality of Instagram, complete with real-time features, interactive UI components, and even an AI-powered chatbot!

## 🌟 Features

- **Authentication System**: Secure user registration and login using JSON Web Tokens (JWT) and bcrypt.
- **Dynamic Feed**: View posts from users you follow.
- **Real-Time Reels**: Scrollable, real-time short-form video feed (Reels). You can create your own Reels using image or video URLs.
- **Stories & Notes**: Post expiring stories and leave short text notes that appear in the messaging interface.
- **Interactive Posts**: Like, comment, and save posts. 
- **Real-Time Messaging**: Real-time private messaging using Socket.io with online status indicators (green dot) and live typing indicators.
- **Meta AI Chatbot**: Built-in AI assistant powered by Google Gemini (gemini-1.5-flash), accessible directly from your DMs, just like Meta AI on Instagram.
- **Explore Page**: Discover posts from users across the platform.
- **User Profiles**: View user grids, edit your profile details, follow/unfollow functionality.

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Lucide React** (for modern, scalable iconography)
- **Axios** (for API requests)
- **Socket.io-client** (for real-time communication)
- **Vanilla CSS** (custom variables and modern styling)

### Backend
- **Node.js & Express** (RESTful API architecture)
- **Prisma ORM** (Database management)
- **SQLite** (Development database)
- **Socket.io** (WebSockets)
- **Google Generative AI SDK** (for the Meta AI chatbot)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akj1002/Instagram-Clone.git
   cd Instagram-Clone
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     PORT=5000
     DATABASE_URL="file:./dev.db"
     JWT_SECRET="your_super_secret_jwt_key"
     GEMINI_API_KEY="your_google_gemini_api_key"
     ```
   - Run database migrations:
     ```bash
     npx prisma db push
     npx prisma generate
     ```
   - Start the backend server:
     ```bash
     npm run dev
     ```

3. **Setup Frontend**
   ```bash
   # Open a new terminal window
   cd frontend
   npm install
   ```
   - Start the frontend development server:
     ```bash
     npm run dev
     ```

4. **Open the App**
   Navigate to `http://localhost:5173` in your browser.

## 💡 Usage Highlights
- **Chatting with Meta AI**: Go to the Messages tab, click on the "Meta AI" contact pinned at the top, and ask it anything! It has contextual awareness of your chat session.
- **Creating Reels**: Go to the Reels tab and click "Create Reel". Paste a direct image or video URL to see it appear in the feed instantly.

## 📄 License
This project is for educational purposes. Feel free to fork and build upon it!
