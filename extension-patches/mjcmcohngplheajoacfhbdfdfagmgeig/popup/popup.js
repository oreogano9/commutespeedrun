import { browserAPI, isFirefox } from '../utils/browser-polyfill.js';

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('cinematicToggle');
  const soundToggle = document.getElementById('cinematicSound');
  const soundContainer = soundToggle.closest('.toggle-container');

  // Hide mute toggle on Firefox
  if (isFirefox) {
    soundContainer.style.display = 'none';
  }

  // Helper function to safely send messages to content script
  async function sendMessageToActiveTab(message) {
    try {
      const tabs = await browserAPI.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]) {
        await browserAPI.tabs.sendMessage(tabs[0].id, message);
      }
    } catch (error) {
      console.log(
        '[Cinematic] ❌ Could not send message to content script:',
        error
      );
    }
  }

  // Load saved states and ensure initial sync
  browserAPI.storage.sync
    .get(['cinematicEnabled', 'cinematicMuted'])
    .then(result => {
      const isEnabled = result.cinematicEnabled !== false;
      toggle.checked = isEnabled;
      document.body.classList.toggle('cinematic-disabled', !isEnabled);

      // Sound toggle - default to muted only on Firefox if undefined
      const isMuted = result.cinematicMuted ?? isFirefox;
      soundToggle.checked = isMuted;

      sendMessageToActiveTab({
        action: 'toggleSound',
        muted: isMuted,
      });
    });

  // Handle main toggle
  toggle.addEventListener('change', async () => {
    const enabled = toggle.checked;
    document.body.classList.toggle('cinematic-disabled', !enabled);
    await browserAPI.storage.sync.set({ cinematicEnabled: enabled });

    try {
      const tabs = await browserAPI.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (tabs[0]) {
        try {
          await browserAPI.tabs.sendMessage(tabs[0].id, {
            action: 'togglecinematic',
            enabled: enabled,
          });
        } catch (error) {
          // Continue with page refresh even if message fails
        }

        // Refresh the page
        setTimeout(async () => {
          await browserAPI.tabs.update(tabs[0].id, {
            url: 'https://www.youtube.com/',
          });
        }, 500);
      }
    } catch (error) {
      console.log('[Cinematic] ❌ Error updating tab:', error);
    }
  });

  // Handle sound toggle
  soundToggle.addEventListener('change', async () => {
    // checked=true means muted=true
    const muted = soundToggle.checked;
    await browserAPI.storage.sync.set({ cinematicMuted: muted });
    sendMessageToActiveTab({
      action: 'toggleSound',
      muted: muted,
    });
  });

  // Listen for updates from content script
  browserAPI.runtime.onMessage.addListener(message => {
    if (message.action === 'updatePopupMute') {
      // Keep the inverse relationship (checked=true means unmuted)
      soundToggle.checked = !message.muted;
    }
  });
});
