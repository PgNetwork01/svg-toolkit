import { TSXConverter } from "./src/utils/tsx-converter.js";

class SVGManager {
  constructor() {
    this.svgContainer = document.getElementById("svgContainer");
    this.svgCount = document.getElementById("svgCount");
    this.noSVGs = document.getElementById("noSVGs");
    this.init();
  }

  async init() {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const svgs = await chrome.tabs.sendMessage(tab.id, { action: "getSVGs" });
    this.updateUI(svgs);
  }

  async updateUI(svgs) {
    // Filter out any invalid SVGs
    const validSvgs = svgs.filter(svg => 
      svg && 
      ((svg.type === 'inline' && svg.svg) || 
       (svg.type === 'external' && svg.url))
    );

    this.svgCount.textContent = `${validSvgs.length} SVGs found`;
    this.noSVGs.style.display = validSvgs.length ? "none" : "block";
    this.svgContainer.innerHTML = "";

    for (let index = 0; index < validSvgs.length; index++) {
      const svgData = validSvgs[index];
      const item = await this.createSVGItem(svgData, index);
      if (item) { // Only append if item was created successfully
        this.svgContainer.appendChild(item);
      }
    }
  }

  async createSVGItem(svgData, index) {
    // Validate SVG data
    if (!svgData || (svgData.type === 'inline' && !svgData.svg) || 
        (svgData.type === 'external' && !svgData.url)) {
      console.warn('Invalid SVG data:', svgData);
      return null;
    }

    const item = document.createElement("div");
    item.className = "svg-item";

    item.innerHTML = `
      <div class="svg-item-header">
        <div class="btn-group">
          <button class="btn btn-secondary copy-btn" title="Copy SVG">
          <svg class"btn-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.75 0.5C1.7835 0.5 1 1.2835 1 2.25V9.75C1 10.7165 1.7835 11.5 2.75 11.5H3.75H4.5V10H3.75H2.75C2.61193 10 2.5 9.88807 2.5 9.75V2.25C2.5 2.11193 2.61193 2 2.75 2H8.25C8.38807 2 8.5 2.11193 8.5 2.25V3H10V2.25C10 1.2835 9.2165 0.5 8.25 0.5H2.75ZM7.75 4.5C6.7835 4.5 6 5.2835 6 6.25V13.75C6 14.7165 6.7835 15.5 7.75 15.5H13.25C14.2165 15.5 15 14.7165 15 13.75V6.25C15 5.2835 14.2165 4.5 13.25 4.5H7.75ZM7.5 6.25C7.5 6.11193 7.61193 6 7.75 6H13.25C13.3881 6 13.5 6.11193 13.5 6.25V13.75C13.5 13.8881 13.3881 14 13.25 14H7.75C7.61193 14 7.5 13.8881 7.5 13.75V6.25Z" fill="currentColor"/>
            </svg>
            <span class="btn-text">Copy</span>
          </button>
          <button class="btn btn-secondary tsx-btn" title="Copy as TSX">
          <svg class"btn-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M4.21969 12.5303L4.75002 13.0607L5.81068 12L5.28035 11.4697L1.81068 7.99999L5.28035 4.53032L5.81068 3.99999L4.75002 2.93933L4.21969 3.46966L0.39647 7.29289C0.00594562 7.68341 0.00594562 8.31658 0.39647 8.7071L4.21969 12.5303ZM11.7804 12.5303L11.25 13.0607L10.1894 12L10.7197 11.4697L14.1894 7.99999L10.7197 4.53032L10.1894 3.99999L11.25 2.93933L11.7804 3.46966L15.6036 7.29289C15.9941 7.68341 15.9941 8.31658 15.6036 8.7071L11.7804 12.5303Z" fill="currentColor"/>
          </svg>
            <span class="btn-text">TSX</span>
          </button>
          <button class="btn btn-secondary download-btn" title="Download SVG">
          <svg class"btn-icon" height="16" stroke-linejoin="round" viewBox="0 0 16 16" width="16" style="color: currentcolor;">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 5.25V4.5H7.25V5.25V9.43934L5.78033 7.96967L5.25 7.43934L4.18934 8.5L4.71967 9.03033L7.46967 11.7803C7.76256 12.0732 8.23744 12.0732 8.53033 11.7803L11.2803 9.03033L11.8107 8.5L10.75 7.43934L10.2197 7.96967L8.75 9.43934V5.25ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0Z" fill="currentColor"/>
            </svg>
            <span class="btn-text">Save</span>
          </button>
        </div>
      </div>
      <div class="svg-preview">
        ${svgData.type === 'external' ? 
          '<div class="loading">Loading external SVG...</div>' : 
          svgData.svg}
      </div>
    `;

    if (svgData.type === 'external') {
      try {
        const response = await fetch(svgData.url);
        if (!response.ok) throw new Error('Failed to fetch SVG');
        const svgContent = await response.text();
        svgData.svg = svgContent;
        item.querySelector('.svg-preview').innerHTML = svgContent;
      } catch (error) {
        item.querySelector('.svg-preview').innerHTML = `
          <div class="error">
            Failed to load external SVG<br>
            <small>${svgData.url}</small>
          </div>
        `;
        console.error('Error loading external SVG:', error);
      }
    }

    this.attachEventListeners(item, svgData, index);
    return item;
  }

  attachEventListeners(item, svgData, index) {
    const copyBtn = item.querySelector(".copy-btn");
    const tsxBtn = item.querySelector(".tsx-btn");
    const downloadBtn = item.querySelector(".download-btn");

    copyBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(svgData.svg);
      this.showToast("SVG copied to clipboard!");
    });

    tsxBtn.addEventListener("click", async () => {
      const componentName = TSXConverter.generateComponentName(index);
      const tsxCode = TSXConverter.convertToTSX(svgData.svg, componentName);
      await navigator.clipboard.writeText(tsxCode);
      this.showToast("TSX component copied to clipboard!");
    });

    downloadBtn.addEventListener("click", () => {
      this.downloadSVG(svgData, index);
    });
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    // Add visible class after a frame to trigger animation
    requestAnimationFrame(() => {
      toast.classList.add("toast-visible");
    });

    setTimeout(() => {
      toast.classList.remove("toast-visible");
      toast.addEventListener("transitionend", () => toast.remove());
    }, 2000);
  }

  downloadSVG(svgData, index) {
    const svgString = svgData.svg;
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    
    let fileName;
    
    if (svgData.type === 'external') {
      // For external SVGs, use the original filename from URL
      fileName = svgData.url.split('/').pop().split('?')[0];
    } else {
      // For inline SVGs, use existing logic
      fileName = svgElement.querySelector('title')?.textContent || 
                svgElement.id ||
                `icon-${index + 1}`;
                  
      // Clean up the filename
      fileName = fileName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
            
      // Ensure .svg extension
      if (!fileName.toLowerCase().endsWith('.svg')) {
          fileName += '.svg';
      }
    }

    // Create blob and trigger download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.showToast(`SVG downloaded as ${fileName}`);
  }
}

new SVGManager();
