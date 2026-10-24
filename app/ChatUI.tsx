'use client';

import Anthropic from '@anthropic-ai/sdk';
import { useEffect, useRef, useState } from 'react';
import type { PromptBundle } from '@/lib/prompts';

type Message = { role: 'user' | 'assistant'; content: string };

type Props = {
  prompts: PromptBundle;
  agents: ReadonlyArray<{ id: string; label: string; overlayKey: string | null }>;
  models: ReadonlyArray<{ id: string; label: string }>;
};

const STORAGE_KEY = 'aura.apiKey';
const STORAGE_AGENT = 'aura.agent';
const STORAGE_MODEL = 'aura.model';

export default function ChatUI({ prompts, agents, models }: Props) {
  const [apiKey, setApiKey] = useState('');
  const [agent, setAgent] = useState(agents[0].id);
  const [model, setModel] = useState(models[0].id);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const k = localStorage.getItem(STORAGE_KEY);
      if (k) setApiKey(k);
      const a = localStorage.getItem(STORAGE_AGENT);
      if (a && agents.some((x) => x.id === a)) setAgent(a);
      const m = localStorage.getItem(STORAGE_MODEL);
      if (m && models.some((x) => x.id === m)) setModel(m);
    } catch {
      /* private mode or blocked storage — stateless is fine */
    }
  }, [agents, models]);

  useEffect(() => {
    try { if (apiKey) localStorage.setItem(STORAGE_KEY, apiKey); } catch { /* ignore */ }
  }, [apiKey]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_AGENT, agent); } catch { /* ignore */ }
  }, [agent]);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_MODEL, model); } catch { /* ignore */ }
  }, [model]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight });
  }, [messages, streaming]);

  async function send() {
    const text = input.trim();
    if (!text || streaming) return;
    if (!apiKey || !apiKey.startsWith('sk-ant-')) {
      setError('Chave inválida. Formato esperado: sk-ant-...');
      return;
    }
    setError(null);

    const userMsg: Message = { role: 'user', content: text };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setStreaming(true);

    // Placeholder assistant message that fills in as the stream arrives
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
      const overlayKey = agents.find((a) => a.id === agent)?.overlayKey ?? null;

      const system: Array<{ type: 'text'; text: string; cache_control?: { type: 'ephemeral' } }> = [
        { type: 'text', text: prompts.soul, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: prompts.systemPrompt, cache_control: { type: 'ephemeral' } },
      ];
      if (overlayKey && overlayKey in prompts.agents) {
        const overlay = (prompts.agents as Record<string, string>)[overlayKey];
        if (overlay) system.push({ type: 'text', text: overlay, cache_control: { type: 'ephemeral' } });
      }

      const stream = client.messages.stream({
        model,
        max_tokens: 8192,
        system,
        messages: history.map((m) => ({ role: m.role, content: m.content })),
      });

      let acc = '';
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          acc += event.delta.text;
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: acc };
            return copy;
          });
        }
      }
      await stream.finalMessage();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      // Rollback the empty assistant placeholder
      setMessages((prev) => {
        if (prev.length && prev[prev.length - 1].role === 'assistant' && !prev[prev.length - 1].content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setStreaming(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  }

  function reset() {
    setMessages([]);
    setError(null);
  }

  return (
    <main className="shell">
      <header className="topbar">
        <div className="brand">AURA-PROSPECT</div>
        <div className="controls">
          <select value={agent} onChange={(e) => setAgent(e.target.value)} disabled={streaming} aria-label="Agente">
            {agents.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={streaming} aria-label="Modelo">
            {models.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
          </select>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            autoComplete="off"
            spellCheck={false}
            aria-label="Anthropic API key"
          />
          <button onClick={reset} disabled={streaming}>RESET</button>
        </div>
      </header>

      <section ref={scrollRef} className="stream">
        {messages.length === 0 && (
          <div className="splash">
            <h1>AURA-PROSPECT</h1>
            <p>
              Arquiteto Cognitivo com modelagem causal <code>t+1..t+5</code>,
              inferência ativa <code>PREDICT → OBSERVE → COMPARE → RESOLVE</code>,
              rejeição contrafactual explícita e portão de paragem conjuntivo <code>|S|/|A| = 1.0</code>.
            </p>
            <p>
              Toda resposta vem no contrato de 4 blocos:
              <code> [ESTADO W2 &amp; VIGILÂNCIA PM]</code>,
              <code> [SIMULAÇÃO PROACT (t+1 a t+3)]</code>,
              <code> [EXECUÇÃO &amp; ARTEFATO DETERMINÍSTICO]</code>,
              <code> [AUDITORIA STOP-GATE]</code>.
            </p>
            <p className="warn">
              <strong>BYOK.</strong> Sua chave <code>sk-ant-...</code> fica apenas no seu navegador
              (<code>localStorage</code>) e as chamadas vão direto para a API da Anthropic.
              Nenhuma passa por este servidor. Obtenha uma chave em{' '}
              <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>
                console.anthropic.com
              </a>.
            </p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`msg msg-${m.role}`}>
            <div className="role">{m.role === 'user' ? 'VOCÊ' : 'AURA'}</div>
            <pre className="content">{m.content || (streaming && i === messages.length - 1 ? '…' : '')}</pre>
          </div>
        ))}
        {streaming && <div className="pulse">▊</div>}
      </section>

      {error && <div className="error">{error}</div>}

      <footer className="composer">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Mensagem (Enter envia · Shift+Enter quebra linha)…"
          rows={3}
          disabled={streaming}
        />
        <button onClick={() => void send()} disabled={streaming || !input.trim()}>
          {streaming ? 'STREAMING…' : 'ENVIAR'}
        </button>
      </footer>
    </main>
  );
}
