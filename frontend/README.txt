MAILPILOT — FIXED EXTENSION

1. Extract this ZIP file.
2. Keep your Spring Boot backend running on http://localhost:8080.
3. Open chrome://extensions in Chrome.
4. Remove the old MailPilot extension to avoid loading the wrong copy (optional, but recommended).
5. Turn on Developer mode.
6. Click Load unpacked.
7. Select the extracted folder named mailpilot-extension-fixed — select the folder containing manifest.json.
8. Open MailPilot. Enter the received email, enter what you want your reply to say, choose a tone, and click Generate reply.

The backend request format is unchanged: { "emailContent": "...", "tone": "..." }.
The original email and your reply instructions are combined in the emailContent field, so no backend code change is required.
