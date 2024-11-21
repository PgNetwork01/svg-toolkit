class SettingsManager {
  constructor() {
    this.defaultSettings = {
      autoOptimize: true,
      namingPattern: "svg-[index]-[date]",
      showPreview: true,
      maxPreviewSize: 150,
      shortcuts: true,
    };
  }

  async init() {
    try {
      const stored = await chrome.storage.sync.get("settings");
      this.settings = { ...this.defaultSettings, ...stored.settings };
      await this.save();
      return this.settings;
    } catch (error) {
      console.error("Failed to initialize settings:", error);
      return this.defaultSettings;
    }
  }

  async save() {
    try {
      await chrome.storage.sync.set({ settings: this.settings });
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  async update(newSettings) {
    try {
      this.settings = { ...this.settings, ...newSettings };
      await this.save();
      return this.settings;
    } catch (error) {
      console.error("Failed to update settings:", error);
      return this.settings;
    }
  }
}

export default new SettingsManager();
