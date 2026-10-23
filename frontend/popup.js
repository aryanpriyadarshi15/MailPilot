'use strict';

const API_URL = 'http://localhost:8080/api/email/generate';

const emailContentInput = document.getElementById('emailContent');
const replyInstructionsInput = document.getElementById('replyInstructions');
const toneSelect = document.getElementById('tone');
const generateBtn = document.getElementById('generateBtn');
const buttonLabel = document.getElementById('buttonLabel');
const statusMessage = document.getElementById('statusMessage');
const resultSection = document.getElementById('resultSection');
const generatedReply = document.getElementById('generatedReply');
const copyBtn = document.getElementById('copyBtn');

function showStatus(message, type = '') {
  statusMessage.textContent = message;
  statusMessage.className = ('status-message ' + type).trim();
}

generateBtn.addEventListener('click', async () => {
  const emailContent = emailContentInput.value.trim();
  const replyInstructions = replyInstructionsInput.value.trim();
  const tone = toneSelect.value;

  if (!emailContent) {
    showStatus('Please paste the email you received.', 'error');
    emailContentInput.focus();
    return;
  }

  if (!replyInstructions) {
    showStatus('Please describe what you want your reply to say.', 'error');
    replyInstructionsInput.focus();
    return;
  }

  const combinedEmailContent = [
    'You are writing a reply to the original email below.',
    'Follow the reply instructions carefully. Write only the reply itself, without a subject line or explanation.',
    '',
    'ORIGINAL EMAIL:',
    emailContent,
    '',
    'REPLY INSTRUCTIONS:',
    replyInstructions
  ].join('\n');

  generateBtn.disabled = true;
  buttonLabel.textContent = 'Generating...';
  showStatus('Contacting the backend. Please wait...');
  resultSection.hidden = true;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailContent: combinedEmailContent, tone: tone })
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(responseText || 'Backend error (HTTP ' + response.status + ').');
    }
    if (!responseText.trim()) {
      throw new Error('The backend returned an empty reply. Please try again.');
    }

    generatedReply.value = responseText.trim();
    resultSection.hidden = false;
    showStatus('Reply generated successfully.', 'success');
  } catch (error) {
    console.error('MailPilot error:', error);
    if (error instanceof TypeError) {
      showStatus('Cannot reach localhost:8080. Start your Spring Boot backend and try again.', 'error');
    } else {
      showStatus(error.message || 'Something went wrong. Please try again.', 'error');
    }
  } finally {
    generateBtn.disabled = false;
    buttonLabel.textContent = 'Generate reply';
  }
});

copyBtn.addEventListener('click', async () => {
  const reply = generatedReply.value.trim();
  if (!reply) {
    showStatus('There is no reply to copy yet.', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(reply);
    copyBtn.textContent = 'Copied!';
    showStatus('Reply copied to clipboard.', 'success');
    window.setTimeout(() => { copyBtn.textContent = 'Copy'; }, 1500);
  } catch (error) {
    generatedReply.focus();
    generatedReply.select();
    const copied = document.execCommand('copy');
    showStatus(copied ? 'Reply copied to clipboard.' : 'Please select and copy the reply manually.', copied ? 'success' : 'error');
  }
});
