export class SVGUtils {
  static async optimizeSVG(svgString) {
    // Basic SVG optimization
    return svgString
      .replace(/\s+/g, " ") // Reduce whitespace
      .replace(/>\s+</g, "><") // Remove whitespace between tags
      .replace(/\s*([{:};\(\)])\s*/g, "$1") // Remove whitespace around brackets
      .replace(/([\d\.]+)px/g, "$1"); // Remove px units
  }

  static async validateSVG(svgString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    return !doc.querySelector("parsererror");
  }

  static generateFileName(prefix = "svg", index = 0) {
    const date = new Date().toISOString().split("T")[0];
    return `${prefix}-${date}-${index}.svg`;
  }

  static async getSVGDimensions(svgString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.querySelector("svg");

    return {
      width: svg.getAttribute("width") || svg.viewBox?.baseVal?.width || null,
      height:
        svg.getAttribute("height") || svg.viewBox?.baseVal?.height || null,
    };
  }

  static async convertToDataURL(svgString) {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    return URL.createObjectURL(blob);
  }
}
