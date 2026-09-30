/*
 * BEK Chat Widget — embeddable assistant for the badreddineek.com ecosystem.
 * Drop this on any page:
 *   <script src="https://chatbot-portfolio-eosin.vercel.app/widget.js" defer></script>
 *
 * The widget talks to the /api/chatbot endpoint of the host it was loaded from,
 * so the API origin is derived automatically from this script's own URL.
 * Styling follows the ecosystem design system (beige / teal, Cabinet Grotesk + Satoshi),
 * and it adapts to the host page theme via the <html data-theme="..."> attribute.
 */
(function () {
  'use strict';

  if (window.__bekChatLoaded) return;
  window.__bekChatLoaded = true;

  var SCRIPT = document.currentScript;
  var API_BASE = (function () {
    try { return new URL(SCRIPT.src).origin; }
    catch (e) { return 'https://chatbot-portfolio-eosin.vercel.app'; }
  })();
  var API_URL = API_BASE + '/api/chatbot';

  var MODE = (SCRIPT && SCRIPT.getAttribute('data-bek-mode')) || 'portfolio';
  var THEME_OVERRIDE = (SCRIPT && SCRIPT.getAttribute('data-bek-theme')) || 'auto';
  var CURRENT_LANG = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'fr';

  var UI_TEXT = {
    fr: {
      open: 'Ouvrir le chat avec Badreddine', assistant: 'Assistant IA', close: 'Fermer',
      placeholder: 'Ecris ton message...', message: 'Message', send: 'Envoyer',
      footer: 'Propulse par IA, les reponses peuvent contenir des erreurs', you: 'Toi'
    },
    en: {
      open: 'Open chat with Badreddine', assistant: 'AI assistant', close: 'Close',
      placeholder: 'Type your message...', message: 'Message', send: 'Send',
      footer: 'AI-powered; replies may contain errors', you: 'You'
    }
  };

  // Per-context welcome message and suggestion chips.
  var PRESETS = {
    portfolio: {
      welcome: "Salut. Je suis Badreddine, version IA. Pose-moi tes questions sur mon parcours, mes projets ou mon stack, en francais ou en anglais.",
      chips: [
        { label: 'Mon parcours', value: 'Parle-moi de ton parcours' },
        { label: 'Mes projets', value: 'Quels sont tes projets ?' },
        { label: 'Mon stack', value: 'Quel est ton stack technique ?' },
        { label: 'Me contacter', value: 'Comment te contacter ?' }
      ]
    },
    hub: {
      welcome: "Bienvenue. Je suis l'assistant de Badreddine. Je peux t'orienter dans son univers (portfolio, services, labs) ou repondre a tes questions. Que cherches-tu ?",
      chips: [
        { label: 'Decouvrir le portfolio', value: 'Montre-moi le portfolio de Badreddine' },
        { label: 'Les services', value: 'Quels services propose Badreddine ?' },
        { label: 'Les Labs', value: "C'est quoi les Labs ?" },
        { label: 'Le contacter', value: 'Comment contacter Badreddine ?' }
      ]
    },
    services: {
      welcome: "Salut. Je peux t'expliquer les prestations de Badreddine (apps data, IA, automatisation, web) et t'aider a cadrer ton besoin. Qu'est-ce qui t'amene ?",
      chips: [
        { label: 'Sheet to App', value: 'Explique-moi le service Sheet to App' },
        { label: 'Automatisation IA', value: 'Comment fonctionne le setup IA et automatisation ?' },
        { label: 'Dashboard', value: 'Je veux un dashboard pour mes donnees' },
        { label: 'Demander un devis', value: 'Comment demander un devis ?' }
      ]
    }
  };
  var PRESETS_EN = {
    portfolio: {
      welcome: "Hi, I'm Badreddine's AI assistant. Ask me about my background, projects or tech stack, in French or English.",
      chips: [
        { label: 'My background', value: 'Tell me about your background' },
        { label: 'My projects', value: 'What projects have you built?' },
        { label: 'My tech stack', value: 'What is your tech stack?' },
        { label: 'Contact me', value: 'How can I contact you?' }
      ]
    },
    hub: {
      welcome: "Welcome. I'm Badreddine's assistant. I can point you to the portfolio, services or Labs, or answer your questions. What are you looking for?",
      chips: [
        { label: 'Explore the portfolio', value: 'Show me Badreddine\'s portfolio' },
        { label: 'Services', value: 'What services does Badreddine offer?' },
        { label: 'The Labs', value: 'What are the Labs?' },
        { label: 'Contact Badreddine', value: 'How can I contact Badreddine?' }
      ]
    },
    services: {
      welcome: "Hi. I can explain Badreddine's services (data apps, AI, automation and web) and help scope your needs. What are you looking for?",
      chips: [
        { label: 'Sheet to App', value: 'Explain the Sheet to App service' },
        { label: 'AI automation', value: 'How does the AI automation setup work?' },
        { label: 'Dashboard', value: 'I need a dashboard for my data' },
        { label: 'Request a quote', value: 'How can I request a quote?' }
      ]
    }
  };
  function getPreset() {
    var presets = CURRENT_LANG === 'en' ? PRESETS_EN : PRESETS;
    return presets[MODE] || presets.portfolio;
  }
  var PRESET = getPreset();
  var UI = UI_TEXT[CURRENT_LANG];

  // ── Styles ──────────────────────────────────────────────────────────────
  var css = [
    '.bek-chat,.bek-chat *{box-sizing:border-box}',
    '.bek-chat{',
    "  --bek-bg:#f7f6f2;--bek-surface:#faf9f7;--bek-surface2:#f0ede7;",
    '  --bek-text:#1a1814;--bek-muted:#6f6a60;--bek-border:rgba(26,24,20,.12);',
    '  --bek-ac:#01696f;--bek-ac-text:#fff;',
    "  --bek-fd:'Cabinet Grotesk','Satoshi',system-ui,sans-serif;",
    "  --bek-fb:'Satoshi','Inter',system-ui,sans-serif;",
    '  --bek-shadow:0 12px 40px rgba(26,24,20,.18);',
    '  font-family:var(--bek-fb);}',
    '.bek-chat[data-bek-theme="dark"]{',
    '  --bek-bg:#16140f;--bek-surface:#211e18;--bek-surface2:#2b271f;',
    '  --bek-text:#f2efe8;--bek-muted:#a8a294;--bek-border:rgba(255,255,255,.12);',
    '  --bek-ac:#4f98a3;--bek-ac-text:#0c0b08;',
    '  --bek-shadow:0 12px 40px rgba(0,0,0,.5);}',
    // Launcher button
    '.bek-fab{position:fixed;bottom:22px;right:22px;z-index:2147483000;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;background:var(--bek-ac);color:var(--bek-ac-text);display:flex;align-items:center;justify-content:center;box-shadow:var(--bek-shadow);transition:transform .18s cubic-bezier(.16,1,.3,1),opacity .18s}',
    '.bek-fab:hover{transform:translateY(-2px) scale(1.04)}',
    '.bek-fab svg{width:26px;height:26px}',
    '.bek-fab .bek-fab-close{display:none}',
    '.bek-chat.bek-open .bek-fab .bek-fab-chat{display:none}',
    '.bek-chat.bek-open .bek-fab .bek-fab-close{display:block}',
    // Panel
    '.bek-panel{position:fixed;bottom:92px;right:22px;z-index:2147483000;width:380px;max-width:calc(100vw - 32px);height:560px;max-height:calc(100vh - 130px);background:var(--bek-bg);border:1px solid var(--bek-border);border-radius:18px;box-shadow:var(--bek-shadow);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(12px) scale(.98);pointer-events:none;transition:opacity .2s,transform .2s cubic-bezier(.16,1,.3,1)}',
    '.bek-chat.bek-open .bek-panel{opacity:1;transform:none;pointer-events:auto}',
    // Header
    '.bek-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:var(--bek-surface);border-bottom:1px solid var(--bek-border)}',
    '.bek-avatar{width:38px;height:38px;border-radius:50%;background:var(--bek-ac);color:var(--bek-ac-text);display:flex;align-items:center;justify-content:center;font-family:var(--bek-fd);font-weight:800;font-size:14px;letter-spacing:.5px;flex-shrink:0}',
    '.bek-head-meta{display:flex;flex-direction:column;line-height:1.25;min-width:0}',
    '.bek-head-name{font-family:var(--bek-fd);font-weight:700;font-size:15px;color:var(--bek-text)}',
    '.bek-head-sub{font-size:12px;color:var(--bek-muted);display:flex;align-items:center;gap:5px}',
    '.bek-dot{width:7px;height:7px;border-radius:50%;background:#2bbf6a;display:inline-block}',
    '.bek-head-x{margin-left:auto;background:none;border:none;cursor:pointer;color:var(--bek-muted);padding:6px;border-radius:8px;display:flex;line-height:0}',
    '.bek-head-x:hover{background:var(--bek-surface2);color:var(--bek-text)}',
    // Messages
    '.bek-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin}',
    '.bek-msgs::-webkit-scrollbar{width:6px}.bek-msgs::-webkit-scrollbar-thumb{background:var(--bek-border);border-radius:3px}',
    '.bek-row{display:flex;gap:8px;max-width:88%}',
    '.bek-row.bek-user{align-self:flex-end;flex-direction:row-reverse}',
    '.bek-bubble{padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;color:var(--bek-text);word-wrap:break-word;overflow-wrap:anywhere}',
    '.bek-bot .bek-bubble{background:var(--bek-surface);border:1px solid var(--bek-border);border-top-left-radius:4px}',
    '.bek-user .bek-bubble{background:var(--bek-ac);color:var(--bek-ac-text);border-top-right-radius:4px}',
    '.bek-bubble a{color:var(--bek-ac);font-weight:600}',
    '.bek-user .bek-bubble a{color:var(--bek-ac-text);text-decoration:underline}',
    '.bek-bubble p{margin:0 0 8px}.bek-bubble p:last-child{margin:0}',
    '.bek-mini-avatar{width:26px;height:26px;border-radius:50%;background:var(--bek-ac);color:var(--bek-ac-text);display:flex;align-items:center;justify-content:center;font-family:var(--bek-fd);font-weight:800;font-size:10px;flex-shrink:0;align-self:flex-end}',
    '.bek-user .bek-mini-avatar{background:var(--bek-surface2);color:var(--bek-muted)}',
    // Typing
    '.bek-typing{display:inline-flex;gap:4px;padding:4px 2px}',
    '.bek-typing span{width:6px;height:6px;border-radius:50%;background:var(--bek-muted);animation:bek-blink 1.2s infinite both}',
    '.bek-typing span:nth-child(2){animation-delay:.2s}.bek-typing span:nth-child(3){animation-delay:.4s}',
    '@keyframes bek-blink{0%,80%,100%{opacity:.3}40%{opacity:1}}',
    // Chips
    '.bek-chips{display:flex;flex-wrap:wrap;gap:7px;padding:0 16px 10px}',
    '.bek-chip{background:var(--bek-surface);border:1px solid var(--bek-border);color:var(--bek-text);padding:7px 12px;border-radius:999px;font-size:12.5px;font-weight:500;cursor:pointer;font-family:var(--bek-fb);transition:background .15s,border-color .15s}',
    '.bek-chip:hover{background:var(--bek-surface2);border-color:var(--bek-ac)}',
    // Input
    '.bek-input{display:flex;gap:8px;padding:12px 14px;border-top:1px solid var(--bek-border);background:var(--bek-surface)}',
    '.bek-input textarea{flex:1;resize:none;border:1px solid var(--bek-border);background:var(--bek-bg);color:var(--bek-text);border-radius:12px;padding:10px 12px;font-size:14px;font-family:var(--bek-fb);max-height:96px;line-height:1.4;outline:none}',
    '.bek-input textarea:focus{border-color:var(--bek-ac)}',
    '.bek-send{flex-shrink:0;width:42px;height:42px;border-radius:12px;border:none;background:var(--bek-ac);color:var(--bek-ac-text);cursor:pointer;display:flex;align-items:center;justify-content:center;align-self:flex-end;transition:opacity .15s}',
    '.bek-send:disabled{opacity:.45;cursor:default}',
    '.bek-send svg{width:19px;height:19px}',
    '.bek-foot{text-align:center;font-size:10.5px;color:var(--bek-muted);padding:0 0 8px;background:var(--bek-surface)}',
    '.bek-foot a{color:var(--bek-muted)}',
    '@media (max-width:440px){.bek-panel{right:12px;left:12px;width:auto;bottom:84px}.bek-fab{bottom:16px;right:16px}}'
  ].join('');

  // ── Helpers ─────────────────────────────────────────────────────────────
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Minimal, XSS-safe markdown: escape first, then apply a tiny whitelist.
  function renderMarkdown(text) {
    var safe = escapeHtml(text);
    // [label](url)
    safe = safe.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, function (_, label, url) {
      return '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + label + '</a>';
    });
    // bare urls (not already inside an href)
    safe = safe.replace(/(^|[\s(])(https?:\/\/[^\s<)]+)/g, function (m, pre, url) {
      return pre + '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + url + '</a>';
    });
    // **bold**
    safe = safe.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // paragraphs / line breaks
    safe = safe.split(/\n{2,}/).map(function (p) {
      return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');
    return safe;
  }

  function detectTheme() {
    if (THEME_OVERRIDE === 'dark' || THEME_OVERRIDE === 'light') return THEME_OVERRIDE;
    var t = document.documentElement.getAttribute('data-theme');
    if (t === 'dark' || t === 'light') return t;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // ── Build DOM ───────────────────────────────────────────────────────────
  var style = el('style');
  style.textContent = css;
  document.head.appendChild(style);

  var root = el('div', 'bek-chat');
  root.setAttribute('lang', CURRENT_LANG);
  root.setAttribute('data-bek-theme', detectTheme());

  var fab = el('button', 'bek-fab');
  fab.setAttribute('aria-label', UI.open);
  fab.innerHTML =
    '<svg class="bek-fab-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7a8.5 8.5 0 0 1-.9-3.8 8.5 8.5 0 0 1 8.5-8.5 8.38 8.38 0 0 1 8.5 8.5z"/></svg>' +
    '<svg class="bek-fab-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';

  var panel = el('div', 'bek-panel');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', CURRENT_LANG === 'fr' ? 'Assistant Badreddine' : 'Badreddine assistant');

  var head = el('div', 'bek-head');
  head.innerHTML =
    '<div class="bek-avatar">BEK</div>' +
    '<div class="bek-head-meta"><span class="bek-head-name">Badreddine</span>' +
    '<span class="bek-head-sub"><span class="bek-dot"></span>' + UI.assistant + '</span></div>';
  var headX = el('button', 'bek-head-x');
  headX.setAttribute('aria-label', UI.close);
  headX.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  head.appendChild(headX);

  var msgs = el('div', 'bek-msgs');
  var chipsWrap = el('div', 'bek-chips');

  var inputWrap = el('div', 'bek-input');
  var textarea = el('textarea');
  textarea.setAttribute('rows', '1');
  textarea.setAttribute('placeholder', UI.placeholder);
  textarea.setAttribute('aria-label', UI.message);
  var sendBtn = el('button', 'bek-send');
  sendBtn.setAttribute('aria-label', UI.send);
  sendBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
  inputWrap.appendChild(textarea);
  inputWrap.appendChild(sendBtn);

  var foot = el('div', 'bek-foot', UI.footer);

  panel.appendChild(head);
  panel.appendChild(msgs);
  panel.appendChild(chipsWrap);
  panel.appendChild(foot);
  panel.appendChild(inputWrap);

  root.appendChild(panel);
  root.appendChild(fab);
  document.body.appendChild(root);

  // ── State ───────────────────────────────────────────────────────────────
  var history = [];
  var streaming = false;
  var opened = false;

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

  function addRow(from) {
    var row = el('div', 'bek-row ' + (from === 'user' ? 'bek-user' : 'bek-bot'));
    var avatar = el('div', 'bek-mini-avatar', from === 'user' ? UI.you : 'BEK');
    var bubble = el('div', 'bek-bubble');
    row.appendChild(avatar);
    row.appendChild(bubble);
    msgs.appendChild(row);
    scrollDown();
    return bubble;
  }

  function showChips(list) {
    chipsWrap.innerHTML = '';
    list.forEach(function (c) {
      var b = el('button', 'bek-chip', escapeHtml(c.label));
      b.addEventListener('click', function () { send(c.value); });
      chipsWrap.appendChild(b);
    });
  }

  function syncLanguage() {
    var nextLang = document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'fr';
    if (nextLang === CURRENT_LANG) return;
    CURRENT_LANG = nextLang;
    UI = UI_TEXT[CURRENT_LANG];
    PRESET = getPreset();
    root.setAttribute('lang', CURRENT_LANG);
    fab.setAttribute('aria-label', UI.open);
    panel.setAttribute('aria-label', CURRENT_LANG === 'fr' ? 'Assistant Badreddine' : 'Badreddine assistant');
    head.querySelector('.bek-head-sub').innerHTML = '<span class="bek-dot"></span>' + UI.assistant;
    headX.setAttribute('aria-label', UI.close);
    textarea.setAttribute('placeholder', UI.placeholder);
    textarea.setAttribute('aria-label', UI.message);
    sendBtn.setAttribute('aria-label', UI.send);
    foot.textContent = UI.footer;
    if (!msgs.querySelector('.bek-user')) {
      msgs.innerHTML = '';
      botBubble(PRESET.welcome);
      showChips(PRESET.chips);
    } else if (chipsWrap.children.length) {
      showChips(PRESET.chips);
    }
  }

  function botBubble(text) {
    var b = addRow('bot');
    b.innerHTML = renderMarkdown(text);
  }

  // ── Send / stream ───────────────────────────────────────────────────────
  function send(text) {
    text = (text || '').trim();
    if (!text || streaming) return;
    chipsWrap.innerHTML = '';
    addRow('user').textContent = text;
    textarea.value = '';
    textarea.style.height = 'auto';
    streaming = true;
    sendBtn.disabled = true;

    var bubble = addRow('bot');
    bubble.innerHTML = '<span class="bek-typing"><span></span><span></span><span></span></span>';

    var full = '';
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text, history: history.slice(-10), mode: MODE })
    }).then(function (res) {
      if (!res.ok || !res.body) throw new Error('api');
      var reader = res.body.getReader();
      var decoder = new TextDecoder();
      var buffer = '';
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return finish();
          buffer += decoder.decode(r.value, { stream: true });
          var lines = buffer.split('\n');
          buffer = lines.pop() || '';
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i].trim();
            if (line.indexOf('data: ') !== 0) continue;
            var data = line.slice(6);
            if (data === '[DONE]') return finish();
            try {
              var tok = JSON.parse(data).token;
              if (tok) { full += tok; bubble.innerHTML = renderMarkdown(full); scrollDown(); }
            } catch (e) { /* skip */ }
          }
          return pump();
        });
      }
      return pump();
    }).catch(function () {
      bubble.innerHTML = renderMarkdown(CURRENT_LANG === 'fr'
        ? "Desole, je n'arrive pas a repondre la tout de suite. Tu peux reessayer, ou ecrire directement a Badreddine sur LinkedIn."
        : "Sorry, I can't answer right now. Please try again or contact Badreddine on LinkedIn.");
      finish();
    });

    function finish() {
      if (!streaming) return;
      streaming = false;
      sendBtn.disabled = false;
      if (full) {
        history.push({ role: 'user', content: text });
        history.push({ role: 'assistant', content: full });
      }
      bubble.innerHTML = renderMarkdown(full || (CURRENT_LANG === 'fr' ? "Hmm, pas de reponse. Reessaie ?" : "No response yet. Please try again."));
      scrollDown();
      textarea.focus();
    }
  }

  // ── Wire up ─────────────────────────────────────────────────────────────
  function toggle(force) {
    opened = force != null ? force : !opened;
    root.classList.toggle('bek-open', opened);
    if (opened) {
      root.setAttribute('data-bek-theme', detectTheme());
      setTimeout(function () { textarea.focus(); }, 200);
    }
  }

  fab.addEventListener('click', function () { toggle(); });
  headX.addEventListener('click', function () { toggle(false); });
  sendBtn.addEventListener('click', function () { send(textarea.value); });
  textarea.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(textarea.value); }
  });
  textarea.addEventListener('input', function () {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + 'px';
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && opened) toggle(false);
  });

  // React to host theme switching
  new MutationObserver(function () {
    root.setAttribute('data-bek-theme', detectTheme());
    syncLanguage();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-lang'] });

  // Seed conversation
  botBubble(PRESET.welcome);
  showChips(PRESET.chips);
})();
