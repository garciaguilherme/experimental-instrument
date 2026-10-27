# Instrumento Experimental: Ícones em Visualização de Dados e Letramento

Instrumento web interativo desenvolvido para a pesquisa de mestrado de **Guilherme da Costa Garcia** (ESDI/UERJ), investigando o impacto do uso de **ícones (isótipos)** em gráficos estatísticos sobre a **compreensão**, a **recordação (memória)** e o **engajamento** do público, considerando diferentes níveis de **letramento visual gráfico** e **numeracia**.

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

1. **Identificação e Consentimento (TCLE)**:
   - Apresentação dos objetivos e concordância livre e esclarecida.
   - Coleta de instituição de origem (ESDI ou ENCE) e geração do código único do participante.

2. **Numeracia Subjetiva (SNS)**:
   - 4 questões quantitativas e probabilísticas adaptadas para estimar a habilidade numérica do respondente.

3. **Mini-VLAT (Visualization Literacy Assessment Test)**:
   - 12 questões objetivas com gráficos em SVG (barras, linhas, setores, dispersão, área empilhada, bolhas, cloroplético, treemap, etc.) para mensurar a proficiência em leitura gráfica.

4. **Transição e Instruções**:
   - Orientação sobre a dinâmica de apresentação dos gráficos do experimento.

5. **Experimento Principal (Censo 2022)**:
   - **Delineamento intra-sujeito (within-subjects)**: 8 tópicos estatísticos, balanceados aleatoriamente para cada participante em **4 gráficos com ícones** e **4 gráficos sem ícones** (controle).
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
  $$\text{tempo\_total\_segundos} = \text{round}\left(\frac{\text{timestamp\_fim} - \text{timestamp\_inicio}}{1000}\right)$$

### 3. Acurácia de Numeracia (Escala de 0 a 4)
- Comparação das respostas com os gabaritos matemáticos:
  - **Item 1**: $3/5 \times 50 = \mathbf{30}$
  - **Item 2**: $100 / 400 = \mathbf{25\%}$
  - **Item 3**: $2/7 \times 70 = \mathbf{20}$
  - **Item 4**: $0{,}04 / (0{,}04 + 0{,}04) = \mathbf{50\%}$
- $\text{acertos\_numeracia} \in [0, 4]$.

### 4. Acurácia no Mini-VLAT (Escala de 0 a 12)
- Cada uma das 12 questões possui uma resposta correta unívoca pré-definida.
- $\text{acertos\_vlat} = \sum_{i=1}^{12} [respostas.vlat_i == gabarito_i]$ (escore de 0 a 12).
- Proporção percentual: $\frac{\text{acertos\_vlat}}{12} \times 100\%$.

### 5. Sorteio e Alocação Intra-Sujeito
- Utiliza o algoritmo Fisher-Yates para embaralhar os 8 índices de tópicos e selecionar exatamente 4 tópicos para a condição **com ícones** (`com_icones`) e 4 para a condição **sem ícones** (`sem_icones`), garantindo neutralidade e balanceamento estatístico intra-sujeito.

### 6. Desempenho no Experimento Principal

| Métrica | Descrição | Escala |
| :--- | :--- | :---: |
| `comp_com_icones_acertos` | Total de acertos em compreensão nos 4 gráficos com ícones | 0 a 4 |
| `comp_sem_icones_acertos` | Total de acertos em compreensão nos 4 gráficos sem ícones | 0 a 4 |
| `mem_com_icones_acertos` | Total de acertos em recordação (memória) nos 4 gráficos com ícones | 0 a 4 |
| `mem_sem_icones_acertos` | Total de acertos em recordação (memória) nos 4 gráficos sem ícones | 0 a 4 |

### 7. Índices de Engajamento Subjetivo (Escala Likert de 1 a 5)
Para cada gráfico $j \in \{1, \dots, 8\}$, o engajamento individual é a média das 3 dimensões (clareza, interesse visual, interesse em ver mais):
$$\text{Engajamento}_j = \frac{\text{Item}_1 + \text{Item}_2 + \text{Item}_3}{3}$$

A partir disso, o sistema computa os índices médios consolidados para cada condição experimental:
- **Engajamento Médio com Ícones**:
  $$\text{engajamento\_medio\_com\_icones} = \frac{1}{4} \sum_{j \in \text{com\_icones}} \text{Engajamento}_j$$
- **Engajamento Médio sem Ícones**:
  $$\text{engajamento\_medio\_sem\_icones} = \frac{1}{4} \sum_{k \in \text{sem\_icones}} \text{Engajamento}_k$$

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML5 semântico, Vanilla CSS (Design responsivo, tipografia Inter, dark/light accents) e JavaScript moderno (ES6+).
- **Vetores e Gráficos**: SVGs originais do Mini-VLAT e PNGs em alta definição dos gráficos do Censo 2022.
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
