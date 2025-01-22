'use client'

import { useState } from 'react';

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "Hello! How can I assist you today?", from: "bot" }]);
  const [input, setInput] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, from: 'user' }]);
      setInput('');
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is an automated response...', from: 'bot' },
        ]);
      }, 1000);
    }
  };

  return (
    <div style={styles.chatbotContainer}>
      <div style={styles.chatWindow}>
        <div style={styles.messagesContainer}>
          {messages.map((msg, index) => (
            <div key={index} style={msg.from === 'bot' ? styles.botMessage : styles.userMessage}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button type="submit" style={styles.sendButton}>Send</button>
        </form>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  chatbotContainer: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '90%',
    maxWidth: '400px',
    height: '500px',
    backgroundColor: 'white',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  chatWindow: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    padding: '15px',
    overflowY: 'auto',
    borderBottom: '1px solid #ddd',
  },
  messagesContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    maxHeight: 'calc(100% - 60px)',
  },
  botMessage: {
    backgroundColor: 'black',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    maxWidth: '80%',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#ffbd39',
    padding: '10px',
    borderRadius: '5px',
    color: 'black',
    maxWidth: '80%',
    alignSelf: 'flex-end',
  },
  form: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  input: {
    flex: 1,
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    color: 'black', // Couleur du texte sombre
  },
  sendButton: {
    backgroundColor: '#ffbd39',
    color: 'black',
    padding: '8px 15px',
    marginLeft: '10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Chatbot;
