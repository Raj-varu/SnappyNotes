/**
 * Zendesk Rich Text & Clipboard Formatter
 * Formats HTML and Plain Text ensuring seamless paste into Zendesk Agent Workspace,
 * Outlook, Gmail, and standard text editors with native bullet points and formatting.
 */

/**
 * Extract all {{variable}} placeholders from HTML or plain text
 * @param {string} text 
 * @returns {string[]} array of unique variable names
 */
export function extractPlaceholders(text) {
  if (!text) return [];
  const regex = /\{\{([^}]+)\}\}/g;
  const matches = new Set();
  let match;
  while ((match = regex.exec(text)) !== null) {
    const varName = match[1].trim();
    if (varName) {
      matches.add(varName);
    }
  }
  return Array.from(matches);
}

/**
 * Replace placeholders in HTML string
 * @param {string} html 
 * @param {Record<string, string>} variableValues 
 * @returns {string}
 */
export function applyVariablesToHtml(html, variableValues = {}) {
  if (!html) return '';
  let result = html;
  for (const [key, value] of Object.entries(variableValues)) {
    if (value !== undefined && value !== null && value.trim() !== '') {
      const regex = new RegExp(`\\{\\{\\s*${escapeRegExp(key)}\\s*\\}\\}`, 'g');
      result = result.replace(regex, escapeHtml(value));
    }
  }
  return result;
}

/**
 * Convert HTML to clean Plain Text with indented bullet points & numbered lists
 * @param {string} html 
 * @returns {string}
 */
export function htmlToZendeskPlainText(html) {
  if (!html) return '';

  // Create temporary DOM element for accurate tree traversal
  const temp = document.createElement('div');
  temp.innerHTML = html;

  function parseNode(node, listDepth = 0, isOrdered = false, listIndex = 1) {
    let text = '';
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();

      if (tagName === 'br') {
        return '\n';
      }

      if (tagName === 'p') {
        let childText = '';
        node.childNodes.forEach(child => {
          childText += parseNode(child, listDepth);
        });
        return childText.trim() + '\n\n';
      }

      if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3') {
        let childText = '';
        node.childNodes.forEach(child => {
          childText += parseNode(child, listDepth);
        });
        return childText.trim().toUpperCase() + '\n\n';
      }

      if (tagName === 'ul') {
        let listText = '';
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'li') {
            listText += parseNode(child, listDepth + 1, false);
          }
        });
        return (listDepth === 0 ? listText + '\n' : listText);
      }

      if (tagName === 'ol') {
        let listText = '';
        let index = 1;
        node.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'li') {
            listText += parseNode(child, listDepth + 1, true, index++);
          }
        });
        return (listDepth === 0 ? listText + '\n' : listText);
      }

      if (tagName === 'li') {
        const indent = '  '.repeat(Math.max(0, listDepth - 1));
        const prefix = isOrdered ? `${listIndex}. ` : '• ';
        let itemContent = '';
        let nestedLists = '';

        node.childNodes.forEach(child => {
          if (child.nodeType === Node.ELEMENT_NODE && (child.tagName.toLowerCase() === 'ul' || child.tagName.toLowerCase() === 'ol')) {
            nestedLists += '\n' + parseNode(child, listDepth);
          } else {
            itemContent += parseNode(child, listDepth);
          }
        });

        return `${indent}${prefix}${itemContent.trim()}${nestedLists}\n`;
      }

      if (tagName === 'blockquote') {
        let childText = '';
        node.childNodes.forEach(child => {
          childText += parseNode(child, listDepth);
        });
        return childText.split('\n').map(l => l ? `> ${l}` : '').join('\n') + '\n\n';
      }

      if (tagName === 'code') {
        return `\`${node.textContent}\``;
      }

      if (tagName === 'pre') {
        return `\n\`\`\`\n${node.textContent}\n\`\`\`\n\n`;
      }

      // Default recursive traverse
      let childText = '';
      node.childNodes.forEach(child => {
        childText += parseNode(child, listDepth);
      });
      return childText;
    }

    return '';
  }

  const rawText = parseNode(temp);
  // Clean up excess newlines (max 2 consecutive)
  return rawText.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Format snippet for clipboard with Zendesk HTML compliance
 * @param {string} rawHtml 
 * @param {Record<string, string>} variableValues 
 * @returns {{ html: string, text: string }}
 */
export function formatSnippetPayload(rawHtml, variableValues = {}) {
  const processedHtml = applyVariablesToHtml(rawHtml, variableValues);
  const plainText = htmlToZendeskPlainText(processedHtml);

  // Clean HTML for Zendesk Rich text paste
  // Ensure standard formatting tags are clean
  const cleanHtml = processedHtml
    .replace(/<p><\/p>/g, '<br>')
    .replace(/\sstyle="[^"]*"/gi, ''); // strip inline styles that can interfere with Zendesk themes

  return {
    html: cleanHtml,
    text: plainText
  };
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(string) {
  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
