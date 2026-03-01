// ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

function ChatWindow({ onClose }) {

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      sender: 'bot',
      text: "Hey there! I'm Akarsh's multi-agent AI assistant—powered by Groq + Llama, fueled by caffeine, and trained to act smarter than I look. 🤖✨\n\nI can dig through Akarsh's documents using RAG, help you write a perfect email to him, or just vibe with your questions.\n\nSo… what mission are we running today? 🚀"
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: "user", content: "reply in a friendly tone and use emojis sometimes in the chat." },
    { role: "assistant", content: "Got it! I'll keep things friendly and fun with emojis! 😊✨" }
  ]);

  // emailState stored in ref — never stale in async callbacks
  const emailStateRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-focus textarea on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-grow textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const fetchWithTimeout = (url, options = {}, timeout = 25000) => {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("timeout")), timeout)
      )
    ]);
  };

  const replaceThinkingMessage = (id, newText) => {
    setMessages(prev =>
      prev.map(msg => msg.id === id ? { ...msg, text: newText } : msg)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setIsLoading(true);

    const userMessage = { id: crypto.randomUUID(), sender: 'user', text: input };
    const thinkingId = crypto.randomUUID();
    const thinkingMessage = { id: thinkingId, sender: 'bot', text: 'Thinking...' };

    setMessages(prev => [...prev, userMessage, thinkingMessage]);

    const userInput = input;
    setInput('');

    // Re-focus textarea immediately after clearing input
    setTimeout(() => textareaRef.current?.focus(), 0);

    const trimmedHistory = chatHistory.slice(-20);

    try {
      const API_URL = 'https://aj-backend.vercel.app/api/ask-gemini';

      const response = await fetchWithTimeout(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userInput,
          history: trimmedHistory,
          emailState: emailStateRef.current,
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      // Update emailState ref immediately
      emailStateRef.current = data.emailState || null;

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
      // Re-focus after response arrives too
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const markdownComponents = {
    p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
    ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2" {...props} />,
    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
    strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
    code: ({ node, inline, className, children, ...props }) =>
      inline ? (
        <code className="bg-gray-800 px-1.5 py-0.5 rounded-md font-mono text-sm" {...props}>
          {children}
        </code>
      ) : (
        <pre className="block w-full overflow-auto bg-gray-800 p-2 rounded-md font-mono text-sm">
          <code className={className} {...props}>{children}</code>
        </pre>
      ),
  };

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
          />
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
