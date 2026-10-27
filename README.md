# Instrumento Experimental: Ícones em Visualização de Dados e Letramento

Instrumento web interativo desenvolvido para a pesquisa de mestrado de **Guilherme da Costa Garcia** (ESDI/UERJ), investigando o impacto do uso de **ícones** em gráficos estatísticos sobre a **compreensão**, a **memória** e o **engajamento** do público, considerando diferentes níveis de **letramento visual gráfico** e **numeracia**.

---

## 🎯 Objetivo da Pesquisa

Avaliar experimentalmente se a incorporação de recursos visuais figurativos (ícones temáticos) em infográficos e gráficos estatísticos baseados no **Censo Demográfico 2022 (IBGE)**:
1. Facilita ou prejudica a **compreensão rápida** dos dados.
2. Auxilia na **retenção e recordação** das informações na memória de curto prazo.
3. Influencia a percepção estética, atratividade e **engajamento** subjetivo.
4. Possui efeitos moderados pela habilidade numérica e pelo letramento visual gráfico do participante.

---

## 🧪 Estrutura do Instrumento

O experimento é composto por 5 etapas sequenciais:

1. **Identificação e Consentimento**:
   - Apresentação dos objetivos.
   - Coleta de instituição de origem (ESDI ou ENCE).

2. **Berlin Numeracy Test**:
   - 4 questões adaptadas para estimar a habilidade numérica do respondente.

3. **Mini-VLAT (Visualization Literacy Assessment Test)**:
   - 12 questões objetivas com gráficos para mensurar a proficiência em leitura gráfica.

4. **Transição e Instruções**:
   - Orientação sobre a dinâmica de apresentação dos gráficos do experimento.

5. **Experimento Principal**:
   - **Delineamento intra-sujeito**: 8 tópicos estatísticos, balanceados aleatoriamente para cada participante em **4 gráficos com ícones** e **4 gráficos sem ícones**.
   - Para cada gráfico, há duas telas consecutivas:
     - **Tela A (Compreensão)**: Visualização do gráfico com 1 pergunta de leitura direta.
     - **Tela B (Recordação e Engajamento)**: Gráfico ocultado; 1 pergunta de memória sobre o dado visualizado + 3 itens em escala Likert (1 a 5) avaliando clareza, interesse e atratividade.

6. **Finalização e Exportação**:
   - Exibição do código do participante, download automático do arquivo JSON de backup e envio assíncrono para planilha via API SheetDB.

---

## 🧮 Seção de Cálculos e Métricas

Todos os dados coletados passam por cálculos automáticos consolidados antes da gravação final:

### 1. Código do Participante
- **Fórmula**: `PREFIXO` + `Número Aleatório (100 a 999)`
  - ESDI/UERJ: `ESDI###`
  - ENCE/IBGE: `ENCE###`

### 2. Tempo Total de Execução
- Medido em segundos desde o início da primeira tela até a conclusão:
  ```text
  tempo_total_segundos = round((timestamp_fim - timestamp_inicio) / 1000)
  ```

### 3. Sorteio e Alocação Intra-Sujeito
- Utiliza o algoritmo Fisher-Yates para embaralhar os 8 índices de tópicos e selecionar exatamente 4 tópicos para a condição **com ícones** (`com_icones`) e 4 para a condição **sem ícones** (`sem_icones`), garantindo neutralidade e balanceamento estatístico intra-sujeito.

### 4. Desempenho no Experimento Principal

| Métrica | Descrição | Escala |
| :--- | :--- | :---: |
| `comp_com_icones_acertos` | Total de acertos em compreensão nos 4 gráficos com ícones 
| `comp_sem_icones_acertos` | Total de acertos em compreensão nos 4 gráficos sem ícones
| `mem_com_icones_acertos` | Total de acertos em recordação (memória) nos 4 gráficos com ícones
| `mem_sem_icones_acertos` | Total de acertos em recordação (memória) nos 4 gráficos sem ícones

### 5. Índices de Engajamento Subjetivo (Escala Likert de 1 a 5)
Para cada gráfico, o engajamento individual é a média das 3 dimensões (clareza, interesse visual e interesse em ver mais):
```text
engajamento_topico = (item_1 + item_2 + item_3) / 3
```

A partir disso, o sistema computa os índices médios consolidados para cada condição experimental:
- **Engajamento Médio com Ícones**:
  ```text
  engajamento_medio_com_icones = média dos 4 tópicos com ícones
  ```
- **Engajamento Médio sem Ícones**:
  ```text
  engajamento_medio_sem_icones = média dos 4 tópicos sem ícones
  ```

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 semântico, Vanilla CSS e JavaScript (ES6+).
- **Vetores e Gráficos**: SVGs adaptados do Mini-VLAT e PNGs dos gráficos do Censo 2022.
- **Armazenamento e Persistência**:
  - `localStorage` para tolerância a falhas e recuperação de sessão.
  - Exportação client-side de arquivo `JSON`.
  - Integração RESTful com **SheetDB** para alimentação direta em planilha Google Sheets.

---

## 📁 Estrutura de Pastas

```text
├── assets/
│   ├── minivlat/          # 12 gráficos SVG do Mini-VLAT
│   └── experimento/       # 16 gráficos PNG (8 controle + 8 com ícones)
├── prints/                # Capturas de tela de todas as 24 etapas
├── index.html             # Estrutura HTML das telas
├── script.js              # Lógica experimental, gabaritos e cálculos
├── style.css              # Estilos visuais e responsividade
├── telas_experimento.pdf  # Compilado com todos os prints em PDF
└── README.md              # Documentação sucinta do projeto
```
