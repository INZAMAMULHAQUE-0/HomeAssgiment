// ✅ Integrated Chat.jsx with Groq-powered backend API
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatHistories, setChatHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const msgs = res.data.map((m) => ({
          id: m._id,
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.message,
          timestamp: m.timestamp,
        }));
        setMessages(msgs);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    fetchChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const tempId = Date.now().toString();
    const userMessage = {
      id: tempId,
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/chat/send`,
        { message: input },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const botMessage = {
        id: res.data.bot._id,
        role: 'assistant',
        content: res.data.bot.message,
        timestamp: res.data.bot.timestamp,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-gray-200 font-semibold">Chat History</span>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-200"
          >
            Logout
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatHistories.map((history) => (
            <div
              key={history.id}
              className="p-3 hover:bg-gray-700 rounded-lg mb-2 cursor-pointer"
            >
              <div className="text-gray-200 font-medium">{history.title}</div>
              <div className="text-gray-400 text-sm">{history.lastMessage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left">
              <div className="inline-block p-3 rounded-lg bg-gray-800 text-gray-200">
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
