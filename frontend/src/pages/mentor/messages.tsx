// src/pages/MessagesPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';

interface Message {
  id: string;
  senderId: string; // 'mentor' or menteeId
  senderName: string;
  text: string;
  timestamp: string; // ISO 8601 string
}

interface Conversation {
  menteeId: string;
  menteeName: string;
  messages: Message[];
}

export const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeMenteeId, setActiveMenteeId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate fetching conversations
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      setError(null);
      try {
        // Mock data
        const mockConversations: Conversation[] = [
          {
            menteeId: 'mentee1',
            menteeName: 'Alice Johnson',
            messages: [
              { id: 'msg1', senderId: 'mentee1', senderName: 'Alice Johnson', text: 'Hi! I had a quick question about our next session.', timestamp: '2025-07-29T10:00:00Z' },
              { id: 'msg2', senderId: 'mentor', senderName: 'You', text: 'Hello Alice! Of course, what\'s on your mind?', timestamp: '2025-07-29T10:05:00Z' },
              { id: 'msg3', senderId: 'mentee1', senderName: 'Alice Johnson', text: 'I was wondering if we could focus on presentation skills.', timestamp: '2025-07-29T10:10:00Z' },
            ],
          },
          {
            menteeId: 'mentee2',
            menteeName: 'Bob Williams',
            messages: [
              { id: 'msg4', senderId: 'mentor', senderName: 'You', text: 'Hey Bob, how are things going with your project?', timestamp: '2025-07-28T14:30:00Z' },
              { id: 'msg5', senderId: 'mentee2', senderName: 'Bob Williams', text: 'Pretty good! I made progress on that bug.', timestamp: '2025-07-28T14:45:00Z' },
            ],
          },
        ];
        setConversations(mockConversations);
        if (mockConversations.length > 0) {
          setActiveMenteeId(mockConversations[0].menteeId);
        }
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Scroll to the bottom of the messages when active mentee or messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMenteeId, conversations]);

  const activeConversation = conversations.find(
    (conv) => conv.menteeId === activeMenteeId
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeMenteeId) return;

    const newMsg: Message = {
      id: `msg${Date.now()}`, // Unique ID
      senderId: 'mentor',
      senderName: 'You',
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.menteeId === activeMenteeId
          ? { ...conv, messages: [...conv.messages, newMsg] }
          : conv
      )
    );
    setNewMessage('');

    // In a real application, you'd send this message to your backend
    console.log('Sending message:', newMsg);
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 text-center text-gray-600">
        Loading messages...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 h-[calc(100vh-100px)] flex flex-col"> {/* Adjust height as needed */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>
      <p className="text-gray-600 mb-8">Chat with your mentees and manage communications.</p>

      <div className="flex flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Conversation List */}
        <div className="w-1/4 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 p-4 border-b border-gray-200">Conversations</h2>
          {conversations.length === 0 ? (
            <p className="text-gray-500 text-center p-4 text-sm">No conversations yet.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {conversations.map((conv) => (
                <li
                  key={conv.menteeId}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${activeMenteeId === conv.menteeId ? 'bg-primary/10' : ''}`}
                  onClick={() => setActiveMenteeId(conv.menteeId)}
                >
                  <div className="flex items-center">
                    <User className="text-gray-500 mr-3" size={20} />
                    <span className="font-medium text-gray-800">{conv.menteeName}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    {conv.messages[conv.messages.length - 1]?.text || 'No messages'}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col">
          {activeConversation ? (
            <>
              <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                <img
                  src={`https://via.placeholder.com/40/CCCCCC/000000?text=${activeConversation.menteeName.split(' ').map(n => n[0]).join('')}`}
                  alt={activeConversation.menteeName}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h2 className="text-xl font-semibold text-gray-800">{activeConversation.menteeName}</h2>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gray-50">
                {activeConversation.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'mentor' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg shadow-md ${
                        message.senderId === 'mentor'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="font-semibold text-sm mb-1">{message.senderName}</p>
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs text-right mt-1 opacity-75">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    type="submit"
                    className="ml-3 p-3 bg-primary text-white rounded-lg hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    disabled={!newMessage.trim()}
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>

      {/* More Functions & Ideas: */}
      <div className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Further Enhancements:</h3>
        <ul className="list-disc list-inside text-blue-700 space-y-2">
          <li>Implement real-time messaging using WebSockets (e.g., Socket.IO, Pusher).</li>
          <li>Add "unread message" indicators and notifications.</li>
          <li>Allow sharing of files, images, and emojis.</li>
          <li>Integrate with a notification system (e.g., browser notifications, email summaries).</li>
          <li>Search functionality within messages.</li>
          <li>"Block User" or "Report Conversation" features.</li>
        </ul>
      </div>
    </div>
  );
};