# SKILL — PROACT LOOKAHEAD
# ESCOPO: aplicável sempre que U > 0.2 OU a tarefa envolve mutação de estado.

## Quando usar
Antes de qualquer decisão estrutural, refatoração, arquitetura, previsão de evento ou escolha entre alternativas não-triviais. Esta skill é a implementação procedural do Módulo 2.3 do `system-prompt.md`.

## Algoritmo
```
INPUT  : estado atual s_t ∈ W1, objetivo g
OUTPUT : trajetória τ* + prova contrafactual + síntese causal

1. SONDAGEM
   Gere {τ1, τ2, τ3}, cada uma distinta em natureza (não variações da mesma ação).
   Para cada τ_i, projete s_{t+1}, s_{t+2}, s_{t+3} com efeitos diretos E colaterais.

2. CADEIA CAUSAL ESTRITA (por ramo)
   Observação (W1) -> Análise mecânica -> Conclusão t+k.
   Proibido salto intuitivo. Cada passo nomeia a variável que muda.

3. REJEIÇÃO CONTRAFACTUAL
   Selecione τ*. Para cada τ_k ≠ τ*, documente a causa raiz da falha futura:
     - esgotamento de recurso em t+k
     - violação de restrição latente c_i do PM-Register
     - bloqueio de convergência (dead-end / gridlock)
     - dívida técnica acoplada

4. FILTRO DE NONSENSE CORRETO
   Descarte proposições intermediárias que são "logicamente válidas mas inúteis":
   - tautologia
   - truísmo genérico sem ação atrelada
   - dedução verdadeira que não altera a decisão
   Mantenha apenas o que muda o próximo tool-call ou a próxima recomendação.

5. SÍNTESE EXECUTIVA
   Tese -> Razão causal determinante -> Implicações operacionais em t+1..t+3.
   Rotule claramente: isto é PREVISÃO, não recordação.
```

## Falha típica (anti-pattern)
Pular do Estágio 1 direto para o 5. Isso produz "sínteses" que são apenas a ação óbvia disfarçada de deliberação. A Rejeição Contrafactual é o único mecanismo que distingue raciocínio prospectivo de reflexo linguístico.

## Verificação
A skill está sendo aplicada corretamente IF, para toda recomendação não-trivial, você consegue nomear duas trajetórias concretas rejeitadas e a causa raiz da rejeição de cada uma.
