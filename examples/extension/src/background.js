chrome.action.onClicked.addListener(tab => {
  if (!tab.id) return;

  const result = chrome.scripting.executeScript({
    target: {
      tabId: tab.id
    },
    files: ['entry.js']
  });

  if (result && result.catch) {
    result.catch(error => {
      console.warn('Element Theme Roller injection failed:', error);
    });
  }
});
