import React from 'react';

export interface MessageData {
  encoded_message?: string;
  message?: string;
  message_type?: string | number;
  id?: number;
  views?: number;
  message_time?: number;
}

/**
 * Decodes HTML entities while preserving Unicode emoji.
 * Uses a textarea element to let the browser decode numeric and named entities.
 */
export const decodeHtmlEntities = (html: string): string => {
  if (!html) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

/**
 * Strip empty Quill placeholders like <p><br></p>
 */
export const stripEmptyPlaceholders = (html: string): string => {
  return html.replace(/<p>\s*<br\s*\/?>\s*<\/p>/gi, '').trim();
};

/**
 * Basic auto-link implementation that returns an HTML string with anchors.
 * This is intentionally conservative — for more advanced transformations
 * a DOM walker approach can be implemented.
 */
export const autoLinkHtml = (text: string): string => {
  if (!text) return '';

  // Link class forces wrapping for long links
  const anchorClass = 'text-blue-700 hover:underline cursor-pointer break-words inline-block max-w-full';

  // Match http/https links
  const urlPattern = /(https?:\/\/[^\s<]+)/gi;

  // Replace with anchored html
  return text.replace(urlPattern, (m) => `<a href="${m}" target="_blank" rel="noopener noreferrer" class="${anchorClass}">${m}</a>`);
};

/**
 * Convenience renderer: decode entities, strip placeholders, auto-link, and
 * convert newlines to <br/>. Returns an HTML string safe to insert via
 * `dangerouslySetInnerHTML` after confidence that content is trusted or
 * sanitized upstream.
 */
export const renderHtmlString = (rawHtml: string): string => {
  const decoded = decodeHtmlEntities(rawHtml || '');
  const stripped = stripEmptyPlaceholders(decoded);
  const linked = autoLinkHtml(stripped);
  return linked.replace(/\n/g, '<br/>');
};

export default {
  decodeHtmlEntities,
  stripEmptyPlaceholders,
  autoLinkHtml,
  renderHtmlString,
};
