import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false); // État pour gérer l'ouverture et la fermeture du chatbot

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Icône pour ouvrir le chatbot */}
      <button 
        onClick={toggleChatbot} 
        style={styles.chatbotIcon}
      >
        💬
      </button>

      {/* Fenêtre modale du chatbot */}
      {isOpen && (
        <div style={styles.chatbotWindow}>
          <div style={styles.chatbotHeader}>
            <h3>Chatbot</h3>
            <button onClick={toggleChatbot} style={styles.closeButton}>X</button>
          </div>
          <div style={styles.chatArea}>
            <textarea 
              placeholder="Posez votre question ici..."
              rows={5}
              style={styles.textarea}
            />
            <button 
              type="submit" 
              style={styles.sendButton}
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  chatbotIcon: {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    fontSize: '30px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    padding: '10px',
    cursor: 'pointer',
  },
  chatbotWindow: {
    position: 'fixed',
    bottom: '80px',
    right: '20px',
    width: '300px',
    height: '400px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '15px',
    zIndex: 1000,
  },
  chatbotHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  closeButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
  },
  chatArea: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 50px)',
  },
  textarea: {
    resize: 'none',
    width: '100%',
    height: '80%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    marginBottom: '10px',
  },
  sendButton: {
    padding: '10px',
    backgroundColor: '#0070f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default Chatbot;
