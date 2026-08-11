/**
 * get_refresh_token.js — Gets a Google Calendar Refresh Token using localhost callback
 * Usage: node get_refresh_token.js
 * Then open the URL printed, sign in, and the token is printed automatically.
 */

const { google } = require('googleapis');
const http = require('http');
const url = require('url');

require('dotenv').config();
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:4000/oauth2callback';


const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: ['https://www.googleapis.com/auth/calendar'],
  prompt: 'consent',
});

// Start a temporary local server to capture the auth code
const server = http.createServer(async (req, res) => {
  const qs = new url.URL(req.url, 'http://localhost:4000').searchParams;
  const code = qs.get('code');
  const error = qs.get('error');

  if (error) {
    res.end(`<h1>❌ Error: ${error}</h1><p>Close this tab and check terminal.</p>`);
    server.close();
    return;
  }

  if (code) {
    res.end('<h1>✅ Authorization successful!</h1><p>You can close this tab. Check your terminal for the refresh token.</p>');
    server.close();

    try {
      const { tokens } = await oauth2Client.getToken(code);
      console.log('\n✅ SUCCESS! Copy this Refresh Token:');
      console.log('========================================');
      console.log(tokens.refresh_token);
      console.log('========================================');
      console.log('\nPaste this refresh token back to your assistant!');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error getting token:', err.message);
      process.exit(1);
    }
  }
});

server.listen(4000, () => {
  console.log('\n========================================');
  console.log('STEP 1: Add this redirect URI to Google Cloud Console:');
  console.log('  http://localhost:4000/oauth2callback');
  console.log('\nSTEP 2: Open this URL in your browser:');
  console.log('========================================\n');
  console.log(authUrl);
  console.log('\n========================================');
  console.log('Waiting for Google to redirect back...');
  console.log('========================================\n');
});
