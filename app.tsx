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

      {/* SIDEBAR IDENTICA À SUA IMAGEM */}
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
            {/* 1. Início / Visão Geral */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <LayoutDashboard className="w-4 h-4" />
              <span>Início / Visão Geral</span>
            </button>

            {/* 2. Scanner IA & Câmera */}
            <button
              onClick={() => setActiveTab('scanner')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'scanner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Camera className="w-4 h-4" />
              <span>Scanner IA & Câmera</span>
            </button>

            {/* 3. Hub de Impressão 3D */}
            <button
              onClick={() => setActiveTab('hub3d')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'hub3d' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Printer className="w-4 h-4" />
              <span>Hub de Impressão 3D</span>
            </button>

            {/* 4. Estoque de Peças (EXATAMENTE COMO NA SUA IMAGEM) */}
            <button
              onClick={() => setActiveTab('stock')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Estoque de Peças</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-0.5 rounded-full">{stockList.length}</span>
            </button>

            {/* 5. Relatório Descarbonização */}
            <button
              onClick={() => setActiveTab('esg')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium transition ${activeTab === 'esg' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50'}`}>
              <Leaf className="w-4 h-4" />
              <span>Relatório Descarbonização</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-200">Oficina IVECO • <span className="text-emerald-400">Plataforma Circular</span></h2>
          <button onClick={() => setShowCadastrarModal(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition">
            <PlusCircle className="w-4 h-4" /> Cadastrar Peça Local
          </button>
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

          {/* DENTRO DE ESTOQUE DE PEÇAS -> ALTERNADOR LOCAL vs REDE IVECO */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              {/* ALTERNADOR DE VISÃO */}
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
              </div>

              {/* BUSCA */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder={stockScope === 'local' ? "Pesquisar no seu estoque local..." : "Buscar peças em Campinas, BH, Curitiba..."}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-slate-700"
                />
              </div>

              {/* CARDS DAS PEÇAS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentDisplayList
                  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.code.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(item => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                      <div className="flex gap-4">
                        <img src={item.images[0]} alt={item.name} className="w-20 h-20 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0" />
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                              stockScope === 'local' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            }`}>
                              {item.unit}
                            </span>
                            <span className="text-xs font-bold text-slate-300">{item.quantity} un.</span>
                          </div>
                          <h3 className="font-bold text-xs text-white truncate">{item.name}</h3>
                          <p className="text-[10px] font-mono text-slate-400">CÓD: {item.code}</p>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between gap-2">
                        <span className="text-[10px] text-slate-400">{item.compatibility}</span>
                        {stockScope === 'network' ? (
                          <button onClick={() => handleSolicitarPecaRede(item)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1">
                            <SendHorizontal className="w-3.5 h-3.5" /> Solicitar Transferência
                          </button>
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

          {/* DEMAIS TELAS DO SEU MENU */}
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
    </div>
  );
}