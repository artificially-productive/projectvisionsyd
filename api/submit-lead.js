const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

function getCredentials() {
  let clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  let sheetId = process.env.GOOGLE_SHEET_ID || '1JsWTjU1IInbT8fieP_X5UnVm7Ltwo7m-XM-SquPP5sQ';

  // Fallback to local service-account.json if env vars not set (for local dev)
  if (!clientEmail || !privateKey) {
    const keyPath = path.join(process.cwd(), 'service-account.json');
    if (fs.existsSync(keyPath)) {
      try {
        const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
        clientEmail = keyFile.client_email;
        privateKey = keyFile.private_key;
      } catch (err) {
        console.error('Failed to read local service-account.json:', err);
      }
    }
  }

  if (privateKey) {
    // Handle escaped newlines in environment variable string
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  return { clientEmail, privateKey, sheetId };
}

module.exports = async function handler(req, res) {
  // Enable CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = {};
      }
    }

    const { name, email, phone, details } = body || {};

    if (!name && !email && !phone) {
      return res.status(400).json({ error: 'Missing required inquiry details' });
    }

    const { clientEmail, privateKey, sheetId } = getCredentials();

    if (!clientEmail || !privateKey) {
      console.error('Google Service Account credentials missing.');
      return res.status(500).json({ error: 'Server integration configuration error' });
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const timestamp = new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'A:E',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [
          [timestamp, name || '', email || '', phone || '', details || '']
        ]
      }
    });

    return res.status(200).json({ success: true, message: 'Inquiry logged to Google Sheet' });
  } catch (error) {
    console.error('Error recording lead to Google Sheet:', error);
    return res.status(500).json({ error: 'Failed to record lead', details: error.message });
  }
};
