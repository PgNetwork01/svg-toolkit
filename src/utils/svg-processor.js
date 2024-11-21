export class SVGProcessor {
  static async process(svgString, options = {}) {
    const {
      optimize = true,
      removeComments = true,
      removeDefs = false,
      removeMetadata = true,
      removeEmptyAttrs = true,
      convertColors = false,
      targetSize = null,
    } = options;

    let svg = svgString;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      const svgElement = doc.querySelector("svg");

      if (!svgElement) {
        throw new Error("Invalid SVG");
      }

      if (removeComments) {
        this.removeComments(doc);
      }

      if (removeMetadata) {
        this.removeMetadata(svgElement);
      }

      if (removeDefs) {
        this.removeDefs(svgElement);
      }

      if (removeEmptyAttrs) {
        this.removeEmptyAttributes(svgElement);
      }

      if (convertColors) {
        this.normalizeColors(svgElement);
      }

      if (targetSize) {
        this.resizeSVG(svgElement, targetSize);
      }

      if (optimize) {
        svg = this.optimizeSVG(svgElement.outerHTML);
      }

      return {
        success: true,
        svg: svg,
        stats: await this.generateStats(svg),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        originalSvg: svgString,
      };
    }
  }

  static removeComments(doc) {
    const iterator = doc.createNodeIterator(
      doc,
      NodeFilter.SHOW_COMMENT,
      () => NodeFilter.FILTER_ACCEPT
    );
    let node;
    while ((node = iterator.nextNode())) {
      node.parentNode.removeChild(node);
    }
  }

  static removeMetadata(svgElement) {
    const metadata = svgElement.querySelector("metadata");
    if (metadata) metadata.remove();
  }

  static removeDefs(svgElement) {
    const defs = svgElement.querySelector("defs");
    if (defs) defs.remove();
  }

  static removeEmptyAttributes(element) {
    Array.from(element.attributes).forEach((attr) => {
      if (!attr.value) element.removeAttribute(attr.name);
    });

    Array.from(element.children).forEach((child) => {
      this.removeEmptyAttributes(child);
    });
  }

  static normalizeColors(element) {
    const convertColor = (color) => {
      // Convert named colors to hex
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = color;
      return ctx.fillStyle;
    };

    const processElement = (el) => {
      const colorAttributes = ["fill", "stroke"];
      colorAttributes.forEach((attr) => {
        if (el.hasAttribute(attr) && el.getAttribute(attr) !== "none") {
          el.setAttribute(attr, convertColor(el.getAttribute(attr)));
        }
      });

      Array.from(el.children).forEach((child) => processElement(child));
    };

    processElement(element);
  }

  static resizeSVG(svgElement, targetSize) {
    const viewBox = svgElement.viewBox.baseVal;
    const aspect = viewBox.width / viewBox.height;

    if (aspect >= 1) {
      svgElement.setAttribute("width", targetSize);
      svgElement.setAttribute("height", targetSize / aspect);
    } else {
      svgElement.setAttribute("height", targetSize);
      svgElement.setAttribute("width", targetSize * aspect);
    }
  }

  static async generateStats(svgString) {
    return {
      originalSize: new Blob([svgString]).size,
      optimizedSize: new Blob([this.optimizeSVG(svgString)]).size,
      elements: (svgString.match(/<\/?[a-z][\s\S]*?>/gi) || []).length,
      paths: (svgString.match(/<path/gi) || []).length,
      groups: (svgString.match(/<g/gi) || []).length,
    };
  }

  static optimizeSVG(svgString) {
    return svgString
      .replace(/\n/g, " ")
      .replace(/[\t ]+/g, " ")
      .replace(/> </g, "><")
      .replace(/<!--.*?-->/g, "")
      .replace(/<!DOCTYPE.*?>/g, "")
      .replace(/<\?xml.*?\?>/g, "")
      .replace(/version=".*?"/g, "")
      .replace(/xmlns:xlink=".*?"/g, "")
      .replace(/style=".*?"/g, function (match) {
        return match.replace(/: /g, ":").replace(/; /g, ";");
      });
  }
}
