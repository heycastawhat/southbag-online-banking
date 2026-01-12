document.addEventListener('DOMContentLoaded', function() {
  // Enable navigation on buttons that have an href
  document.querySelectorAll('button[href]').forEach(function(btn){
    btn.setAttribute('type','button');
    btn.addEventListener('click', function(){
      var target = btn.getAttribute('href');
      if (target) {
        window.location.href = target;
      }
    });
  });

  // Secure portal: choose-new-password flow, but must be 123456
  var path = window.location.pathname || '';
  if (path.endsWith('/secureportal.html') || path.endsWith('secureportal.html')) {
    var params = new URLSearchParams(window.location.search);
    var pwd = params.get('password');
    var content = document.getElementById('content');
    if (!content) {
      content = document.body;
    }
    function attachResetButton() {
      var existing = document.getElementById('resetSetup');
      if (!existing) {
        var btn = document.createElement('button');
        btn.id = 'resetSetup';
        btn.className = 'btn-small';
        btn.textContent = 'Reset setup';
        btn.style.marginTop = '12px';
        document.body.appendChild(btn);
        btn.addEventListener('click', function(){
          try {
            localStorage.removeItem('sb_password');
            localStorage.removeItem('sb_login_count');
          } catch (e) {}
          var c = document.getElementById('content') || document.body;
          c.innerHTML = '<h1>Setup Reset</h1><p>Password and login count cleared.</p><a href="secureportal.html" class="btn-small">Reload setup</a>';
        });
      }
    }
    var stored = localStorage.getItem('sb_password');

    // Require the user to set the password first, regardless of URL params
    if (!stored) {
      // Show choose-new-password UI (must be 123456)
      content.innerHTML = (
        '<h1>Choose a New Password</h1>' +
        '<form id="setPwd" style="margin-top:12px;">' +
          '<input type="password" id="newPwd" required placeholder="Enter new password">' +
          '<button type="submit" class="btn-small" style="margin-left:8px;">Save</button>' +
        '</form>' +
        '<p id="pwdMsg" style="color:#900; margin-top:8px;"></p>' +
        '<a href="index.html" class="btn-small" style="display:inline-block; margin-top:12px;">Back to login</a>'
      );
      var form = document.getElementById('setPwd');
      var msg = document.getElementById('pwdMsg');
      if (form) {
        form.addEventListener('submit', function(e){
          e.preventDefault();
          var val = (document.getElementById('newPwd').value || '').trim();
          if (val === '123456') {
            try { localStorage.setItem('sb_password', '123456'); } catch (e) {}
            try { localStorage.setItem('sb_login_count', '0'); } catch (e) {}
            content.innerHTML = '<h1>Password Saved</h1><p>Your new password is set. Please go back and log in.</p><a href="index.html" class="btn-small">Back to login</a>';
          } else {
            if (msg) { msg.textContent = 'Password must be exactly 123456.'; }
          }
        });
      }
      attachResetButton();
    } else {
      // Stored password exists; only log in if provided password matches it
      if (pwd === '123456') {
        var count = parseInt(localStorage.getItem('sb_login_count') || '0', 10);
        if (count >= 1) {
          // Second (or subsequent) login: go to /real.html (absolute path)
          window.location.href = '/real.html';
        } else {
          localStorage.setItem('sb_login_count', String(count + 1));
          content.innerHTML = '<h1>Welcome to the Secure Portal</h1><p>Access granted.</p><a href="index.html" class="btn-small" style="display:inline-block; margin-top:12px;">Back to login</a>';
          attachResetButton();
        }
      } else {
        content.innerHTML = '<h1>Incorrect Password</h1><p>Access denied. The only permitted password is 123456.</p><a href="index.html" class="btn-small">Back to login</a>';
        attachResetButton();
      }
    }
    attachResetButton();
  }

  // Live Chat Widget
  const openBtn = document.getElementById('openChat');
  const closeBtn = document.getElementById('closeChat');
  const chatWidget = document.getElementById('chatWidget');
  const sendBtn = document.getElementById('sendChat');
  const chatInput = document.getElementById('chatInput');
  const chatMessages = document.getElementById('chatMessages');

  if (openBtn) {
    openBtn.addEventListener('click', function() {
      chatWidget.classList.add('active');
      openBtn.style.display = 'none';
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      chatWidget.classList.remove('active');
      if (openBtn) openBtn.style.display = 'block';
    });
  }

  if (sendBtn && chatInput && chatMessages) {
    var sendMessage = function() {
      var text = chatInput.value.trim();
      if (text) {
        // Add user message
        var userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.textContent = text;
        chatMessages.appendChild(userMsg);
        chatInput.value = '';

        // Fake bot response
        setTimeout(function() {
          var botMsg = document.createElement('div');
          botMsg.className = 'chat-message bot';
          botMsg.textContent = 'Not enough credits. Please top up your account to continue.';
          chatMessages.appendChild(botMsg);
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);

        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') sendMessage();
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });
  }
});

function showMeetingPopup() {
    const popup = document.createElement('div');
    popup.id = 'meetingPopup';
    popup.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 0;
      border-radius: 8px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.2);
      z-index: 10000;
      width: 400px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      border: 1px solid #dadce0;
    `;
    popup.innerHTML = `
      <div style="padding: 24px 24px 20px 24px;">
        <div style="font-size: 13px; color: #5f6368; margin-bottom: 20px;">southbag.com says</div>
        <div style="font-size: 13px; color: #202124; line-height: 1.4; margin-bottom: 24px;">
          Please schedule an in-person meeting at your local SouthBag branch to continue.
        </div>
        <div style="text-align: right; border-top: 1px solid #e8eaed; padding-top: 16px; margin: 0 -24px -20px -24px; padding-left: 24px; padding-right: 24px;">
          <button id="closePopup" style="background: #1a73e8; color: white; border: none; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: 500; min-width: 65px;">OK</button>
        </div>
      </div>
    `;
    
    const overlay = document.createElement('div');
    overlay.id = 'popupOverlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.4);
      z-index: 9999;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(popup);
    
    document.getElementById('closePopup').addEventListener('click', () => {
      popup.remove();
      overlay.remove();
    });
  }

  // Show popup randomly between 10-30 seconds after page load
  const randomDelay = Math.floor(Math.random() * 20000) + 10000;
  setTimeout(showMeetingPopup, randomDelay);
});