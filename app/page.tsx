'use client'

import { useState } from 'react';

// Cross-portfolio version switcher styles
const switcherStyle: React.CSSProperties = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  zIndex: 9999,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '6px',
};

const switcherLabelStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: 'rgba(0,0,0,0.4)',
  textAlign: 'right',
  paddingRight: '4px',
  fontFamily: 'monospace',
};

const switcherBtnBaseStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  padding: '7px 14px',
  borderRadius: '999px',
  textDecoration: 'none',
  fontSize: '0.75rem',
  fontWeight: 600,
  fontFamily: 'monospace',
  whiteSpace: 'nowrap',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  border: 'none',
};

const classicBtnStyle: React.CSSProperties = {
  ...switcherBtnBaseStyle,
  background: '#f1f5f9',
  color: '#1e293b',
  boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
};

const aiBtnStyle: React.CSSProperties = {
  ...switcherBtnBaseStyle,
  background: 'linear-gradient(135deg, #0f172a, #1e3a5f)',
  color: '#e2e8f0',
  boxShadow: '0 2px 12px rgba(15,23,42,0.3)',
};

const Chatbot = () => {
  const [messages, setMessages] = useState([{ text: "Salut! Désolé pour l'instant je suis encore en cours de dévéloppement", from: "bot" }]);
  const [input, setInput] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, from: 'user' }]);
      setInput('');

      try {
        const response = await fetch('/api/chatbot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: data.botResponse, from: 'bot' },
        ]);
      } catch (error) {
        console.error('Error while fetching the chatbot response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'Sorry, something went wrong...', from: 'bot' },
        ]);
      }
    }
  };

  return (
    <>
      {/* Cross-portfolio version switcher */}
      <div style={switcherStyle}>
        <span style={switcherLabelStyle}>Choisir une version</span>
        <a
          href="https://badreddineek.github.io/portfolioBadreddine/"
          target="_blank"
          rel="noopener noreferrer"
          style={classicBtnStyle}
        >
          <span>📄</span>
          <span>Version classique ↗</span>
        </a>
        <a
          href="https://badreddineek.github.io/portfolio-ai/"
          target="_blank"
          rel="noopener noreferrer"
          style={aiBtnStyle}
        >
          <span>🤖</span>
          <span>Version BEK.ai ↗</span>
        </a>
      </div>

      {/* Chatbot widget */}
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
    </>
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
    color: 'black',
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
