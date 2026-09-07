#!/usr/bin/env node
import { Command } from 'commander';
import { runInitAction } from './commands/init/action.js';

const program = new Command();

program.name('provisioner').description('State-aware monorepo provisioning tool').version('1.0.0');

program
  .command('init')
  .description('Bootstrap and rename a new fork of the monorepo')
  .action((options: import('./types/index.js').InitCommandOptions) => {
    runInitAction(options).catch((err) => {
      console.error('Failed to run init command:', err);
      process.exit(1);
    });
  });

program.parse(process.argv);
