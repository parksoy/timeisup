// Set initial time limit to 1 minute (for testing; you can change this)
const timeLimit = 1 * 60 * 1000; // 1 minute in milliseconds

// Check if time limit has passed
chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.get(["lastShutdownTime"], (result) => {
    const lastShutdownTime = result.lastShutdownTime || 0;
    const currentTime = Date.now();

    if (currentTime - lastShutdownTime > timeLimit) {
      // If time limit has passed, open static page
      chrome.tabs.create({ url: chrome.runtime.getURL("static.html") });
    }
  });
});

// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
  // Set initial lastShutdownTime on installation/update
  chrome.storage.local.set({ lastShutdownTime: Date.now() });
});

// Reset the timer at midnight
function resetTimerAtMidnight() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  
  const timeUntilMidnight = midnight - now;
  setTimeout(() => {
    chrome.storage.local.set({ lastShutdownTime: Date.now() });
    resetTimerAtMidnight();
  }, timeUntilMidnight);
}

resetTimerAtMidnight();
