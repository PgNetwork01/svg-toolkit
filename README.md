# SVG Toolkit - Chrome Extension

<div align="center">
  <img src="public/icon128.png" alt="CopySVG Pro Logo" width="128" height="128">
  <h3>Your Ultimate SVG Management Chrome Extension</h3>
  <p>Effortlessly copy, convert, and optimize SVGs while browsing - perfect for developers and designers.</p>
</div>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-green)](https://chrome.google.com/webstore)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

## ✨ Features

- 🔍 **Smart SVG Detection**: Automatically finds all SVGs on any webpage
- 🔄 **One-Click Conversion**: Transform SVGs to React/TSX components instantly
- ⚡ **Quick Copy**: Copy SVG code with a single click
- 🎨 **Visual Preview**: See SVGs before copying
- 🛠️ **Batch Processing**: Handle multiple SVGs simultaneously
- 📱 **Responsive Design**: Works seamlessly across all screen sizes
- 🌓 **Dark Mode Support**: Automatic theme switching based on system preferences

## 🚀 Getting Started

### Installation

1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. The CopySVG Pro icon will appear in your browser toolbar

### Usage

1. Click the extension icon or use `Alt + S` to open
2. Browse detected SVGs on the current page
3. Use quick actions:
   - `Alt + C`: Copy selected SVG
   - `Alt + T`: Convert to TSX
   - `Alt + B`: Batch convert

## 🛠️ Development Setup

### Clone the repository

```bash
git clone [https://github.com/vxsahu/copysvg-pro.git](https://github.com/vxsahu/svg-toolkit.git)
```

###Install dependencies

```bash
npm install
```

### Build Tailwind CSS

```bash
npm run build
```
### Watch for CSS changes during development

```bash
npm run watch
```

## 🏗️ Project Structure

```
├── public/ # Static assets
│ ├── utils/ # Utility functions
│ └── input.css # Tailwind CSS input
├── src/
│ ├── content.js
│ ├── background.js
│ ├── popup.html
│ ├── styles.css
│ └── manifest.json
├── popup.html # Extension popup
├── welcome.html # Welcome page
└── styles.css # Core styles
```


## 🤝 Contributing

We love your input! We want to make contributing to CopySVG Pro as easy and transparent as possible. Please:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- All our amazing contributors
- The Chrome Extensions community

## 🔮 Roadmap

- [ ] Support for more framework component formats (Vue, Svelte)
- [ ] Advanced SVG optimization options
- [ ] Custom naming patterns for exported components
- [ ] Batch export configurations
- [ ] Integration with design tools

## 📫 Contact

Have questions or suggestions? Please open an issue or reach out to us:

- Create an issue
- Follow updates on Twitter: [@vxsahhu](https://twitter.com/vxsahu)
- Join our Discord community (coming soon)

---


*Made with ❤️ by developers, for developers*
