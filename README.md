# AURA-PROSPECT

> Autonomous Ultra-Intelligent Reasoning & Short-Term Prospective Execution Architecture

Arquitetura de contexto para agentes de IA focada em modelagem causal de curto prazo (`t+1` a `t+5`), inferência ativa (`PREDICT -> OBSERVE -> COMPARE -> RESOLVE`), motor prospectivo com rejeição contrafactual e portões de runtime conjuntivos (`|S|/|A| = 1.0`).

## Estrutura

```
.
├── SOUL.md                 # Slot #1 — identidade, vetor NEO-PI-R, matriz de pushback (cache STABLE)
├── system-prompt.md        # Slots #2–#5 — tri-mundo, motor PROACT, PM-Register, portões, formato de saída
├── agents/
│   ├── strategist.md       # overlay: arquitetura e refatoração
│   └── researcher.md       # overlay: pesquisa com filtro SACA
├── skills/
│   ├── proact-lookahead.md # 5 estágios de compressão cognitiva
│   ├── pm-register.md      # vigilância das 5 dimensões TriggerBench
│   └── stop-gate.md        # auditoria conjuntiva de encerramento
└── app/                    # chat UI (Next.js) — BYOK (Bring Your Own Key)
```

## Como funciona a UI

O chat deste repositório é **BYOK**: o usuário cola a própria `ANTHROPIC_API_KEY` no browser; a chave fica em `localStorage` e as chamadas vão **direto do navegador para a API da Anthropic** (via `dangerouslyAllowBrowser`). O servidor Vercel só serve o HTML/JS estático — nenhuma chamada passa pelo backend, nenhum custo é cobrado do dono do deploy.

A injeção respeita a hierarquia de cache:

| Slot | Cache | Conteúdo |
|---|---|---|
| 1 | STABLE | `SOUL.md` |
| 2–3 | STABLE | Módulos 1–2 de `system-prompt.md` (tri-mundo + motor PROACT) |
| 4 | CONTEXT | Módulo 3 (PM-Register + leis de ferramentas) + overlay do agente |
| 5 | VOLATILE | Módulo 4 (portões + formato de saída) + histórico |

Cada bloco é enviado como item separado de `system[]` com `cache_control: { type: 'ephemeral' }`, aproveitando o desconto de ~75% de prompt caching da Anthropic a partir do segundo turno.

## Deploy local

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`, cole uma chave `sk-ant-...` e teste.

## Deploy em produção

Qualquer push para `main` dispara deploy automático na Vercel (via integração GitHub + Vercel). Nenhuma env var é necessária — chaves são do usuário final.

## Licença

MIT.
