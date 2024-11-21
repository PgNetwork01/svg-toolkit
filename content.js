class SVGDetector {
  constructor() {
    this.setupMessageListener();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === "getSVGs") {
        // Get inline SVGs and filter out invalid ones
        const inlineSVGs = Array.from(document.getElementsByTagName("svg"))
          .filter(svg => {
            // Check if SVG has valid content
            return svg.innerHTML.trim() !== '' && 
                   svg.getBoundingClientRect().width > 0 &&
                   svg.getBoundingClientRect().height > 0;
          })
          .map(svg => svg.outerHTML);

        // Get external SVGs and filter out invalid ones
        const externalSVGs = Array.from(document.querySelectorAll('img[src$=".svg"], object[data$=".svg"]'))
          .filter(element => {
            // Check if element has valid source
            const source = element.src || element.data;
            return source && source.trim() !== '';
          })
          .map(element => ({
            type: 'external',
            url: element.src || element.data,
            element: element.outerHTML
          }));

        // Combine both types and filter out any undefined entries
        const allSVGs = [
          ...inlineSVGs.map(svg => ({ type: 'inline', svg })),
          ...externalSVGs
        ].filter(Boolean);

        sendResponse(allSVGs);
      } else if (request.action === "copySVGFromContext") {
        this.handleContextMenuCopy(request.target, request.srcUrl);
      }
      return true;
    });
  }

  async handleContextMenuCopy(targetId, srcUrl) {
    try {
      let svgString = '';
      
      // Handle SVG image elements
      if (srcUrl && srcUrl.toLowerCase().endsWith('.svg')) {
        const response = await fetch(srcUrl);
        svgString = await response.text();
      } else {
        // Handle inline SVGs
        const element = targetId ? document.querySelector(`[data-contextmenu-element-id="${targetId}"]`) : null;
        const svgElement = element?.closest('svg') || element?.querySelector('svg');
        
        if (svgElement) {
          svgString = svgElement.outerHTML;
        } else {
          // Fallback: try to find SVG in img elements
          const imgElement = element?.closest('img[src$=".svg"]') || document.querySelector('img[src$=".svg"]');
          if (imgElement) {
            const response = await fetch(imgElement.src);
            svgString = await response.text();
          }
        }
      }

      if (svgString && svgString.includes('<svg')) {
        await navigator.clipboard.writeText(svgString);
        this.showCopyFeedback();
      }
    } catch (error) {
      console.error('Failed to copy SVG:', error);
      this.showErrorFeedback();
    }
  }

  showCopyFeedback() {
    // Create and show a temporary feedback tooltip
    const feedback = document.createElement('div');
    feedback.textContent = 'SVG Copied!';
    feedback.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 8px 16px;
      border-radius: 16px;
      z-index: 999999;
      font-family: system-ui;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: fadeInOut 2s ease-in-out forwards;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        20% { opacity: 1; transform: translateY(0); }
        80% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(-20px); }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(feedback);

    // Remove feedback after animation
    setTimeout(() => {
      feedback.remove();
      style.remove();
    }, 2000);
  }

  showErrorFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = 'Failed to copy SVG';
    feedback.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #f44336;
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      z-index: 999999;
      font-family: system-ui;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      animation: fadeInOut 2s ease-in-out forwards;
    `;

    document.body.appendChild(feedback);
    setTimeout(() => feedback.remove(), 2000);
  }

  findSVGs() {
    const svgs = [];

    // Find inline SVGs
    document.querySelectorAll("svg").forEach((svg) => {
      svgs.push(svg.outerHTML);
    });

    // Find SVGs in use elements
    document.querySelectorAll("use").forEach((use) => {
      const href = use.getAttribute("href") || use.getAttribute("xlink:href");
      if (href && href.startsWith("#")) {
        const id = href.slice(1);
        const referencedSvg = document.getElementById(id);
        if (referencedSvg && referencedSvg.tagName.toLowerCase() === "svg") {
          svgs.push(referencedSvg.outerHTML);
        }
      }
    });

    // Find background SVGs
    this.findBackgroundSVGs(document.body, svgs);

    return [...new Set(svgs)]; // Remove duplicates
  }

  findBackgroundSVGs(element, svgs) {
    const style = window.getComputedStyle(element);
    const backgroundImage = style.backgroundImage;

    if (backgroundImage.includes("svg")) {
      const url = backgroundImage.match(/url\(['"]?(.*?)['"]?\)/)?.[1];
      if (url) {
        fetch(url)
          .then((response) => response.text())
          .then((svgContent) => {
            if (svgContent.includes("<svg")) {
              svgs.push(svgContent);
            }
          })
          .catch(() => {});
      }
    }

    Array.from(element.children).forEach((child) => {
      this.findBackgroundSVGs(child, svgs);
    });
  }
}

new SVGDetector();
