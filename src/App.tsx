/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabId } from './types';
import { Header } from './components/Header';
import { InicioTab } from './components/InicioTab';
import { BranchZakiaTab } from './components/BranchZakiaTab';
import { BranchRefugioTab } from './components/BranchRefugioTab';
import { UnifiedConsolidatedTab } from './components/UnifiedConsolidatedTab';
import { ProposalDonJuventinoTab } from './components/ProposalDonJuventinoTab';
import { PrintExecutiveReport, PrintReportType } from './components/PrintExecutiveReport';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printInitialReport, setPrintInitialReport] = useState<PrintReportType>('zakia');

  const handleOpenPrint = (reportType?: PrintReportType) => {
    if (reportType) {
      setPrintInitialReport(reportType);
    } else {
      // Map current active tab to matching print report
      if (activeTab === 'zakia') setPrintInitialReport('zakia');
      else if (activeTab === 'refugio') setPrintInitialReport('refugio');
      else setPrintInitialReport('unificado');
    }
    setIsPrintModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header & Sticky Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPrint={() => handleOpenPrint()} 
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'inicio' && (
          <InicioTab onGoToBranches={() => setActiveTab('zakia')} />
        )}

        {activeTab === 'zakia' && (
          <BranchZakiaTab onExport={() => handleOpenPrint('zakia')} />
        )}

        {activeTab === 'refugio' && (
          <BranchRefugioTab onExport={() => handleOpenPrint('refugio')} />
        )}

        {activeTab === 'unificado' && (
          <UnifiedConsolidatedTab onExport={() => handleOpenPrint('unificado')} />
        )}

        {activeTab === 'propuesta' && <ProposalDonJuventinoTab />}
      </main>

      {/* Printable / PDF Export Modal */}
      {isPrintModalOpen && (
        <PrintExecutiveReport 
          initialReport={printInitialReport} 
          onClose={() => setIsPrintModalOpen(false)} 
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight">PANADERÍA <span className="text-amber-500">SANTA FÉ</span></span>
            <span>&bull;</span>
            <span className="text-emerald-700 font-medium">Control Operativo &amp; Financiero</span>
            <span>&bull;</span>
            <span>Sucursales Zákia y El Refugio</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('inicio')} 
              className="hover:text-amber-700 font-medium transition-colors cursor-pointer"
            >
              Inicio &bull; Carta
            </button>
            <button 
              onClick={() => setActiveTab('zakia')} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Sucursal Zákia
            </button>
            <button 
              onClick={() => setActiveTab('refugio')} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Sucursal Refugio
            </button>
            <button 
              onClick={() => setActiveTab('unificado')} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Consolidado
            </button>
            <button 
              onClick={() => setActiveTab('propuesta')} 
              className="hover:text-amber-600 font-medium transition-colors cursor-pointer"
            >
              Propuesta Don Juventino
            </button>
            <button 
              onClick={() => handleOpenPrint()} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Exportar PDF
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

