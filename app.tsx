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
  Share2,
  Truck,
  PackageOpen,
  Building,
  Phone,
  Mail,
  CircleDot
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
    images: ['https://perimpecas.com.br/fotos/425141.jpg']
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
    images: ['https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg']
  }
];

// --- ESTOQUE INTEGRADO DAS OUTRAS CONCESSIONÁRIAS DA REDE IVECO ---
const NETWORK_STOCK = [
  {
    id: 'NET-101',
    name: 'Bomba de Injeção Alta Pressão Common Rail',
    code: 'IVE-INJ-990',
    unit: 'IVECO Campinas',
    unitCity: 'Campinas - SP',
    distance: '98 km',
    quantity: 1,
    status: 'Disponível na Rede',
    condition: 'Recondicionado Homologado',
    location: 'Almoxarifado Central - Prateleira 02',
    compatibility: 'IVECO STRALIS / HI-WAY',
    material: 'Aço Forjado / Valvulado',
    contact: { phone: '(19) 3251-4400', email: 'campinas@iveco.com.br' },
    images: ['https://images.tcdn.com.br/img/img_prod/920964/engrenagem_do_comando_de_valvula_para_iveco_cursor_8_euro_3_99436187_17565_1_4e7fa24537e2bc9521e272a7a40cdedb.jpg']
  },
  {
    id: 'NET-102',
    name: 'Farol Dianteiro Direito Full LED Matrix',
    code: 'IVE-LED-303',
    unit: 'IVECO Curitiba',
    unitCity: 'Curitiba - PR',
    distance: '408 km',
    quantity: 3,
    status: 'Disponível na Rede',
    condition: 'Seminovo Testado',
    location: 'Setor Eletrônico - A3',
    compatibility: 'IVECO S-WAY',
    material: 'Policarbonato / LED',
    contact: { phone: '(41) 3025-7800', email: 'curitiba@iveco.com.br' },
    images: ['https://perimpecas.com.br/fotos/425141.jpg']
  },
  {
    id: 'NET-103',
    name: 'Módulo Eletrônico de Controle de Freio ABS',
    code: 'IVE-ABS-404',
    unit: 'IVECO Belo Horizonte',
    unitCity: 'Belo Horizonte - MG',
    distance: '586 km',
    quantity: 2,
    status: 'Disponível na Rede',
    condition: 'Novo em Estoque',
    location: 'Prateleira E-1',
    compatibility: 'IVECO DAILY / TECTOR',
    material: 'Alumínio / Placa SMD',
    contact: { phone: '(31) 3298-2200', email: 'bh@iveco.com.br' },
    images: ['https://images.tcdn.com.br/img/img_prod/834811/coletor_admissao_secundario_palio_brava_1_6_16v_1993_a_2000_46541292_original_19829_3_a7323bef4fa578e0110a05364d9255fb.jpeg']
  },
  {
    id: 'NET-104',
    name: 'Turbina do Motor N67 - IVECO Tector',
    code: 'IVE-TRB-707',
    unit: 'IVECO Rio de Janeiro',
    unitCity: 'Rio de Janeiro - RJ',
    distance: '435 km',
    quantity: 1,
    status: 'Disponível na Rede',
    condition: 'Revisado com Laudo',
    location: 'Setor Motor - B2',
    compatibility: 'IVECO TECTOR / DAILY',
    material: 'Liga de Titânio',
    contact: { phone: '(21) 3555-9100', email: 'rio@iveco.com.br' },
    images: ['https://perimpecas.com.br/fotos/425141.jpg']
  },
  {
    id: 'NET-105',
    name: 'Radiador de Água Completo IVECO S-Way',
    code: 'IVE-RAD-215',
    unit: 'IVECO Porto Alegre',
    unitCity: 'Porto Alegre - RS',
    distance: '1.109 km',
    quantity: 2,
    status: 'Disponível na Rede',
    condition: 'Seminovo Testado',
    location: 'Prateleira C-7',
    compatibility: 'IVECO S-WAY',
    material: 'Alumínio / Cobre',
    contact: { phone: '(51) 3222-6600', email: 'poa@iveco.com.br' },
    images: ['https://images.tcdn.com.br/img/img_prod/834811/coletor_admissao_secundario_palio_brava_1_6_16v_1993_a_2000_46541292_original_19829_3_a7323bef4fa578e0110a05364d9255fb.jpeg']
  }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-8821', part: 'Suporte do Tampão de Óleo', status: 'Aguardando Aprovação', requestedBy: 'IVECO Campinas', date: 'Hoje, 10:30', type: 'recebida' },
  { id: 'REQ-8820', part: 'Coletor de Ar Secundário', status: 'Aprovado para Envio', requestedBy: 'IVECO BH', date: 'Ontem', type: 'recebida' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'esg' | 'stock' | 'scanner' | 'hub3d'>('dashboard');

  // Controle de visão dentro de Estoque de Peças (Local vs Rede Inteira)
  const [stockScope, setStockScope] = useState<'local' | 'network'>('local');

  // Estados dos Dados
  const [stockList, setStockList] = useState(INITIAL_STOCK);
  const [networkStockList, setNetworkStockList] = useState(NETWORK_STOCK);
  const [requestList, setRequestList] = useState(INITIAL_REQUESTS);

  const [searchTerm, setSearchTerm] = useState('');

  // Modais e Alertas
  const [showCadastrarModal, setShowCadastrarModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showRequestsModal, setShowRequestsModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detalhes da Peça Selecionada
  const [selectedPart, setSelectedPart] = useState<any | null>(null);
  const [selectedNetworkPart, setSelectedNetworkPart] = useState<any | null>(null);

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

  // 🔹 SOLICITAR PEÇA DA REDE (NOVO)
  const handleSolicitarPecaRede = (item: any) => {
    const newReq = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      part: item.name,
      status: 'Solicitado via Rede',
      requestedBy: item.unit,
      date: 'Agora',
      type: 'enviada'
    };
    setRequestList([newReq, ...requestList]);
    setNotificationCount(prev => prev + 1);
    triggerToast(`✅ Solicitação enviada para ${item.unit}!`);
    setSelectedNetworkPart(null);
  };

  // 🔹 CONECTAR COM A UNIDADE (NOVO)
  const handleContatarUnidade = (item: any) => {
    triggerToast(`📞 Contato: ${item.contact.phone} • ${item.contact.email}`);
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
              <span>Início / Visão Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'scanner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Camera className="w-4 h-4" />
              <span>Scanner IA & Câmera</span>
            </button>

            <button
              onClick={() => setActiveTab('hub3d')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'hub3d' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Printer className="w-4 h-4" />
              <span>Hub de Impressão 3D</span>
            </button>

            <button
              onClick={() => setActiveTab('stock')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Estoque de Peças</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{stockList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('esg')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'esg' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Leaf className="w-4 h-4" />
              <span>Relatório Descarbonização</span>
            </button>
          </nav>
        </div>

        {/* 🔹 NOVO: STATUS DA REDE NO RODAPÉ */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2 text-xs text-slate-300 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold">Rede IVECO Online</span>
          </div>
          <p className="text-[10px] text-slate-500 mb-2">5 concessionárias conectadas</p>
          <button
            onClick={() => setShowRequestsModal(true)}
            className="w-full text-[10px] bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-bold py-2 rounded-lg transition flex items-center justify-center gap-1.5">
            <Truck className="w-3 h-3" />
            Minhas Solicitações ({requestList.length})
          </button>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200">Oficina IVECO • <span className="text-emerald-400">Plataforma Circular</span></h2>
          <div className="flex items-center gap-2">
            {/* 🔹 NOVO: BOTÃO DE SOLICITAÇÕES NO TOPO */}
            <button
              onClick={() => setShowRequestsModal(true)}
              className="relative bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
              <Truck className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Solicitações</span>
              {requestList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {requestList.length}
                </span>
              )}
            </button>
            <button onClick={() => setShowCadastrarModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
              <PlusCircle className="w-4 h-4" /> Cadastrar Peça Local
            </button>
          </div>
        </header>

        <main className="p-4 md:p-6 space-y-6 max-w-6xl w-full mx-auto">
          {/* VISÃO GERAL */}
          {activeTab === 'dashboard' && (
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white">Início / Visão Geral</h2>
              <p className="text-xs text-slate-400">Bem-vindo à plataforma de economia circular da IVECO.</p>
              <button onClick={() => setActiveTab('stock')} className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl">
                Acessar Estoque de Peças →
              </button>
            </div>
          )}

          {/* ESTOQUE DE PEÇAS */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              {/* ALTERNADOR DE VISÃO */}
              <div className="bg-slate-900 p-2 rounded-2xl border border-slate-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-wrap">
                  <button
                    onClick={() => setStockScope('local')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                      stockScope === 'local' 
                        ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' 
                        : 'text-slate-400 hover:text-white'
                    }`}>
                    <Building2 className="w-4 h-4" />
                    <span>Estoque Local</span>
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
                    <span>Rede IVECO Integrada</span>
                    <span className="bg-blue-500/30 px-2 py-0.5 rounded text-[10px] text-blue-200">{networkStockList.length}</span>
                  </button>
                </div>

                {/* 🔹 NOVO: INDICADOR DE CONEXÃO QUANDO EM MODO REDE */}
                {stockScope === 'network' && (
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    5 unidades conectadas em tempo real
                  </div>
                )}
              </div>

              {/* BUSCA */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={stockScope === 'local' ? "Pesquisar no seu estoque local..." : "Buscar peças em Campinas, BH, Curitiba, Rio, POA..."}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* 🔹 NOVO: BANNER INFORMATIVO EM MODO REDE */}
              {stockScope === 'network' && (
                <div className="bg-gradient-to-r from-blue-950/50 to-slate-900 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-xl shrink-0">
                    <Share2 className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-blue-300">Estoque Compartilhado entre Concessionárias</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Peças disponíveis em outras unidades IVECO podem ser transferidas para sua oficina. 
                      Clique em <strong className="text-blue-300">"Solicitar Transferência"</strong> e a rede cuidará da logística.
                    </p>
                  </div>
                </div>
              )}

              {/* CARDS DAS PEÇAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDisplayList
                  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 hover:border-slate-700 transition">
                      <div className="flex gap-4">
                        <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border flex items-center gap-1 ${
                              stockScope === 'local' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {stockScope === 'network' && <MapPin className="w-2.5 h-2.5" />}
                              {item.unit}
                            </span>
                            <span className="text-xs font-bold text-slate-300">{item.quantity} un.</span>
                          </div>
                          <h3 className="font-bold text-xs text-white truncate">{item.name}</h3>
                          <p className="text-[10px] font-mono text-slate-400">CÓD: {item.code}</p>
                        </div>
                      </div>

                      {/* 🔹 NOVO: DISTÂNCIA PARA PEÇAS DA REDE */}
                      {stockScope === 'network' && item.distance && (
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
                          <Truck className="w-3 h-3 text-blue-400" />
                          <span>Distância: <strong className="text-slate-200">{item.distance}</strong></span>
                          <span className="text-slate-600">•</span>
                          <span>Entrega estimada: <strong className="text-slate-200">2-3 dias úteis</strong></span>
                        </div>
                      )}

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap">
                        <span className="text-[10px] text-slate-400">{item.compatibility}</span>
                        {stockScope === 'network' ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedNetworkPart(item)}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleSolicitarPecaRede(item)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition">
                              <SendHorizontal className="w-3.5 h-3.5" /> Solicitar Transferência
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setSelectedPart(item)} className="bg-slate-800 text-slate-200 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" /> Ver Detalhes
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* DEMAIS TELAS */}
          {activeTab === 'scanner' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
              <h3 className="font-bold text-sm text-white">Scanner IA & Câmera</h3>
              <p className="text-xs text-slate-400">Escaneie peças para checar reuso e integridade.</p>
            </div>
          )}

          {activeTab === 'hub3d' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
              <h3 className="font-bold text-sm text-white">Hub de Impressão 3D</h3>
              <p className="text-xs text-slate-400">Fila de impressão e modelos homologados IVECO.</p>
            </div>
          )}

          {activeTab === 'esg' && (
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
              <h3 className="font-bold text-sm text-white">Relatório Descarbonização</h3>
              <p className="text-xs text-slate-400">Métricas de emissão de CO2 evitada e reuso de materiais.</p>
            </div>
          )}
        </main>
      </div>

      {/* 🔹 NOVO: MODAL DE DETALHES DA PEÇA DA REDE */}
      {selectedNetworkPart && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Network className="w-3 h-3" /> Rede IVECO
                </span>
                <h3 className="text-sm font-extrabold text-white">Peça em Outra Unidade</h3>
              </div>
              <button onClick={() => setSelectedNetworkPart(null)} className="text-slate-400 hover:text-white font-bold text-xs bg-slate-800 px-3 py-1.5 rounded-lg">Fechar [X]</button>
            </div>

            <div className="aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img src={selectedNetworkPart.images[0]} alt={selectedNetworkPart.name} className="w-full h-full object-cover" />
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
              <div>
                <h4 className="font-extrabold text-sm text-white uppercase">{selectedNetworkPart.name}</h4>
                <p className="text-[11px] font-mono text-slate-400">Código: {selectedNetworkPart.code}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-800 py-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">UNIDADE ORIGEM</span>
                  <span className="font-bold text-blue-400">{selectedNetworkPart.unit}</span>
                  <p className="text-[10px] text-slate-500 mt-0.5">{selectedNetworkPart.unitCity}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">DISTÂNCIA</span>
                  <span className="font-bold text-slate-200">{selectedNetworkPart.distance}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">QUANTIDADE</span>
                  <span className="font-bold text-slate-200">{selectedNetworkPart.quantity} unidades</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">CONDIÇÃO</span>
                  <span className="font-bold text-slate-200">{selectedNetworkPart.condition}</span>
                </div>
              </div>

              {/* 🔹 CONTATO DA UNIDADE */}
              <div className="bg-blue-950/30 border border-blue-500/20 rounded-xl p-3 space-y-2">
               