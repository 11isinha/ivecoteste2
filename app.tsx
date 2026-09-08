import React, { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  Leaf,
  Sparkles,
  PackageCheck,
  RefreshCw,
  Camera,
  ScanLine,
  PlusCircle,
  Bell,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight,
  X,
  ShieldCheck,
  MapPin,
  Printer,
  Thermometer,
  Wrench,
  Layers,
  Eye,
  XCircle
} from 'lucide-react';

// --- DADOS INICIAIS ROBUSTOS ---
const INITIAL_STOCK = [
  { 
    id: '1', 
    name: 'ALAVANCA COMANDO VALVULA IVECO STRALIS', 
    code: '425141', 
    status: 'Disponível', 
    quantity: 2,
    condition: 'Recuperável',
    year: 2024,
    location: 'Almoxarifado B – Prateleira 04 – Gaveta 12',
    compatibility: 'IVECO S-WAY / STRALIS',
    material: 'PA12-CF (Reforçado Fibra de Carbono)',
    images: [
      'https://perimpecas.com.br/fotos/425141.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrURse1orkGDX9fJPsbo4i67fbuRuMEYqbjxKKfQB3cV07ios1kNFhhME&s=10'
    ]
  },
  { 
    id: '2', 
    name: 'Engrenagem do Acionamento de Acessórios', 
    code: 'IVE-SUP-881', 
    status: 'Disponível', 
    quantity: 5,
    condition: 'Novo 3D Homologado',
    year: 2026,
    location: 'Almoxarifado A – Prateleira 01 – Gaveta 03',
    compatibility: 'IVECO S-WAY / TECTOR',
    material: 'PEEK Alta Resistência Termal',
    images: [
      'https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg'
    ]
  },
  { 
    id: '3', 
    name: 'Coletor de Admissão Secundário', 
    code: 'IVE-COL-009', 
    status: 'Indisponível', 
    quantity: 0,
    condition: 'Aguardando Impressão',
    year: 2025,
    location: 'Hub 3D - Fila de Produção',
    compatibility: 'IVECO DAILY / HI-WAY',
    material: 'PA12-CF',
    images: [
      'https://images.tcdn.com.br/img/img_prod/834811/coletor_admissao_secundario_palio_brava_1_6_16v_1993_a_2000_46541292_original_19829_3_a7323bef4fa578e0110a05364d9255fb.jpeg'
    ]
  }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-8821', part: 'Suporte do Tampão de Óleo', status: 'Aguardando Aprovação', requestedBy: 'IVECO Campinas', date: 'Hoje, 10:30' },
  { id: 'REQ-8820', part: 'Coletor de Ar Secundário', status: 'Aprovado para Envio', requestedBy: 'IVECO BH', date: 'Ontem' },
  { id: 'REQ-8819', part: 'Módulo de Injeção Eletrônica', status: 'Em Análise de Viabilidade', requestedBy: 'SP - Anchieta', date: '04 de Set' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'esg' | 'ai' | 'stock' | 'requests' | 'scanner' | 'hub3d'>('dashboard');

  // Estados dos Dados
  const [stockList, setStockList] = useState(INITIAL_STOCK);
  const [requestList, setRequestList] = useState(INITIAL_REQUESTS);
  const [stockFilter, setStockFilter] = useState<'Todos' | 'Disponível' | 'Indisponível'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais e Alertas
  const [showCadastrarModal, setShowCadastrarModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detalhes da Peça Selecionada
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Estados do Scanner e Câmera WebRTC Real
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Formulário de Cadastro Rápido de Peça (TOTALMENTE FUNCIONAL)
  const [newPartName, setNewPartName] = useState('');
  const [newPartCode, setNewPartCode] = useState('');
  const [newPartStatus, setNewPartStatus] = useState('Disponível');
  const [newPartQuantity, setNewPartQuantity] = useState('1');
  const [newPartLocation, setNewPartLocation] = useState('Almoxarifado Principal');
  const [newPartImageUrl, setNewPartImageUrl] = useState('');

  // Hub 3D & Fila de Impressão
  const [printQueue, setPrintQueue] = useState([
    { id: 'Q-101', name: 'Suporte Tampão Óleo Motor', material: 'PA12-CF', timeEst: '45 min', requestedBy: 'IVECO Campinas' },
    { id: 'Q-102', name: 'Coletor de Ar Secundário', material: 'PEEK', timeEst: '1h 20m', requestedBy: 'IVECO SP - Anchieta' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cadastrar Nova Peça no Estoque
  const handleCadastrarPeca = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    const newPart = {
      id: String(Date.now()),
      name: newPartName.toUpperCase(),
      code: newPartCode.trim() || `IVE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: newPartStatus,
      quantity: Number(newPartQuantity) || 1,
      condition: 'Novo Cadastrado',
      year: new Date().getFullYear(),
      location: newPartLocation,
      compatibility: 'IVECO Frota Pesada',
      material: 'PA12-CF Polímero Reforçado',
      images: [
        newPartImageUrl.trim() || 'https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg'
      ]
    };

    setStockList([newPart, ...stockList]);
    setShowCadastrarModal(false);
    setNewPartName('');
    setNewPartCode('');
    setNewPartQuantity('1');
    setNewPartImageUrl('');
    triggerToast(`Peça "${newPart.name}" cadastrada com sucesso no estoque!`);
  };

  // Câmera WebRTC
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError('Permissão de câmera negada ou dispositivo indisponível.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleRunScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        name: 'SENSOR DE PRESSÃO DO RAIL COMMON',
        code: 'IVE-SNS-440',
        condition: 'Desgaste moderado (Recuperável via 3D)',
        material: 'PA12-CF',
        co2Savings: '14.2 kg CO₂',
        timeToPrint: '45 min'
      });
      stopCamera();
    }, 2200);
  };

  const sendTo3DPrinter = (partName: string) => {
    setPrintQueue(prev => [
      ...prev,
      {
        id: `Q-${Date.now().toString().slice(-3)}`,
        name: partName,
        material: 'PA12-CF',
        timeEst: '55 min',
        requestedBy: 'IVECO Oficina SP'
      }
    ]);
    triggerToast(`Peça "${partName}" enviada para a fila de Impressão 3D!`);
    setActiveTab('hub3d');
  };

  // Filtro do Estoque
  const filteredStock = stockList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (stockFilter === 'Todos') return matchesSearch;
    return matchesSearch && item.status === stockFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex font-sans antialiased">

      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= SIDEBAR LATERAL ================= */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="bg-blue-600 font-black text-white text-base px-2.5 py-1 rounded tracking-tighter shadow-lg shadow-blue-600/30">
              IVECO
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1">
                ECOOFICINA <span className="text-emerald-400 text-xs">4.0</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">REDE BRASIL DE REUSO</p>
            </div>
          </div>

          <div className="p-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-200">IVECO São Paulo</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Matriz</span>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-xs">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Principal</div>

            <button
              onClick={() => { setActiveTab('dashboard'); stopCamera(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Início / Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab('esg'); stopCamera(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'esg' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Impacto ESG & CO₂</span>
            </button>

            <button
              onClick={() => { setActiveTab('ai'); stopCamera(); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'ai' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Oportunidades IA</span>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">NOVO</span>
            </button>

            <div className="px-3 pt-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gestão & Produção</div>

            <button
              onClick={() => { setActiveTab('stock'); stopCamera(); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4" />
                <span>Estoque de Peças</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{stockList.length}</span>
            </button>

            <button
              onClick={() => { setActiveTab('hub3d'); stopCamera(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'hub3d' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Hub Impressão 3D</span>
            </button>

            <button
              onClick={() => { setActiveTab('requests'); stopCamera(); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'requests' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <RefreshCw className="w-4 h-4" />
              <span>Solicitações de Troca</span>
            </button>

            <div className="px-3 pt-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Inovação</div>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'scanner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <ScanLine className="w-4 h-4 text-cyan-400" />
              <span>Escanear Peça / IA</span>
            </button>
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                AM
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">Adriano M.</p>
                <p className="text-[10px] text-slate-400">Gerente Técnico</p>
              </div>
            </div>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </aside>

      {/* ================= CONTEÚDO PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* HEADER */}
        <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-200">Oficina IVECO • <span className="text-emerald-400">Gestão 4.0</span></h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setShowNotificationModal(true); setNotificationCount(0); }}
              className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition text-slate-300">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* BOTÃO CADASTRAR PEÇA */}
            <button
              onClick={() => setShowCadastrarModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
              <PlusCircle className="w-4 h-4" />
              <span>+ Cadastrar Peça</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-emerald-400" />
              <span>Escanear</span>
            </button>
          </div>
        </header>

        {/* CORPO DINÂMICO */}
        <main className="p-4 md:p-6 space-y-6 max-w-6xl w-full mx-auto">

          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Rede Conectada IVECO</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">Bem-vindo, Adriano!</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Estoque digital, manufatura aditiva e sustentabilidade integrados.</p>
                </div>
                <button
                  onClick={() => setActiveTab('stock')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5">
                  <span>Ver Estoque da Unidade</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* CARDS DE INDICADORES */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>Peças no Estoque</span>
                    <PackageCheck className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-bold text-white">{stockList.length}</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>Disponíveis</span>
                    <RefreshCw className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">
                    {stockList.filter(s => s.status === 'Disponível').length}
                  </p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>CO₂ Evitado</span>
                    <Leaf className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-emerald-400">1.250 kg</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="flex justify-between items-center text-slate-400 text-xs font-medium">
                    <span>Solicitações da Rede</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-bold text-amber-400">{requestList.length}</p>
                </div>
              </div>

              {/* DESTAQUE DE PEÇAS RECENTES */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-emerald-400" /> Peças em Destaque no Estoque
                  </h3>
                  <button onClick={() => setActiveTab('stock')} className="text-xs text-emerald-400 hover:underline">
                    Ver Catálogo Completo →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {stockList.slice(0, 3).map(item => (
                    <div 
                      key={item.id} 
                      onClick={() => { setSelectedPart(item); setActiveImageIdx(0); }}
                      className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex gap-3 items-center hover:border-emerald-500/50 cursor-pointer transition">
                      <img src={item.images[0]} alt={item.name} className="w-14 h-14 object-cover rounded-lg shrink-0 border border-slate-800" />
                      <div className="overflow-hidden">
                        <p className="font-bold text-xs text-slate-200 truncate">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">CÓD: {item.code}</p>
                        <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {item.status} ({item.quantity} un)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. ESTOQUE DE PEÇAS (TOTALMENTE FUNCIONAL E COM CADASTRO) */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h2 className="font-bold text-base text-white">Estoque da Unidade - São Paulo</h2>
                  <p className="text-xs text-slate-400">Consulte, cadastre e gerencie componentes da oficina.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                    {(['Todos', 'Disponível', 'Indisponível'] as const).map(f => (
                      <button
                        key={f}
                        onClick={() => setStockFilter(f)}
                        className={`px-3 py-1 rounded-md transition ${
                          stockFilter === f ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
                        }`}>
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowCadastrarModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Nova Peça</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nome da peça ou código..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* LISTA DE ESTOQUE EM CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredStock.length > 0 ? (
                  filteredStock.map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition">
                      <div>
                        <div className="relative aspect-video bg-slate-950 overflow-hidden">
                          <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                          <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Disponível' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="p-4 space-y-2">
                          <h4 className="font-bold text-xs text-white leading-snug">{item.name}</h4>
                          <p className="text-[10px] font-mono text-emerald-400">Código: {item.code}</p>

                          <div className="space-y-1 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                            <p><strong className="text-slate-300">Qtd:</strong> {item.quantity} un.</p>
                            <p className="truncate"><strong className="text-slate-300">Local:</strong> {item.location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex gap-2">
                        <button 
                          onClick={() => { setSelectedPart(item); setActiveImageIdx(0); }} 
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1 border border-slate-700">
                          <Eye className="w-3.5 h-3.5" /> Detalhes
                        </button>
                        <button 
                          onClick={() => sendTo3DPrinter(item.name)} 
                          className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 font-bold text-xs px-3 py-2 rounded-xl transition">
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-12 text-center text-slate-500 text-xs bg-slate-900 border border-slate-800 rounded-xl">
                    Nenhuma peça encontrada. Clique em "+ Cadastrar Peça" para adicionar novos itens ao estoque.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. HUB DE IMPRESSÃO 3D */}
          {activeTab === 'hub3d' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Printer className="w-5 h-5 text-blue-400" /> Hub de Manufatura Aditiva On-Demand
                </h3>
                <p className="text-xs text-slate-400">Monitoramento de células industriais e fila de produção de polímeros reforçados.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-xs text-white">Impressora 3D #01 (Industrial PEEK)</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 inline-block">
                    Imprimindo
                  </span>
                  <div className="space-y-1 text-[10px] text-slate-400 font-mono">
                    <div className="flex justify-between"><span>Progresso:</span><span>74%</span></div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-blue-500 w-[74%]"></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                  <h4 className="font-bold text-xs text-white">Impressora 3D #02 (PA12-CF Heavy)</h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 inline-block">
                    Disponível
                  </span>
                  <p className="text-[11px] text-slate-400">Pronta para receber novos arquivos CAD da rede.</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                <h4 className="font-bold text-xs text-white mb-3">Fila de Produção Atual</h4>
                <div className="space-y-2">
                  {printQueue.map((item, idx) => (
                    <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-200">{idx + 1}. {item.name}</p>
                        <p className="text-[10px] text-slate-400">Material: <span className="text-cyan-400">{item.material}</span> • Solicitante: {item.requestedBy}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          {item.timeEst}
                        </span>
                        <button onClick={() => setPrintQueue(printQueue.filter(q => q.id !== item.id))} className="text-red-400 hover:text-red-300">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. IMPACTO ESG & CO2 */}
          {activeTab === 'esg' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Leaf className="w-4 h-4" />
                  <span>Sustentabilidade & ESG IVECO</span>
                </div>
                <h2 className="text-xl font-extrabold text-white">Economia Circular & Redução de Impacto</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-xs">CO₂ Evitado Acumulado</span>
                    <p className="text-3xl font-black text-emerald-400">1.250 kg</p>
                    <p className="text-[11px] text-slate-500">Equivalente a plantar 88 árvores na região.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-xs">Peças Reutilizadas</span>
                    <p className="text-3xl font-black text-white">87 un.</p>
                    <p className="text-[11px] text-slate-500">Evitando descarte prematuro de metal.</p>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 text-xs">Taxa de Reaproveitamento</span>
                    <p className="text-3xl font-black text-cyan-400">78%</p>
                    <p className="text-[11px] text-slate-500">Meta IVECO superada com sucesso.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. OPORTUNIDADES IA */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Inteligência da Rede IVECO</span>
                </div>
                <h2 className="text-base font-bold text-white">Oportunidades de Troca Inteligente</h2>
                <p className="text-xs text-slate-400 mt-1">A IA identificou peças paradas em outras concessionárias para reparos locais.</p>
              </div>

              <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded text-[10px]">RECOMENDADO</span>
                  <h3 className="font-bold text-white text-sm mt-1">Farol Direito Full LED Matrix</h3>
                  <p className="text-slate-400">Disponível na unidade <b>IVECO Curitiba</b>.</p>
                </div>
                <button 
                  onClick={() => {
                    setRequestList([{ id: `REQ-${Math.floor(1000+Math.random()*9000)}`, part: 'Farol LED Matrix', status: 'Solicitada', requestedBy: 'IVECO Curitiba', date: 'Agora' }, ...requestList]);
                    triggerToast('Solicitação enviada para Curitiba!');
                  }}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg font-bold">
                  Solicitar Peça
                </button>
              </div>
            </div>
          )}

          {/* 6. SCANNER & VISÃO POR IA */}
          {activeTab === 'scanner' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Camera className="w-5 h-5 text-emerald-400" /> Diagnóstico por Visão Computacional
                </h3>
                <p className="text-xs text-slate-400 mb-6">Aponte a câmera para a peça danificada para avaliar rachaduras e sugerir fabricação 3D.</p>

                <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center mb-4">
                  {cameraActive ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6 space-y-3">
                      <ScanLine className="w-12 h-12 text-slate-600 mx-auto animate-pulse" />
                      <p className="text-xs text-slate-400">Câmera desativada. Clique para iniciar.</p>
                    </div>
                  )}

                  {isScanning && (
                    <div className="absolute inset-0 bg-emerald-950/70 border-2 border-emerald-400 flex flex-col items-center justify-center backdrop-blur-sm z-20">
                      <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mb-2" />
                      <p className="text-xs font-bold text-white">Identificando geometria via Inteligência Artificial...</p>
                    </div>
                  )}
                </div>

                {cameraError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-xs text-red-400">{cameraError}</div>}

                <div className="flex gap-3 justify-center">
                  {!cameraActive ? (
                    <button onClick={startCamera} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2">
                      <Camera className="w-4 h-4" /> Ligar Câmera
                    </button>
                  ) : (
                    <>
                      <button onClick={handleRunScan} disabled={isScanning} className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl transition flex items-center gap-2">
                        <ScanLine className="w-4 h-4" /> Escanear Peça
                      </button>
                      <button onClick={stopCamera} className="bg-slate-800 text-slate-300 font-bold text-xs px-4 py-3 rounded-xl">Desligar</button>
                    </>
                  )}
                </div>
              </div>

              {scannedResult && (
                <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4 text-xs">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="font-bold text-sm text-white">{scannedResult.name}</h4>
                      <p className="text-[11px] font-mono text-emerald-400">CÓDIGO: {scannedResult.code}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">Reconhecido</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Diagnóstico:</span>
                      <span className="font-semibold text-slate-200">{scannedResult.condition}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Material:</span>
                      <span className="font-semibold text-cyan-400">{scannedResult.material}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      const newP = {
                        id: String(Date.now()),
                        name: scannedResult.name,
                        code: scannedResult.code,
                        status: 'Disponível',
                        quantity: 1,
                        condition: 'Escaneado via IA',
                        year: 2026,
                        location: 'Almoxarifado Principal',
                        compatibility: 'Frota IVECO',
                        material: scannedResult.material,
                        images: ['https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg']
                      };
                      setStockList([newP, ...stockList]);
                      setScannedResult(null);
                      setActiveTab('stock');
                      triggerToast('Peça escaneada e salva no estoque com sucesso!');
                    }} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Salvar Peça no Estoque Imediatamente
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 7. SOLICITAÇÕES DE TROCA */}
          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h2 className="font-bold text-base text-white">Solicitações de Troca na Rede</h2>
                <p className="text-xs text-slate-400 mt-0.5">Pedidos de transferência de peças entre unidades IVECO.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl divide-y divide-slate-800/80 text-xs">
                {requestList.map(req => (
                  <div key={req.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-500">{req.id}</span>
                      <h4 className="font-bold text-slate-200 text-sm mt-0.5">{req.part}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Solicitado por: <b>{req.requestedBy}</b> • {req.date}</p>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-semibold">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL CADASTRAR NOVA PEÇA (TOTALMENTE FUNCIONAL) ================= */}
      {showCadastrarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Cadastrar Nova Peça no Estoque
              </h3>
              <button onClick={() => setShowCadastrarModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarPeca} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Nome do Componente / Peça *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Bomba de Alta Pressão Common Rail"
                  value={newPartName}
                  onChange={e => setNewPartName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Código IVECO</label>
                  <input
                    type="text"
                    placeholder="Ex: IVE-9921"
                    value={newPartCode}
                    onChange={e => setNewPartCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartQuantity}
                    onChange={e => setNewPartQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Localização no Almoxarifado</label>
                <input
                  type="text"
                  placeholder="Ex: Prateleira 02 - Gaveta 05"
                  value={newPartLocation}
                  onChange={e => setNewPartLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Link da Imagem (Opcional)</label>
                <input
                  type="url"
                  placeholder="https://exemplo.com/foto-peca.jpg"
                  value={newPartImageUrl}
                  onChange={e => setNewPartImageUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Status do Item</label>
                <select
                  value={newPartStatus}
                  onChange={e => setNewPartStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500">
                  <option value="Disponível">Disponível para Troca / Uso</option>
                  <option value="Indisponível">Em Uso / Indisponível</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCadastrarModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-950">
                  Cadastrar Peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL DETALHES DA PEÇA ================= */}
      {selectedPart && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-xl space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white">Detalhes do Componente</h3>
              <button onClick={() => setSelectedPart(null)} className="text-slate-400 hover:text-white font-bold text-xs bg-slate-800 px-3 py-1 rounded-lg">Fechar [X]</button>
            </div>

            <div className="relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img src={selectedPart.images[activeImageIdx]} alt="Peça" className="w-full h-full object-cover" />
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
              <div>
                <h4 className="font-extrabold text-sm text-white uppercase">{selectedPart.name}</h4>
                <p className="text-[11px] font-mono text-emerald-400">Código: {selectedPart.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-b border-slate-800 py-3">
                <div><span className="text-slate-500 block text-[10px]">STATUS</span><span className="font-bold text-emerald-400">{selectedPart.status}</span></div>
                <div><span className="text-slate-500 block text-[10px]">QUANTIDADE</span><span className="font-bold text-slate-200">{selectedPart.quantity} unidades</span></div>
                <div><span className="text-slate-500 block text-[10px]">CONDIÇÃO</span><span className="font-bold text-slate-200">{selectedPart.condition}</span></div>
                <div><span className="text-slate-500 block text-[10px]">LOCAL</span><span className="font-bold text-slate-200">{selectedPart.location}</span></div>
              </div>
            </div>

            <button 
              onClick={() => { sendTo3DPrinter(selectedPart.name); setSelectedPart(null); }} 
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl transition flex items-center justify-center gap-2">
              <Printer className="w-4 h-4" /> Solicitar Réplica no Hub 3D
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL NOTIFICAÇÕES ================= */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" /> Notificações
              </h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <p className="font-bold text-slate-200">Peça Aprovada para Envio</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sua solicitação de Módulo foi aceita.</p>
              </div>
            </div>
            <button onClick={() => setShowNotificationModal(false)} className="w-full py-2 bg-slate-800 text-slate-200 font-bold text-xs rounded-xl">Fechar</button>
          </div>
        </div>
      )}

    </div>
  );
}