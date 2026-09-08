import React, { useState, useRef } from 'react';
import { 
  Printer, 
  Wrench, 
  CheckCircle2, 
  Box, 
  RefreshCw, 
  Camera,
  AlertTriangle,
  Play
} from 'lucide-react';

export default function App() {
  const [tab, setTab] = useState('scanner'); // 'scanner', 'lista', 'fila'
  
  // Estados da Câmera e do Scanner
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [erroCamera, setErroCamera] = useState('');
  const [escaneando, setEscaneando] = useState(false);
  const [pecaAnalisada, setPecaAnalisada] = useState(false);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Fila de Impressão Simples
  const [pedidos, setPedidos] = useState([
    { id: '1', nome: 'Suporte do Motor', status: 'Imprimindo...', tempo: '40 min' }
  ]);

  const [modalSucesso, setModalSucesso] = useState(false);
  const [itemCriado, setItemCriado] = useState('');

  // FUNÇÃO 1: Ligar Câmera com Ação do Usuário
  const ligarCamera = async () => {
    setErroCamera('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraAtiva(true);
    } catch (err) {
      console.error(err);
      setErroCamera('O navegador não deu permissão para usar a câmera. Clique em permitir na barra de endereço.');
      setCameraAtiva(false);
    }
  };

  // FUNÇÃO 2: Desligar Câmera
  const desligarCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraAtiva(false);
  };

  // FUNÇÃO 3: Tirar foto / Simular Leitura
  const lerPeca = () => {
    setEscaneando(true);
    setTimeout(() => {
      setEscaneando(false);
      setPecaAnalisada(true);
      desligarCamera();
    }, 2000);
  };

  // FUNÇÃO 4: Reiniciar Câmera
  const reiniciar = () => {
    setPecaAnalisada(false);
    setEscaneando(false);
    ligarCamera();
  };

  // FUNÇÃO 5: Mandar para Impressora
  const enviarParaImpressora = (nomePeca) => {
    const novoPedido = {
      id: String(pedidos.length + 1),
      nome: nomePeca,
      status: 'Na Fila',
      tempo: '1 hora'
    };
    setPedidos([...pedidos, novoPedido]);
    setItemCriado(nomePeca);
    setModalSucesso(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col">
      
      {/* TOPO SIMPLES */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 font-black px-2.5 py-1 rounded text-sm">IVECO</span>
            <h1 className="font-bold text-base">Oficina 3D</h1>
          </div>
          <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded font-semibold">
            Modo Fácil
          </span>
        </div>
      </header>

      {/* NAVEGAÇÃO POR ABAS DIRETA */}
      <div className="bg-slate-950 border-b border-slate-800 p-2">
        <div className="max-w-4xl mx-auto flex gap-2">
          <button
            onClick={() => { setTab('scanner'); desligarCamera(); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              tab === 'scanner' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
            <Camera className="w-4 h-4" />
            <span>1. Tirar Foto da Peça</span>
          </button>

          <button
            onClick={() => { setTab('lista'); desligarCamera(); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              tab === 'lista' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
            <Box className="w-4 h-4" />
            <span>2. Peças Prontas</span>
          </button>

          <button
            onClick={() => { setTab('fila'); desligarCamera(); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 ${
              tab === 'fila' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
            <Printer className="w-4 h-4" />
            <span>3. Ver Impressões ({pedidos.length})</span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="max-w-4xl w-full mx-auto p-4 flex-1">

        {/* 1. ABA DO SCANNER / CÂMERA */}
        {tab === 'scanner' && (
          <div className="space-y-4">
            
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-400" />
                Identificar Peça Quebrada
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Ligue a câmera e aponte para o local onde a peça está trincada ou gasta.
              </p>
            </div>

            {/* CAIXA DA CÂMERA */}
            <div className="bg-black border-2 border-slate-700 rounded-xl overflow-hidden min-h-[300px] flex flex-col items-center justify-center relative">
              
              {/* ESTADO 1: Câmera Desligada */}
              {!cameraAtiva && !escaneando && !pecaAnalisada && (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                    <Camera className="w-8 h-8 text-slate-400" />
                  </div>
                  {erroCamera && (
                    <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20 max-w-xs mx-auto">
                      {erroCamera}
                    </p>
                  )}
                  <button
                    onClick={ligarCamera}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition flex items-center gap-2 mx-auto">
                    <Play className="w-4 h-4 fill-white" />
                    <span>LIGAR CÂMERA AGORA</span>
                  </button>
                </div>
              )}

              {/* ESTADO 2: Câmera Ligada ao Vivo */}
              {cameraAtiva && !escaneando && !pecaAnalisada && (
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-[320px] object-cover"
                  />
                  <div className="absolute inset-4 border-2 border-emerald-400/60 border-dashed rounded-lg pointer-events-none flex items-center justify-center">
                    <span className="bg-slate-900/80 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full">
                      Mantenha a peça centralizada
                    </span>
                  </div>
                  <button
                    onClick={lerPeca}
                    className="absolute bottom-4 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-xl">
                    📸 LER PEÇA AGORA
                  </button>
                </div>
              )}

              {/* ESTADO 3: Lendo a Peça */}
              {escaneando && (
                <div className="text-center p-6 space-y-3">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm font-bold text-emerald-400">Procurando defeitos na peça...</p>
                </div>
              )}

              {/* ESTADO 4: Resultado Encontrado */}
              {pecaAnalisada && (
                <div className="w-full p-4 bg-slate-800 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Peça Reconhecida!</span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Nome da Peça:</span>
                      <strong className="text-white text-sm">Suporte do Coletor - IVECO 2026</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Problema Detectado:</span>
                      <span className="text-amber-400 font-medium">Trinca de 12mm na aba de fixação.</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Vantagem da Peça 3D:</span>
                      <span className="text-emerald-400 font-bold">65% mais leve que a peça de metal original.</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={reiniciar}
                      className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" />
                      Tirar Outra Foto
                    </button>
                    <button
                      onClick={() => enviarParaImpressora('Suporte do Coletor 3D')}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-1">
                      <Printer className="w-3.5 h-3.5" />
                      Imprimir Peça Nova
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

        {/* 2. ABA PEÇAS PRONTAS (CATÁLOGO SIMPLES) */}
        {tab === 'lista' && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h2 className="font-bold text-base text-white">Catálogo de Peças Rápidas</h2>
              <p className="text-xs text-slate-400 mt-0.5">Escolha uma peça pronta para mandar direto para a impressora.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { nome: 'Suporte do Intercooler', tempo: '45 minutos', peso: '2 kg mais leve' },
                { nome: 'Capa do Conector Elétrico', tempo: '20 minutos', peso: '500g mais leve' },
                { nome: 'Presilha de Mangueira', tempo: '15 minutos', peso: ' Resistentíssima' }
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">{item.nome}</h3>
                    <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                      <p>⏱️ Tempo de impressão: {item.tempo}</p>
                      <p className="text-emerald-400 font-medium">💡 Vantagem: {item.peso}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => enviarParaImpressora(item.nome)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition flex items-center justify-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    <span>Fazer Esta Peça</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. ABA FILA DE IMPRESSÃO */}
        {tab === 'fila' && (
          <div className="space-y-4">
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
              <h2 className="font-bold text-base text-white">Fila de Trabalho da Impressora</h2>
              <p className="text-xs text-slate-400 mt-0.5">Acompanhe quais peças estão sendo fabricadas agora.</p>
            </div>

            <div className="space-y-2">
              {pedidos.map((p) => (
                <div key={p.id} className="bg-slate-800 p-3.5 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-white block text-sm">{p.nome}</strong>
                    <span className="text-slate-400">Tempo estimado: {p.tempo}</span>
                  </div>
                  <span className="bg-blue-500/20 text-blue-400 font-bold px-2.5 py-1 rounded-full">
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* AVISO DE SUCESSO (MODAL SIMPLE) */}
      {modalSucesso && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl max-w-xs w-full text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Pedido Confirmado!</h3>
              <p className="text-xs text-slate-300 mt-1">
                A peça <b>{itemCriado}</b> foi enviada para a impressora.
              </p>
            </div>
            <button
              onClick={() => { setModalSucesso(false); setTab('fila'); }}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg">
              Ver Fila de Impressão
            </button>
          </div>
        </div>
      )}

    </div>
  );
}