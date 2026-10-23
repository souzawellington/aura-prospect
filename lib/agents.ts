export const AGENTS = [
  { id: 'base', label: 'AURA-PROSPECT (base)', overlayKey: null },
  { id: 'strategist', label: 'Strategist (arquitetura)', overlayKey: 'strategist' },
  { id: 'researcher', label: 'Researcher (pesquisa)', overlayKey: 'researcher' },
] as const;

export const MODELS = [
  { id: 'claude-sonnet-5-5', label: 'Sonnet 5.5' },
  { id: 'claude-opus-5-5', label: 'Opus 5.5' },
  { id: 'claude-haiku-5-5', label: 'Haiku 5.5' },
] as const;

export type AgentId = (typeof AGENTS)[number]['id'];
export type ModelId = (typeof MODELS)[number]['id'];
