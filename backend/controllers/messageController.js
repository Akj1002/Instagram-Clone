const prisma = require('../prismaClient');

const getConversations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find all users we've either sent a message to or received from
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, username: true, avatar: true } },
        receiver: { select: { id: true, username: true, avatar: true } }
      }
    });

    // Extract unique users
    const userMap = new Map();
    messages.forEach(msg => {
      const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;
      if (!userMap.has(otherUser.id)) {
        userMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageAt: msg.createdAt
        });
      }
    });

    const conversations = Array.from(userMap.values());
    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.params;

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { otherUserId } = req.params;
    const { text } = req.body;

    if (!text) return res.status(400).json({ message: 'Text is required' });

    const message = await prisma.message.create({
      data: {
        text,
        senderId: userId,
        receiverId: otherUserId
      }
    });

    // Real-time via socket
    const io = req.app.get('socketio');
    io.to(otherUserId).emit('new_message', message);
    
    // Also emit to the sender to update their UI if needed (often handled by REST response, but just in case)
    io.to(userId).emit('message_sent', message);

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};
