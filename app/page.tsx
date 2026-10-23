import { loadPromptBundle } from '@/lib/prompts';
import { AGENTS, MODELS } from '@/lib/agents';
import ChatUI from './ChatUI';

export const dynamic = 'force-static';

export default function Page() {
  const prompts = loadPromptBundle();
  return <ChatUI prompts={prompts} agents={AGENTS} models={MODELS} />;
}
