/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabId } from './types';
import { Header } from './components/Header';
import { ExecutiveSummaryTab } from './components/ExecutiveSummaryTab';
import { BranchZakiaTab } from './components/BranchZakiaTab';
import { BranchRefugioTab } from './components/BranchRefugioTab';
import { UnifiedConsolidatedTab } from './components/UnifiedConsolidatedTab';
import { InvestorCalculatorTab } from './components/InvestorCalculatorTab';
import { ProposalDonJuventinoTab } from './components/ProposalDonJuventinoTab';
import { PrintExecutiveReport } from './components/PrintExecutiveReport';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('pitch');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Header & Sticky Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onPrint={() => setIsPrintModalOpen(true)} 
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'pitch' && (
          <ExecutiveSummaryTab 
            onGoToCalculator={() => setActiveTab('calculadora')}
            onGoToBranches={() => setActiveTab('unificado')}
          />
        )}

        {activeTab === 'zakia' && <BranchZakiaTab />}

        {activeTab === 'refugio' && <BranchRefugioTab />}

        {activeTab === 'unificado' && <UnifiedConsolidatedTab />}

        {activeTab === 'calculadora' && <InvestorCalculatorTab />}

        {activeTab === 'propuesta' && <ProposalDonJuventinoTab />}
      </main>

      {/* Printable / PDF Export Modal */}
      {isPrintModalOpen && (
        <PrintExecutiveReport onClose={() => setIsPrintModalOpen(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 tracking-tight">PANADERÍA <span className="text-amber-500">SANTA FÉ</span></span>
            <span>&bull;</span>
            <span>Ronda de Capital Privado $10 MDP</span>
            <span>&bull;</span>
            <span className="text-emerald-600 font-medium">Sucursales Zákia y El Refugio</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveTab('pitch')} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Resumen Ejecutivo
            </button>
            <button 
              onClick={() => setActiveTab('propuesta')} 
              className="hover:text-amber-600 font-medium transition-colors cursor-pointer"
            >
              Propuesta Don Juventino
            </button>
            <button 
              onClick={() => setActiveTab('calculadora')} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Calculadora
            </button>
            <button 
              onClick={() => setIsPrintModalOpen(true)} 
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Imprimir Informe
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

