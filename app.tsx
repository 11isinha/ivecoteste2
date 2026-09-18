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
  XCircle,
  Network,
  SendHorizontal,
  Building2,
  Share2
} from 'lucide-react';

// --- DADOS DO ESTOQUE LOCAL ---
const INITIAL_STOCK = [
  { 
    id: '1', 
    name: 'ALAVANCA COMANDO VALVULA IVECO STRALIS', 
    code: '425141', 
    status: 'Disponível', 
    quantity: 2,
    condition: 'Recuperável',
    year: 2024,
    unit: 'IVECO São Paulo (Sua Unidade)',
    location: 'Almoxarifado B – Prateleira 04 – Gaveta 12',
    compatibility: 'IVECO S-WAY / STRALIS',
    material: 'PA12-CF (Reforçado Fibra de Carbono)',
    images: [
      'https://perimpecas.com.br/fotos/425141.jpg'
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
    unit: 'IVECO São Paulo (Sua Unidade)',
    location: 'Almoxarifado A – Prateleira 01 – Gaveta 03',
    compatibility: 'IVECO S-WAY / TECTOR',
    material: 'PEEK Alta Resistência Termal',
    images: [
      'https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg'
    ]
  }
];

// --- ESTOQUE INTEGRADO DAS OUTRAS CONCESSIONÁRIAS DA REDE IVECO ---
const NETWORK_STOCK = [
  {
    id: 'NET-101',
    name: 'Bomba de Injeção Alta Pressão Common Rail',
    code: 'IVE-INJ-990',
    unit: 'IVECO Concessionária Campinas',
    quantity: 1,
    status: 'Disponível na Rede',
    condition: 'Recondicionado Homologado',
    location: 'Almoxarifado Central - Prateleira 02',
    compatibility: 'IVECO STRALIS / HI-WAY',
    material: 'Aço Forjado / Valvulado',
    images: [
      'https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg'
    ]
  },
  {
    id: 'NET-102',
    name: 'Farol Dianteiro Direiro Full LED Matrix',
    code: 'IVE-LED-303',
    unit: 'IVECO Concessionária Curitiba',
    quantity: 3,
    status: 'Disponível na Rede',
    condition: 'Seminovo Testado',
    location: 'Setor Eletrônico - A3',
    compatibility: 'IVECO S-WAY',
    material: 'Policarbonato / LED',
    images: [
      'https://perimpecas.com.br/fotos/425141.jpg'
    ]
  },
  {
    id: 'NET-103',
    name: 'Módulo Eletrônico de Controle de Freio ABS',
    code: 'IVE-ABS-404',
    unit: 'IVECO Concessionária Belo Horizonte',
    quantity: 2,
    status: 'Disponível na Rede',
    condition: 'Novo em Estoque',
    location: 'Prateleira E-1',
    compatibility: 'IVECO DAILY / TECTOR',
    material: 'Alumínio / Placa SMD',
    images: [
      'https://images.tcdn.com.br/img/img_prod/834811/coletor_admissao_secundario_palio_brava_1_6_16v_1993_a_2000_46541292_original_19829_3_a7323bef4fa578e0110a05364d9255fb.jpeg'
    ]
  }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-8821', part: 'Suporte do Tampão de Óleo', status: 'Aguardando Aprovação', requestedBy: 'IVECO Campinas', date: 'Hoje, 10:30' },
  { id: 'REQ-8820', part: 'Coletor de Ar Secundário', status: 'Aprovado para Envio', requestedBy: 'IVECO BH', date: 'Ontem' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'esg' | 'ai' | 'stock' | 'requests' | 'scanner' | 'hub3d'>('dashboard');

  // Controle de visão dentro da aba Estoque (Local vs Rede Inteira)
  const [stockScope, setStockScope] = useState<'local' | 'network'>('local');

  // Estados dos Dados
  const [stockList, setStockList] = useState(INITIAL_STOCK);
  const [networkStockList, setNetworkStockList] = useState(NETWORK_STOCK);
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

  // Câmera WebRTC
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Cadastrar Nova Peça
  const [newPartName, setNewPartName] = useState('');
  const [newPartCode, setNewPartCode] = useState('');
  const [newPartQuantity, setNewPartQuantity] = useState('1');
  const [newPartLocation, setNewPartLocation] = useState('Almoxarifado Principal');

  // Hub 3D
  const [printQueue, setPrintQueue] = useState([
    { id: 'Q-101', name: 'Suporte Tampão Óleo Motor', material: 'PA12-CF', timeEst: '45 min', requestedBy: 'IVECO Campinas' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSolicitarPecaRede = (item: any) => {
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      part: item.name,
      status: 'Solicitado via Rede',
      requestedBy: item.unit,
      date: 'Agora'
    };
    setRequestList([newReq, ...requestList]);
    triggerToast(`Solicitação da peça "${item.name}" enviada para ${item.unit}!`);
  };

  const handleCadastrarPeca = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName.trim()) return;

    const newPart = {
      id: String(Date.now()),
      name: newPartName.toUpperCase(),
      code: newPartCode.trim() || `IVE-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Disponível',
      quantity: Number(newPartQuantity) || 1,
      condition: 'Novo Cadastrado',
      year: new Date().getFullYear(),
      unit: 'IVECO São Paulo (Sua Unidade)',
      location: newPartLocation,
      compatibility: 'IVECO Frota Pesada',
      material: 'PA12-CF Polímero Reforçado',
      images: ['https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg']
    };

    setStockList([newPart, ...stockList]);
    setShowCadastrarModal(false);
    setNewPartName('');
    setNewPartCode('');
    triggerToast(`Peça "${newPart.name}" cadastrada com sucesso!`);
  };

  // Câmera Controls
  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch (err) {
      setCameraError('Não foi possível acessar a câmera. Verifique as permissões.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        name: 'SUPORTE TAMPÃO ÓLEO MOTOR',
        code: 'IVE-904-82',
        status: 'Reaproveitável / Recuperável',
        material: 'PA12-CF (Poliamida Carbono)',
        recuperabilidade: '94%',
        recomendacao: 'Disponível para redesign e impressão 3D em caso de desgaste acelerado.'
      });
      stopCamera();
    }, 2000);
  };

  const currentDisplayList = stockScope === 'local' ? stockList : networkStockList;

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex font-sans antialiased">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-300 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR */}
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

          <nav className="p-3 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Início / Dashboard</span>
            </button>

            {/* ABA DE ESTOQUE COMPLETO (LOCAL + REDE ACESSIBILIDADE) */}
            <button
              onClick={() => setActiveTab('stock')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4" />
                <span>Gestão de Estoque</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{stockList.length + networkStockList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'scanner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Camera className="w-4 h-4 text-emerald-400" />
              <span>Scanner Visão Computacional</span>
            </button>

            <button
              onClick={() => setActiveTab('hub3d')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'hub3d' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Hub de Impressão 3D</span>
            </button>

            <button
              onClick={() => setActiveTab('esg')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'esg' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Leaf className="w-4 h-4 text-emerald-400" />
              <span>Indicadores ESG IVECO</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'requests' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4" />
                <span>Solicitações de Troca</span>
              </div>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-bold">{requestList.length}</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-200">Oficina IVECO • <span className="text-emerald-400">Plataforma Circular</span></h2>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowNotificationModal(!showNotificationModal)} 
              className="relative bg-slate-800 p-2 rounded-xl text-slate-300 hover:text-white transition">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            <button onClick={() => setShowCadastrarModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
              <PlusCircle className="w-4 h-4" /> Cadastrar Peça Local
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 space-y-6 max-w-6xl w-full mx-auto">
          {/* DASHBOARD PRINCIPAL */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Economia Circular em Tempo Real
                  </span>
                  <h1 className="text-xl font-extrabold text-white mt-1">Concessionárias IVECO Conectadas</h1>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl">
                    Sua unidade está integrada com a rede nacional IVECO. Compartilhe peças, reduza descarte de metal e encomende peças impressas em 3D.
                  </p>
                </div>
                <button onClick={() => setActiveTab('stock')} className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl transition flex items-center gap-2">
                  <span>Ver Estoque Completo</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* CARDS DE KPIS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Peças Cadastradas Locais</p>
                  <p className="text-2xl font-black text-white mt-1">{stockList.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-[10px] font-bold uppercase text-blue-400 flex items-center gap-1">
                    <Network className="w-3 h-3" /> Peças na Rede IVECO
                  </p>
                  <p className="text-2xl font-black text-blue-400 mt-1">{networkStockList.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Solicitações Ativas</p>
                  <p className="text-2xl font-black text-amber-400 mt-1">{requestList.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">CO2 Evitado na Rede</p>
                  <p className="text-2xl font-black text-emerald-400 mt-1">142.8 kg</p>
                </div>
              </div>
            </div>
          )}

          {/* ABA DE ESTOQUE (AGORA INTEGRANDO ESTOQUE LOCAL + REDE IVECO) */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              {/* SELETOR NO CORAÇÃO DO ESTOQUE: ALTERNE ENTRE LOCAL E REDE */}
              <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setStockScope('local')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                      stockScope === 'local' 
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-400 hover:text-white'
                    }`}>
                    <Building2 className="w-4 h-4" />
                    <span>Estoque Local (Sua Unidade)</span>
                    <span className="bg-slate-900/60 px-2 py-0.5 rounded text-[10px]">{stockList.length}</span>
                  </button>

                  <button
                    onClick={() => setStockScope('network')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                      stockScope === 'network' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                        : 'text-slate-400 hover:text-white'
                    }`}>
                    <Network className="w-4 h-4" />
                    <span>Rede IVECO Integrada (Outras Unidades)</span>
                    <span className="bg-blue-500/30 px-2 py-0.5 rounded text-[10px] text-blue-200">{networkStockList.length}</span>
                  </button>
                </div>

                {stockScope === 'network' && (
                  <span className="text-[11px] text-blue-400 font-medium px-3 py-1 bg-blue-500/10 rounded-xl border border-blue-500/20 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5" /> Peças disponíveis para transferência direta inter-concessionárias
                  </span>
                )}
              </div>

              {/* BARRA DE PESQUISA E FILTROS */}
              <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder={stockScope === 'local' ? "Pesquisar no seu estoque local por nome, código ou localização..." : "Buscar peças disponíveis em Campinas, BH, Curitiba..."}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                  />
                </div>
              </div>

              {/* LISTA DE PEÇAS (EXIBE CONFORME A SELEÇÃO LOCAL OU REDE) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDisplayList
                  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition">
                      <div className="flex gap-4">
                        <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              stockScope === 'local' 
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {item.unit}
                            </span>
                            <span className="text-xs font-bold text-slate-300">{item.quantity} un.</span>
                          </div>
                          <h3 className="font-bold text-xs text-white truncate">{item.name}</h3>
                          <p className="text-[10px] font-mono text-slate-400">CÓD: {item.code}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-500" /> {item.location}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">{item.compatibility}</span>
                        
                        {stockScope === 'network' ? (
                          <button
                            onClick={() => handleSolicitarPecaRede(item)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                            <SendHorizontal className="w-3.5 h-3.5" />
                            <span>Solicitar Transferência</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedPart(item)}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl transition flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Ver Detalhes</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* SCANNER COM VISÃO COMPUTACIONAL */}
          {activeTab === 'scanner' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 text-center max-w-2xl mx-auto">
              <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Identificação Automática de Peças Danificadas</span>
              </h3>
              <p className="text-xs text-slate-400">Aponte a câmera para a peça para verificar recuperabilidade e compatibilidade no estoque local ou da rede IVECO.</p>

              <div className="relative bg-slate-950 rounded-xl border border-slate-800 h-64 flex items-center justify-center overflow-hidden">
                {cameraActive ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-2">
                    <ScanLine className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
                    <p className="text-xs text-slate-500">Câmera desligada</p>
                  </div>
                )}
              </div>

              <div className="flex justify-center gap-3">
                {!cameraActive ? (
                  <button onClick={startCamera} className="bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl">Ligar Câmera</button>
                ) : (
                  <>
                    <button onClick={handleSimulateScan} disabled={isScanning} className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl">
                      {isScanning ? 'Analisando Estrutura...' : 'Escanear Peça'}
                    </button>
                    <button onClick={stopCamera} className="bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl">Desligar</button>
                  </>
                )}
              </div>

              {scannedResult && (
                <div className="bg-slate-950 border border-emerald-500/30 p-4 rounded-xl text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-400">{scannedResult.name}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">Índice Reuso: {scannedResult.recuperabilidade}</span>
                  </div>
                  <p className="text-slate-400">Material: {scannedResult.material}</p>
                  <p className="text-slate-300">{scannedResult.recomendacao}</p>
                </div>
              )}
            </div>
          )}

          {/* HUB IMPRESSÃO 3D */}
          {activeTab === 'hub3d' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-400" /> Fila de Fabricação Aditiva 3D
              </h3>
              <div className="space-y-2">
                {printQueue.map(q => (
                  <div key={q.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-200">{q.name}</p>
                      <p className="text-[10px] text-slate-500">Material: {q.material} • Solicitante: {q.requestedBy}</p>
                    </div>
                    <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/20">
                      Est. {q.timeEst}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RELATÓRIOS ESG */}
          {activeTab === 'esg' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Leaf className="w-4 h-4 text-emerald-400" /> Impacto Ambiental Integrado da Rede
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">Metal Reaproveitado (Rede)</span>
                  <p className="text-xl font-bold text-emerald-400">384.5 kg</p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400">Redução na Pegada de Frete</span>
                  <p className="text-xl font-bold text-blue-400">-42% Km rodados em logística</p>
                </div>
              </div>
            </div>
          )}

          {/* SOLICITAÇÕES DE TROCA */}
          {activeTab === 'requests' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400" /> Fila de Solicitações e Transferências
              </h3>
              <div className="space-y-2">
                {requestList.map(req => (
                  <div key={req.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-white">{req.part}</p>
                      <p className="text-[10px] text-slate-400">Unidade: {req.requestedBy} • {req.date}</p>
                    </div>
                    <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold px-2.5 py-1 rounded-full">
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL DE CADASTRO DE PEÇA LOCAL */}
      {showCadastrarModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">Cadastrar Peça no Estoque Local</h3>
              <button onClick={() => setShowCadastrarModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCadastrarPeca} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Nome do Componente</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: COLETOR DE ADMISSÃO"
                  value={newPartName}
                  onChange={e => setNewPartName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Código IVECO</label>
                <input
                  type="text"
                  placeholder="Ex: IVE-4002"
                  value={newPartCode}
                  onChange={e => setNewPartCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={newPartQuantity}
                    onChange={e => setNewPartQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Localização</label>
                  <input
                    type="text"
                    value={newPartLocation}
                    onChange={e => setNewPartLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition mt-2">
                Salvar e Disponibilizar no Estoque
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES DA PEÇA */}
      {selectedPart && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">{selectedPart.name}</h3>
              <button onClick={() => setSelectedPart(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <img src={selectedPart.images[0]} alt={selectedPart.name} className="w-full h-40 object-cover rounded-xl border border-slate-800" />
              <p><strong>Código:</strong> {selectedPart.code}</p>
              <p><strong>Unidade de Origem:</strong> {selectedPart.unit}</p>
              <p><strong>Localização Interna:</strong> {selectedPart.location}</p>
              <p><strong>Material:</strong> {selectedPart.material}</p>
              <p><strong>Compatibilidade:</strong> {selectedPart.compatibility}</p>
            </div>

            <button onClick={() => setSelectedPart(null)} className="w-full bg-slate-800 text-slate-200 font-bold py-2 rounded-xl">
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}