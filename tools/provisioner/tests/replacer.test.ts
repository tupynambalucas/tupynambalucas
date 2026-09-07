import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { applyReplacements } from '../src/core/replacer.js';
import * as fs from 'node:fs';
import * as glob from 'glob';

vi.mock('node:fs');
vi.mock('glob');

describe('Replacer Core Logic', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should replace strings safely and write if changed', () => {
    vi.mocked(glob.globSync).mockReturnValue(['mock.yaml']);
    vi.mocked(fs.readFileSync).mockReturnValue('host: tupynambalucas.dev');
    
    const count = applyReplacements('/mock/dir', [
      { oldValue: 'tupynambalucas.dev', newValue: 'mycompany.com' }
    ]);
    
    expect(count).toBe(1);
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining('mock.yaml'),
      'host: mycompany.com',
      'utf-8'
    );
  });

  it('should not write if no changes occurred', () => {
    vi.mocked(glob.globSync).mockReturnValue(['mock.yaml']);
    vi.mocked(fs.readFileSync).mockReturnValue('host: nothing');
    
    const count = applyReplacements('/mock/dir', [
      { oldValue: 'tupynambalucas.dev', newValue: 'mycompany.com' }
    ]);
    
    expect(count).toBe(0);
    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
