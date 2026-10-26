// Mini-VLAT Pure SVG Chart Generator
// Produces 100% vector SVG charts translated to Portuguese (with language toggle support)
// Layout fine-tuned with minimal adjustments to prevent any clipped labels/legends in Portuguese

(function() {
    window.CURRENT_LANG = 'pt'; // Default: Portuguese as requested

    const SVG_NS = "http://www.w3.org/2000/svg";

    const I18N = {
        pt: {
            barChart: {
                title: "Velocidade Global da Internet em 2021",
                yLabel: "Velocidade da Internet (Mbps)",
                countries: {
                    "Australia": "Austrália",
                    "China": "China",
                    "Hong Kong": "Hong Kong",
                    "India": "Índia",
                    "Indonesia": "Indonésia",
                    "Japan": "Japão",
                    "Malaysia": "Malásia",
                    "New Zealand": "Nova Zelândia",
                    "Singapore": "Singapura",
                    "South Korea": "Coreia do Sul",
                    "Sri Lanka": "Sri Lanka",
                    "Taiwan": "Taiwan",
                    "Thailand": "Tailândia",
                    "Vietnam": "Vietnã"
                }
            },
            areaChart: {
                title: "Preço do Café Robusta",
                yLabel: "Preço do Café (US$/libra)",
                months: ["Abril", "Julho", "Outubro", "2019", "Abril", "Julho", "Outubro", "2020"]
            },
            bubbleChart: {
                title: "Sistemas de Metrô do Mundo",
                yLabel: "Extensão Total do Sistema (km)",
                xLabel: "Número de Estações",
                legendTitleLine1: "Passageiros",
                legendTitleLine2: "(bilhões/ano)",
                cities: {
                    "Delhi": "Délhi",
                    "Guangzhow": "Guangzhou",
                    "Tokyo": "Tóquio",
                    "Mexico City": "Cidade do México",
                    "Moscow": "Moscou",
                    "London": "Londres",
                    "Seoul": "Seul",
                    "Paris": "Paris",
                    "Beijing": "Pequim",
                    "Shanghai": "Xangai",
                    "N.Y.C.": "Nova York"
                }
            },
            choropleth: {
                title: "Taxa de Desocupação por Estado em 2020"
            },
            histogram: {
                title: "Distância da Viagem e Clientes",
                yLabel: "Número de Clientes",
                xLabel: "Distância (em km)",
                unit: "clientes"
            },
            lineChart: {
                title: "Preço do Petróleo em 2020",
                yLabel: "Preço do Petróleo (US$)",
                xLabel: "Mês",
                months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"]
            },
            pieChart: {
                title: "Participação de Mercado Global de Smartphones em 2021",
                brands: {
                    "Others": "Outros",
                    "Samsung": "Samsung",
                    "Xiaomi": "Xiaomi",
                    "Apple": "Apple",
                    "Oppo": "Oppo",
                    "Vivo": "Vivo"
                }
            },
            scatterplot: {
                title: "Altura e Peso de 85 Indivíduos",
                yLabel: "Peso (em kg)",
                xLabel: "Altura (em cm)"
            },
            stacked100: {
                title: "Desempenho nas Olimpíadas de Tóquio 2020",
                yLabel: "Medalhas Olímpicas (em %)",
                xLabel: "Países",
                countries: {
                    "U.S.A.": "E.U.A.",
                    "Great Britain": "Grã-Bretanha",
                    "Japan": "Japão",
                    "Australia": "Austrália"
                },
                legend: {
                    "Gold": "Ouro",
                    "Silver": "Prata",
                    "Bronze": "Bronze"
                }
            },
            stackedArea: {
                title: "Nomes Femininos Populares no Reino Unido",
                yLabel: "Número de Meninas",
                xLabel: "Ano",
                legend: {
                    "Amelia": "Amélia",
                    "Isla": "Isla",
                    "Olivia": "Olívia"
                }
            },
            stackedBar: {
                title: "Preços de Serviço de Quarto",
                yLabel: "Custo (US$)",
                xLabel: "Cidades",
                cities: {
                    "Helsinki": "Helsinque",
                    "Oslo": "Oslo",
                    "Seoul": "Seul",
                    "Zurich": "Zurique",
                    "Stockholm": "Estocolmo",
                    "Paris": "Paris",
                    "N.Y.C.": "Nova York",
                    "Singapore": "Singapura",
                    "Toronto": "Toronto",
                    "Copenhagen": "Copenhague"
                },
                items: {
                    "Sandwich": "Sanduíche",
                    "Water": "Água",
                    "Peanut": "Amendoim",
                    "Soda": "Refrigerante",
                    "Vodka": "Vodca"
                }
            },
            treemap: {
                groups: {
                    "Search/Portal": "Busca / Portais",
                    "Software": "Software",
                    "Retail": "Varejo",
                    "Social Network": "Redes Sociais",
                    "Computer": "Computadores"
                }
            }
        },
        en: {
            barChart: {
                title: "Global Internet Speed in 2021",
                yLabel: "Internet Speed (Mbps)",
                countries: {
                    "Australia": "Australia",
                    "China": "China",
                    "Hong Kong": "Hong Kong",
                    "India": "India",
                    "Indonesia": "Indonesia",
                    "Japan": "Japan",
                    "Malaysia": "Malaysia",
                    "New Zealand": "New Zealand",
                    "Singapore": "Singapore",
                    "South Korea": "South Korea",
                    "Sri Lanka": "Sri Lanka",
                    "Taiwan": "Taiwan",
                    "Thailand": "Thailand",
                    "Vietnam": "Vietnam"
                }
            },
            areaChart: {
                title: "Robusta Coffee Price",
                yLabel: "Coffee Price ($/lb)",
                months: ["April", "July", "October", "2019", "April", "July", "October", "2020"]
            },
            bubbleChart: {
                title: "Metro System of the World",
                yLabel: "Total System Length (Km)",
                xLabel: "Number of Stations",
                legendTitleLine1: "Ridership",
                legendTitleLine2: "(bn per year)",
                cities: {
                    "Delhi": "Delhi",
                    "Guangzhow": "Guangzhow",
                    "Tokyo": "Tokyo",
                    "Mexico City": "Mexico City",
                    "Moscow": "Moscow",
                    "London": "London",
                    "Seoul": "Seoul",
                    "Paris": "Paris",
                    "Beijing": "Beijing",
                    "Shanghai": "Shanghai",
                    "N.Y.C.": "N.Y.C"
                }
            },
            choropleth: {
                title: "Unemployment Rate by State in 2020 (Brazil)"
            },
            histogram: {
                title: "Trip Distance and Customers",
                yLabel: "Number of Customers",
                xLabel: "Distance (in Km)",
                unit: "customers"
            },
            lineChart: {
                title: "Oil Prices in 2020",
                yLabel: "Oil Price ($)",
                xLabel: "Month",
                months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
            },
            pieChart: {
                title: "Global Smartphone Market Share in 2021",
                brands: {
                    "Others": "Others",
                    "Samsung": "Samsung",
                    "Xiaomi": "Xiaomi",
                    "Apple": "Apple",
                    "Oppo": "Oppo",
                    "Vivo": "Vivo"
                }
            },
            scatterplot: {
                title: "Height and Weight of 85 Individuals",
                yLabel: "Weight (in Kg)",
                xLabel: "Height (in cm)"
            },
            stacked100: {
                title: "Tokyo Olympic 2020 Performance",
                yLabel: "Olympic Medals (in %)",
                xLabel: "Countries",
                countries: {
                    "U.S.A.": "U.S.A.",
                    "Great Britain": "Great Britain",
                    "Japan": "Japan",
                    "Australia": "Australia"
                },
                legend: {
                    "Gold": "Gold",
                    "Silver": "Silver",
                    "Bronze": "Bronze"
                }
            },
            stackedArea: {
                title: "Popular Girls' Names in the U.K.",
                yLabel: "Number of Girls",
                xLabel: "Year",
                legend: {
                    "Amelia": "Amelia",
                    "Isla": "Isla",
                    "Olivia": "Olivia"
                }
            },
            stackedBar: {
                title: "Room Service Prices",
                yLabel: "Cost ($)",
                xLabel: "Cities",
                cities: {
                    "Helsinki": "Helsinki",
                    "Oslo": "Oslo",
                    "Seoul": "Seoul",
                    "Zurich": "Zurich",
                    "Stockholm": "Stockholm",
                    "Paris": "Paris",
                    "N.Y.C.": "N.Y.C.",
                    "Singapore": "Singapore",
                    "Toronto": "Toronto",
                    "Copenhagen": "Copenhague"
                },
                items: {
                    "Sandwich": "Sandwich",
                    "Water": "Water",
                    "Peanut": "Peanut",
                    "Soda": "Soda",
                    "Vodka": "Vodka"
                }
            },
            treemap: {
                groups: {
                    "Search/Portal": "Search/Portal",
                    "Software": "Software",
                    "Retail": "Retail",
                    "Social Network": "Social Network",
                    "Computer": "Computer"
                }
            }
        }
    };

    function createSvgElement(tag, attrs = {}) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [k, v] of Object.entries(attrs)) {
            el.setAttribute(k, v);
        }
        return el;
    }

    window.SVG_CHARTS = {
        I18N,
        renderBarChart,
        renderAreaChart,
        renderBubbleChart,
        renderChoropleth,
        renderHistogram,
        renderLineChart,
        renderPieChart,
        renderScatterplot,
        renderStacked100,
        renderStackedArea,
        renderStackedBar,
        renderTreemap
    };

    // 1. BAR CHART
    function renderBarChart(container) {
        const data = window.VIS_DATA.barChart;
        const width = 800, height = 800;
        const margin = { top: 65, right: 36, bottom: 135, left: 95 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].barChart;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-barchart"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 + 10,
            y: 38,
            "text-anchor": "middle",
            class: "chart-title",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const yMin = 5, yMax = 100;
        const yScale = (v) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;
        const yTicks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

        yTicks.forEach(tick => {
            const y = yScale(tick);
            const grid = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y,
                stroke: "#e4e4e4", "stroke-width": "1"
            });
            g.appendChild(grid);

            const tickMark = createSvgElement("line", {
                x1: -6, x2: 0, y1: y, y2: y,
                stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(tickMark);

            const txt = createSvgElement("text", {
                x: -12, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            txt.textContent = tick;
            g.appendChild(txt);
        });

        const leftAxis = createSvgElement("line", {
            x1: 0, x2: 0, y1: yScale(yMax), y2: plotH,
            stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(leftAxis);

        const bottomAxis = createSvgElement("line", {
            x1: 0, x2: plotW, y1: plotH, y2: plotH,
            stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(bottomAxis);

        const barPad = 0.28;
        const totalBars = data.length;
        const bandW = plotW / totalBars;
        const barW = bandW * (1 - barPad);

        data.forEach((d, i) => {
            const bx = i * bandW + (bandW - barW) / 2;
            const by = yScale(d.speed);
            const bh = plotH - by;
            const localizedCountry = txtDict.countries[d.country] || d.country;

            const bar = createSvgElement("rect", {
                x: bx, y: by, width: barW, height: bh,
                fill: "#2b7bba", class: "bar-element"
            });
            const tip = createSvgElement("title");
            tip.textContent = `${localizedCountry}: ${d.speed} Mbps`;
            bar.appendChild(tip);
            g.appendChild(bar);

            const tick = createSvgElement("line", {
                x1: bx + barW / 2, x2: bx + barW / 2,
                y1: plotH, y2: plotH + 6,
                stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(tick);

            const label = createSvgElement("text", {
                transform: `translate(${bx + barW / 2 + 4}, ${plotH + 12}) rotate(38)`,
                "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 14.5px; font-weight: bold; fill: #000;"
            });
            label.textContent = localizedCountry;
            g.appendChild(label);
        });

        // Y label
        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            class: "axis-label",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 2. AREA CHART
    function renderAreaChart(container) {
        const values = window.VIS_DATA.areaChart;
        const width = 800, height = 800;
        const margin = { top: 65, right: 35, bottom: 80, left: 100 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].areaChart;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-areachart"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 + 30,
            y: 38,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 27px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const yMin = 0.50, yMax = 0.90;
        const yScale = (v) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;
        const yTicks = [0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80, 0.85, 0.90];
        const xScale = (i) => (i / (values.length - 1)) * plotW;

        const xTicks = [
            { idx: 3, label: txtDict.months[0] },
            { idx: 6, label: txtDict.months[1] },
            { idx: 9, label: txtDict.months[2] },
            { idx: 12, label: txtDict.months[3] },
            { idx: 15, label: txtDict.months[4] },
            { idx: 18, label: txtDict.months[5] },
            { idx: 21, label: txtDict.months[6] },
            { idx: 23, label: txtDict.months[7] }
        ];

        yTicks.forEach(tick => {
            const y = yScale(tick);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y,
                stroke: "#d6d6d6", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        xTicks.forEach(t => {
            const x = xScale(t.idx);
            const line = createSvgElement("line", {
                x1: x, x2: x, y1: 0, y2: plotH,
                stroke: "#d6d6d6", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        let areaPathD = `M ${xScale(0)} ${plotH}`;
        values.forEach((v, i) => {
            areaPathD += ` L ${xScale(i)} ${yScale(v)}`;
        });
        areaPathD += ` L ${xScale(values.length - 1)} ${plotH} Z`;

        const areaPath = createSvgElement("path", {
            d: areaPathD,
            fill: "#72a8d1",
            "fill-opacity": "0.85",
            stroke: "none"
        });
        g.appendChild(areaPath);

        const box = createSvgElement("rect", {
            x: 0, y: 0, width: plotW, height: plotH,
            fill: "none", stroke: "#b5b5b5", "stroke-width": "1"
        });
        g.appendChild(box);

        yTicks.forEach(tick => {
            const y = yScale(tick);
            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y,
                stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const label = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            label.textContent = tick.toFixed(2);
            g.appendChild(label);
        });

        xTicks.forEach(t => {
            const x = xScale(t.idx);
            const mark = createSvgElement("line", {
                x1: x, x2: x, y1: plotH, y2: plotH + 5,
                stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const label = createSvgElement("text", {
                x: x, y: plotH + 24, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            label.textContent = t.label;
            g.appendChild(label);
        });

        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 3. BUBBLE CHART (With 2-line legend title to prevent clipping at the right edge)
    function renderBubbleChart(container) {
        const data = window.VIS_DATA.bubbleChart;
        const width = 800, height = 800;
        const margin = { top: 65, right: 135, bottom: 85, left: 90 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].bubbleChart;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-bubblechart"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 - 10,
            y: 38,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const xMin = 150, xMax = 800;
        const xScale = (v) => ((v - xMin) / (xMax - xMin)) * plotW;

        const yMin = 150, yMax = 500;
        const yScale = (v) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;
        const rScale = (r) => (r / 3.6) * 32.5;

        const xTicks = [150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800];
        const yTicks = [150, 200, 250, 300, 350, 400, 450, 500];

        // Gridlines
        xTicks.forEach(t => {
            const x = xScale(t);
            const line = createSvgElement("line", {
                x1: x, x2: x, y1: 0, y2: plotH,
                stroke: "#e4e4e4", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        yTicks.forEach(t => {
            const y = yScale(t);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y,
                stroke: "#e4e4e4", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        // Frame
        const frame = createSvgElement("rect", {
            x: 0, y: 0, width: plotW, height: plotH,
            fill: "none", stroke: "#b5b5b5", "stroke-width": "1"
        });
        g.appendChild(frame);

        // Y tick marks & labels
        yTicks.forEach(t => {
            const y = yScale(t);
            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        // X tick marks & labels
        xTicks.forEach(t => {
            const x = xScale(t);
            const mark = createSvgElement("line", {
                x1: x, x2: x, y1: plotH, y2: plotH + 5, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: x, y: plotH + 22, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        // Bubbles & city labels
        data.forEach(d => {
            const cx = xScale(d.stations);
            const cy = yScale(d.length);
            const r = rScale(d.ridership);
            const localizedCity = txtDict.cities[d.city] || d.city;

            const circle = createSvgElement("circle", {
                cx: cx, cy: cy, r: r,
                fill: "#6baed6", "fill-opacity": "0.78",
                stroke: "#252525", "stroke-width": "1.2",
                class: "bubble-circle"
            });
            const tip = createSvgElement("title");
            tip.textContent = `${localizedCity}\n${txtDict.xLabel}: ${d.stations}\n${txtDict.yLabel}: ${d.length} km\n${txtDict.legendTitleLine1}: ${d.ridership} bn/ano`;
            circle.appendChild(tip);
            g.appendChild(circle);

            const label = createSvgElement("text", {
                x: cx + r + 6, y: cy + 5,
                "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #000;"
            });
            label.textContent = localizedCity;
            g.appendChild(label);
        });

        // Legend at top-right (spaced cleanly to prevent overlap with circle or clipping at canvas border)
        const legendX = plotW + 14;
        const legendY = 16;

        const legTitle = createSvgElement("text", {
            x: legendX, y: legendY,
            "text-anchor": "start",
            style: "font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #000;"
        });
        legTitle.innerHTML = `<tspan x="${legendX}">${txtDict.legendTitleLine1}</tspan><tspan x="${legendX}" dy="16">${txtDict.legendTitleLine2}</tspan>`;
        g.appendChild(legTitle);

        const legendValues = [3.5, 3.0, 2.5];
        let curY = legendY + 52;
        legendValues.forEach(val => {
            const r = rScale(val);
            const circle = createSvgElement("circle", {
                cx: legendX + 34, cy: curY, r: r,
                fill: "none", stroke: "#000", "stroke-width": "1.3"
            });
            g.appendChild(circle);

            const lbl = createSvgElement("text", {
                x: legendX + 74, y: curY + 5,
                "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = val.toFixed(1);
            g.appendChild(lbl);

            curY += r * 2 + 18;
        });

        // X Axis Label
        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2,
            y: height - 15,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        // Y Axis Label
        const yLabel = createSvgElement("text", {
            transform: `translate(28, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 4. CHOROPLETH MAP
    function renderChoropleth(container) {
        const states = window.VIS_DATA.choroplethStates;
        const width = 960, height = 750;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].choropleth;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-choropleth"
        });

        // Defs
        const defs = createSvgElement("defs");
        const grad = createSvgElement("linearGradient", {
            id: "choro-legend-grad",
            x1: "0%", y1: "0%", x2: "100%", y2: "0%"
        });
        grad.innerHTML = `
            <stop offset="0%" stop-color="#084594"/>
            <stop offset="100%" stop-color="#f7fbff"/>
        `;
        defs.appendChild(grad);
        svg.appendChild(defs);

        // Title
        const title = createSvgElement("text", {
            x: width / 2 - 10,
            y: 42,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        // Legend
        const legG = createSvgElement("g", { transform: "translate(45, 68)" });
        const legBar = createSvgElement("rect", {
            x: 0, y: 0, width: 280, height: 26,
            fill: "url(#choro-legend-grad)", stroke: "none"
        });
        legG.appendChild(legBar);

        const legTicks = [
            { text: "21%", x: 0 },
            { text: "17%", x: 65 },
            { text: "14%", x: 135 },
            { text: "10%", x: 205 },
            { text: "6%", x: 270 }
        ];
        legTicks.forEach(t => {
            const txt = createSvgElement("text", {
                x: t.x, y: 46, "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            txt.textContent = t.text;
            legG.appendChild(txt);
        });
        svg.appendChild(legG);

        const mapG = createSvgElement("g", { id: "map-states-group" });
        svg.appendChild(mapG);

        function getStateColor(val) {
            if (!val) return "#f7fbff";
            const min = 6.0, max = 21.0;
            let ratio = (val - min) / (max - min);
            if (ratio < 0) ratio = 0;
            if (ratio > 1) ratio = 1;

            const r = Math.round(247 - ratio * (247 - 8));
            const g = Math.round(251 - ratio * (251 - 69));
            const b = Math.round(255 - ratio * (255 - 148));
            return `rgb(${r}, ${g}, ${b})`;
        }

        states.forEach(s => {
            const color = getStateColor(s.value);
            const path = createSvgElement("path", {
                d: s.d, fill: color, stroke: "#ffffff",
                "stroke-width": "1.2", class: "state-path",
                "data-state": s.name
            });
            const tip = createSvgElement("title");
            const qStr = (s.q1 !== undefined) ? `\n1º Trim: ${s.q1}% | 2º Trim: ${s.q2}%\n3º Trim: ${s.q3}% | 4º Trim: ${s.q4}%` : '';
            tip.textContent = `${s.name} (${s.code}): ${s.value}%${qStr}`;
            path.appendChild(tip);
            mapG.appendChild(path);
        });

        const labelsG = createSvgElement("g", { id: "map-labels-group" });
        svg.appendChild(labelsG);

        const customOffsets = {
            "Pernambuco": [-20, 0],
            "Goiás": [-15, 5],
            "Bahia": [-10, 5],
            "Piauí": [0, -8],
            "Ceará": [-6, 0],
            "Maranhão": [-8, 0],
            "Santa Catarina": [0, 2]
        };

        const leaderLines = {
            "Distrito Federal": { x1: 588, y1: 445, x2: 632, y2: 445, labelX: 638, labelY: 449, code: "DF" },
            "Rio Grande do Norte": { x1: 755, y1: 298, x2: 805, y2: 290, labelX: 811, labelY: 294, code: "RN" },
            "Paraíba": { x1: 755, y1: 318, x2: 815, y2: 318, labelX: 821, labelY: 322, code: "PB" },
            "Alagoas": { x1: 752, y1: 353, x2: 808, y2: 348, labelX: 814, labelY: 352, code: "AL" },
            "Sergipe": { x1: 742, y1: 368, x2: 800, y2: 375, labelX: 806, labelY: 379, code: "SE" },
            "Espírito Santo": { x1: 692, y1: 502, x2: 748, y2: 505, labelX: 754, labelY: 509, code: "ES" },
            "Rio de Janeiro": { x1: 668, y1: 542, x2: 725, y2: 555, labelX: 731, labelY: 559, code: "RJ" }
        };

        states.forEach(s => {
            if (!s.code || !s.centroid) return;

            if (leaderLines[s.name]) {
                const ll = leaderLines[s.name];
                const line = createSvgElement("line", {
                    x1: ll.x1, y1: ll.y1, x2: ll.x2, y2: ll.y2,
                    stroke: "#000", "stroke-width": "1.3"
                });
                labelsG.appendChild(line);

                const txt = createSvgElement("text", {
                    x: ll.labelX, y: ll.labelY, "text-anchor": "start",
                    style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
                });
                txt.textContent = ll.code;
                labelsG.appendChild(txt);
                return;
            }

            let cx = s.centroid[0];
            let cy = s.centroid[1];

            if (customOffsets[s.name]) {
                cx += customOffsets[s.name][0];
                cy += customOffsets[s.name][1];
            }

            const txt = createSvgElement("text", {
                x: cx, y: cy + 5, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            txt.textContent = s.code;
            labelsG.appendChild(txt);
        });

        if (container) container.appendChild(svg);
        return svg;
    }

    // 5. HISTOGRAM
    function renderHistogram(container) {
        const bins = window.VIS_DATA.histogramBins;
        const width = 800, height = 800;
        const margin = { top: 65, right: 35, bottom: 85, left: 95 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].histogram;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-histogram"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 + 10,
            y: 38,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const yMax = 260;
        const yScale = (v) => plotH - (v / yMax) * plotH;
        const yTicks = [0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260];

        yTicks.forEach(tick => {
            const y = yScale(tick);
            if (tick > 0) {
                const grid = createSvgElement("line", {
                    x1: 0, x2: plotW, y1: y, y2: y,
                    stroke: "#e4e4e4", "stroke-width": "1"
                });
                g.appendChild(grid);
            }

            const mark = createSvgElement("line", {
                x1: -6, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const txt = createSvgElement("text", {
                x: -12, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            txt.textContent = tick;
            g.appendChild(txt);
        });

        const leftAxis = createSvgElement("line", {
            x1: 0, x2: 0, y1: 0, y2: plotH, stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(leftAxis);

        const bottomAxis = createSvgElement("line", {
            x1: 0, x2: plotW, y1: plotH, y2: plotH, stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(bottomAxis);

        const binW = plotW / bins.length;
        bins.forEach((count, i) => {
            const bx = i * binW;
            const by = yScale(count);
            const bh = plotH - by;

            const rect = createSvgElement("rect", {
                x: bx, y: by, width: binW, height: bh,
                fill: "#2b7bba", stroke: "#3182bd", "stroke-width": "0.5"
            });
            const tip = createSvgElement("title");
            tip.textContent = `${i * 10} - ${(i + 1) * 10} km: ${count} ${txtDict.unit}`;
            rect.appendChild(tip);
            g.appendChild(rect);
        });

        for (let i = 1; i <= bins.length; i++) {
            const x = i * binW;
            const mark = createSvgElement("line", {
                x1: x, x2: x, y1: plotH, y2: plotH + 6, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const txt = createSvgElement("text", {
                x: x, y: plotH + 22, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            txt.textContent = i * 10;
            g.appendChild(txt);
        }

        const yLabel = createSvgElement("text", {
            transform: `translate(30, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2, y: height - 15,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 6. LINE CHART (Rotated month labels slightly to prevent crowding/overlapping in Portuguese)
    function renderLineChart(container) {
        const data = window.VIS_DATA.lineChart;
        const width = 800, height = 800;
        const margin = { top: 65, right: 48, bottom: 95, left: 90 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].lineChart;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-linechart"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 + 10, y: 38, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const yMax = 60;
        const yScale = (v) => plotH - (v / yMax) * plotH;
        const yTicks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];
        const xScale = (i) => (i / (data.length - 1)) * (plotW - 20) + 10;

        yTicks.forEach(t => {
            const y = yScale(t);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y,
                stroke: "#dcdcdc", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        data.forEach((d, i) => {
            const x = xScale(i);
            const line = createSvgElement("line", {
                x1: x, x2: x, y1: 0, y2: plotH,
                stroke: "#dcdcdc", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        const frame = createSvgElement("rect", {
            x: 0, y: 0, width: plotW, height: plotH,
            fill: "none", stroke: "#b5b5b5", "stroke-width": "1"
        });
        g.appendChild(frame);

        yTicks.forEach(t => {
            const y = yScale(t);
            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        data.forEach((d, i) => {
            const x = xScale(i);
            const mark = createSvgElement("line", {
                x1: x, x2: x, y1: plotH, y2: plotH + 5, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const monthName = txtDict.months[i] || d.month;
            // Angled rotation (32 deg) ensures longer Portuguese month names never overlap or clip at right border
            const lbl = createSvgElement("text", {
                transform: `translate(${x - 4}, ${plotH + 15}) rotate(32)`,
                "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 12px; font-weight: 500; fill: #000;"
            });
            lbl.textContent = monthName;
            g.appendChild(lbl);
        });

        let lineD = "";
        data.forEach((d, i) => {
            const x = xScale(i);
            const y = yScale(d.price);
            lineD += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
        });

        const path = createSvgElement("path", {
            d: lineD, fill: "none", stroke: "#2b7bba", "stroke-width": "2.8"
        });
        g.appendChild(path);

        data.forEach((d, i) => {
            const x = xScale(i);
            const y = yScale(d.price);
            const monthName = txtDict.months[i] || d.month;
            const dot = createSvgElement("circle", {
                cx: x, cy: y, r: 4.5, fill: "#2b7bba", stroke: "none"
            });
            const tip = createSvgElement("title");
            tip.textContent = `${monthName}: $${d.price}`;
            dot.appendChild(tip);
            g.appendChild(dot);
        });

        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2, y: height - 12,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 7. PIE CHART (Title font-size gently scaled to 23.5px for ideal margin clearance)
    function renderPieChart(container) {
        const data = window.VIS_DATA.pieChart;
        const width = 800, height = 800;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].pieChart;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-piechart"
        });

        // Title with adjusted font-size to give clean breathing room
        const title = createSvgElement("text", {
            x: width / 2, y: 40, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const cx = 400, cy = 430, r = 350;
        const g = createSvgElement("g", {
            transform: `translate(${cx}, ${cy})`
        });
        svg.appendChild(g);

        let curAngle = 0;
        const total = data.reduce((acc, d) => acc + d.share, 0);

        data.forEach(d => {
            const angleSpan = (d.share / total) * 2 * Math.PI;
            const startA = curAngle;
            const endA = curAngle + angleSpan;
            curAngle = endA;

            const x1 = r * Math.sin(startA);
            const y1 = -r * Math.cos(startA);
            const x2 = r * Math.sin(endA);
            const y2 = -r * Math.cos(endA);
            const largeArc = (endA - startA) > Math.PI ? 1 : 0;

            const pathD = `M 0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;

            const localizedBrand = txtDict.brands[d.brand] || d.brand;

            const slice = createSvgElement("path", {
                d: pathD, fill: d.color, stroke: "none"
            });
            const tip = createSvgElement("title");
            tip.textContent = `${localizedBrand}: ${d.share}%`;
            slice.appendChild(tip);
            g.appendChild(slice);

            const midAngle = startA + angleSpan / 2;
            const lr = r * 0.58;
            const lx = lr * Math.sin(midAngle);
            const ly = -lr * Math.cos(midAngle);

            const txt = createSvgElement("text", {
                x: lx, y: ly + 8, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #000;"
            });
            txt.textContent = localizedBrand;
            g.appendChild(txt);
        });

        if (container) container.appendChild(svg);
        return svg;
    }

    // 8. SCATTERPLOT
    function renderScatterplot(container) {
        const data = window.VIS_DATA.scatterplot;
        const width = 800, height = 800;
        const margin = { top: 65, right: 35, bottom: 85, left: 90 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].scatterplot;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-scatterplot"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 + 10, y: 38, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const xMin = 155, xMax = 185;
        const xScale = (v) => ((v - xMin) / (xMax - xMin)) * plotW;

        const yMin = 40, yMax = 75;
        const yScale = (v) => plotH - ((v - yMin) / (yMax - yMin)) * plotH;

        const xTicks = [156, 158, 160, 162, 164, 166, 168, 170, 172, 174, 176, 178, 180, 182, 184];
        const yTicks = [40, 45, 50, 55, 60, 65, 70, 75];

        xTicks.forEach(t => {
            const x = xScale(t);
            const line = createSvgElement("line", {
                x1: x, x2: x, y1: 0, y2: plotH, stroke: "#dcdcdc", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        yTicks.forEach(t => {
            const y = yScale(t);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y, stroke: "#dcdcdc", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        const frame = createSvgElement("rect", {
            x: 0, y: 0, width: plotW, height: plotH,
            fill: "none", stroke: "#b5b5b5", "stroke-width": "1"
        });
        g.appendChild(frame);

        yTicks.forEach(t => {
            const y = yScale(t);
            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 14.5px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        xTicks.forEach(t => {
            const x = xScale(t);
            const mark = createSvgElement("line", {
                x1: x, x2: x, y1: plotH, y2: plotH + 5, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: x, y: plotH + 22, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 14.5px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        data.forEach(d => {
            const x = xScale(d.height);
            const y = yScale(d.weight);
            const dot = createSvgElement("circle", {
                cx: x, cy: y, r: 3.2, fill: "#2b7bba", stroke: "none"
            });
            const tip = createSvgElement("title");
            tip.textContent = `${txtDict.xLabel}: ${d.height.toFixed(1)} cm\n${txtDict.yLabel}: ${d.weight.toFixed(1)} kg`;
            dot.appendChild(tip);
            g.appendChild(dot);
        });

        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2, y: height - 15, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 9. 100% STACKED BAR CHART
    function renderStacked100(container) {
        const data = window.VIS_DATA.stacked100;
        const width = 800, height = 800;
        const margin = { top: 65, right: 100, bottom: 85, left: 90 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].stacked100;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-stacked100"
        });

        // Title with adjusted font-size to prevent clipping
        const title = createSvgElement("text", {
            x: width / 2 - 10, y: 38, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 25.5px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const yScale = (v) => plotH - (v / 100) * plotH;
        const yTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

        yTicks.forEach(t => {
            const y = yScale(t);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y, stroke: "#e4e4e4", "stroke-width": "1"
            });
            g.appendChild(line);

            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        const leftAxis = createSvgElement("line", {
            x1: 0, x2: 0, y1: 0, y2: plotH, stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(leftAxis);

        const bottomAxis = createSvgElement("line", {
            x1: 0, x2: plotW, y1: plotH, y2: plotH, stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(bottomAxis);

        const totalGroups = data.length;
        const groupW = plotW / totalGroups;
        const barW = groupW * 0.72;

        data.forEach((d, i) => {
            const gx = i * groupW + (groupW - barW) / 2;
            const localizedCountry = txtDict.countries[d.country] || d.country;

            const goldH = (d.gold / 100) * plotH;
            const goldY = plotH - goldH;

            const silverH = (d.silver / 100) * plotH;
            const silverY = goldY - silverH;

            const bronzeH = (d.bronze / 100) * plotH;
            const bronzeY = silverY - bronzeH;

            // Gold
            const rGold = createSvgElement("rect", {
                x: gx, y: goldY, width: barW, height: goldH, fill: "#fba53e"
            });
            const tipG = createSvgElement("title");
            tipG.textContent = `${localizedCountry} - ${txtDict.legend.Gold}: ${d.gold}%`;
            rGold.appendChild(tipG);
            g.appendChild(rGold);

            // Silver
            const rSilver = createSvgElement("rect", {
                x: gx, y: silverY, width: barW, height: silverH, fill: "#b8b8b8"
            });
            const tipS = createSvgElement("title");
            tipS.textContent = `${localizedCountry} - ${txtDict.legend.Silver}: ${d.silver}%`;
            rSilver.appendChild(tipS);
            g.appendChild(rSilver);

            // Bronze
            const rBronze = createSvgElement("rect", {
                x: gx, y: bronzeY, width: barW, height: bronzeH, fill: "#d6ad5e"
            });
            const tipB = createSvgElement("title");
            tipB.textContent = `${localizedCountry} - ${txtDict.legend.Bronze}: ${d.bronze}%`;
            rBronze.appendChild(tipB);
            g.appendChild(rBronze);

            const lbl = createSvgElement("text", {
                x: gx + barW / 2, y: plotH + 24, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = localizedCountry;
            g.appendChild(lbl);
        });

        // Legend at top-right with clear margin
        const legX = plotW + 10;
        const legY = 12;
        const legendItems = [
            { label: txtDict.legend.Gold, color: "#fba53e" },
            { label: txtDict.legend.Silver, color: "#b8b8b8" },
            { label: txtDict.legend.Bronze, color: "#d6ad5e" }
        ];

        legendItems.forEach((item, idx) => {
            const iy = legY + idx * 24;
            const sq = createSvgElement("rect", {
                x: legX, y: iy, width: 14, height: 14, fill: item.color
            });
            g.appendChild(sq);

            const txt = createSvgElement("text", {
                x: legX + 18, y: iy + 12, "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #000;"
            });
            txt.textContent = item.label;
            g.appendChild(txt);
        });

        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2, y: height - 15, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 10. STACKED AREA CHART (Refined margins so both Y ticks and legend text have ample padding)
    function renderStackedArea(container) {
        const data = window.VIS_DATA.stackedArea;
        const width = 800, height = 800;
        const margin = { top: 65, right: 105, bottom: 85, left: 105 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].stackedArea;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-stackedarea"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 - 10, y: 38, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const xMin = 2009, xMax = 2014;
        const xScale = (yr) => ((yr - xMin) / (xMax - xMin)) * plotW;

        const yMax = 19000;
        const yScale = (v) => plotH - (v / yMax) * plotH;
        const yTicks = [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000, 18000];

        yTicks.forEach(t => {
            const y = yScale(t);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y, stroke: "#dcdcdc", "stroke-width": "1"
            });
            g.appendChild(line);
        });

        for (let yr = xMin; yr <= xMax; yr++) {
            const x = xScale(yr);
            const line = createSvgElement("line", {
                x1: x, x2: x, y1: 0, y2: plotH, stroke: "#dcdcdc", "stroke-width": "1"
            });
            g.appendChild(line);
        }

        const frame = createSvgElement("rect", {
            x: 0, y: 0, width: plotW, height: plotH,
            fill: "none", stroke: "#b5b5b5", "stroke-width": "1"
        });
        g.appendChild(frame);

        const pts = data.map(d => {
            const y0 = 0;
            const y1 = d.Amelia;
            const y2 = y1 + d.Isla;
            const y3 = y2 + d.Olivia;
            return {
                x: xScale(d.year),
                year: d.year,
                y0: yScale(y0),
                y1: yScale(y1),
                y2: yScale(y2),
                y3: yScale(y3)
            };
        });

        // Layer 3: Olivia
        let dOlivia = `M ${pts[0].x} ${pts[0].y2}`;
        pts.forEach(p => { dOlivia += ` L ${p.x} ${p.y3}`; });
        for (let i = pts.length - 1; i >= 0; i--) { dOlivia += ` L ${pts[i].x} ${pts[i].y2}`; }
        dOlivia += " Z";

        const pOlivia = createSvgElement("path", {
            d: dOlivia, fill: "#deebf7", stroke: "none"
        });
        g.appendChild(pOlivia);

        // Layer 2: Isla
        let dIsla = `M ${pts[0].x} ${pts[0].y1}`;
        pts.forEach(p => { dIsla += ` L ${p.x} ${p.y2}`; });
        for (let i = pts.length - 1; i >= 0; i--) { dIsla += ` L ${pts[i].x} ${pts[i].y1}`; }
        dIsla += " Z";

        const pIsla = createSvgElement("path", {
            d: dIsla, fill: "#9ecae1", stroke: "none"
        });
        g.appendChild(pIsla);

        // Layer 1: Amelia
        let dAmelia = `M ${pts[0].x} ${plotH}`;
        pts.forEach(p => { dAmelia += ` L ${p.x} ${p.y1}`; });
        dAmelia += ` L ${pts[pts.length - 1].x} ${plotH} Z`;

        const pAmelia = createSvgElement("path", {
            d: dAmelia, fill: "#2b7bba", stroke: "none"
        });
        g.appendChild(pAmelia);

        // Y tick marks & labels
        yTicks.forEach(t => {
            const y = yScale(t);
            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = (lang === 'pt' ? t.toLocaleString("pt-BR") : t.toLocaleString("en-US"));
            g.appendChild(lbl);
        });

        // X tick marks & labels
        for (let yr = xMin; yr <= xMax; yr++) {
            const x = xScale(yr);
            const mark = createSvgElement("line", {
                x1: x, x2: x, y1: plotH, y2: plotH + 5, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: x, y: plotH + 24, "text-anchor": "middle",
                style: "font-family: Arial, sans-serif; font-size: 15px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = yr;
            g.appendChild(lbl);
        }

        // Legend at top-right with clear spacing
        const legX = plotW + 10;
        const legY = 12;
        const legendItems = [
            { label: txtDict.legend.Amelia, color: "#2b7bba" },
            { label: txtDict.legend.Isla, color: "#9ecae1" },
            { label: txtDict.legend.Olivia, color: "#deebf7" }
        ];

        legendItems.forEach((item, idx) => {
            const iy = legY + idx * 24;
            const sq = createSvgElement("rect", {
                x: legX, y: iy, width: 14, height: 14, fill: item.color
            });
            g.appendChild(sq);

            const txt = createSvgElement("text", {
                x: legX + 18, y: iy + 12, "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #000;"
            });
            txt.textContent = item.label;
            g.appendChild(txt);
        });

        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2, y: height - 15, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 11. STACKED BAR CHART (City names angled at 38 deg like original to prevent overlapping)
    function renderStackedBar(container) {
        const data = window.VIS_DATA.stackedBar;
        const width = 800, height = 800;
        const margin = { top: 65, right: 135, bottom: 110, left: 90 };
        const plotW = width - margin.left - margin.right;
        const plotH = height - margin.top - margin.bottom;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].stackedBar;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-stackedbar"
        });

        // Title
        const title = createSvgElement("text", {
            x: width / 2 - 10, y: 38, "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 28px; font-weight: bold; fill: #000;"
        });
        title.textContent = txtDict.title;
        svg.appendChild(title);

        const g = createSvgElement("g", {
            transform: `translate(${margin.left}, ${margin.top})`
        });
        svg.appendChild(g);

        const yMax = 70;
        const yScale = (v) => plotH - (v / yMax) * plotH;
        const yTicks = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];

        yTicks.forEach(t => {
            const y = yScale(t);
            const line = createSvgElement("line", {
                x1: 0, x2: plotW, y1: y, y2: y, stroke: "#e4e4e4", "stroke-width": "1"
            });
            g.appendChild(line);

            const mark = createSvgElement("line", {
                x1: -5, x2: 0, y1: y, y2: y, stroke: "#000", "stroke-width": "1.2"
            });
            g.appendChild(mark);

            const lbl = createSvgElement("text", {
                x: -10, y: y + 5, "text-anchor": "end",
                style: "font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = t;
            g.appendChild(lbl);
        });

        const leftAxis = createSvgElement("line", {
            x1: 0, x2: 0, y1: 0, y2: plotH, stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(leftAxis);

        const bottomAxis = createSvgElement("line", {
            x1: 0, x2: plotW, y1: plotH, y2: plotH, stroke: "#000", "stroke-width": "1.2"
        });
        g.appendChild(bottomAxis);

        const totalGroups = data.length;
        const groupW = plotW / totalGroups;
        const barW = groupW * 0.74;

        const layers = [
            { key: "Sandwich", label: txtDict.items.Sandwich, color: "#74c476" },
            { key: "Water", label: txtDict.items.Water, color: "#bcbddc" },
            { key: "Peanut", label: txtDict.items.Peanut, color: "#fdae6b" },
            { key: "Soda", label: txtDict.items.Soda, color: "#fb8072" },
            { key: "Vodka", label: txtDict.items.Vodka, color: "#3182bd" }
        ];

        data.forEach((d, i) => {
            const bx = i * groupW + (groupW - barW) / 2;
            let currentY = plotH;
            const localizedCity = txtDict.cities[d.city] || d.city;

            layers.forEach(layer => {
                const val = d[layer.key];
                const segH = (val / yMax) * plotH;
                const segY = currentY - segH;

                const rect = createSvgElement("rect", {
                    x: bx, y: segY, width: barW, height: segH, fill: layer.color
                });
                const tip = createSvgElement("title");
                tip.textContent = `${localizedCity} - ${layer.label}: $${val}`;
                rect.appendChild(tip);
                g.appendChild(rect);

                currentY = segY;
            });

            // Rotated city names (38 deg) to completely prevent overlapping across adjacent columns
            const lbl = createSvgElement("text", {
                transform: `translate(${bx + barW / 2 + 2}, ${plotH + 12}) rotate(38)`,
                "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 13px; font-weight: bold; fill: #000;"
            });
            lbl.textContent = localizedCity;
            g.appendChild(lbl);
        });

        // Legend at top-right with clear spacing
        const legX = plotW + 10;
        const legY = 10;
        layers.forEach((item, idx) => {
            const iy = legY + idx * 22;
            const sq = createSvgElement("rect", {
                x: legX, y: iy, width: 14, height: 14, fill: item.color
            });
            g.appendChild(sq);

            const txt = createSvgElement("text", {
                x: legX + 18, y: iy + 12, "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 13px; font-weight: 500; fill: #000;"
            });
            txt.textContent = item.label;
            g.appendChild(txt);
        });

        const yLabel = createSvgElement("text", {
            transform: `translate(32, ${plotH / 2 + margin.top}) rotate(-90)`,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        yLabel.textContent = txtDict.yLabel;
        svg.appendChild(yLabel);

        const xLabel = createSvgElement("text", {
            x: margin.left + plotW / 2, y: height - 12,
            "text-anchor": "middle",
            style: "font-family: Arial, sans-serif; font-size: 26px; font-weight: bold; fill: #000;"
        });
        xLabel.textContent = txtDict.xLabel;
        svg.appendChild(xLabel);

        if (container) container.appendChild(svg);
        return svg;
    }

    // 12. TREEMAP
    function renderTreemap(container) {
        const width = 800, height = 800;

        const lang = window.CURRENT_LANG || 'pt';
        const txtDict = I18N[lang].treemap;

        const svg = createSvgElement("svg", {
            viewBox: `0 0 ${width} ${height}`,
            width: "100%",
            height: "100%",
            class: "vlat-svg",
            id: "svg-treemap"
        });

        const groups = [
            {
                origKey: "Search/Portal",
                title: txtDict.groups["Search/Portal"] || "Busca / Portais",
                titleX: 15, titleY: 28,
                color: "#97d09b",
                rects: [
                    { name: "Google", x: 15, y: 38, w: 275, h: 315, tx: 22, ty: 62 },
                    { name: "MSN/WindowsLive/Bing", x: 293, y: 38, w: 215, h: 315, tx: 307, ty: 55, rotate: 90 },
                    { name: "Yahoo!", x: 15, y: 360, w: 250, h: 230, tx: 22, ty: 385 },
                    { name: "Ask", x: 268, y: 360, w: 240, h: 230, tx: 276, ty: 385 }
                ]
            },
            {
                origKey: "Software",
                title: txtDict.groups["Software"] || "Software",
                titleX: 520, titleY: 28,
                color: "#fbc497",
                rects: [
                    { name: "Mozilla", x: 520, y: 38, w: 140, h: 110, tx: 526, ty: 62 },
                    { name: "Adobe", x: 664, y: 38, w: 106, h: 110, tx: 670, ty: 62 },
                    { name: "Real Network", x: 520, y: 152, w: 140, h: 98, tx: 526, ty: 175 },
                    { name: "Videolan", x: 664, y: 152, w: 106, h: 52, tx: 670, ty: 175 },
                    { name: "Conduit", x: 664, y: 208, w: 106, h: 42, tx: 670, ty: 230 }
                ]
            },
            {
                origKey: "Retail",
                title: txtDict.groups["Retail"] || "Varejo",
                titleX: 520, titleY: 266,
                color: "#f9b0b1",
                rects: [
                    { name: "eBay", x: 520, y: 276, w: 130, h: 220, tx: 526, ty: 300 },
                    { name: "Amazon", x: 653, y: 276, w: 117, h: 220, tx: 660, ty: 300 },
                    { name: "Wal-Mart", x: 520, y: 500, w: 93, h: 90, tx: 526, ty: 524 },
                    { name: "Craigslist", x: 616, y: 500, w: 93, h: 90, tx: 622, ty: 524 },
                    { name: "Target", x: 712, y: 500, w: 58, h: 90, tx: 718, ty: 524 }
                ]
            },
            {
                origKey: "Social Network",
                title: txtDict.groups["Social Network"] || "Redes Sociais",
                titleX: 15, titleY: 620,
                color: "#cfc0db",
                rects: [
                    { name: "Facebook", x: 15, y: 630, w: 340, h: 140, tx: 22, ty: 655 },
                    { name: "Twitter", x: 360, y: 630, w: 107, h: 80, tx: 366, ty: 655 },
                    { name: "Orkut", x: 360, y: 714, w: 107, h: 56, tx: 366, ty: 738 },
                    { name: "LinkedIn", x: 471, y: 630, w: 37, h: 140, tx: 485, ty: 650, rotate: 90 }
                ]
            },
            {
                origKey: "Computer",
                title: txtDict.groups["Computer"] || "Computadores",
                titleX: 520, titleY: 620,
                color: "#74a9cf",
                rects: [
                    { name: "Apple", x: 520, y: 630, w: 180, h: 140, tx: 526, ty: 655 },
                    { name: "Dell", x: 704, y: 630, w: 66, h: 72, tx: 710, ty: 653 },
                    { name: "HP", x: 704, y: 705, w: 66, h: 65, tx: 710, ty: 728 }
                ]
            }
        ];

        groups.forEach(grp => {
            const title = createSvgElement("text", {
                x: grp.titleX, y: grp.titleY, "text-anchor": "start",
                style: "font-family: Arial, sans-serif; font-size: 24px; font-weight: bold; fill: #000;"
            });
            title.textContent = grp.title;
            svg.appendChild(title);

            grp.rects.forEach(r => {
                const rect = createSvgElement("rect", {
                    x: r.x, y: r.y, width: r.w, height: r.h,
                    fill: grp.color, stroke: "#000000", "stroke-width": "1"
                });
                const tip = createSvgElement("title");
                tip.textContent = `${grp.title} > ${r.name}`;
                rect.appendChild(tip);
                svg.appendChild(rect);

                const label = createSvgElement("text", {
                    style: "font-family: Arial, sans-serif; font-size: 17.5px; fill: #000;"
                });
                if (r.rotate) {
                    label.setAttribute("transform", `translate(${r.tx}, ${r.ty}) rotate(${r.rotate})`);
                } else {
                    label.setAttribute("x", r.tx);
                    label.setAttribute("y", r.ty);
                }
                label.textContent = r.name;
                svg.appendChild(label);
            });
        });

        if (container) container.appendChild(svg);
        return svg;
    }
})();
