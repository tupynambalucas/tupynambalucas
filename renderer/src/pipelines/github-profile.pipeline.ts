import type { Pipeline } from './types.js';

/**
 * Pipeline configuration for generating the root-level developer profile README.md.
 */
export const githubProfilePipeline: Pipeline = {
  id: 'github-profile',
  name: 'GitHub Developer Profile',
  description: 'Compiles the main developer profile README and its respective statistics cards.',
  targets: [
    {
      name: 'Root Profile README',
      templatePath: 'src/templates/docs/README.template.md',
      outputPath: '../README.md', // Writes directly to the monorepo root (D:\projects\tupynambalucas\README.md)
      ciPath: 'README.md',
      ciBranches: ['main'],
    },
  ],
};
