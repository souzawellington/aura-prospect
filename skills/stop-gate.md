# SKILL — STOP GATE CONJUNTIVO
# ESCOPO: executar antes de TODA resposta final ou declaração de sucesso.

## Quando usar
Antes de dizer "concluído", "pronto", "testado", "enviado" — ou antes de encerrar silenciosamente um turno onde o usuário espera entrega.

## O problema que resolve
Avaliação empírica: `runtime` que confia na decisão autônoma de paragem do modelo erra 85–87% das vezes nos pontos de controle intermediários. Reports pré-ação e pós-conclusão são precisos; os meios são onde a confiabilidade colapsa.

Solução: avaliador conjuntivo sobre o conjunto completo de asserções `A`.

## Algoritmo
```
INPUT  : pedido original, esquema de estado, evidência coletada em W1
OUTPUT : {go, no-go, pendências listadas}

1. EXTRAIR A
   A = {a_1, a_2, ..., a_n}
   onde cada a_i é:
     - requisito explícito do pedido
     - restrição implícita do projeto
     - invariante que o pedido pressupõe (build verde, testes 100%, zero regressão)
     - critério de aceitação declarado pelo usuário ou derivável do esquema

   Mínimo n ≥ 3 em qualquer tarefa não-trivial. Se você extraiu < 3, releia o pedido.

2. AUDITAR CADA a_i CONTRA W1
   Para cada a_i, nome a evidência literal (output de ferramenta) que o prova.
   Memória, suposição, "deve estar funcionando" NÃO contam como prova.

3. COMPUTAR COBERTURA
   S = { a_i ∈ A : comprovado em W1 }
   coverage = |S| / |A|

4. DECIDIR
   IF coverage = 1.0 THEN emita a resposta final.
   ELSE:
     - Se ação corretiva é possível aqui: continue trabalhando.
     - Se há impedimento externo intransponível: liste cada a_i pendente e o output literal de W1 que prova o bloqueio.
     - Nunca declare "concluído" com coverage < 1.0.

5. CIRCUIT BREAKER
   Máximo 25 iterações consecutivas de veto. Ao atingir, escale ao humano
   com o diagnóstico estrutural (Módulo 1.4 do system-prompt.md).
```

## Caso de uso
Métrica empírica: avaliador que detém 100% das condições que o modelo falha por padrão aprova a tarefa em ~75% dos casos; omitir 1 condição baixa para ~33%.

Verificações que o próprio modelo escreve do pedido+esquema (sem ver condições ocultas) interceptam 75% das paragens incompletas. Isso é o que o Stop Gate deste prompt faz.

## Falha típica
Declarar sucesso baseado em `queued`, `running`, `pending`, `active`. Estados de progresso não são estados de conclusão. Reporte o estado literal observado.
