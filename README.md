# Instrumento Experimental: Ícones em Visualização de Dados e Letramento

Instrumento web da pesquisa de mestrado de **Guilherme da Costa Garcia** (ESDI/UERJ) sobre o impacto de **ícones** em gráficos do Censo 2022 (IBGE) na compreensão, memória e engajamento.

## Etapas do Experimento (`index.html`)

1. **Início**: escolha da instituição (`ESDI` ou `ENCE`) e geração de ID anônimo (`ESDI###` / `ENCE###`).
2. **Numeracia (Berlin Numeracy Test)**: 4 questões (`0` a `4` pontos).
3. **Mini-VLAT**: 12 questões com correção para chute (`R - W / (C - 1)`, de `-6` a `12`; questões puladas não descontam).
4. **Experimento Principal**: 8 gráficos em ordem aleatória, sendo **4 com ícones** e **4 sem ícones** por participante. Para cada gráfico:
   - Tela de **Compreensão** (gráfico visível).
   - Tela de **Memória + Engajamento** (gráfico oculto, 1 questão de recordação e 3 itens Likert de 1 a 5).
5. **Finalização**: envio automático para o SheetDB ao concluir os gráficos, campo opcional de e-mail e download de backup `.json`.

> Use `?debug=1` na URL para exibir o menu de navegação de testes.

## Checagem dos Cálculos

```bash
node tests/calculos.test.js
```

## Planilha SheetDB (Cabeçalho)

```text
id_participante	instituicao	data_hora	tempo_segundos	acertos_numeracia	acertos_vlat	comp_icones	comp_sem_icones	mem_icones	mem_sem_icones	engajamento_icones	engajamento_sem_icones	email	json_completo
```

Arquivos individuais de resposta (`experimento_*.json`, `.csv`, `.xlsx`) são ignorados pelo `.gitignore`.

## Estrutura

```text
├── assets/          # Gráficos do Mini-VLAT (SVG), experimento (PNG) e logos
├── prints/          # Capturas das telas
├── tests/           # Checagem automatizada (calculos.test.js)
├── index.html       # Instrumento experimental
├── script.js        # Lógica, gabaritos e envio ao SheetDB
├── style.css        # Estilos do experimento
└── README.md
```
