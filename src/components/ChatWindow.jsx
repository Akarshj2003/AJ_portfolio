// 1. Import 'useEffect' and 'useRef'
import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

function ChatWindow({ onClose }) {

  // -------------------------------
  // STATE
  // -------------------------------
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: crypto.randomUUID(),
      sender: 'bot', 
      text: "Hey there! I'm Akarsh's multi-agent AI assistant—powered by Gemini, fueled by caffeine, and trained to act smarter than I look.  \nI can dig through Akarsh's documents using RAG, help you write a perfect email to him,  \nor just vibe with your questions.  \nSo… what mission are we running today? 🚀" 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
  {
    role: "user",
    parts: [
      {
        text: "From now on, reply in a friendly tone and use emojis in the chat."
      }
    ]
  },
  {
    role: "model",
    parts: [
      {
        text: "🌟 Got it! I'll reply in a friendly tone and use emojis to keep things fun and warm! 😊🔥"
      }
    ]
  }
]);


  const messagesEndRef = useRef(null);

  // WhatsApp style textarea auto-grow
  const textareaRef = useRef(null);


  // -------------------------------
  // SCROLL TO BOTTOM
  // -------------------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);


  // -------------------------------
  // TIMEOUT WRAPPER
  // -------------------------------
  const fetchWithTimeout = (url, options = {}, timeout = 20000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      )
    ]);
  };


  // -------------------------------
  // REPLACE THINKING MESSAGE
  // -------------------------------
  const replaceThinkingMessage = (id, newText) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === id ? { ...msg, text: newText } : msg
      )
    );
  };


  // -------------------------------
  // HANDLE SUBMIT
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    const userMessage = { 
      id: crypto.randomUUID(), 
      sender: 'user', 
      text: input 
    };

    const thinkingId = crypto.randomUUID();
    const thinkingMessage = { id: thinkingId, sender: 'bot', text: 'Thinking...' };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);

    const userInput = input;
    setInput('');

    try {
      const API_URL = 'https://aj-backend.vercel.app/api/ask-gemini';

      const response = await fetchWithTimeout(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userInput, history: chatHistory }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data.history)

      setChatHistory(data.history);
      replaceThinkingMessage(thinkingId, data.answer);

    } catch (error) {
      console.error('Error fetching response:', error);
      replaceThinkingMessage(
        thinkingId,
        '⚠️ The server took too long or hit an error. Please try again!'
      );
    } finally {
      setIsLoading(false);
    }
  };


  // -------------------------------
  // MARKDOWN STYLES
  // -------------------------------
  const markdownComponents = {
    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
    code: ({ inline, ...props }) =>
      inline ? (
        <code className="bg-gray-800 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props} />
      ) : (
        <code className="block w-full overflow-auto bg-gray-800 p-2 rounded-md font-mono text-sm" {...props} />
      ),
    pre: ({ node, ...props }) => (
      <pre className="block w-full overflow-auto bg-gray-800 p-2 rounded-md font-mono text-sm" {...props} />
    ),
  };


  // -------------------------------
  // UI RETURN
  // -------------------------------
  return (
    <div className="fixed z-50 bottom-0 right-0 h-[90%] w-full 
    	 sm:w-[90%] md:w-[80%] lg:w-[50%] 
    	 sm:bottom-6 sm:right-6 
    	 flex flex-col bg-gray-900 text-white 
    	 rounded-t-lg sm:rounded-lg shadow-xl 
    	 border border-gray-700 overflow-hidden">

      <div className="w-full h-full flex flex-col bg-gray-900 text-white shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h3 className="text-lg font-semibold">Chat Assistant</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white"
            aria-label="Close chat"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg whitespace-pre-wrap ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 rounded-br-none'
                    : 'bg-gray-700 rounded-bl-none max-w-md'
                }`}
              >
                <ReactMarkdown components={markdownComponents}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-700 flex-shrink-0 flex gap-2 items-end">

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={1}
            className="flex-1 max-h-32 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 
              resize-none overflow-hidden"
            placeholder="Ask a question..."
            disabled={isLoading}
          ></textarea>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Wait...' : 'Send'}
          </button>

        </form>

      </div>
    </div>
  );
}

export default ChatWindow;
