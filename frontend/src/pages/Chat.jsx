import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FiMenu, FiX, FiMessageSquare, FiMail, FiInfo, FiPlus, FiLogOut } from 'react-icons/fi';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatHistories, setChatHistories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isNewChat, setIsNewChat] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch chat histories when component mounts
  useEffect(() => {
    const fetchChatHistories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const transformedHistories = res.data.reduce((acc, curr) => {
          const existingChat = acc.find(chat => chat.id === curr.chatId);
          if (existingChat) {
            if (new Date(curr.timestamp) > new Date(existingChat.lastTimestamp)) {
              existingChat.lastMessage = curr.message.slice(0, 30) + (curr.message.length > 30 ? '...' : '');
              existingChat.lastTimestamp = curr.timestamp;
            }
          } else {
            acc.push({
              id: curr.chatId || curr._id,
              title: curr.message.slice(0, 20) + (curr.message.length > 20 ? '...' : ''),
              lastMessage: curr.message.slice(0, 30) + (curr.message.length > 30 ? '...' : ''),
              lastTimestamp: curr.timestamp
            });
          }
          return acc;
        }, []);
        
        setChatHistories(transformedHistories);
      } catch (err) {
        console.error('Failed to load chat histories:', err);
      }
    };
    
    fetchChatHistories();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/chat/history`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const chatMessages = res.data.filter(msg => 
            (msg.chatId || msg._id) === activeChatId
          ).map(msg => ({
            id: msg._id,
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.message,
            timestamp: msg.timestamp
          }));
          
          setMessages(chatMessages);
          setIsNewChat(false);
          setIsMobileSidebarOpen(false); // Close sidebar on mobile when chat is selected
        } catch (err) {
          console.error('Failed to load chat messages:', err);
        }
      };
      
      fetchMessages();
    } else {
      setMessages([]);
      setIsNewChat(true);
    }
  }, [activeChatId]);

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
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/api/chat/send`,
        { message: input, chatId: activeChatId },
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

      if (isNewChat) {
        const newChat = {
          id: res.data.bot.chatId || res.data.bot._id,
          title: input.slice(0, 20) + (input.length > 20 ? '...' : ''),
          lastMessage: botMessage.content.slice(0, 30) + (botMessage.content.length > 30 ? '...' : ''),
          lastTimestamp: botMessage.timestamp
        };
        setChatHistories(prev => [newChat, ...prev]);
        setActiveChatId(newChat.id);
        setIsNewChat(false);
      } else {
        setChatHistories(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? { 
                ...chat, 
                lastMessage: botMessage.content.slice(0, 30) + (botMessage.content.length > 30 ? '...' : ''),
                lastTimestamp: botMessage.timestamp
              }
            : chat
        ));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setIsNewChat(true);
    setIsMobileSidebarOpen(false); // Close sidebar on mobile
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Mobile Sidebar Toggle Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700"
      >
        {isMobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transform transition-transform duration-300 ease-in-out
          fixed md:static inset-y-0 left-0 w-64 bg-gray-800 p-4 flex flex-col border-r border-gray-700 z-40`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-gray-200 font-semibold text-lg">Chats</h2>
          <div className="flex space-x-2">
            <Link 
              to="/about" 
              className="text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700"
              title="About"
            >
              <FiInfo size={18} />
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700"
              title="Contact"
            >
              <FiMail size={18} />
            </Link>
            <button
              onClick={startNewChat}
              className="text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700"
              title="New Chat"
            >
              <FiPlus size={18} />
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-white p-2 rounded hover:bg-gray-700"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
        
        {/* Chat History List */}
        <div className="flex-1 overflow-y-auto">
          {chatHistories.length === 0 && (
            <div className="text-gray-400 text-sm p-2">No chat history yet</div>
          )}
          {chatHistories.map((history) => (
            <div
              key={history.id}
              onClick={() => setActiveChatId(history.id)}
              className={`p-3 hover:bg-gray-700 rounded-lg mb-2 cursor-pointer transition-colors ${
                activeChatId === history.id ? 'bg-gray-700' : ''
              }`}
            >
              <div className="text-gray-200 font-medium truncate">
                {history.title}
              </div>
              <div className="text-gray-400 text-sm truncate">
                {history.lastMessage}
              </div>
              <div className="text-gray-500 text-xs mt-1">
                {new Date(history.lastTimestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
          <h2 className="text-lg font-semibold">
            {activeChatId ? chatHistories.find(c => c.id === activeChatId)?.title || 'Chat' : 'New Chat'}
          </h2>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            <FiMessageSquare size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && !loading && (
            <div className="flex items-center justify-center h-full text-gray-400">
              {activeChatId ? 'No messages in this chat' : 'Start a new conversation'}
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.role === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] md:max-w-md lg:max-w-lg xl:max-w-xl ${
                  message.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-800 text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="text-left">
              <div className="inline-block p-3 rounded-lg bg-gray-800 text-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-100"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
          <div className="flex space-x-2 md:space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;