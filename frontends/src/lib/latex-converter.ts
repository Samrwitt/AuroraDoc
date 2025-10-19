/**
 * Convert TipTap HTML content to LaTeX format
 */
export const convertToLatex = (html: string): string => {
  let latex = "";
  
  // Parse the HTML content
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Add document preamble
  latex += "\\documentclass[12pt]{article}\n";
  latex += "\\usepackage[utf8]{inputenc}\n";
  latex += "\\usepackage{amsmath}\n";
  latex += "\\usepackage{graphicx}\n";
  latex += "\\usepackage{hyperref}\n\n";
  latex += "\\begin{document}\n\n";
  
  // Process each node
  const processNode = (node: Node): string => {
    let result = "";
    
    if (node.nodeType === Node.TEXT_NODE) {
      return escapeLatex(node.textContent || "");
    }
    
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      
      switch (tagName) {
        case "h1":
          result = `\\section{${processChildren(element)}}\n\n`;
          break;
        case "h2":
          result = `\\subsection{${processChildren(element)}}\n\n`;
          break;
        case "h3":
          result = `\\subsubsection{${processChildren(element)}}\n\n`;
          break;
        case "p":
          const alignment = (element as HTMLElement).style.textAlign;
          const content = processChildren(element);
          if (alignment === "center") {
            result = `\\begin{center}\n${content}\n\\end{center}\n\n`;
          } else if (alignment === "right") {
            result = `\\begin{flushright}\n${content}\n\\end{flushright}\n\n`;
          } else {
            result = `${content}\n\n`;
          }
          break;
        case "strong":
        case "b":
          result = `\\textbf{${processChildren(element)}}`;
          break;
        case "em":
        case "i":
          result = `\\textit{${processChildren(element)}}`;
          break;
        case "u":
          result = `\\underline{${processChildren(element)}}`;
          break;
        case "code":
          result = `\\texttt{${processChildren(element)}}`;
          break;
        case "a":
          const href = element.getAttribute("href") || "";
          result = `\\href{${href}}{${processChildren(element)}}`;
          break;
        case "blockquote":
          result = `\\begin{quote}\n${processChildren(element)}\n\\end{quote}\n\n`;
          break;
        case "ul":
          result = `\\begin{itemize}\n${processChildren(element)}\\end{itemize}\n\n`;
          break;
        case "ol":
          result = `\\begin{enumerate}\n${processChildren(element)}\\end{enumerate}\n\n`;
          break;
        case "li":
          result = `\\item ${processChildren(element)}\n`;
          break;
        default:
          result = processChildren(element);
      }
    }
    
    return result;
  };
  
  const processChildren = (element: Element): string => {
    let result = "";
    element.childNodes.forEach(child => {
      result += processNode(child);
    });
    return result;
  };
  
  // Process body content
  doc.body.childNodes.forEach(node => {
    latex += processNode(node);
  });
  
  latex += "\\end{document}";
  
  return latex;
};

const escapeLatex = (text: string): string => {
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/[&%$#_{}]/g, "\\$&")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
};

/**
 * Download LaTeX content as a .tex file
 */
export const downloadLatex = (latex: string, filename: string = "document.tex") => {
  const blob = new Blob([latex], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
