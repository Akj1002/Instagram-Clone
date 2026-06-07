const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Vite default port
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Expose io to routes
app.set('socketio', io);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const interactionRoutes = require('./routes/interactions');
const messageRoutes = require('./routes/messages');
const storyRoutes = require('./routes/stories');
const noteRoutes = require('./routes/notes');
const reelRoutes = require('./routes/reels');
const aiRoutes = require('./routes/ai');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/interactions', interactionRoutes);
app.use('/messages', messageRoutes);
app.use('/stories', storyRoutes);
app.use('/notes', noteRoutes);
app.use('/reels', reelRoutes);
app.use('/ai', aiRoutes);

// Basic route
app.get('/', (req, res) => {
  res.send('Instagram Clone API is running');
});

// Socket.io connection handling
const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Users will join a room with their user ID for private notifications
  socket.on('join', (userId) => {
    socket.join(userId);
    onlineUsers.set(userId, socket.id);
    io.emit('user_online', userId);
    console.log(`User ${userId} joined their notification room.`);
  });

  socket.on('typing', ({ senderId, receiverId }) => {
    socket.to(receiverId).emit('typing', senderId);
  });

  socket.on('stop_typing', ({ senderId, receiverId }) => {
    socket.to(receiverId).emit('stop_typing', senderId);
  });

  socket.on('check_online_status', (userIds, callback) => {
    const online = userIds.filter(id => onlineUsers.has(id));
    if (callback) callback(online);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Find the user who disconnected
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_offline', userId);
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
