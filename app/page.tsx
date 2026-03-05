'use client'

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

type Message = {
  text: string;
  from: 'bot' | 'user';
};

type HistoryItem = {
  role: 'user' | 'assistant';
  content: string;
};

// ── Suggestion chips ─────────────────────────────────────────────────────────
const INITIAL_CHIPS = [
  { label: '🎓 Mon parcours', value: 'Parle-moi de ton parcours' },
  { label: '💻 Mes projets', value: 'Quels sont tes projets GitHub ?' },
  { label: '🛠️ Mon stack', value: 'Quel est ton stack technique ?' },
  { label: '📬 Me contacter', value: 'Comment te contacter ?' },
];

// Extract 2-3 contextual chips from the last bot reply
function extractChips(botText: string): { label: string; value: string }[] {
  const chips: { label: string; value: string }[] = [];
  const t = botText.toLowerCase();
  if (t.includes('projet') || t.includes('github')) chips.push({ label: '💻 Voir les projets', value: 'Détaille-moi tes projets GitHub' });
  if (t.includes('stack') || t.includes('python') || t.includes('streamlit') || t.includes('snowflake')) chips.push({ label: '🛠️ Ton stack complet', value: 'Détaille ton stack technique complet' });
  if (t.includes('parcours') || t.includes('polytech') || t.includes('iae') || t.includes('formation')) chips.push({ label: '🎓 Ta formation', value: 'Parle-moi de ta formation en détail' });
  if (t.includes('expérience') || t.includes('efor') || t.includes('boehringer') || t.includes('bioaster')) chips.push({ label: '💼 Tes expériences', value: 'Détaille tes expériences professionnelles' });
  if (t.includes('ia') || t.includes('llm') || t.includes('agent') || t.includes('copilot')) chips.push({ label: '🤖 Ton usage de l\'IA', value: 'Comment tu utilises l\'IA au quotidien ?' });
  if (t.includes('contact') || t.includes('linkedin') || t.includes('disponible') || t.includes('opportunit')) chips.push({ label: '📬 Te contacter', value: 'Comment te contacter ?' });
  if (t.includes('sport') || t.includes('running') || t.includes('marathon') || t.includes('10km')) chips.push({ label: '🏃 Tes perfs sport', value: 'Parle-moi de tes performances en running' });
  // Return max 3, deduplicated
  return chips.slice(0, 3);
}

// ── Contact fallback button ───────────────────────────────────────────────────
function ContactFallback() {
  return (
    <div style={contactFallbackStyle}>
      <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Contacte le vrai Badreddine 👇</span>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <a href="mailto:elkhamlichi.badreddine@gmail.com" style={contactBtnStyle}>
          ✉️ Email
        </a>
        <a href="https://www.linkedin.com/in/badreddine-el-khamlichi/" target="_blank" rel="noopener noreferrer" style={contactBtnStyle}>
          💼 LinkedIn
        </a>
        <a href="https://github.com/BadreddineEK" target="_blank" rel="noopener noreferrer" style={contactBtnStyle}>
          🐙 GitHub
        </a>
      </div>
    </div>
  );
}

const contactFallbackStyle: React.CSSProperties = {
  marginLeft: '36px',
  marginTop: '4px',
  padding: '10px 14px',
  background: '#f1f5f9',
  borderRadius: '12px',
  border: '1px solid #e2e8f0',
};

const contactBtnStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '5px 12px',
  borderRadius: '999px',
  background: '#0f172a',
  color: '#f1f5f9',
  fontSize: '0.75rem',
  fontWeight: 600,
  textDecoration: 'none',
  transition: 'opacity 0.15s',
};

// ── Markdown renderer for bot bubbles ────────────────────────────────────────
const markdownComponents = {
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#ffbd39', textDecoration: 'underline', wordBreak: 'break-all' as const }}>
      {children}
    </a>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p style={{ margin: '0 0 6px 0' }}>{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul style={{ margin: '4px 0', paddingLeft: '18px' }}>{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol style={{ margin: '4px 0', paddingLeft: '18px' }}>{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li style={{ marginBottom: '2px' }}>{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong style={{ color: '#ffbd39' }}>{children}</strong>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code style={{ background: 'rgba(255,189,57,0.15)', padding: '1px 5px', borderRadius: '4px', fontSize: '0.8rem' }}>{children}</code>
  ),
};

function isContactMessage(text: string) {
  const t = text.toLowerCase();
  return t.includes('contact') || t.includes('joindre') || t.includes('reach') || t.includes('email') || t.includes('linkedin');
}

// ── Styles ────────────────────────────────────────────────────────────────────
const switcherStyle: React.CSSProperties = { position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '6px' };
const switcherLabelStyle: React.CSSProperties = { fontSize: '0.65rem', color: 'rgba(0,0,0,0.4)', textAlign: 'left', paddingLeft: '4px', fontFamily: 'monospace' };
const switcherBtnBase: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '999px', textDecoration: 'none', fontSize: '0.75rem', fontWeight: 600, fontFamily: 'monospace', whiteSpace: 'nowrap', cursor: 'pointer', transition: 'opacity 0.15s', border: 'none' };
const classicBtnStyle: React.CSSProperties = { ...switcherBtnBase, background: '#f1f5f9', color: '#1e293b', boxShadow: '0 2px 12px rgba(0,0,0,0.12)' };
const aiBtnStyle: React.CSSProperties = { ...switcherBtnBase, background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', color: '#e2e8f0', boxShadow: '0 2px 12px rgba(15,23,42,0.3)' };

const INITIAL_MESSAGE: Message = {
  text: "Salut ! 👋 Je suis Badreddine (version IA 🤖). Pose-moi des questions sur mon parcours, mes compétences ou mes projets — en français ou en anglais !",
  from: 'bot',
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showInitialChips, setShowInitialChips] = useState(true);
  const [contextualChips, setContextualChips] = useState<{ label: string; value: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim() || isStreaming) return;
    setShowInitialChips(false);
    setContextualChips([]);
    setMessages(prev => [...prev, { text: userMessage, from: 'user' }]);
    setInput('');
    setIsStreaming(true);
    setMessages(prev => [...prev, { text: '', from: 'bot' }]);

    abortRef.current = new AbortController();
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, history }),
        signal: abortRef.current.signal,
      });
      if (!response.ok || !response.body) throw new Error('API error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';
      let sseBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        sseBuffer += decoder.decode(value);
        const lines = sseBuffer.split('\n');
        sseBuffer = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              fullText += parsed.token;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { text: fullText, from: 'bot' };
                return updated;
              });
            }
          } catch { /* skip */ }
        }
      }

      setHistory(prev => [
        ...prev,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: fullText },
      ]);

      // Generate contextual chips from bot reply
      const chips = extractChips(fullText);
      setContextualChips(chips);

    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { text: 'Désolé, une erreur est survenue. Réessaie ! 🙏', from: 'bot' };
          return updated;
        });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input.trim());
  };

  const lastBotMessage = [...messages].reverse().find(m => m.from === 'bot');
  const showContactFallback = !isStreaming && lastBotMessage && isContactMessage(lastBotMessage.text);

  return (
    <>
      <div style={switcherStyle}>
        <span style={switcherLabelStyle}>Choisir une version</span>
        <a href="https://badreddineek.github.io/portfolioBadreddine/" target="_blank" rel="noopener noreferrer" style={classicBtnStyle}>
          <span>📄</span><span>Version classique ↗</span>
        </a>
        <a href="https://badreddineek.github.io/portfolio-ai/" target="_blank" rel="noopener noreferrer" style={aiBtnStyle}>
          <span>🤖</span><span>Version BEK.ai ↗</span>
        </a>
      </div>

      <div style={styles.pageBackground}>
        <div style={styles.chatbotContainer}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.avatarCircle}>BEK</div>
            <div>
              <div style={styles.headerName}>Badreddine EL KHAMLICHI</div>
              <div style={styles.headerSub}>Data Scientist · Digital Twin 🤖</div>
            </div>
            <div style={styles.onlineDot} title="Online" />
          </div>

          {/* Messages */}
          <div style={styles.messagesContainer}>
            {messages.map((msg, index) => (
              <div key={index} style={msg.from === 'bot' ? styles.botRow : styles.userRow}>
                {msg.from === 'bot' && <div style={styles.botAvatar}>BEK</div>}
                <div style={msg.from === 'bot' ? styles.botBubble : styles.userBubble}>
                  {msg.from === 'bot' ? (
                    <>
                      <ReactMarkdown components={markdownComponents}>
                        {msg.text}
                      </ReactMarkdown>
                      {isStreaming && index === messages.length - 1 && (
                        <span style={styles.cursor}>▋</span>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {isStreaming && messages[messages.length - 1]?.text === '' && (
              <div style={styles.botRow}>
                <div style={styles.botAvatar}>BEK</div>
                <div style={styles.typingIndicator}>
                  <span style={styles.dot} />
                  <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </div>
              </div>
            )}

            {/* Contact fallback */}
            {showContactFallback && <ContactFallback />}

            {/* Initial chips */}
            {showInitialChips && !isStreaming && (
              <div style={styles.chipsContainer}>
                {INITIAL_CHIPS.map(chip => (
                  <button key={chip.value} style={styles.chip}
                    onClick={() => sendMessage(chip.value)}
                    onMouseEnter={e => (e.currentTarget.style.background = '#ffbd39')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            {/* Contextual chips after bot reply */}
            {!showInitialChips && !isStreaming && contextualChips.length > 0 && (
              <div style={styles.chipsContainer}>
                {contextualChips.map(chip => (
                  <button key={chip.value} style={styles.chip}
                    onClick={() => sendMessage(chip.value)}
                    onMouseEnter={e => (e.currentTarget.style.background = '#ffbd39')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    {chip.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything... / Pose-moi une question..."
              style={styles.input}
              disabled={isStreaming}
            />
            <button type="submit" style={isStreaming ? styles.sendButtonDisabled : styles.sendButton} disabled={isStreaming}>
              {isStreaming ? '...' : '➤'}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageBackground: { minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: "'Geist', 'Inter', sans-serif" },
  chatbotContainer: { width: '100%', maxWidth: '480px', height: '620px', backgroundColor: '#ffffff', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 },
  avatarCircle: { width: '44px', height: '44px', borderRadius: '50%', background: '#ffbd39', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.75rem', flexShrink: 0 },
  headerName: { color: '#f1f5f9', fontWeight: 700, fontSize: '0.9rem' },
  headerSub: { color: '#94a3b8', fontSize: '0.72rem', marginTop: '2px' },
  onlineDot: { width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', marginLeft: 'auto', flexShrink: 0, boxShadow: '0 0 6px #22c55e' },
  messagesContainer: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', padding: '16px', backgroundColor: '#f8fafc' },
  botRow: { display: 'flex', alignItems: 'flex-end', gap: '8px' },
  userRow: { display: 'flex', justifyContent: 'flex-end' },
  botAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#ffbd39', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.6rem', flexShrink: 0 },
  botBubble: { backgroundColor: '#0f172a', color: '#f1f5f9', padding: '10px 14px', borderRadius: '16px 16px 16px 4px', maxWidth: '78%', fontSize: '0.85rem', lineHeight: '1.5' },
  userBubble: { backgroundColor: '#ffbd39', color: '#0f172a', padding: '10px 14px', borderRadius: '16px 16px 4px 16px', maxWidth: '78%', fontSize: '0.85rem', lineHeight: '1.5', fontWeight: 500, whiteSpace: 'pre-wrap' },
  typingIndicator: { backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', display: 'flex', gap: '5px', alignItems: 'center' },
  dot: { width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ffbd39', animation: 'bounce 1.2s infinite', display: 'inline-block' },
  cursor: { display: 'inline-block', marginLeft: '2px', animation: 'blink 0.8s step-end infinite', color: '#ffbd39', fontWeight: 'bold' },
  chipsContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px', paddingLeft: '36px' },
  chip: { padding: '6px 12px', borderRadius: '999px', border: '1.5px solid #ffbd39', background: 'transparent', color: '#0f172a', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.15s', fontFamily: "'Geist', 'Inter', sans-serif" },
  form: { display: 'flex', padding: '12px 16px', gap: '8px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff', flexShrink: 0 },
  input: { flex: 1, padding: '10px 14px', fontSize: '0.85rem', border: '1.5px solid #e2e8f0', borderRadius: '999px', color: '#0f172a', outline: 'none', backgroundColor: '#f8fafc' },
  sendButton: { backgroundColor: '#ffbd39', color: '#0f172a', padding: '10px 16px', border: 'none', borderRadius: '999px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', flexShrink: 0 },
  sendButtonDisabled: { backgroundColor: '#e2e8f0', color: '#94a3b8', padding: '10px 16px', border: 'none', borderRadius: '999px', cursor: 'not-allowed', fontWeight: 700, fontSize: '1rem', flexShrink: 0 },
};
