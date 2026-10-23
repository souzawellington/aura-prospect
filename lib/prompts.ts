import fs from 'node:fs';
import path from 'node:path';

export type PromptBundle = {
  soul: string;
  systemPrompt: string;
  agents: {
    strategist: string;
    researcher: string;
  };
};

/**
 * Server-side only. Reads SOUL.md, system-prompt.md and per-agent overlays
 * from the repo root at request time. Next.js bundles these at build time
 * for Vercel deployment.
 */
export function loadPromptBundle(): PromptBundle {
  const root = process.cwd();
  const read = (p: string) => fs.readFileSync(path.join(root, p), 'utf-8');
  return {
    soul: read('SOUL.md'),
    systemPrompt: read('system-prompt.md'),
    agents: {
      strategist: read('agents/strategist.md'),
      researcher: read('agents/researcher.md'),
    },
  };
}
