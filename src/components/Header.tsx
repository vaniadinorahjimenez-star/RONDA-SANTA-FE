import React from 'react';
import { TabId } from '../types';
import { 
  Building2, 
  Store, 
  Layers, 
  Calculator, 
  FileText, 
  Printer, 
  TrendingUp, 
  CheckCircle2,
  DollarSign,
  Handshake
} from 'lucide-react';

interface HeaderProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onPrint: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onPrint }) => {
  const tabs = [
    { id: 'pitch' as TabId, label: 'Resumen Ejecutivo', icon: FileText },
    { id: 'zakia' as TabId, label: 'Sucursal Zákia', icon: Store },
    { id: 'refugio' as TabId, label: 'Sucursal Refugio', icon: Store },
    { id: 'unificado' as TabId, label: 'Consolidado Unificado', icon: Layers, badge: 'Ambas' },
    { id: 'calculadora' as TabId, label: 'Calculadora Inversionista', icon: Calculator, badge: 'Simulador' },
    { id: 'propuesta' as TabId, label: 'Propuesta', icon: Handshake, badge: 'Don Juventino' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg tracking-tight shadow-xs">
            <span className="text-amber-400">SF</span>
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                PANADERÍA <span className="text-amber-500">SANTA FÉ</span>
              </h1>
              <span className="hidden sm:inline-block text-slate-300">|</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> 10 MDP Ronda
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 tracking-normal">
              Prospecto de inversión &bull; Adquisición estratégica de Panadería Santa Fé (Zákia &amp; El Refugio)
            </p>
          </div>
        </div>

        {/* Quick Stats & Print Action */}
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="hidden sm:flex items-center gap-4 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">Venta Mensual:</span>
              <span className="font-semibold text-slate-800">$1,293,143 MXN</span>
            </div>
            <div className="w-px h-6 bg-slate-200" />
            <div>
              <span className="text-slate-400 uppercase text-[10px] tracking-wider block">Target ROI Anual:</span>
              <span className="font-bold text-emerald-600">13% &ndash; 16%</span>
            </div>
          </div>

          <button
            onClick={onPrint}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-xs cursor-pointer"
            title="Imprimir o guardar como PDF este informe"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Exportar / Imprimir</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {isActive ? (
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                ) : (
                  <Icon className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md uppercase tracking-wider font-semibold ${
                      isActive ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
