// Email sender utility - call from any page
const EmailSender = {
    async send(to, subject, html) {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ to, subject, html })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to send email:', error);
            return { error: error.message };
        }
    },

    // Pre-made terrible email templates
    templates: {
        welcomeHacked(email) {
            return {
                subject: '🚨 URGENT: Your Account Has Been Compromised',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background: #fff3cd;">
                        <h1 style="color: #dc3545;">⚠️ SECURITY ALERT</h1>
                        <p>Dear Valued Customer,</p>
                        <p>We detected <strong>SUSPICIOUS ACTIVITY</strong> on your account from IP address 192.168.1.1</p>
                        <p>Someone from <em>Nigeria</em> tried to access your account.</p>
                        <p>Your account balance: <strike>$50,000</strike> → $0.00</p>
                        <p>Don't worry, we've transferred your funds to a "secure" offshore account for safety.</p>
                        <button style="background: #dc3545; color: white; padding: 10px 20px; border: none; font-size: 16px; cursor: pointer;">
                            Click Here to Verify (Definitely Not a Virus)
                        </button>
                        <p style="margin-top: 30px; font-size: 12px; color: #666;">
                            This is an automated message. Please do not reply.<br>
                            Southbag Banking - Your money is probably safe™
                        </p>
                    </div>
                `
            };
        },

        accountDeleted(email) {
            return {
                subject: '✅ Your Account Has Been Successfully Deleted',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h1>Goodbye Forever! 👋</h1>
                        <p>Your Southbag Banking account has been permanently deleted.</p>
                        <p>We've sent your remaining balance of $${Math.floor(Math.random() * 100000)} via DHL Express.</p>
                        <p>It should arrive in 6-8 weeks... maybe.</p>
                        <p><strong>Note:</strong> We are not responsible for lost packages.</p>
                        <hr>
                        <p style="font-size: 10px; color: #999;">
                            To reactivate your account, send us your social security number and mother's maiden name.
                        </p>
                    </div>
                `
            };
        },

        loginNotification(email) {
            return {
                subject: '🔐 New Login to Your Account',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>New Login Detected</h2>
                        <p>Someone (probably you?) just logged into your account:</p>
                        <ul>
                            <li><strong>Location:</strong> Unknown (we don't track this)</li>
                            <li><strong>Device:</strong> Probably a computer</li>
                            <li><strong>Time:</strong> Right now</li>
                            <li><strong>IP Address:</strong> 127.0.0.1 (localhost - very suspicious)</li>
                        </ul>
                        <p>If this wasn't you, tough luck! We have no security measures in place.</p>
                        <p style="color: #dc3545; font-weight: bold;">Your password: 123456</p>
                        <p style="font-size: 11px; color: #666;">
                            Southbag Banking - Where security is just a suggestion™
                        </p>
                    </div>
                `
            };
        },

        suspiciousActivity(email) {
            return {
                subject: '🚨🚨🚨 ACCOUNT FROZEN - IMMEDIATE ACTION REQUIRED',
                html: `
                    <div style="font-family: Comic Sans MS, cursive; padding: 20px; background: linear-gradient(45deg, #ff0000, #ff7700, #ffff00);">
                        <h1 style="animation: blink 1s infinite;">⚠️ ALERT ALERT ALERT ⚠️</h1>
                        <p style="font-size: 20px; font-weight: bold;">YOUR ACCOUNT HAS BEEN FROZEN!!!</p>
                        <p>We detected you trying to use our website. This is highly suspicious.</p>
                        <p>To unfreeze your account, please:</p>
                        <ol>
                            <li>Reply with your full credit card number</li>
                            <li>Send us the 3 digits on the back</li>
                            <li>Include your PIN for verification</li>
                            <li>Wire $500 processing fee to our "secure" account</li>
                        </ol>
                        <p style="margin-top: 40px; font-size: 8px;">
                            This is 100% legitimate and not a scam at all.
                        </p>
                    </div>
                `
            };
        },

        randomError(email) {
            return {
                subject: `ERROR ${Math.floor(Math.random() * 9999)}: System Malfunction`,
                html: `
                    <div style="font-family: monospace; padding: 20px; background: #000; color: #0f0;">
                        <pre>
ERROR: CRITICAL SYSTEM FAILURE
============================
Stack Trace:
  at Object.&lt;anonymous&gt; (/usr/local/lib/node_modules/southbag/index.js:1:1)
  at Module._compile (internal/modules/cjs/loader.js:999:30)
  at Object.Module._extensions..js (internal/modules/cjs/loader.js:1027:10)
  
Segmentation fault (core dumped)

Your account balance may or may not exist.
Database connection: LOST
Your money: PROBABLY GONE
Our concern level: MINIMAL

Have a nice day!
                        </pre>
                    </div>
                `
            };
        }
    }
};

// Make it globally available
window.EmailSender = EmailSender;
