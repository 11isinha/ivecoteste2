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
  AlertCircle,
  Clock,
  ArrowUpRight,
  ChevronRight,
  TrendingUp,
  X,
  Upload,
  User,
  ShieldCheck,
  MapPin,
  Check,
  FileText
} from 'lucide-react';

// --- DADOS INICIAIS BASEADOS NO VÍDEO ---
const INITIAL_STOCK = [
  { id: '1', name: 'Alternador 28V 100A', code: 'IVE-ALT-281', status: 'Disponível', location: 'SP - Anchieta', isReconditioned: true },
  { id: '2', name: 'Compressor de Ar Monocilíndrico', code: 'IVE-CMP-001', status: 'Indisponível', location: 'SP - Leste', isReconditioned: false },
  { id: '3', name: 'Turbo Compressor Garrett Dual Stage', code: 'IVE-TUR-992', status: 'Disponível', location: 'Curitiba - PR', isReconditioned: true },
  { id: '4', name: 'Farol Direito Full LED Matrix', code: 'IVE-LED-104', status: 'Descarte Reciclável', location: 'SP - Anchieta', isReconditioned: false },
  { id: '5', name: 'Disco de Freio Ventilado Dianteiro', code: 'IVE-DSC-883', status: 'Disponível', location: 'Campinas - SP', isReconditioned: true }
];

const INITIAL_REQUESTS = [
  { id: 'REQ-8821', part: 'Suporte do Tampão de Óleo', status: 'Aguardando Aprovação', requestedBy: 'VECO Campinas', date: 'Hoje, 10 text:30' },
  { id: 'REQ-8820', part: 'Coletor de Ar Secundário', status: 'Aprovado para Envio', requestedBy: 'IVECO BH', date: 'Ontem' },
  { id: 'REQ-8819', part: 'Módulo de Injeção Eletrônica', status: 'Em Análise de Viabilidade', requestedBy: 'SP - Anchieta', date: '04 de Set' }
];

export default function App() {
  // Estado de Navegação da Sidebar (Baseado no Vídeo)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'esg' | 'ai' | 'stock' | 'requests' | 'scanner'>('dashboard');

  // Estados dos Dados
  const [stockList, setStockList] = useState(INITIAL_STOCK);
  const [requestList, setRequestList] = useState(INITIAL_REQUESTS);
  const [stockFilter, setStockFilter] = useState<'Todos' | 'Disponível' | 'Indisponível' | 'Descarte'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modais e Alertas
  const [showCadastrarModal, setShowCadastrarModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estados do Scanner e Câmera
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [cameraError, setCameraError] = useState(false);

  // Formulário de Cadastro Rápido de Peça
  const [newPartName, setNewPartName] = useState('');
  const [newPartCode, setNewPartCode] = useState('');
  const [newPartStatus, setNewPartStatus] = useState('Disponível');

  // Notificação Temporária (Toast)
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cadastrar Nova Peça
  const handleCadastrarPeca = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartName) return;

    const newPart = {
      id: String(stockList.length + 1),
      name: newPartName,
      code: newPartCode || `IVE-PRT-${Math.floor(100 + Math.random() * 900)}`,
      status: newPartStatus,
      location: 'IVECO - Matriz SP',
      isReconditioned: true
    };

    setStockList([newPart, ...stockList]);
    setShowCadastrarModal(false);
    setNewPartName('');
    setNewPartCode('');
    triggerToast(`Peça "${newPart.name}" cadastrada com sucesso!`);
  };

  // Simular Leitura do Scanner
  const handleRunScan = () => {
    setIsScanning(true);
    setScannedResult(null);
    setCameraError(false);

    setTimeout(() => {
      setIsScanning(false);
      setScannedResult({
        name: 'Alternador 28V 100A IVECO',
        code: 'IVE-ALT-281',
        condition: 'Recondicionável (85% aproveitável)',
        actionSuggested: 'Cadastrar no Estoque de Reuso',
        co2Savings: '42.5 kg'
      });
    }, 2200);
  };

  // Filtro do Estoque
  const filteredStock = stockList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.code.toLowerCase().includes(searchTerm.toLowerCase());
    if (stockFilter === 'Todos') return matchesSearch;
    if (stockFilter === 'Disponível') return matchesSearch && item.status === 'Disponível';
    if (stockFilter === 'Indisponível') return matchesSearch && item.status === 'Indisponível';
    if (stockFilter === 'Descarte') return matchesSearch && item.status === 'Descarte Reciclável';
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex font-sans antialiased">

      {/* TOAST FLUTUANTE DE AVISO */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-2xl border border-emerald-400/40 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= BARRA LATERAL (SIDEBAR) ================= */}
      <aside className="w-64 bg-[#0F172A] border-r border-slate-800 flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo IVECO ECOOFICINA 4.0 */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="bg-emerald-500 font-black text-slate-950 text-base px-2.5 py-1 rounded tracking-tighter">
              IV
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1">
                ECOOFICINA <span className="text-emerald-400 text-xs">4.0</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">REDE UNIDADE SP-01</p>
            </div>
          </div>

          {/* Selector de Unidade */}
          <div className="p-3">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold text-slate-200">IVECO São Paulo</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">Trocar</span>
            </div>
          </div>

          {/* Menu Principal */}
          <nav className="p-3 space-y-1 text-xs">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Principal</div>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4" />
                <span>Início / Dashboard</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('esg')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'esg' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Impacto ESG & CO₂</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'ai' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Oportunidades IA</span>
              </div>
              <span className="bg-purple-500/20 text-purple-300 text-[9px] font-bold px-1.5 py-0.5 rounded-full">NOVO</span>
            </button>

            <div className="px-3 pt-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Gestão da Unidade</div>

            <button
              onClick={() => setActiveTab('stock')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'stock' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-4 h-4" />
                <span>Estoque de Peças</span>
              </div>
              <span className="bg-slate-800 text-slate-300 text-[10px] px-1.5 py-0.5 rounded-full">{stockList.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'requests' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-4 h-4" />
                <span>Solicitações de Troca</span>
              </div>
            </button>

            <div className="px-3 pt-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Leitura & IA</div>

            <button
              onClick={() => setActiveTab('scanner')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium transition ${
                activeTab === 'scanner' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}>
              <div className="flex items-center gap-2.5">
                <ScanLine className="w-4 h-4 text-emerald-400" />
                <span>Escanear Peça / Câmera</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Usuário Conectado */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                AD
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

      {/* ================= ÁREA DE CONTEÚDO PRINCIPAL ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* TOPO DA TELA (HEADER PRINCIPAL) */}
        <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-slate-200">Visão Geral de Oficina <span className="text-emerald-400">IVECO</span></h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão Notificações */}
            <button
              onClick={() => { setShowNotificationModal(true); setNotificationCount(0); }}
              className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition text-slate-300">
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </button>

            {/* Botão Cadastrar Peça */}
            <button
              onClick={() => setShowCadastrarModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
              <PlusCircle className="w-4 h-4" />
              <span>+ Cadastrar Peça</span>
            </button>

            {/* Botão Escanear por IA */}
            <button
              onClick={() => setActiveTab('scanner')}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold px-3.5 py-2 rounded-xl transition flex items-center gap-1.5">
              <ScanLine className="w-4 h-4 text-emerald-400" />
              <span>Escanear & IA</span>
            </button>
          </div>
        </header>

        {/* CORPO DE CONTEÚDO VÁRIAS ABAS */}
        <main className="p-4 md:p-6 space-y-6 max-w-6xl w-full mx-auto">

          {/* ================= 1. DASHBOARD PRINCIPAL ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* Card Boas Vindas */}
              <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Rede Conectada IVECO</span>
                  </div>
                  <h1 className="text-xl font-bold text-white">Bem-vindo, Adriano!</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Plataforma conectada a 4 unidades ativas na rede.</p>
                </div>
                <button
                  onClick={() => setActiveTab('stock')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md flex items-center gap-1.5">
                  <span>Ver Estoque da Unidade</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Banner de Destaque IA */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px]">IA OPORTUNIDADE</span>
                  <span>Peça compatível encontrada na <b>IVECO Curitiba</b></span>
                </div>
                <button onClick={() => setActiveTab('ai')} className="text-emerald-400 hover:underline font-semibold flex items-center gap-1">
                  <span>Ver Oportunidade</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* GRID DE INDICADORES / CARDS */}
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
                    <span>Disponíveis Troca</span>
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

              {/* ATIVIDADES RECENTES */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Atividades Recentes na Oficina</h3>
                  <button onClick={() => setActiveTab('requests')} className="text-xs text-emerald-400 hover:underline">Ver Histórico</button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                      <div>
                        <p className="font-semibold text-slate-200">Nova solicitação de peça recebida</p>
                        <p className="text-[11px] text-slate-400">IVECO Campinas solicitou 1x Tampão do Óleo.</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">10 min atrás</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <div>
                        <p className="font-semibold text-slate-200">Peça cadastrada por scanner</p>
                        <p className="text-[11px] text-slate-400">Alternador 28V 100A adicionado ao estoque local.</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">2 horas atrás</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= 2. IMPACTO ESG & CO2 ================= */}
          {activeTab === 'esg' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Leaf className="w-4 h-4" />
                  <span>Indicadores de Sustentabilidade & ESG IVECO</span>
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
                    <p className="text-[11px] text-slate-500">Meta IVECO 2026 superada com sucesso.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= 3. OPORTUNIDADES IA ================= */}
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Inteligência da Rede IVECO</span>
                </div>
                <h2 className="text-base font-bold text-white">Oportunidades de Troca Inteligente</h2>
                <p className="text-xs text-slate-400 mt-1">A IA identificou peças paradas em outras concessionárias que servem para reparos locais.</p>
              </div>

              <div className="bg-slate-900 border border-purple-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="bg-purple-500/20 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded">OPORTUNIDADE RECOMENDADA</span>
                    <h3 className="font-bold text-white text-sm mt-1">Farol Direito Full LED Matrix</h3>
                    <p className="text-xs text-slate-400">Parado há 120 dias na unidade <b>IVECO Curitiba</b>.</p>
                  </div>
                  <button 
                    onClick={() => {
                      const newReq = { id: `REQ-${Math.floor(1000 + Math.random()*9000)}`, part: 'Farol Direito LED Matrix', status: 'Solicitada', requestedBy: 'IVECO Curitiba', date: 'Agora' };
                      setRequestList([newReq, ...requestList]);
                      triggerToast('Solicitação enviada para a IVECO Curitiba!');
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition">
                    Solicitar Peça
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= 4. ESTOQUE DA UNIDADE ================= */}
          {activeTab === 'stock' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div>
                  <h2 className="font-bold text-base text-white">Estoque da Unidade - São Paulo</h2>
                  <p className="text-xs text-slate-400">Consulte e gerencie as peças cadastradas na oficina.</p>
                </div>

                {/* Filtros */}
                <div className="flex gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
                  {(['Todos', 'Disponível', 'Indisponível', 'Descarte'] as const).map(f => (
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
              </div>

              {/* Busca */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Buscar por nome da peça ou código..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Lista do Estoque */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
                {filteredStock.length > 0 ? (
                  filteredStock.map(item => (
                    <div key={item.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-850 transition">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100 text-sm">{item.name}</span>
                          {item.isReconditioned && (
                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold px-1.5 py-0.5 rounded">
                              REUSO RECONDICIONADO
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 flex items-center gap-3 text-[11px]">
                          <span>Cód: <strong className="text-slate-300 font-mono">{item.code}</strong></span>
                          <span>•</span>
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        item.status === 'Disponível' ? 'bg-emerald-500/20 text-emerald-400' :
                        item.status === 'Indisponível' ? 'bg-slate-800 text-slate-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    Nenhuma peça encontrada para os filtros selecionados.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= 5. SOLICITAÇÕES DE TROCA ================= */}
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

          {/* ================= 6. SCANNER E CÂMERA (CORRIGIDO) ================= */}
          {activeTab === 'scanner' && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-base text-white flex items-center gap-2">
                    <ScanLine className="w-5 h-5 text-emerald-400" />
                    Leitor de Peça & Visão por IA
                  </h2>
                  <p className="text-xs text-slate-400">Escaneie o código da peça ou tire uma foto do defeito para diagnóstico automático.</p>
                </div>

                {/* Seleção do Modo de Leitura */}
                <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button 
                    onClick={() => setScannerMode('camera')}
                    className={`px-3 py-1 rounded font-semibold ${scannerMode === 'camera' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>
                    Câmera
                  </button>
                  <button 
                    onClick={() => setScannerMode('upload')}
                    className={`px-3 py-1 rounded font-semibold ${scannerMode === 'upload' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}>
                    Enviar Foto
                  </button>
                </div>
              </div>

              {/* TELA DE SCANNER */}
              <div className="bg-slate-950 border-2 border-slate-800 border-dashed rounded-2xl min-h-[320px] flex flex-col items-center justify-center relative overflow-hidden p-6">
                
                {scannerMode === 'camera' && !isScanning && !scannedResult && (
                  <div className="text-center space-y-3 max-w-sm">
                    <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <Camera className="w-8 h-8" />
                    </div>
                    <p className="text-xs text-slate-300">Aponte a câmera do seu celular ou computador para a peça ou etiqueta QR Code.</p>
                    <button
                      onClick={handleRunScan}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition shadow-lg flex items-center gap-2 mx-auto">
                      <ScanLine className="w-4 h-4" />
                      <span>INICIAR ESCANEAMENTO AO VIVO</span>
                    </button>
                  </div>
                )}

                {scannerMode === 'upload' && !isScanning && !scannedResult && (
                  <div className="text-center space-y-3">
                    <Upload className="w-10 h-10 text-slate-500 mx-auto" />
                    <p className="text-xs text-slate-300">Arraste a foto da peça ou clique para escolher do seu dispositivo.</p>
                    <button
                      onClick={handleRunScan}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs px-5 py-2.5 rounded-xl transition">
                      Selecionar Arquivo de Imagem
                    </button>
                  </div>
                )}

                {/* EM PROCESSAMENTO */}
                {isScanning && (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs font-bold text-emerald-400 animate-pulse">
                      Identificando componente via Inteligência Artificial IVECO...
                    </p>
                  </div>
                )}

                {/* RESULTADO DA LEITURA */}
                {scannedResult && (
                  <div className="w-full bg-slate-900 border border-emerald-500/40 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Diagnóstico Concluído</span>
                      </div>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                        Assertividade: 99.2%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Peça Reconhecida:</span>
                        <strong className="text-white text-sm block mt-0.5">{scannedResult.name}</strong>
                        <span className="text-[11px] text-slate-400 font-mono">Cód: {scannedResult.code}</span>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Condição Detectada:</span>
                        <span className="text-emerald-400 font-bold block mt-0.5">{scannedResult.condition}</span>
                        <span className="text-[11px] text-slate-400">Economia estimada: {scannedResult.co2Savings} de CO₂</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => setScannedResult(null)}
                        className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition">
                        Escanear Outra Peça
                      </button>
                      <button
                        onClick={() => {
                          const newP = {
                            id: String(stockList.length + 1),
                            name: scannedResult.name,
                            code: scannedResult.code,
                            status: 'Disponível',
                            location: 'SP - Matriz',
                            isReconditioned: true
                          };
                          setStockList([newP, ...stockList]);
                          setScannedResult(null);
                          setActiveTab('stock');
                          triggerToast('Peça escaneada e adicionada ao Estoque!');
                        }}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition">
                        Adicionar ao Estoque Agora
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ================= MODAL CADASTRAR PEÇA ================= */}
      {showCadastrarModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-400" />
                Cadastrar Peça na Oficina
              </h3>
              <button onClick={() => setShowCadastrarModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCadastrarPeca} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 font-medium block mb-1">Nome do Componente/Peça:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Coletor de Admissão Turbina"
                  value={newPartName}
                  onChange={e => setNewPartName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Código IVECO (Opcional):</label>
                <input
                  type="text"
                  placeholder="Ex: IVE-9921-X"
                  value={newPartCode}
                  onChange={e => setNewPartCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Status do Item:</label>
                <select
                  value={newPartStatus}
                  onChange={e => setNewPartStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500">
                  <option value="Disponível">Disponível para Troca</option>
                  <option value="Indisponível">Em Uso / Indisponível</option>
                  <option value="Descarte Reciclável">Descarte Reciclável</option>
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
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition">
                  Salvar Peça
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL NOTIFICAÇÕES ================= */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-emerald-400" />
                Notificações Recentes
              </h3>
              <button onClick={() => setShowNotificationModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <p className="font-bold text-slate-200">Peça Aprovada para Envio</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Sua solicitação de Módulo foi aceita pela matriz.</p>
              </div>
              <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800">
                <p className="font-bold text-slate-200">Nova solicitação na Rede</p>
                <p className="text-[11px] text-slate-400 mt-0.5">IVECO BH solicitou verificação de estoque.</p>
              </div>
            </div>

            <button
              onClick={() => setShowNotificationModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl">
              Fechar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}