import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Send } from 'lucide-react';
import { io } from 'socket.io-client';
import NotesBar from '../components/NotesBar';
import './Messages.css';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [aiTyping, setAiTyping] = useState(false);

  // Define the Meta AI contact
  const metaAIContact = {
    user: {
      id: 'meta-ai',
      username: 'Meta AI',
      avatar: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/1024px-ChatGPT_logo.svg.png', // Or any AI logo
    },
    lastMessage: 'Ask me anything...'
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await axios.get('/messages/conversations');
        // Prepend Meta AI to the conversations list
        setConversations([metaAIContact, ...res.data]);
      } catch (error) {
        console.error('Fetch conversations error', error);
      }
    };
    fetchConversations();

    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);
    newSocket.emit('join', user.id);

    newSocket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    newSocket.on('user_online', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.add(userId);
        return newSet;
      });
    });

    newSocket.on('user_offline', (userId) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    newSocket.on('typing', (senderId) => {
      if (activeChat && activeChat.id === senderId) {
        setIsTyping(true);
      }
    });

    newSocket.on('stop_typing', (senderId) => {
      if (activeChat && activeChat.id === senderId) {
        setIsTyping(false);
      }
    });

    return () => newSocket.close();
  }, [user.id]);

  useEffect(() => {
    if (activeChat && socket) {
      setIsTyping(false);
      setAiTyping(false);
      
      if (activeChat.id === 'meta-ai') {
        // AI Chat has no backend history yet, we'll keep it in state
        // In a real app we might fetch AI history from the DB too
        setMessages([]);
      } else {
        const fetchMessages = async () => {
          try {
            const res = await axios.get(`/messages/${activeChat.id}`);
            setMessages(res.data);
            scrollToBottom();
          } catch (error) {
            console.error('Fetch messages error', error);
          }
        };
        fetchMessages();
      }

      // Check online status for all real users
      const userIds = conversations
        .filter(c => c.user.id !== 'meta-ai')
        .map(c => c.user.id);
      
      if (activeChat.id !== 'meta-ai' && !userIds.includes(activeChat.id)) {
        userIds.push(activeChat.id);
      }

      if (userIds.length > 0) {
        socket.emit('check_online_status', userIds, (online) => {
          setOnlineUsers(new Set([...online, 'meta-ai'])); // AI is always online
        });
      } else {
        setOnlineUsers(new Set(['meta-ai']));
      }
    }
  }, [activeChat, conversations, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, aiTyping]);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (socket && activeChat && activeChat.id !== 'meta-ai') {
      socket.emit('typing', { senderId: user.id, receiverId: activeChat.id });
      
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', { senderId: user.id, receiverId: activeChat.id });
      }, 2000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const messageText = newMessage;
    setNewMessage('');

    if (activeChat.id === 'meta-ai') {
      // Append user message immediately
      const userMsg = {
        id: Date.now().toString(),
        text: messageText,
        senderId: user.id,
        receiverId: 'meta-ai',
        createdAt: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMsg]);
      setAiTyping(true);

      try {
        const res = await axios.post('/ai/chat', { 
          text: messageText,
          history: messages
        });
        setMessages(prev => [...prev, res.data]);
      } catch (error) {
        console.error('AI error', error);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: 'Sorry, I am having trouble connecting right now.',
          senderId: 'meta-ai',
          receiverId: user.id,
          createdAt: new Date().toISOString()
        }]);
      } finally {
        setAiTyping(false);
      }

    } else {
      try {
        const res = await axios.post(`/messages/${activeChat.id}`, { text: messageText });
        setMessages(prev => [...prev, res.data]);
        if (socket) {
          socket.emit('stop_typing', { senderId: user.id, receiverId: activeChat.id });
        }
      } catch (error) {
        console.error('Send message error', error);
      }
    }
  };

  return (
    <div className="messages-page">
      <div className="messages-sidebar">
        <div className="messages-header">
          <h2>{user.username}</h2>
        </div>
        <NotesBar />
        <div className="conversations-list">
          {conversations.length === 0 ? (
            <div className="no-conversations">No messages yet.</div>
          ) : (
            conversations.map((conv, idx) => (
              <div 
                key={idx} 
                className={`conversation-item ${activeChat?.id === conv.user.id ? 'active' : ''}`}
                onClick={() => setActiveChat(conv.user)}
              >
                <div className="conv-avatar-container">
                  <img src={conv.user.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="conv-avatar" />
                  {onlineUsers.has(conv.user.id) && <div className="online-indicator"></div>}
                </div>
                <div className="conv-info">
                  <span className="conv-username">{conv.user.username}</span>
                  <span className="conv-lastmsg">{conv.lastMessage}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="messages-content">
        {!activeChat ? (
          <div className="no-chat-selected">
            <Send size={64} style={{ color: 'var(--text-secondary)' }} />
            <h2>Your Messages</h2>
            <p>Send private photos and messages to a friend or group.</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <div className="conv-avatar-container">
                <img src={activeChat.avatar || 'https://via.placeholder.com/150'} alt="Avatar" className="chat-avatar" />
                {onlineUsers.has(activeChat.id) && <div className="online-indicator"></div>}
              </div>
              <span className="chat-username">{activeChat.username}</span>
            </div>

            <div className="chat-messages">
              {messages.map((msg, idx) => {
                const isMine = msg.senderId === user.id;
                return (
                  <div key={idx} className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
                    {msg.text}
                  </div>
                );
              })}
              {(isTyping || aiTyping) && (
                <div className="message-bubble theirs typing-indicator">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-container">
              <form onSubmit={handleSendMessage} className="chat-form">
                <input 
                  type="text" 
                  placeholder="Message..." 
                  value={newMessage}
                  onChange={handleTyping}
                  className="chat-input"
                />
                {newMessage.trim() && (
                  <button type="submit" className="chat-send-btn">Send</button>
                )}
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Messages;
