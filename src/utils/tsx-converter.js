export class TSXConverter {
  static convertToTSX(svgString, componentName = "Icon") {
    // Clean up the SVG
    const cleanSvg = svgString
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      // Convert kebab-case to camelCase
      .replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      // Replace class with className
      .replace(/class=/g, "className=");

    // Create the simplified TSX component
    return `export default function ${componentName}({ className }: { className?: string }) {
  return (
    ${cleanSvg.replace(/<svg/, '<svg className={className}')}
  );
}`;
  }

  static generateComponentName(index) {
    // Convert index to proper component name (e.g., ShareIcon, ArrowIcon)
    return `Icon${index + 1}`;
  }
}
