import React from 'react';
import { GastoRubro } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { X, Calendar, DollarSign, Tag, Info, TrendingUp, AlertCircle } from 'lucide-react';

interface DetailModalProps {
  item: GastoRubro | null;
  sucursalNombre: string;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ item, sucursalNombre, onClose }) => {
  if (!item) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Tag className="w-3.5 h-3.5" />
            <span>{sucursalNombre} &bull; {item.categoria}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light tracking-tight text-white">
            <span className="font-bold">{item.concepto}</span>
          </h3>
          <p className="text-slate-400 text-xs mt-1">Rubro No. {item.no} en la estructura de costos operativos</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-xs text-slate-500 font-medium block">Gasto Diario</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5 font-mono">
                {formatCurrency(item.gastoDiario, true)}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-xs text-slate-500 font-medium block">Gasto Semanal</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5 font-mono">
                {formatCurrency(item.gastoSemanal)}
              </span>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
              <span className="text-xs text-amber-700 font-medium block">Gasto Mensual</span>
              <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5 font-mono">
                {formatCurrency(item.proyeccionMensual)}
              </span>
            </div>
          </div>

          {/* Impact Indicator */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Impacto en Costos de Sucursal
              </span>
              <span className="text-xs font-bold text-slate-900 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full font-mono">
                {formatPercent(item.porcentajeTotal)} del presupuesto
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(item.porcentajeTotal, 100)}%` }}
              />
            </div>
          </div>

          {/* Description & Business Context */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-slate-400" />
              Detalle y Justificación Operativa
            </h4>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {item.descripcion || 'Gasto recurrente registrado en el análisis financiero auditado de la sucursal.'}
            </p>
          </div>

          {/* Proyección Anual */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className="text-xs text-slate-600 font-medium">Proyección Anual (12 Meses):</span>
            </div>
            <span className="text-sm font-bold text-slate-900 font-mono">
              {formatCurrency(item.proyeccionMensual * 12)}
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer shadow-xs"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
