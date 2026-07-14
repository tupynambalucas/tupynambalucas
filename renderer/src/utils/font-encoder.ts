import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workspaceRoot = resolve(__dirname, '../../');

let cachedFontBase64: string | null = null;

/**
 * Reads the local Nunito variable font from `@studio/design` and returns its Base64 data URI representation.
 * Caches the result in memory to prevent redundant disk I/O operations.
 */
export function getInlinedNunitoFont(): string {
  if (cachedFontBase64) {
    return cachedFontBase64;
  }

  // Resolve path relative to renderer package root (D:\projects\tupynambalucas\renderer)
  const fontFilePath = resolve(
    workspaceRoot,
    '../studio/design/assets/fonts/nunito/nunito-variable.woff2',
  );

  try {
    const fontBuffer = readFileSync(fontFilePath);
    const base64Font = fontBuffer.toString('base64');
    cachedFontBase64 = `data:font/woff2;charset=utf-8;base64,${base64Font}`;
    return cachedFontBase64;
  } catch (error) {
    console.error(`[Font Encoder] Failed to read variable font at path: ${fontFilePath}`, error);
    throw error;
  }
}
