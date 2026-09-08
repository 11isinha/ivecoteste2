# 🚛 IVECO ECOFICINA 3D • Hub de Manufatura Aditiva & Descarbonização

Plataforma inteligente de manufatura aditiva, diagnóstico por visão computacional e estoque digital de reposição sob demanda para a frota pesada IVECO.

---

## 🌟 Visão Geral

A **ECOFICINA 3D** é uma solução que integra a transição ecológica da mobilidade pesada à Indústria 4.0:
- **Alívio de Peso Estrutural**: Substituição de peças pesadas de aço fundido por polímeros técnicos reforçados com fibra de carbono (**PA12-CF** e **PEEK**), reduzindo até **65% da massa** dos componentes.
- **Logística Digital & Frete Zero**: Fabricação descentralizada sob demanda diretamente nos hubs concessionários e oficinas autorizadas através de arquivos CAD homologados.
- **Descarbonização Contínua**: Cada 100 kg reduzidos no caminhão economizam aproximadamente **0,35L de diesel / 100 km (~0,93 kg CO₂ evitado)**.

---

## 🚀 Funcionalidades Principais

1. **Hero Cinematográfico com Vídeo de Fundo**:
   - Vídeo oficial demonstrativo em loop contínuo e silencioso (`iveco_animacao.mp4`).
   - Tipografia de alto contraste com gradientes e indicadores rápidos de sustentabilidade.

2. **Diagnóstico IA & Visão Computacional**:
   - Varredura e reconhecimento automatizado de componentes desgastados.
   - Cálculo instantâneo da viabilidade de recondicionamento aditivo e emissões poupadas.

3. **Hub de Impressão 3D & Telemetria em Tempo Real**:
   - Monitoramento das células industriais de impressão (status, temperaturas de bico/mesa, jobs em andamento e tempo restante).
   - Rastreamento e gerenciamento da fila de manufatura aditiva.

4. **Catálogo Digital CAD Homologado IVECO**:
   - Modelos técnicos prontos para fatiamento e impressão local com laudo de resistência mecânica e redução de peso.

5. **Dashboard ESG & Indicadores de CO₂**:
   - Consolidação de peças recondicionadas, massa aliviada na frota e toneladas de CO₂e evitadas ao longo do ciclo de vida.
   - Certificado digital de conformidade com metas corporativas e ISO 14001.

---

## 📁 Estrutura do Repositório

```text
├── ecoficina_iveco_hub_de_manufatura_aditiva_descarboniza_o.tsx  # Componente React (TSX) com Tailwind CSS e Lucide Icons
├── index.html                                                    # Aplicação web completa e pronta para execução no navegador
├── iveco_animacao.mp4                                            # Vídeo demonstrativo oficial
├── README.md                                                     # Documentação do projeto
└── .gitignore                                                    # Arquivos ignorados pelo Git
```

---

## 💻 Como Executar

### Opção 1: Execução Direta no Navegador
Basta abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari). O aplicativo carrega automaticamente o React 18, Tailwind CSS e ícones sem necessidade de instalação prévia.

### Opção 2: Servidor Local
Você pode rodar um servidor HTTP local simples:

```bash
# Com Python
python -m http.server 3344

# Ou com Node.js (npx)
npx serve .
```

Acesse: `http://localhost:3344`

---

## 🛠️ Tecnologias Utilizadas

- **React 18** (Hooks, State Management, Refs)
- **Tailwind CSS** (Dark Mode, Gradientes, Glassmorphism, Micro-animações)
- **Lucide Icons**
- **HTML5 Video** (Background Video Cover em Loop)
- **TypeScript / JSX**
