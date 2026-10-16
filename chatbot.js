// Minimal chatbot bootstrap that loads on all pages except login/signup
(function () {
  function shouldShowChatbot() {
    const content = document.getElementById('content');
    const hasLogin = content && content.innerHTML && content.innerHTML.includes('id="login-form"');
    const hasSignup = content && content.innerHTML && content.innerHTML.includes('id="signup-form"');
    return !(hasLogin || hasSignup);
  }

  function initChatbot() {
    const bot = document.getElementById('chatbot');
    const toggle = document.getElementById('chatbot-toggle');
    if (!bot) return;
    
    // Always keep chatbot closed by default, only show toggle button
    if (!shouldShowChatbot()) {
      bot.style.display = 'none';
      if (toggle) toggle.style.display = 'none';
      return;
    }
    
    // Keep chatbot closed, show toggle button
    bot.style.display = 'none';
    if (toggle) toggle.style.display = 'flex';

    // If user never interacted, seed a greeting
    const chatContent = document.getElementById('chat-content');
    if (chatContent && chatContent.childElementCount === 0) {
      const greet = document.createElement('div');
      greet.className = 'bot-message';
      greet.textContent = 'Hi! I can help you find rooms and navigate campus. Try: "Go to Engineering 1st floor Computer" or "Find boys washroom"';
      chatContent.appendChild(greet);
    }

    // Ensure chat submission works and shows output
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    if (chatForm && userInput && !chatForm.__wired) {
      chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = userInput.value.trim();
        if (!msg) return;
        const userDiv = document.createElement('div');
        userDiv.className = 'user-message';
        userDiv.textContent = msg;
        chatContent.appendChild(userDiv);
        userInput.value = '';

        // Always try local navigation against classroomData first
        if (window.campusNav) {
          const intent = window.campusNav.resolveIntent(msg);
          const actionable = intent && (intent.building || intent.floor || intent.department || intent.query);
          if (actionable) {
            window.campusNav.navigateTo(intent);
            const summary = intent.query ? window.campusNav.summarizeSearch(intent.query) : window.campusNav.summarizeSelection(intent);
            const botDiv = document.createElement('div');
            botDiv.className = 'bot-message';
            botDiv.textContent = summary;
            chatContent.appendChild(botDiv);
            chatContent.scrollTop = chatContent.scrollHeight;
          }
        }

        // Use hosted model if configured; else try a simple built-in intent parser
        if (window.fetchResponse) {
          try {
            const raw = await window.fetchResponse(msg);
            let displayText = raw;
            try {
              const cmd = JSON.parse(raw);
              if (cmd && cmd.action) {
                // Execute navigation if possible
                if (window.campusNav && (cmd.action === 'navigate' || cmd.action === 'search')) {
                  window.campusNav.navigateTo({
                    building: cmd.building,
                    floor: cmd.floor,
                    department: cmd.department,
                    query: cmd.query || (cmd.action === 'search' ? msg : undefined)
                  });
                  // Prefer a summary from data
                  displayText = cmd.action === 'search' ? window.campusNav.summarizeSearch(cmd.query || msg) : window.campusNav.summarizeSelection({ building: cmd.building, floor: cmd.floor, department: cmd.department });
                } else if (cmd.action === 'ask') {
                  displayText = cmd.question || 'Can you clarify?';
                }
              }
            } catch (_) {}
            const botDiv = document.createElement('div');
            botDiv.className = 'bot-message';
            botDiv.textContent = displayText || 'Done.';
            chatContent.appendChild(botDiv);
            chatContent.scrollTop = chatContent.scrollHeight;
            return;
          } catch (err) {
            const botDiv = document.createElement('div');
            botDiv.className = 'bot-message';
            botDiv.textContent = 'Error contacting assistant. Please try again later.';
            chatContent.appendChild(botDiv);
            chatContent.scrollTop = chatContent.scrollHeight;
          }
        } else {
          // If no hosted model, the local path above already handled navigation & summary.
        }
      });
      chatForm.__wired = true;
    }
  }

  // Re-run when pages are loaded dynamically via loadPage
  const originalLoadPage = window.loadPage;
  if (typeof originalLoadPage === 'function') {
    window.loadPage = function (page) {
      originalLoadPage(page);
      // Don't auto-show chatbot, let the toggle control it
      setTimeout(() => {
        const bot = document.getElementById('chatbot');
        const toggle = document.getElementById('chatbot-toggle');
        if (bot && toggle) {
          bot.style.display = 'none';
          toggle.style.display = 'flex';
        }
      }, 0);
    };
  }

  // Initial
  window.addEventListener('load', initChatbot);
})();


