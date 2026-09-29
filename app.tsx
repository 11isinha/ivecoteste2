import React, { useState, useRef } from 'react';
import {
  LayoutDashboard,
  Leaf,
  Camera,
  ScanLine,
  Printer,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Play,
  Layers,
  Sparkles,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';

// --- BASE DE DADOS REDUZIDA (PROTÓTIPO DE DEMONSTRAÇÃO) ---
const PROTOTYPE_PARTS = [
  {
    id: 'PART-ALG-01',
    name: 'SUPORTE DO CABO DE ACELERADOR (ANTIGO)',
    truckModel: 'IVECO TurboDaily 3510',
    year: 1998,
    status: 'Obsoleto / Fora de Linha',
    healthStatus: '35% (Trincado e Ressecado)',
    materialOriginal: 'Aço / Plástico Injetado',
    additiveMaterial: 'Filamento de Algas (Bio-PA Algae Compound)',
    co2Savings: '12.8 kg CO₂',
    isLegacy: true,
    description: 'Peça descontinuada no catálogo tradicional. Redesenho aprovado para impressão 3D sustentável.'
  },
  {
    id: 'PART-ALG-02',
    name: 'CAPA PROTETORA DO SENSOR TECTOR',
    truckModel: 'IVECO Tector Euro 5',
    year: 2016,
    status: 'Recuperável',
    healthStatus: '60% (Desgaste Superficial)',
    materialOriginal: 'Plástico ABS Confeccionado',
    additiveMaterial: 'Filamento de Algas Reforçado',
    co2Savings: '5.4 kg CO₂',
    isLegacy: false,
    description: 'Pode ser recondicionada e reconstruída localmente via manufatura aditiva.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'scanner' | 'hub3d' | 'esg'>('scanner');

  // Câmera & Scanner
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Fila do Hub 3D
  const [printQueue, setPrintQueue] = useState([
    {
      id: 'JOB-01',
      name: 'SUPORTE DO CABO DE ACELERADOR',
      material: 'Filamento de Algas (Bio-PA Algae)',
      truckModel: 'IVECO TurboDaily (1998)',
      status: 'Em Produção',
      progress: 68,
      timeRemaining: '18 min'
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
      setCameraError('Permissão para acessar a câmera negada ou dispositivo indisponível.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  // Simulação de Escaneamento da Peça Antiga
  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Retorna a peça antiga como demonstração padrão do protótipo
      setScannedResult(PROTOTYPE_PARTS[0]);
      stopCamera();
    }, 2200);
  };

  const handleSendToPrinter = (part: any) => {
    const newJob = {
      id: `JOB-${Math.floor(10 + Math.random() * 90)}`,
      name: part.name,
      material: part.additiveMaterial,
      truckModel: `${part.truckModel} (${part.year})`,
      status: 'Aguardando Impressora',
      progress: 0,
      timeRemaining: '35 min'
    };
    setPrintQueue([...printQueue, newJob]);
    showToast(`Peça enviada para o Hub de Impressão 3D (Filamento de Algas)!`);
    setActiveTab('hub3d');
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 font-sans flex flex-col antialiased">
      {/* TOAST FLUTUANTE */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-slate-950 font-extrabold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* CABEÇALHO DA ECOOFICINA */}
      <header className="bg-[#0F172A] border-b border-slate-800 p-4 sticky top-0 z-30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 font-black text-white text-base px-2.5 py-1 rounded tracking-tighter">
            IVECO
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wide text-white flex items-center gap-1.5">
              ECOOFICINA <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">MANUFATURA ADITIVA</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono">PROCESSO CIRCULAR • FILAMENTO DE ALGAS</p>
          </div>
        </div>

        <nav className="flex gap-2">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'scanner' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            <Camera className="w-3.5 h-3.5" />
            <span>1. Scanner IA</span>
          </button>
          <button
            onClick={() => setActiveTab('hub3d')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'hub3d' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            <Printer className="w-3.5 h-3.5" />
            <span>2. Impressão 3D ({printQueue.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('esg')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'esg' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}>
            <Leaf className="w-3.5 h-3.5" />
            <span>3. Ciclo 3 R's</span>
          </button>
        </nav>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4 md:p-6 max-w-4xl w-full mx-auto space-y-6">

        {/* --- ABA 1: SCANNER DE PEÇAS --- */}
        {activeTab === 'scanner' && (
          <div className="space-y-5">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/20 uppercase">
                Diagnóstico Digital & Redesenho Sustentável
              </span>
              <h2 className="text-base font-bold text-white">Escanear Componente IVECO</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Aponte a câmera para a peça antiga ou com defeito. Nosso sistema de visão computacional identificará a saúde do componente, o modelo/ano do caminhão e sugerirá a fabricação limpa por **Manufatura Aditiva**.
              </p>
            </div>

            {/* ÁREA DA CÂMERA */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl overflow-hidden min-h-[280px] flex flex-col items-center justify-center relative">
              {!cameraActive && !isScanning && !scannedResult && (
                <div className="text-center p-6 space-y-4">
                  <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mx-auto text-emerald-400 shadow-xl">
                    <ScanLine className="w-8 h-8" />
                  </div>
                  {cameraError && (
                    <p className="text-xs text-red-400 bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 max-w-xs mx-auto">
                      {cameraError}
                    </p>
                  )}
                  <button
                    onClick={startCamera}
                    className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition flex items-center gap-2 mx-auto shadow-lg shadow-emerald-500/20">
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>LIGAR CÂMERA DO SCANNER</span>
                  </button>
                </div>
              )}

              {cameraActive && !isScanning && (
                <div className="w-full relative flex flex-col items-center justify-center">
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-[320px] object-cover" />
                  <div className="absolute inset-6 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="bg-slate-950/80 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                      Centralize a peça no quadro
                    </span>
                  </div>
                  <div className="absolute bottom-4 flex gap-2">
                    <button
                      onClick={handleSimulateScan}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs px-6 py-2.5 rounded-xl shadow-2xl flex items-center gap-2">
                      <Camera className="w-4 h-4" />
                      ESCANEAR AGORA
                    </button>
                    <button
                      onClick={stopCamera}
                      className="bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="text-center p-8 space-y-3">
                  <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                    Analisando Geometria & Saúde da Peça...
                  </p>
                </div>
              )}
            </div>

            {/* RESULTADO DO SCANNER */}
            {scannedResult && (
              <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h3 className="font-extrabold text-sm text-white">{scannedResult.name}</h3>
                      <p className="text-[10px] font-mono text-emerald-400">ID: {scannedResult.id}</p>
                    </div>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {scannedResult.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Modelo & Ano do Caminhão</span>
                    <strong className="text-white text-sm">{scannedResult.truckModel}</strong>
                    <p className="text-[10px] text-slate-500">Ano de Fabricação: {scannedResult.year}</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">Saúde da Peça Escaneada</span>
                    <strong className="text-amber-400 text-sm">{scannedResult.healthStatus}</strong>
                    <p className="text-[10px] text-slate-500">Diagnóstico: Estrutura comprometida pelo tempo</p>
                  </div>
                </div>

                {/* ALERTA DE PEÇA ANTIGA / INDISPONÍVEL & REDESENHO SUSTENTÁVEL */}
                {scannedResult.isLegacy && (
                  <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-xl p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-1 text-xs">
                        <h4 className="font-bold text-emerald-300">Peça Não Disponível na Linha Convencional</h4>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          Por pertencer a um caminhão antigo, esta peça original não é mais produzida em fábrica. 
                          Ela pode ser **REDESENHADA via MANUFATURA ADITIVA** utilizando **Filamento de Algas (Bio-PA Algae)**, eliminando fretes e reduzindo pegada de carbono.
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] flex justify-between items-center">
                      <span className="text-slate-400">Material Recomendado:</span>
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <Leaf className="w-3.5 h-3.5" /> {scannedResult.additiveMaterial}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => { setScannedResult(null); startCamera(); }}
                    className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition">
                    <RefreshCw className="w-3.5 h-3.5" />
                    Escanear Outra
                  </button>
                  <button
                    onClick={() => handleSendToPrinter(scannedResult)}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5">
                    <Printer className="w-3.5 h-3.5" />
                    Fabricar com Filamento de Algas
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* --- ABA 2: HUB DE IMPRESSÃO 3D --- */}
        {activeTab === 'hub3d' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <h2 className="font-bold text-sm text-white flex items-center gap-2">
                  <Printer className="w-4 h-4 text-emerald-400" />
                  Fila de Manufatura Aditiva On-Demand
                </h2>
                <p className="text-xs text-slate-400">Peças redesenhadas sendo fabricadas com filamento biológico de algas.</p>
              </div>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold">
                Mesa Exclusiva: Bio-Polímeros
              </span>
            </div>

            <div className="space-y-3">
              {printQueue.map((item) => (
                <div key={item.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <h3 className="font-extrabold text-white text-sm">{item.name}</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Veículo: <span className="text-slate-200 font-semibold">{item.truckModel}</span></p>
                    </div>
                    <span className="bg-blue-500/20 text-blue-300 font-bold px-2.5 py-1 rounded-full text-[10px]">
                      {item.status}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-[11px] flex justify-between items-center">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Filamento:
                    </span>
                    <span className="font-bold text-emerald-400">{item.material}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>Progresso da Extrusão</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${item.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- ABA 3: CICLO SUSTENTÁVEL DOS 3 R's --- */}
        {activeTab === 'esg' && (
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <h2 className="font-bold text-base text-white flex items-center gap-2">
                <Leaf className="w-5 h-5 text-emerald-400" />
                O Processo da EcoOficina (Os 3 R's)
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Entenda como a combinação de visão computacional, manufatura aditiva local e filamentos ecológicos de algas transforma a logística de peças de reposição IVECO.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center font-black text-sm">
                  1
                </div>
                <h3 className="font-bold text-xs text-white uppercase">Reduzir (Frete & Resíduo)</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Evita o transporte rodoviário de peças antigas vindas de estoques distantes, reduzindo drasticamente a pegada de CO₂.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-lg flex items-center justify-center font-black text-sm">
                  2
                </div>
                <h3 className="font-bold text-xs text-white uppercase">Reutilizar (Redesenho CAD)</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Modelos de caminhões fora de linha ganham vida nova através da engenharia reversa e do redesenho aditivo digital.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="w-8 h-8 bg-cyan-500/20 text-cyan-400 rounded-lg flex items-center justify-center font-black text-sm">
                  3
                </div>
                <h3 className="font-bold text-xs text-white uppercase">Reciclar (Filamento de Algas)</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Uso de polímeros biodegradáveis com base de algas marinhas, criando uma matéria-prima limpa e renovável.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}