// src/app/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './page.module.css';

interface Message {
  text: string;
  isUser: boolean;
  isError?: boolean;
  isTyping?: boolean;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { text: input, isUser: true };
    setMessages((prev: Message[]) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      console.log('Sending API request for input:', input);
      const response = await fetch(`/api/chat?q=${encodeURIComponent(input)}`);
      console.log('API response status:', response.status);
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

      const data = await response.json();
      console.log('API response data:', data);
      if (data.error) throw new Error(data.error);

      setMessages((prev: Message[]) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('API error:', error);
      setMessages((prev: Message[]) => [
        ...prev,
        { text: 'Sorry, something went wrong', isUser: false, isError: true },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.chatWindow}>
        <div className={styles.messages}>
          {messages.map((message: Message, index: number) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.isUser ? styles.userMessage : styles.botMessage
              } ${message.isError ? styles.errorMessage : ''}`}
            >
              {message.text}
            </div>
          ))}
          {isTyping && (
            <div className={`${styles.message} ${styles.botMessage} ${styles.typing}`}>
              Bot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <footer className={styles.inputContainer}>
        <textarea
          className={styles.input}
          value={input}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button className={styles.sendButton} onClick={handleSend}>
          Send
        </button>
      </footer>
    </div>
  );
}