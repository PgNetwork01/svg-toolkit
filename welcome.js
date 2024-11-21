class WelcomePage {
  constructor() {
    this.init();
  }

  init() {
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute("href"));
        target.scrollIntoView({ behavior: "smooth" });
      });
    });

    // Register keyboard shortcuts
    this.registerKeyboardShortcuts();
  }

  registerKeyboardShortcuts() {
    const shortcuts = {
      "Alt+S": this.openExtension,
      "Alt+C": this.copySelectedSVG,
      "Alt+A": this.selectAllSVGs,
    };

    document.addEventListener("keydown", (e) => {
      const key = `${e.altKey ? "Alt+" : ""}${e.key.toUpperCase()}`;
      if (shortcuts[key]) {
        e.preventDefault();
        shortcuts[key]();
      }
    });
  }

  openExtension() {
    chrome.runtime.sendMessage({ action: "openPopup" });
  }

  copySelectedSVG() {
    chrome.runtime.sendMessage({ action: "copySelected" });
  }

  selectAllSVGs() {
    chrome.runtime.sendMessage({ action: "selectAll" });
  }
}

new WelcomePage();
