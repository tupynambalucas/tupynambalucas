import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { brandColors } from '@tupynambalucas-studio/design/tokens';
import { fillTemplate } from '../utils/template-fill.js';
import { getInlinedNunitoFont } from '../utils/font-encoder.js';

interface RenderHeaderOptions {
  outputDir: string;
  defaultHeaderTemplatePath: string;
}

/**
 * Renders the dark and light versions of the personal brand header card SVG,
 * embedding the variable Nunito font as Base64 and loading colors from @studio/design tokens.
 */
export function renderHeaderCards(options: RenderHeaderOptions): void {
  const { outputDir, defaultHeaderTemplatePath } = options;

  console.info(`Reading header SVG template from ${defaultHeaderTemplatePath}...`);
  const template = readFileSync(defaultHeaderTemplatePath, 'utf8');

  // Load the variable font inlined as Base64 Data URI
  const nunitoFontBase64 = getInlinedNunitoFont();

  // Create output directory if it doesn't exist
  mkdirSync(outputDir, { recursive: true });

  // 1. Render Dark Mode Header (header-dark.svg)
  console.info('Compiling header-dark.svg (Dark Mode)...');
  const darkData = {
    nunitoFontBase64,
    colors: {
      titleColor: brandColors.typography.titles.dark, // Light text for dark background
      subtitleColor: brandColors.typography.subtitles.dark,
      brandPurple: brandColors.identity.brandPurple,
    },
  };
  const darkSvg = fillTemplate(template, darkData);
  const darkOutPath = join(outputDir, 'header-dark.svg');
  writeFileSync(darkOutPath, darkSvg, 'utf8');

  // 2. Render Light Mode Header (header-light.svg)
  console.info('Compiling header-light.svg (Light Mode)...');
  const lightData = {
    nunitoFontBase64,
    colors: {
      titleColor: brandColors.typography.titles.light, // Dark text for light background
      subtitleColor: brandColors.typography.subtitles.light,
      brandPurple: brandColors.identity.brandPurple,
    },
  };
  const lightSvg = fillTemplate(template, lightData);
  const lightOutPath = join(outputDir, 'header-light.svg');
  writeFileSync(lightOutPath, lightSvg, 'utf8');

  console.info('Header cards successfully rendered!');
}
