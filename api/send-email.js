// Vercel serverless function for sending emails
// Install: npm install resend

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, subject, html, type } = req.body;

    // You'll need to set RESEND_API_KEY in Vercel environment variables
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (!RESEND_API_KEY) {
        return res.status(500).json({ error: 'Email service not configured' });
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: 'Southbag Banking <noreply@southbag.com>', // Update with your domain
                to: [to],
                subject: subject,
                html: html
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to send email');
        }

        return res.status(200).json({ success: true, id: data.id });
    } catch (error) {
        console.error('Email error:', error);
        return res.status(500).json({ error: error.message });
    }
}
