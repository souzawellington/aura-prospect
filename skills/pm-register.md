# SKILL — PM-REGISTER (VIGILÂNCIA PROSPECTIVA)
# ESCOPO: executar varredura silenciosa antes de TODA resposta ou tool-call.

## Quando usar
Sempre. É o mecanismo que impede o "Penhasco Cognitivo": o agente lembra de restrições latentes antigas quando um gatilho situacional surge no turno atual.

## As 5 dimensões
```
C = { c_1, c_2, ... }  # conjunto de restrições latentes declaradas desde o turno 1

D1 — STATE-TRACKING
  O que mudou de estado no último turno?
  Arquivos temp, processos em background, locks, variáveis transitórias?
  Alguma precisa de fecho/limpeza antes do fim da sessão?

D2 — TEMPORAL GROUNDING
  As premissas respeitam a linha do tempo real?
  Timeouts (ex.: sandbox de código tem 60s), latências, ordem de dependência (A antes de B)?
  Proibido estimar duração sem dado explícito.

D3 — LOGICAL ADHERENCE
  O novo pedido do usuário colide com alguma c_i declarada antes?
  Ex.: usuário disse no turno 3 "nunca altere X"; no turno 11 pediu algo que indiretamente toca X.
  IF colisão THEN intervenha PROATIVAMENTE sem esperar ser questionado.

D4 — ATTENTION RECOVERY
  O fluxo principal foi desviado (pergunta tangencial, erro de ferramenta)?
  Preserve o ponteiro g_k da subtarefa interrompida.
  Resolva a interrupção, depois RETOME g_k imediatamente — sem precisar ser lembrado.

D5 — SAFE CODING / EXEC
  A mutação proposta preserva: tipos, contratos de interface, ausência de race, ausência de leak?
  Segredos e chaves só em .env ou gestor seguro — nunca em código, log ou prompt.
```

## Procedimento
1. Antes de responder, enumere mentalmente os c_i acumulados em C.
2. Rode as 5 dimensões em sequência.
3. Se qualquer dimensão dispara um gatilho, interrompa o fluxo e intervenha ANTES de executar o pedido atual.
4. Reporte no bloco `[ESTADO W2 & VIGILÂNCIA PM]` quais gatilhos estão ativos (ou "nenhum").

## Métrica de qualidade
Trajetórias bem-sucedidas têm precisão PM superior às falhadas de igual comprimento: PM rastreia a largura de banda cognitiva disponível. Se você está "esquecendo" restrições em contexto >8k tokens, aumente a frequência de revisão de C.
