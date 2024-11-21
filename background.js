class BackgroundService {
  constructor() {
    this.setupContextMenu();
    this.handleInstall();
  }

  setupContextMenu() {
    try {
      chrome.contextMenus.removeAll(async () => {
        try {
          await chrome.contextMenus.create({
            id: "copySVG",
            title: "Copy SVG",
            contexts: ["image", "all"],
            documentUrlPatterns: ["<all_urls>"]
          });
        } catch (error) {
          console.error('Failed to create context menu:', error);
        }
      });

      chrome.contextMenus.onClicked.addListener(async (info, tab) => {
        if (info.menuItemId === "copySVG") {
          if (!tab?.id) {
            console.error('Invalid tab');
            return;
          }

          if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://')) {
            console.warn('Cannot access browser internal pages');
            return;
          }

          try {
            await chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            });
          } catch (error) {
            // Script might already be injected, continue
            console.debug('Script injection status:', error);
          }

          try {
            await chrome.tabs.sendMessage(tab.id, {
              action: "copySVGFromContext",
              target: info.targetElementId,
              srcUrl: info.srcUrl,
            });
          } catch (error) {
            console.error('Failed to send message to content script:', error);
          }
        }
      });
    } catch (error) {
      console.error('Failed to setup context menu:', error);
    }
  }

  handleInstall() {
    chrome.runtime.onInstalled.addListener((details) => {
      if (details.reason === "install") {
        try {
          chrome.tabs.create({
            url: "welcome.html",
          });
        } catch (error) {
          console.error('Failed to open welcome page:', error);
        }
      }
    });
  }
}

new BackgroundService();
