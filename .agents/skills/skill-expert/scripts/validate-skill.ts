import * as fs from 'fs';
import * as path from 'path';

interface ValidationResult {
  filePath: string;
  errors: string[];
}

function printUsage(): void {
  console.log(
    'Usage: pnpm exec tsx .agents/skills/skill-expert/scripts/validate-skill.ts --path <skill-directory>',
  );
}

function findMdFiles(dir: string): string[] {
  const results: string[] = [];
  if (fs.existsSync(dir) === false) {
    return results;
  }
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat !== undefined && stat.isDirectory() === true) {
      if (file !== 'node_modules' && file !== '.git') {
        results.push(...findMdFiles(filePath));
      }
    } else if (file.endsWith('.md') === true || file.endsWith('.mdx') === true) {
      results.push(filePath);
    }
  }
  return results;
}

function validateSkillDir(targetDir: string): boolean {
  const absoluteTargetDir = path.resolve(targetDir);
  if (fs.existsSync(absoluteTargetDir) === false) {
    console.error(`Error: Directory does not exist: ${absoluteTargetDir}`);
    return false;
  }

  const skillMdPath = path.join(absoluteTargetDir, 'SKILL.md');
  if (fs.existsSync(skillMdPath) === false) {
    console.error(`Error: Required file SKILL.md not found in ${absoluteTargetDir}`);
    return false;
  }

  let hasErrors = false;
  const results: ValidationResult[] = [];

  // 1. Validate SKILL.md Frontmatter and Line Count
  const skillMdErrors: string[] = [];
  const skillMdContent = fs.readFileSync(skillMdPath, 'utf-8');
  const lineCount = skillMdContent.split(/\r?\n/).length;

  if (lineCount >= 500) {
    skillMdErrors.push(
      `SKILL.md has ${lineCount} lines, which exceeds the maximum limit of 500 lines.`,
    );
  }

  // Parse YAML Frontmatter
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---/;
  const frontmatterMatch = skillMdContent.match(frontmatterRegex);

  if (frontmatterMatch === null) {
    skillMdErrors.push(
      "SKILL.md does not contain valid YAML frontmatter block delimited by '---'.",
    );
  } else {
    const rawYaml = frontmatterMatch[1];
    const lines = rawYaml.split(/\r?\n/);
    const frontmatter: Record<string, string> = {};

    for (const line of lines) {
      if (!line.trim() || line.startsWith('#')) continue;
      const separatorIndex = line.indexOf(':');
      if (separatorIndex === -1) continue;
      const key = line.slice(0, separatorIndex).trim();
      let val = line.slice(separatorIndex + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      frontmatter[key] = val;
    }

    // Name Validation
    if (frontmatter.name === undefined) {
      skillMdErrors.push("Frontmatter is missing the required 'name' field.");
    } else {
      const parentDirName = path.basename(absoluteTargetDir);
      if (frontmatter.name !== parentDirName) {
        skillMdErrors.push(
          `The 'name' field in frontmatter ('${frontmatter.name}') must match the parent directory name ('${parentDirName}').`,
        );
      }

      const nameLen = frontmatter.name.length;
      if (nameLen < 1 || nameLen > 64) {
        skillMdErrors.push(
          `The 'name' field length (${nameLen}) must be between 1 and 64 characters.`,
        );
      }

      const nameRegex = /^[a-z0-9-]+$/;
      if (nameRegex.test(frontmatter.name) === false) {
        skillMdErrors.push(
          `The 'name' field ('${frontmatter.name}') must contain only lowercase alphanumeric characters (a-z, 0-9) and hyphens (-).`,
        );
      }

      if (frontmatter.name.startsWith('-') === true || frontmatter.name.endsWith('-') === true) {
        skillMdErrors.push(
          `The 'name' field ('${frontmatter.name}') must not start or end with a hyphen.`,
        );
      }

      if (frontmatter.name.includes('--') === true) {
        skillMdErrors.push(
          `The 'name' field ('${frontmatter.name}') must not contain consecutive hyphens.`,
        );
      }
    }

    // Description Validation
    if (frontmatter.description === undefined) {
      skillMdErrors.push("Frontmatter is missing the required 'description' field.");
    } else {
      const descLen = frontmatter.description.length;
      if (descLen < 1 || descLen > 1024) {
        skillMdErrors.push(
          `The 'description' field length (${descLen}) must be between 1 and 1024 characters.`,
        );
      }
      if (frontmatter.description.trim() === '') {
        skillMdErrors.push("The 'description' field must be non-empty.");
      }
    }
  }

  if (skillMdErrors.length > 0) {
    results.push({ filePath: 'SKILL.md', errors: skillMdErrors });
    hasErrors = true;
  }

  // 2. Scan all Markdown files for Emojis and Absolute Links
  const mdFiles = findMdFiles(absoluteTargetDir);
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  for (const filePath of mdFiles) {
    const fileErrors: string[] = [];
    const relativePath = path.relative(absoluteTargetDir, filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Check for Emojis
    // Reset regex lastIndex
    emojiRegex.lastIndex = 0;
    const emojiMatches = content.match(emojiRegex);
    if (emojiMatches !== null) {
      // Narrow down matches to verify they are real emojis and not standard numbers or simple punctuation
      const realEmojis = emojiMatches.filter((emoji) => {
        // Exclude digits (0-9), asterisk, hash (often captured in loose emoji property matches)
        const charCode = emoji.charCodeAt(0);
        if (charCode >= 48 && charCode <= 57) return false; // '0'-'9'
        if (emoji === '*' || emoji === '#' || emoji === '©' || emoji === '®') return false;
        return true;
      });

      if (realEmojis.length > 0) {
        fileErrors.push(`Found forbidden emojis: ${Array.from(new Set(realEmojis)).join(', ')}`);
      }
    }

    // Check for absolute paths and file:/// URLs
    if (content.toLowerCase().includes('file:///')) {
      fileErrors.push("Found forbidden 'file:///' link.");
    }

    // Scan for windows drive letter patterns in links or plain text
    const driveLetterRegex = /\b[A-Za-z]:[\\/]/g;
    if (driveLetterRegex.test(content) === true) {
      fileErrors.push('Found absolute Windows file path (e.g. C:\\ or D:\\).');
    }

    // Scan markdown links for absolute targets
    const markdownLinkRegex = /\[.*?\]\((.*?)\)/g;
    let linkMatch;
    while ((linkMatch = markdownLinkRegex.exec(content)) !== null) {
      const url = linkMatch[1].trim();
      if (url.startsWith('/') === true && url.startsWith('//') === false) {
        fileErrors.push(`Found forbidden absolute markdown link target: "${url}"`);
      }
    }

    if (fileErrors.length > 0) {
      const existingResultIndex = results.findIndex((r) => r.filePath === relativePath);
      if (existingResultIndex !== -1) {
        results[existingResultIndex].errors.push(...fileErrors);
      } else {
        results.push({ filePath: relativePath, errors: fileErrors });
      }
      hasErrors = true;
    }
  }

  // 3. Output results
  if (hasErrors === true) {
    console.error(`\n=== Skill Validation FAILED for: ${absoluteTargetDir} ===`);
    for (const res of results) {
      console.error(`\nFile: ${res.filePath}`);
      for (const err of res.errors) {
        console.error(`  - ${err}`);
      }
    }
    console.error('\n=============================================');
    return false;
  }

  console.log(`\n=== Skill Validation PASSED for: ${absoluteTargetDir} ===`);
  return true;
}

function main(): void {
  const args = process.argv.slice(2);
  let targetPath = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--path' && i + 1 < args.length) {
      targetPath = args[i + 1];
      break;
    }
  }

  if (targetPath === '') {
    printUsage();
    process.exit(1);
  }

  const success = validateSkillDir(targetPath);
  if (success === true) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

main();
