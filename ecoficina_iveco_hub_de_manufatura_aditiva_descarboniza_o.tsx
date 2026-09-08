import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, 
  Cpu, 
  Leaf, 
  Truck, 
  Wrench, 
  ShieldCheck, 
  Layers, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Plus, 
  Download, 
  Activity, 
  Box, 
  RefreshCw, 
  ChevronRight, 
  ArrowRight, 
  Clock, 
  Scale, 
  Award, 
  Share2, 
  Info, 
  Settings, 
  MapPin, 
  FileText, 
  Server,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  X
} from 'lucide-react';

// --- MOCK DATA ---
const INITIAL_CAD_CATALOG = [
  {
    id: 'CAD-8842',
    name: 'Suporte do Duto do Intercooler',
    category: 'Motor & Admissão',
    material: 'PA12-CF (Nylon Carbon Fiber)',
    originalWeight: 2.8, // kg (Aço)
    printWeight: 0.9, // kg (PA12-CF)
    weightReduction: '67.8%',
    co2SavedFabrication: 14.2, // kg CO2e
    co2SavedLogistics: 5.8, // kg CO2e
    co2SavedLifespan: 176.7, // kg CO2e em 120.000km
    tensileStrength: '115 MPa',
    printTimeHours: 4.5,
    status: 'Homologado IVECO',
    modelCode: 'S-IVE-2026-X1'
  },
  {
    id: 'CAD-9102',
    name: 'Coletor Secundário de Ar',
    category: 'Admissão & Filtros',
    material: 'PA6-CF (High Impact)',
    originalWeight: 4.1,
    printWeight: 1.4,
    weightReduction: '65.8%',
    co2SavedFabrication: 22.5,
    co2SavedLogistics: 8.1,
    co2SavedLifespan: 251.1,
    tensileStrength: '130 MPa',
    printTimeHours: 7.2,
    status: 'Homologado IVECO',
    modelCode: 'C-IVE-2025-A2'
  },
  {
    id: 'CAD-3310',
    name: 'Carcaça de Conector Elétrico Principal',
    category: 'Elétrico & Sensores',
    material: 'PETG-CF / PEEK',
    originalWeight: 0.8,
    printWeight: 0.3,
    weightReduction: '62.5%',
    co2SavedFabrication: 4.8,
    co2SavedLogistics: 2.1,
    co2SavedLifespan: 46.5,
    tensileStrength: '98 MPa',
    printTimeHours: 1.8,
    status: 'Homologado IVECO',
    modelCode: 'E-IVE-2026-E9'
  },
  {
    id: 'CAD-5521',
    name: 'Presilha Estrutural de Tubulação Hidráulica',
    category: 'Chassi & Suspensão',
    material: 'PA12-CF Heavy Duty',
    originalWeight: 1.5,
    printWeight: 0.5,
    weightReduction: '66.6%',
    co2SavedFabrication: 8.3,
    co2SavedLogistics: 3.4,
    co2SavedLifespan: 93.0,
    tensileStrength: '145 MPa',
    printTimeHours: 2.2,
    status: 'Homologado IVECO',
    modelCode: 'P-IVE-2026-H4'
  }
];

const MOCK_PRINTERS = [
  {
    id: 'PRN-01',
    name: 'Cell 3D Alpha (Robótica/Industrial)',
    hubName: 'Hub IVECO São Paulo - Anchieta',
    status: 'Imprimindo',
    currentJob: 'Suporte Duto Intercooler (CAD-8842)',
    progress: 68,
    tempNozzle: '285°C',
    tempBed: '100°C',
    materialLoaded: 'PA12-CF (Nylon Carbon Fiber)',
    timeRemaining: '1h 25m'
  },
  {
    id: 'PRN-02',
    name: 'Cell 3D Beta (Alta Precisão)',
    hubName: 'Hub IVECO São Paulo - Anchieta',
    status: 'Disponível',
    currentJob: 'Aguardando Fila',
    progress: 0,
    tempNozzle: '25°C',
    tempBed: '25°C',
    materialLoaded: 'PEEK Auto Grade',
    timeRemaining: '-'
  },
  {
    id: 'PRN-03',
    name: 'Cell 3D Gamma (Granular/FDM)',
    hubName: 'Hub IVECO Curitiba - Parceiro',
    status: 'Manutenção Preventiva',
    currentJob: 'Calibração do Extrusor',
    progress: 0,
    tempNozzle: '20°C',
    tempBed: '20°C',
    materialLoaded: 'PETG-CF',
    timeRemaining: '-'
  }
];

const MOCK_SCAN_DIAGNOSIS = {
  scannedPart: 'Suporte de Retenção do Coletor - S-IVE-2026',
  damageDetected: 'Fissura estrutural de 12mm na aba de fixação lateral por fadiga térmica.',
  severity: 'Média (Afeta estabilidade mas permite reparo aditivo local)',
  recommendation: 'RECONDICIONAR EM 3D (Polímeros Reforçados)',
  materialSuggested: 'PA12-CF (Nylon com 20% Fibra de Carbono)',
  originalWeightKg: 3.2,
  reconditionedWeightKg: 1.1,
  weightDeltaKg: -2.1,
  co2SavingsManufacturing: 18.5,
  co2SavingsLogistics: 6.2,
  co2Savings100kKm: 195.3,
  estPrintTimeHours: 3.8
};

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState('hub3d'); // 'scanner', 'hub3d', 'catalog', 'dashboard', 'settings'
  
  // App Data States
  const [printers, setPrinters] = useState(MOCK_PRINTERS);
  const [cadCatalog, setCadCatalog] = useState(INITIAL_CAD_CATALOG);
  const [selectedCad, setSelectedCad] = useState(INITIAL_CAD_CATALOG[0]);
  const [activePrintQueue, setActivePrintQueue] = useState([
    {
      id: 'Q-101',
      partName: 'Suporte Duto Intercooler',
      cadCode: 'CAD-8842',
      requestedBy: 'Concessionária SP-Leste',
      status: 'Em Impressão',
      printerId: 'PRN-01',
      progress: 68,
      eta: '1h 25m'
    },
    {
      id: 'Q-102',
      partName: 'Presilha Estrutural Hidráulica',
      cadCode: 'CAD-5521',
      requestedBy: 'Oficina Parceira Campinas',
      status: 'Na Fila',
      printerId: 'PRN-02',
      progress: 0,
      eta: '2h 20m (Aguardando)'
    }
  ]);

  // Scanner Simulator States
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('PA12-CF (Nylon Carbon Fiber)');

  // Dynamic Metrics State
  const [metrics, setMetrics] = useState({
    partsReconditioned: 142,
    weightReducedKg: 284.5,
    co2AvoidedTons: 18.6,
    activePrinters: 2,
    hoursActive: 540
  });

  // Modal State
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);
  const [orderSummary, setOrderSummary] = useState(null);

  // Trigger Print Simulation effect
  useEffect(() => {
    const timer = setInterval(() => {
      setPrinters(prev => prev.map(p => {
        if (p.status === 'Imprimindo' && p.progress < 100) {
          return { ...p, progress: Math.min(p.progress + 1, 100) };
        }
        return p;
      }));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Handle Scanner Simulation
  const handleStartScan = () => {
    setScanning(true);
    setScanned(false);
    setTimeout(() => {
      setScanning(false);
      setScanned(true);
    }, 2500);
  };

  // Submit 3D Print Order
  const handleSendPrintOrder = (partData) => {
    const newQueueItem = {
      id: `Q-${Math.floor(100 + Math.random() * 900)}`,
      partName: partData.name || partData.scannedPart,
      cadCode: partData.id || 'CAD-DIAG-01',
      requestedBy: 'Oficina Matriz IVECO',
      status: 'Na Fila',
      printerId: 'PRN-02',
      progress: 0,
      eta: `${partData.printTimeHours || partData.estPrintTimeHours || 3}h 00m`
    };

    setActivePrintQueue([...activePrintQueue, newQueueItem]);
    setMetrics(prev => ({
      ...prev,
      partsReconditioned: prev.partsReconditioned + 1,
      weightReducedKg: Number((prev.weightReducedKg + Math.abs(partData.weightDeltaKg || (partData.originalWeight - partData.printWeight))).toFixed(1)),
      co2AvoidedTons: Number((prev.co2AvoidedTons + 0.22).toFixed(2))
    }));

    setOrderSummary({
      partName: partData.name || partData.scannedPart,
      material: selectedMaterial,
      weightSaved: Math.abs(partData.weightDeltaKg || (partData.originalWeight - partData.printWeight)).toFixed(1),
      printerAssigned: 'Cell 3D Beta (Hub SP)'
    });
    setShowOrderSuccessModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* HEADER / TOP BAR WITH ECO-BADGE */}
      <header className="bg-slate-800/90 border-b border-slate-700 sticky top-0 z-40 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg flex items-center justify-center font-black tracking-widest text-white text-lg shadow-lg shadow-blue-500/30">
              IVECO
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight flex items-center gap-2">
                ECOFICINA 3D
                <span className="text-xs font-normal bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full">
                  Manufatura Aditiva
                </span>
              </h1>
              <p className="text-xs text-slate-400">Rede Conectada de Recondicionamento & Polímeros Reforçados</p>
            </div>
          </div>

          {/* ECO-BADGE NIVEL OURO */}
          <div className="hidden md:flex items-center gap-3 bg-slate-950/60 border border-emerald-500/30 rounded-xl px-3 py-1.5">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span>Oficina Verde • Nível Ouro</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-[11px] text-slate-400">Hub 3D Ativo • Descarbonização Ativa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentTab('scanner')} 
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-emerald-900/40">
              <Cpu className="w-4 h-4" />
              <span>Diagnóstico IA</span>
            </button>
          </div>
        </div>
      </header>

      {/* ================= CINEMATIC BACKGROUND VIDEO HERO (LIGHT & CLEAN LOOP) ================= */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden border-b border-slate-700/80">
        {/* Background Video (Fullscreen Cover, Bright & Vivid) */}
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950 z-0">
          <video
            src="./iveco_animacao.mp4"
            className="w-full h-full object-cover object-center brightness-105 contrast-105"
            autoPlay
            loop
            muted
            playsInline
          />
          {/* Subtle Soft Gradient Overlays (preserves video visibility while keeping text crisp) */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/30 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-950/20 z-10 pointer-events-none"></div>
        </div>

        {/* Floating Top Status Indicator Bar inside Hero */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 pt-6 flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/70 backdrop-blur-md border border-blue-500/30 text-blue-300 text-xs font-semibold tracking-wide shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>MANUFATURA ADITIVA & SUSTENTABILIDADE IVECO</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 bg-slate-900/70 backdrop-blur-md border border-slate-700/70 rounded-xl px-3 py-1.5 text-xs text-slate-200 shadow-md">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Frota Conectada IVECO 2026</span>
          </div>
        </div>

        {/* Center/Left Hero Content */}
        <div className="relative z-20 max-w-7xl w-full mx-auto px-4 py-12 md:py-16 flex flex-col justify-center flex-1">
          <div className="max-w-2xl space-y-6">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 rounded-lg bg-emerald-500/25 backdrop-blur-md border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-widest shadow-md">
                Hub de Inovação & Descarbonização
              </span>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]">
                Descarbonização & <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                  Peças 3D Sob Demanda
                </span>
              </h1>

              <p className="text-sm md:text-lg text-slate-100 leading-relaxed font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] max-w-xl">
                Acelerando a transição sustentável da frota pesada através do recondicionamento inteligente, 
                estoque digital homologado e polímeros reforçados com fibra de carbono (PA12-CF / PEEK) — gerando até 
                <strong className="text-emerald-400 font-bold"> 65% de alívio de massa</strong> e 
                <strong className="text-cyan-300 font-bold"> eliminação total de frete logístico</strong>.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentTab('scanner');
                  document.getElementById('main-workspace')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs md:text-sm font-bold shadow-xl shadow-blue-600/40 hover:shadow-cyan-500/50 transition-all flex items-center gap-2 group transform hover:-translate-y-0.5">
                <Cpu className="w-4 h-4 group-hover:scale-110 transition-transform text-white" />
                <span>Iniciar Diagnóstico IA</span>
                <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1.5 transition-transform" />
              </button>

              <button
                onClick={() => {
                  setCurrentTab('catalog');
                  document.getElementById('main-workspace')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md text-slate-100 border border-slate-600/80 hover:border-slate-500 text-xs md:text-sm font-semibold transition-all flex items-center gap-2 shadow-lg">
                <Box className="w-4 h-4 text-cyan-400" />
                <span>Catálogo CAD Digital</span>
              </button>
            </div>

            {/* Micro Highlight Cards Overlaid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/20 max-w-lg">
              <div className="bg-slate-950/65 backdrop-blur-md border border-white/15 p-2.5 rounded-xl shadow-lg">
                <div className="text-base md:text-xl font-black text-emerald-400">-65%</div>
                <div className="text-[11px] text-slate-200 font-medium">Alívio de Peso</div>
                <div className="text-[9px] text-slate-400">PA12-CF / PEEK</div>
              </div>

              <div className="bg-slate-950/65 backdrop-blur-md border border-white/15 p-2.5 rounded-xl shadow-lg">
                <div className="text-base md:text-xl font-black text-cyan-300">Zero Frete</div>
                <div className="text-[11px] text-slate-200 font-medium">Estoque Digital</div>
                <div className="text-[9px] text-slate-400">Impressão Local 3D</div>
              </div>

              <div className="bg-slate-950/65 backdrop-blur-md border border-white/15 p-2.5 rounded-xl shadow-lg">
                <div className="text-base md:text-xl font-black text-white">100%</div>
                <div className="text-[11px] text-slate-200 font-medium">Homologado</div>
                <div className="text-[9px] text-slate-400">Engenharia IVECO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Clean Scroll Down indicator */}
        <div className="relative z-20 border-t border-white/10 bg-slate-950/40 backdrop-blur-sm py-3 px-4 flex justify-center">
          <button
            onClick={() => document.getElementById('main-workspace')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 text-xs text-slate-200 hover:text-white transition group py-1">
            <span>Explorar Painel Operacional & Células 3D</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform text-cyan-400" />
          </button>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <div id="main-workspace" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* SIDEBAR NAVIGATION (Large Screens) */}
        <nav className="hidden lg:flex lg:col-span-3 flex-col gap-2 bg-slate-800/40 p-3 rounded-2xl border border-slate-700/50 h-fit">
          <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            Módulos ECOFICINA
          </div>
          <button
            onClick={() => setCurrentTab('hub3d')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'hub3d' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-700/50'
            }`}>
            <Printer className="w-4 h-4" />
            <span>Hub de Impressão 3D</span>
          </button>

          <button
            onClick={() => setCurrentTab('scanner')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'scanner' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-700/50'
            }`}>
            <Cpu className="w-4 h-4" />
            <span>Diagnóstico & Scanner IA</span>
          </button>

          <button
            onClick={() => setCurrentTab('catalog')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'catalog' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-700/50'
            }`}>
            <Box className="w-4 h-4" />
            <span>Catálogo CAD Homologado</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
              currentTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-300 hover:bg-slate-700/50'
            }`}>
            <BarChart3 className="w-4 h-4" />
            <span>Indicadores ESG & CO₂</span>
          </button>

          <div className="mt-6 p-3 bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 rounded-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs mb-1">
              <Leaf className="w-4 h-4" />
              <span>Lightweighting IVECO</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Substituir aço por <b>PA-CF/PEEK</b> reduz até 65% do peso da peça, gerando até 0,93kg CO₂ economizado/100km na rodagem.
            </p>
          </div>
        </nav>

        {/* CONTENT AREA */}
        <main className="lg:col-span-9 space-y-6">

          {/* METRICS SUMMARY STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                Peças Recondicionadas
              </span>
              <span className="text-xl md:text-2xl font-bold text-white mt-1">{metrics.partsReconditioned}</span>
              <span className="text-[10px] text-emerald-400 mt-1 font-medium">+14 este mês</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                Alívio de Peso Frota
              </span>
              <span className="text-xl md:text-2xl font-bold text-cyan-300 mt-1">{metrics.weightReducedKg} <span className="text-xs font-normal text-slate-400">kg</span></span>
              <span className="text-[10px] text-cyan-400 mt-1 font-medium">~65% por componente</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                CO₂ Evitado Total
              </span>
              <span className="text-xl md:text-2xl font-bold text-emerald-400 mt-1">{metrics.co2AvoidedTons} <span className="text-xs font-normal text-slate-400">tCO₂e</span></span>
              <span className="text-[10px] text-emerald-400 mt-1 font-medium">Ciclo completo de vida</span>
            </div>

            <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex flex-col">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                Células 3D Ativas
              </span>
              <span className="text-xl md:text-2xl font-bold text-amber-300 mt-1">{metrics.activePrinters} <span className="text-xs font-normal text-slate-400">Hubs</span></span>
              <span className="text-[10px] text-slate-400 mt-1 font-medium">{metrics.hoursActive}h de extrusão</span>
            </div>
          </div>

          {/* ================= TAB 1: HUB DE IMPRESSÃO 3D ================= */}
          {currentTab === 'hub3d' && (
            <div className="space-y-6">
              {/* STATUS IMPRESSORAS DA REDE */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Server className="w-5 h-5 text-blue-400" />
                      Status das Células de Impressão Industrial
                    </h2>
                    <p className="text-xs text-slate-400">Monitorização em tempo real das máquinas na unidade e concessionárias parceiras</p>
                  </div>
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Rede Sincronizada
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {printers.map((prn) => (
                    <div key={prn.id} className="bg-slate-900/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-600 transition">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-sm text-slate-200">{prn.name}</h3>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-slate-500" />
                              {prn.hubName}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            prn.status === 'Imprimindo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            prn.status === 'Disponível' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {prn.status}
                          </span>
                        </div>

                        <div className="mt-3 p-2.5 bg-slate-950/60 rounded-lg text-xs space-y-1.5">
                          <div className="flex justify-between text-slate-400">
                            <span>Job Atual:</span>
                            <span className="font-medium text-slate-200 text-right truncate max-w-[120px]">{prn.currentJob}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Material Técnico:</span>
                            <span className="font-semibold text-cyan-400">{prn.materialLoaded}</span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Bico / Mesa:</span>
                            <span className="font-mono text-slate-300">{prn.tempNozzle} | {prn.tempBed}</span>
                          </div>
                        </div>

                        {prn.status === 'Imprimindo' && (
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Progresso</span>
                              <span className="font-mono text-blue-400 font-bold">{prn.progress}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
                                style={{ width: `${prn.progress}%` }}>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Restante:</span>
                              <span className="font-medium text-slate-200">{prn.timeRemaining}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => setCurrentTab('catalog')}
                        className="mt-4 w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition border border-slate-700 flex items-center justify-center gap-1">
                        <span>Alocar Job nesta Célula</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* FILA DE PEDIDOS E RASTREAMENTO DE CAMADAS */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <h2 className="text-base font-bold flex items-center gap-2 mb-4">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  Fila de Manufatura Aditiva & Rastreamento
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-700 text-xs text-slate-400 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Código / Peça</th>
                        <th className="py-2.5 px-3">Origem Pedido</th>
                        <th className="py-2.5 px-3">Célula Atribuída</th>
                        <th className="py-2.5 px-3">Estado</th>
                        <th className="py-2.5 px-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-xs">
                      {activePrintQueue.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-slate-200">{item.partName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{item.cadCode}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-300">
                            {item.requestedBy}
                          </td>
                          <td className="py-3 px-3">
                            <span className="bg-slate-900 border border-slate-700 px-2 py-1 rounded text-slate-300 font-mono">
                              {item.printerId}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full font-medium text-[11px] ${
                              item.status === 'Em Impressão' ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-300'
                            }`}>
                              {item.status} ({item.progress}%)
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button className="text-blue-400 hover:text-blue-300 font-medium underline text-xs">
                              Ver Fatiamento 3D
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: DIAGNÓSTICO COM IA (SCANNER) ================= */}
          {currentTab === 'scanner' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Cpu className="w-5 h-5 text-emerald-400" />
                      Diagnóstico por Visão Computacional & Scanner de Peças
                    </h2>
                    <p className="text-xs text-slate-400">Identificação de desgaste e recomendação automática de recondicionamento aditivo</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  {/* SIMULADOR DE SCANNER */}
                  <div className="md:col-span-5 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                    {!scanning && !scanned && (
                      <div className="text-center space-y-3 p-4">
                        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
                          <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="font-semibold text-sm">Posicione a Peça para Leitura</h3>
                        <p className="text-xs text-slate-400">O scanner analisará fissuras, desgaste de flanges e viabilidade de reforço sintético.</p>
                        <button 
                          onClick={handleStartScan}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-600/30 transition">
                          Iniciar Varredura IA
                        </button>
                      </div>
                    )}

                    {scanning && (
                      <div className="text-center space-y-4">
                        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                          <Wrench className="w-10 h-10 text-emerald-400 animate-pulse" />
                        </div>
                        <p className="text-xs font-medium text-emerald-400 animate-pulse">A analisar malha geométrica & tensões...</p>
                      </div>
                    )}

                    {scanned && (
                      <div className="w-full space-y-3 text-left">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> Análise Concluída
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">Confiança IA: 98.4%</span>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <p className="text-slate-400">Componente Reconhecido:</p>
                          <p className="font-bold text-slate-200">{MOCK_SCAN_DIAGNOSIS.scannedPart}</p>
                          <p className="text-amber-400 text-[11px] bg-amber-500/10 border border-amber-500/20 p-2 rounded mt-1">
                            <b>Anomalia:</b> {MOCK_SCAN_DIAGNOSIS.damageDetected}
                          </p>
                        </div>

                        <button 
                          onClick={handleStartScan}
                          className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition flex items-center justify-center gap-1">
                          <RefreshCw className="w-3.5 h-3.5" /> Repetir Scanner
                        </button>
                      </div>
                    )}
                  </div>

                  {/* RECOMENDAÇÃO INTELIGENTE & DECISÃO */}
                  <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                    {scanned ? (
                      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="w-4 h-4" /> Sugestão do Motor IA IVECO
                          </span>
                          <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-500/30">
                            5º Destino Inteligente
                          </span>
                        </div>

                        <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-lg">
                          <h3 className="font-bold text-emerald-300 text-sm">
                            {MOCK_SCAN_DIAGNOSIS.recommendation}
                          </h3>
                          <p className="text-xs text-slate-300 mt-1">
                            A peça qualifica-se para reconstrução parcial aditiva em <b>PA12-CF (Nylon com Fibra de Carbono)</b> sem necessidade de descartar o corpo principal.
                          </p>
                        </div>

                        {/* IMPACTO ESTIMADO DO REPARO */}
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">Alívio de Peso</span>
                            <span className="font-bold text-cyan-400 text-sm">{MOCK_SCAN_DIAGNOSIS.weightDeltaKg} kg</span>
                            <span className="text-[9px] text-slate-500 block">(-65.6%)</span>
                          </div>

                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">CO₂ Fabr.+Frete</span>
                            <span className="font-bold text-emerald-400 text-sm">24.7 kg</span>
                            <span className="text-[9px] text-emerald-500 block">evitados já</span>
                          </div>

                          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                            <span className="text-slate-400 text-[10px] block">CO₂ Rodagem</span>
                            <span className="font-bold text-emerald-300 text-sm">195.3 kg</span>
                            <span className="text-[9px] text-slate-500 block">em 100 mil km</span>
                          </div>
                        </div>

                        {/* SELEÇÃO DE POLÍMERO E AÇÃO */}
                        <div className="space-y-2">
                          <label className="text-xs text-slate-300 font-medium block">
                            Selecione o Polímero Técnico para Envio:
                          </label>
                          <select 
                            value={selectedMaterial}
                            onChange={(e) => setSelectedMaterial(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500">
                            <option>PA12-CF (Nylon Carbon Fiber - Alta Rigidez)</option>
                            <option>PEEK Auto-Grade (Extrema Resistência Térmica)</option>
                            <option>PETG-CF (Resistência Química & Impacto)</option>
                            <option>TPU Automotivo (Flexível/Vedações)</option>
                          </select>
                        </div>

                        <button 
                          onClick={() => handleSendPrintOrder(MOCK_SCAN_DIAGNOSIS)}
                          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2">
                          <Printer className="w-4 h-4" />
                          <span>Enviar Ordem para Célula 3D Local</span>
                        </button>
                      </div>
                    ) : (
                      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center text-slate-400 space-y-2 flex flex-col justify-center h-full">
                        <Info className="w-8 h-8 text-slate-500 mx-auto" />
                        <p className="text-xs font-medium">Aguardando leitura de peça no módulo visual ao lado.</p>
                        <p className="text-[11px] text-slate-500">O sistema calculará automaticamente o alívio de massa e as emissões de CO₂ poupadas.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: CATÁLOGO DIGITAL CAD HOMOLOGADO ================= */}
          {currentTab === 'catalog' && (
            <div className="space-y-6">
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h2 className="text-base font-bold flex items-center gap-2">
                      <Box className="w-5 h-5 text-blue-400" />
                      Catálogo Digital CAD Homologado IVECO
                    </h2>
                    <p className="text-xs text-slate-400">Modelos 3D prontos para fabricação local sob demanda com laudo técnico de resistência</p>
                  </div>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                    <input 
                      type="text" 
                      placeholder="Buscar por código ou peça..." 
                      className="bg-slate-950 border border-slate-700 text-xs rounded-xl pl-8 pr-3 py-2 w-full sm:w-60 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cadCatalog.map((cad) => (
                    <div 
                      key={cad.id}
                      onClick={() => setSelectedCad(cad)}
                      className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                        selectedCad.id === cad.id 
                          ? 'bg-slate-900 border-blue-500 shadow-md shadow-blue-500/10' 
                          : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'
                      }`}>
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                              {cad.modelCode}
                            </span>
                            <h3 className="font-bold text-sm text-slate-200 mt-1">{cad.name}</h3>
                            <p className="text-xs text-slate-400">{cad.category}</p>
                          </div>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {cad.status}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                          <div>
                            <span className="text-slate-400 text-[10px] block">Material Recomendado</span>
                            <span className="font-semibold text-cyan-400">{cad.material}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Resistência à Tração</span>
                            <span className="font-semibold text-slate-200">{cad.tensileStrength}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Peso Orig. vs 3D</span>
                            <span className="font-medium text-slate-300">{cad.originalWeight}kg &rarr; <b className="text-emerald-400">{cad.printWeight}kg</b></span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10px] block">Alívio de Massa</span>
                            <span className="font-bold text-cyan-300">{cad.weightReduction}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> ~{cad.printTimeHours}h de impressão
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendPrintOrder(cad);
                          }}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition text-xs flex items-center gap-1">
                          <Printer className="w-3.5 h-3.5" /> Enviar p/ Impressão
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: DASHBOARD ESG & FÓRMULA DE DESCARBONIZAÇÃO ================= */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              {/* CARD DE FÓRMULA DE DESCARBONIZAÇÃO */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 shadow-xl">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                  <Leaf className="w-5 h-5" />
                  <span>Fórmula de Descarbonização Expandida IVECO</span>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono text-xs md:text-sm text-emerald-300 overflow-x-auto my-3">
                  {"CO₂e Total Poupado = CO₂ (Fabricação Evitada) + CO₂ (Frete Zero Logística Digital) + CO₂ (Alívio de Peso na Rodagem)"}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Para caminhões pesados IVECO, cada <b>100 kg reduzidos</b> no veículo representam aproximadamente <b>0,35L de diesel a menos por 100 km (~0,93 kg CO₂ evitado)</b>. Em 120.000 km/ano por veículo, o acumulo de componentes em polímero reforçado gera economia contínua de escala industrial.
                </p>
              </div>

              {/* DETALHAMENTO DE IMPACTO AMBIENTAL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4">
                  <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    Fontes de Redução de Emissões (tCO₂e)
                  </h3>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Fabricação Evitada (Aço/Fundição)</span>
                        <span className="font-bold text-blue-400">7.2 tCO₂e (38.7%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '38.7%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Frete & Logística Zero (Digital CAD)</span>
                        <span className="font-bold text-cyan-400">3.1 tCO₂e (16.6%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400" style={{ width: '16.6%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Alívio de Peso na Rodagem Frota</span>
                        <span className="font-bold text-emerald-400">8.3 tCO₂e (44.7%)</span>
                      </div>
                      <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '44.7%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      Certificado de Descarbonização IVECO
                    </h3>
                    <p className="text-xs text-slate-400">
                      Esta unidade está homologada como <b>Hub de Manufatura Verde Nível Ouro</b>, cumprindo as metas corporativas ESG de economia circular.
                    </p>
                  </div>

                  <div className="mt-4 p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                    <div className="text-xs">
                      <span className="text-slate-400 block">Selo de Eficiência</span>
                      <span className="font-bold text-emerald-300">ISO 14001 & Manufatura 3D</span>
                    </div>
                    <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Baixar Relatório
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-slate-800 backdrop-blur z-40 px-2 py-2">
        <div className="flex justify-around items-center">
          <button
            onClick={() => setCurrentTab('hub3d')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
              currentTab === 'hub3d' ? 'text-blue-400' : 'text-slate-400'
            }`}>
            <Printer className="w-5 h-5" />
            <span>Hub 3D</span>
          </button>

          <button
            onClick={() => setCurrentTab('scanner')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
              currentTab === 'scanner' ? 'text-blue-400' : 'text-slate-400'
            }`}>
            <Cpu className="w-5 h-5" />
            <span>Diagnóstico</span>
          </button>

          <button
            onClick={() => setCurrentTab('catalog')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
              currentTab === 'catalog' ? 'text-blue-400' : 'text-slate-400'
            }`}>
            <Box className="w-5 h-5" />
            <span>Catálogo</span>
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium ${
              currentTab === 'dashboard' ? 'text-blue-400' : 'text-slate-400'
            }`}>
            <BarChart3 className="w-5 h-5" />
            <span>Indicadores</span>
          </button>
        </div>
      </div>

      {/* MODAL DE SUCESSO DO PEDIDO DE IMPRESSÃO */}
      {showOrderSuccessModal && orderSummary && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-lg text-white">Ordem 3D Enviada com Sucesso!</h3>
              <p className="text-xs text-slate-400 mt-1">
                A ordem de fabricação foi adicionada à fila do hub e o ficheiro CAD foi enviado para o fatiador.
              </p>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Peça:</span>
                <span className="font-bold text-slate-200">{orderSummary.partName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Polímero Selecionado:</span>
                <span className="font-semibold text-cyan-400">{orderSummary.material}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Massa Aliviada:</span>
                <span className="font-bold text-emerald-400">-{orderSummary.weightSaved} kg</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Destino:</span>
                <span className="font-mono text-slate-300">{orderSummary.printerAssigned}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowOrderSuccessModal(false);
                setCurrentTab('hub3d');
              }}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition">
              Acompanhar na Fila do Hub 3D
            </button>
          </div>
        </div>
      )}
    </div>
  );
}