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
});
