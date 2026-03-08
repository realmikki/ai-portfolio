import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
const ADMIN_PASSWORD = "123"; // Change this to match server.js

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    background: #080810;
    font-family: 'DM Sans', system-ui, sans-serif;
    color: #e0e0f0;
  }

  .layout {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  /* ---- LEFT PANEL ---- */
  .profile-panel {
    width: 320px;
    flex-shrink: 0;
    background: #0d0d18;
    border-right: 1px solid #1a1a2e;
    display: flex;
    flex-direction: column;
    padding: 40px 28px;
    position: relative;
    overflow: hidden;
  }

  .profile-panel::before {
    content: '';
    position: absolute;
    top: -80px; left: -80px;
    width: 300px; height: 300px;
    background: radial-gradient(circle, #5b7fff18, transparent 70%);
    pointer-events: none;
  }

  .avatar-ring {
    width: 72px; height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, #5b7fff, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin-bottom: 20px;
    position: relative;
    flex-shrink: 0;
  }

  .online-dot {
    position: absolute;
    bottom: 3px; right: 3px;
    width: 14px; height: 14px;
    background: #4ade80;
    border-radius: 50%;
    border: 2px solid #0d0d18;
    box-shadow: 0 0 8px #4ade8088;
  }

  .profile-name {
    font-size: 22px;
    font-weight: 600;
    color: #f0f0ff;
    letter-spacing: -0.4px;
    margin-bottom: 4px;
  }

  .profile-title {
    font-size: 13px;
    color: #5b7fff;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .profile-bio {
    font-size: 13px;
    color: #505068;
    line-height: 1.7;
    margin-bottom: 28px;
  }

  .divider {
    height: 1px;
    background: #1a1a2e;
    margin-bottom: 24px;
  }

  .skills-label {
    font-size: 10px;
    color: #404058;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
    margin-bottom: 28px;
  }

  .skill-tag {
    background: #13132a;
    border: 1px solid #2a2a4a;
    border-radius: 6px;
    padding: 4px 10px;
    font-size: 11px;
    font-family: 'DM Mono', monospace;
    color: #8888c8;
  }

  .profile-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: auto;
  }

  .profile-link {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #505068;
    text-decoration: none;
    transition: color 0.15s;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    padding: 0;
  }

  .profile-link:hover { color: #a0a0c8; }

  .link-icon {
    width: 28px; height: 28px;
    background: #13132a;
    border: 1px solid #1e1e3a;
    border-radius: 7px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }

  /* ---- RIGHT PANEL (chat) ---- */
  .chat-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    background: #080810;
  }

  .chat-header {
    height: 60px;
    border-bottom: 1px solid #121220;
    display: flex;
    align-items: center;
    padding: 0 32px;
    gap: 12px;
    flex-shrink: 0;
  }

  .chat-header-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 6px #4ade8088;
  }

  .chat-header-text {
    font-size: 13px;
    color: #505068;
  }

  .chat-header-text span {
    color: #8888a8;
    font-weight: 500;
  }

  .chat-header-right {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* Doc loaded badge in header */
  .doc-badge {
    display: flex; align-items: center; gap: 6px;
    background: #0f1a0f; border: 1px solid #1a3a1a;
    border-radius: 20px; padding: 4px 12px;
    font-size: 11px; color: #4ade80;
  }

  .doc-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #4ade80; box-shadow: 0 0 5px #4ade8088;
  }

  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 40px 0 20px;
    scrollbar-width: thin;
    scrollbar-color: #1a1a2e transparent;
  }

  .messages-area::-webkit-scrollbar { width: 4px; }
  .messages-area::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 2px; }

  .welcome {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 40px;
    text-align: center;
    gap: 20px;
  }

  .welcome-greeting {
    font-size: 28px;
    font-weight: 600;
    color: #e0e0f8;
    letter-spacing: -0.5px;
  }

  .welcome-greeting span {
    background: linear-gradient(135deg, #5b7fff, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .welcome-sub {
    font-size: 14px;
    color: #404058;
    max-width: 400px;
    line-height: 1.7;
  }

  .suggestions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 8px;
    max-width: 480px;
    width: 100%;
  }

  .suggestion-card {
    background: #0d0d18;
    border: 1px solid #1a1a2e;
    border-radius: 10px;
    padding: 14px 16px;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s;
    font-family: inherit;
  }

  .suggestion-card:hover {
    background: #111120;
    border-color: #5b7fff44;
    transform: translateY(-1px);
  }

  .suggestion-card-icon { font-size: 18px; margin-bottom: 8px; }

  .suggestion-card-text {
    font-size: 12px;
    color: #707090;
    line-height: 1.5;
  }

  .message-row {
    display: flex;
    padding: 8px 32px;
    gap: 14px;
    max-width: 860px;
    margin: 0 auto;
    width: 100%;
    animation: fadeUp 0.2s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(5px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg-avatar {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .msg-avatar-user { background: #1a1a2e; color: #8888a8; font-weight: 600; font-size: 11px; }
  .msg-avatar-ai { background: linear-gradient(135deg, #5b7fff, #a78bfa); }

  .msg-body { flex: 1; min-width: 0; }

  .msg-name {
    font-size: 11px;
    font-weight: 600;
    color: #404058;
    margin-bottom: 6px;
    letter-spacing: 0.03em;
  }

  .msg-text {
    font-size: 14px;
    line-height: 1.8;
    color: #c0c0e0;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .msg-text-user { color: #9090b8; }

  .typing { display: flex; gap: 4px; align-items: center; padding: 4px 0; }
  .typing-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: #5b7fff; animation: pulse 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes pulse {
    0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
    30% { opacity: 1; transform: scale(1.3); }
  }

  .input-area {
    padding: 16px 32px 28px;
    flex-shrink: 0;
  }

  .input-box {
    max-width: 860px;
    margin: 0 auto;
    background: #0d0d18;
    border: 1px solid #1e1e32;
    border-radius: 14px;
    display: flex;
    align-items: flex-end;
    gap: 10px;
    padding: 12px 14px;
    transition: all 0.15s;
  }

  .input-box:focus-within {
    border-color: #5b7fff44;
    box-shadow: 0 0 0 3px #5b7fff0a;
  }

  .chat-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #d0d0f0;
    font-size: 14px;
    font-family: inherit;
    resize: none;
    line-height: 1.6;
    max-height: 140px;
    min-height: 24px;
    overflow-y: auto;
    scrollbar-width: none;
  }

  .chat-textarea::placeholder { color: #303048; }

  .send-button {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, #5b7fff, #a78bfa);
    border: none; border-radius: 8px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: all 0.15s;
  }

  .send-button:disabled { opacity: 0.25; cursor: default; }
  .send-button:not(:disabled):hover { transform: scale(1.06); box-shadow: 0 4px 16px #5b7fff44; }

  .input-hint { text-align: center; font-size: 11px; color: #252535; margin-top: 10px; }

  /* ---- ADMIN PANEL ---- */
  .admin-trigger {
    position: fixed;
    bottom: 16px; right: 16px;
    width: 32px; height: 32px;
    background: transparent;
    border: none;
    cursor: pointer;
    opacity: 0.08;
    transition: opacity 0.2s;
    font-size: 18px;
    z-index: 100;
  }
  .admin-trigger:hover { opacity: 0.4; }

  .admin-overlay {
    position: fixed;
    inset: 0;
    background: #00000088;
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.15s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .admin-modal {
    background: #0d0d18;
    border: 1px solid #2a2a4a;
    border-radius: 16px;
    padding: 32px;
    width: 420px;
    max-width: 90vw;
    animation: slideUp 0.2s ease;
  }

  @keyframes slideUp {
    from { transform: translateY(10px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .admin-title {
    font-size: 16px;
    font-weight: 600;
    color: #e0e0f8;
    margin-bottom: 6px;
  }

  .admin-sub {
    font-size: 12px;
    color: #404058;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .admin-input {
    width: 100%;
    background: #080810;
    border: 1px solid #1e1e32;
    border-radius: 8px;
    padding: 10px 14px;
    color: #d0d0f0;
    font-size: 14px;
    font-family: inherit;
    outline: none;
    margin-bottom: 12px;
    transition: border-color 0.15s;
  }

  .admin-input:focus { border-color: #5b7fff44; }

  .admin-btn {
    width: 100%;
    background: linear-gradient(135deg, #5b7fff, #a78bfa);
    border: none;
    border-radius: 8px;
    padding: 11px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
    margin-bottom: 10px;
  }

  .admin-btn:hover { opacity: 0.9; }
  .admin-btn:disabled { opacity: 0.4; cursor: default; }

  .admin-cancel {
    width: 100%;
    background: transparent;
    border: 1px solid #1e1e32;
    border-radius: 8px;
    padding: 10px;
    color: #505068;
    font-size: 13px;
    font-family: inherit;
    cursor: pointer;
    transition: all 0.15s;
  }

  .admin-cancel:hover { border-color: #2a2a4a; color: #8080a0; }

  .admin-status {
    font-size: 12px;
    padding: 8px 12px;
    border-radius: 7px;
    margin-bottom: 12px;
    text-align: center;
  }

  .admin-status.success { background: #0f1a0f; color: #4ade80; border: 1px solid #1a3a1a; }
  .admin-status.error { background: #1a0f0f; color: #f87171; border: 1px solid #3a1a1a; }
  .admin-status.loading { background: #0f0f1a; color: #8888c8; border: 1px solid #1e1e3a; }

  .docs-list {
    margin-bottom: 16px;
  }

  .docs-list-label {
    font-size: 10px;
    color: #404058;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .doc-item {
    display: flex; align-items: center; gap: 8px;
    background: #0f1a0f; border: 1px solid #1a3a1a;
    border-radius: 7px; padding: 8px 12px; margin-bottom: 6px;
  }

  .doc-item-name { font-size: 12px; color: #4ade80; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;

const suggestions = [
  { icon: "💻", text: "What technologies does Mikael know?" },
  { icon: "🎓", text: "Tell me about his education" },
  { icon: "🚀", text: "What projects has he worked on?" },
  { icon: "📬", text: "How can I contact Mikael?" },
];

const skills = ["React", "Node.js", "Kotlin", "Java", "C#", "Python", "C", "Git"];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin state
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminStep, setAdminStep] = useState("password"); // "password" | "upload"
  const [passwordInput, setPasswordInput] = useState("");
  const [adminStatus, setAdminStatus] = useState(null); // { type, text }
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const adjustTextarea = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "24px";
    ta.style.height = Math.min(ta.scrollHeight, 140) + "px";
  };

  // Secret trigger: triple-click the bottom-right button
  const handleAdminTrigger = () => {
    clickCount.current += 1;
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => { clickCount.current = 0; }, 600);
    if (clickCount.current >= 3) {
      clickCount.current = 0;
      setShowAdmin(true);
      setAdminStep("password");
      setPasswordInput("");
      setAdminStatus(null);
    }
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setAdminStep("upload");
      setAdminStatus(null);
    } else {
      setAdminStatus({ type: "error", text: "Incorrect password." });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setAdminStatus({ type: "loading", text: `Reading ${file.name}...` });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: { "x-admin-password": ADMIN_PASSWORD },
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setUploadedDocs(prev => [...prev, file.name]);
        setAdminStatus({ type: "success", text: `✓ ${file.name} loaded (${data.chunks} chunks)` });
      } else {
        setAdminStatus({ type: "error", text: data.error || "Upload failed." });
      }
    } catch {
      setAdminStatus({ type: "error", text: "Could not connect to backend." });
    }

    setUploading(false);
    e.target.value = "";
  };

  const sendMessage = async (text) => {
    const question = text || input.trim();
    if (!question || loading) return;

    setMessages(prev => [...prev, { role: "user", text: question }]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "24px";
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history: messages })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", text: data.answer }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "ai",
        text: "Sorry, I couldn't connect. Make sure the backend is running."
      }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="layout">

        {/* Left profile panel */}
        <div className="profile-panel">
          <div className="avatar-ring">
            👨‍💻
            <div className="online-dot" />
          </div>

          <div className="profile-name">Mikael Gaup</div>
          <div className="profile-title">Frontend & Mobile Developer</div>

          <div className="profile-bio">
            2nd year IT student at Høyskolen Kristiania. Building AI-powered web apps, learning Python and C. Former esports pro turned developer.
          </div>

          <div className="divider" />

          <div className="skills-label">Tech Stack</div>
          <div className="skills-list">
            {skills.map(s => (
              <div key={s} className="skill-tag">{s}</div>
            ))}
          </div>

          <div className="divider" />

          <div className="profile-links">
            <button className="profile-link">
              <div className="link-icon">🐙</div>
              GitHub
            </button>
            <button className="profile-link">
              <div className="link-icon">💼</div>
              LinkedIn
            </button>
            <button className="profile-link">
              <div className="link-icon">📄</div>
              Download CV
            </button>
          </div>
        </div>

        {/* Right chat panel */}
        <div className="chat-panel">
          <div className="chat-header">
            <div className="chat-header-dot" />
            <div className="chat-header-text">
              Chat with <span>Mikael's AI</span> — ask anything about his background
            </div>
            <div className="chat-header-right">
              {uploadedDocs.length > 0 && (
                <div className="doc-badge">
                  <div className="doc-badge-dot" />
                  {uploadedDocs.length} doc{uploadedDocs.length > 1 ? "s" : ""} loaded
                </div>
              )}
            </div>
          </div>

          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="welcome">
                <div className="welcome-greeting">
                  Hi, I'm <span>Mikael's AI</span> 👋
                </div>
                <div className="welcome-sub">
                  Ask me anything about Mikael's skills, experience, education, or projects. I'm here to help you get to know him.
                </div>
                <div className="suggestions-grid">
                  {suggestions.map(s => (
                    <button key={s.text} className="suggestion-card" onClick={() => sendMessage(s.text)}>
                      <div className="suggestion-card-icon">{s.icon}</div>
                      <div className="suggestion-card-text">{s.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, i) => (
                  <div className="message-row" key={i}>
                    <div className={`msg-avatar ${msg.role === "user" ? "msg-avatar-user" : "msg-avatar-ai"}`}>
                      {msg.role === "user" ? "You" : "✦"}
                    </div>
                    <div className="msg-body">
                      <div className="msg-name">
                        {msg.role === "user" ? "You" : "Mikael's AI"}
                      </div>
                      <div className={`msg-text ${msg.role === "user" ? "msg-text-user" : ""}`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="message-row">
                    <div className="msg-avatar msg-avatar-ai">✦</div>
                    <div className="msg-body">
                      <div className="msg-name">Mikael's AI</div>
                      <div className="typing">
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                        <div className="typing-dot" />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </>
            )}
          </div>

          <div className="input-area">
            <div className="input-box">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                placeholder="Ask about Mikael's skills, projects, or experience..."
                value={input}
                rows={1}
                onChange={e => { setInput(e.target.value); adjustTextarea(); }}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        </div>
      </div>

      {/* Hidden admin trigger — triple click the dot in bottom right */}
      <button className="admin-trigger" onClick={handleAdminTrigger}>⚙</button>

      {/* Admin modal */}
      {showAdmin && (
        <div className="admin-overlay" onClick={e => { if (e.target === e.currentTarget) setShowAdmin(false); }}>
          <div className="admin-modal">
            {adminStep === "password" ? (
              <>
                <div className="admin-title">Admin Access</div>
                <div className="admin-sub">Enter your password to manage documents.</div>
                {adminStatus && (
                  <div className={`admin-status ${adminStatus.type}`}>{adminStatus.text}</div>
                )}
                <input
                  className="admin-input"
                  type="password"
                  placeholder="Password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handlePasswordSubmit()}
                  autoFocus
                />
                <button className="admin-btn" onClick={handlePasswordSubmit}>
                  Continue
                </button>
                <button className="admin-cancel" onClick={() => setShowAdmin(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div className="admin-title">Document Manager</div>
                <div className="admin-sub">Upload PDFs or TXT files. The AI will use all loaded documents to answer questions.</div>

                {adminStatus && (
                  <div className={`admin-status ${adminStatus.type}`}>{adminStatus.text}</div>
                )}

                {uploadedDocs.length > 0 && (
                  <div className="docs-list">
                    <div className="docs-list-label">Loaded documents</div>
                    {uploadedDocs.map((doc, i) => (
                      <div key={i} className="doc-item">
                        <span>📄</span>
                        <span className="doc-item-name">{doc}</span>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <button
                  className="admin-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "+ Upload Document"}
                </button>
                <button className="admin-cancel" onClick={() => setShowAdmin(false)}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}