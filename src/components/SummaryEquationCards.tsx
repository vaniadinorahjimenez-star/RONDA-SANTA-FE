import React from 'react';
import { TrendingUp, DollarSign, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export interface SummaryEquationCardsProps {
  ingresosMensuales: number;
  ingresosAnuales: number;
  gastosMensuales: number;
  gastosAnuales: number;
  gastosSemanales: number;
  rubrosCount: number;
  utilidadMensual: number;
  utilidadAnual: number;
  margenNeto: string | number;
  tituloIngresos?: string;
  subtituloIngresos?: string;
  subtituloGastos?: string;
  subtituloUtilidad?: string;
  onToggleIngresos?: () => void;
  isIngresosExpanded?: boolean;
  onSelectGastos?: () => void;
  onSelectResumen?: () => void;
  isPrintMode?: boolean;
  showClickHelper?: boolean;
}

export const SummaryEquationCards: React.FC<SummaryEquationCardsProps> = ({
  ingresosMensuales,
  ingresosAnuales,
  gastosMensuales,
  gastosAnuales,
  gastosSemanales,
  rubrosCount,
  utilidadMensual,
  utilidadAnual,
  margenNeto,
  tituloIngresos = '1. INGRESOS MENSUALES PROMEDIO',
  subtituloIngresos,
  subtituloGastos,
  subtituloUtilidad,
  onToggleIngresos,
  isIngresosExpanded = false,
  onSelectGastos,
  onSelectResumen,
  isPrintMode = false,
  showClickHelper = true,
}) => {
  return (
    <div className={`rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 shadow-xs space-y-4 ${isPrintMode ? 'border-stone-300 shadow-none' : ''}`}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* 1. Ingresos Mensuales */}
        <div
          onClick={onToggleIngresos}
          className={`w-full lg:w-1/3 border-2 rounded-xl p-4.5 text-center sm:text-left transition-all ${
            onToggleIngresos && !isPrintMode ? 'cursor-pointer' : ''
          } ${
            isIngresosExpanded
              ? 'bg-amber-50/80 border-amber-500 shadow-xs ring-2 ring-amber-400/20'
              : 'bg-stone-50 border-stone-200 hover:border-stone-400'
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>{tituloIngresos}</span>
            </div>
            {!isPrintMode && onToggleIngresos && (
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-colors ${
                  isIngresosExpanded ? 'bg-amber-500 text-stone-900' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {isIngresosExpanded ? 'Ocultar' : 'Desplegar'}
              </span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-mono">
            {formatCurrency(ingresosMensuales)}
          </div>
          <div className="text-xs text-stone-700 mt-1">
            {subtituloIngresos ? (
              <span>{subtituloIngresos}</span>
            ) : (
              <>
                Venta Total Anual (12M): <strong className="text-stone-900 font-mono">{formatCurrency(ingresosAnuales)}</strong>
              </>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-stone-200/70 text-xs font-semibold text-amber-900 flex items-center justify-between">
            <span className="flex items-center gap-1">
              {!isPrintMode && onToggleIngresos && (
                isIngresosExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span>{isIngresosExpanded ? 'Cerrar tabla de ingresos' : 'Desplegar tabla de ingresos por mes'}</span>
            </span>
            <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
              12 Meses
            </span>
          </div>
        </div>

        {/* Minus Sign */}
        <div className="hidden lg:flex text-stone-400 font-bold text-2xl select-none">-</div>

        {/* 2. Menos Gastos Operativos */}
        <div
          onClick={onSelectGastos}
          className={`w-full lg:w-1/3 border rounded-xl p-4.5 text-center sm:text-left transition-all ${
            onSelectGastos && !isPrintMode ? 'cursor-pointer hover:border-stone-300' : ''
          } bg-stone-50 border-stone-200`}
        >
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>2. MENOS GASTOS OPERATIVOS</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-mono">
            {formatCurrency(gastosMensuales)}
          </div>
          <div className="text-xs text-stone-700 mt-1">
            {subtituloGastos ? (
              <span>{subtituloGastos}</span>
            ) : (
              <>
                Gasto Anual (12M): <span className="font-mono">{formatCurrency(gastosAnuales)}</span> &bull; Semanal: <span className="font-mono">{formatCurrency(gastosSemanales)}</span>
              </>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-stone-200/70 text-xs text-stone-600 flex items-center justify-between">
            <span>{rubrosCount} Rubros auditados</span>
            <span className="text-[10px] text-amber-800 font-bold">Ver desglose &rarr;</span>
          </div>
        </div>

        {/* Equals Sign */}
        <div className="hidden lg:flex text-stone-400 font-bold text-2xl select-none">=</div>

        {/* 3. Igual Utilidad Neta Mensual */}
        <div
          onClick={onSelectResumen}
          className={`w-full lg:w-1/3 border-2 rounded-xl p-4.5 text-center sm:text-left transition-all ${
            onSelectResumen && !isPrintMode ? 'cursor-pointer' : ''
          } bg-emerald-50/80 border-emerald-500 shadow-2xs hover:border-emerald-600`}
        >
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>3. IGUAL UTILIDAD NETA MENSUAL</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight font-mono">
            {formatCurrency(utilidadMensual)}
          </div>
          <div className="text-xs text-emerald-800 font-medium mt-1">
            {subtituloUtilidad ? (
              <span>{subtituloUtilidad}</span>
            ) : (
              <>
                Margen Neto: <strong>{typeof margenNeto === 'number' ? `${margenNeto}%` : margenNeto}</strong> &bull; Utilidad Anual (12M): <strong className="font-mono">{formatCurrency(utilidadAnual)}</strong>
              </>
            )}
          </div>
          <div className="mt-2.5 pt-2 border-t border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <span>Retorno neto mensual</span>
            <span className="text-[10px] text-emerald-900 font-bold">Ver histórico &rarr;</span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-600">
        <span className="flex items-center gap-1.5 text-center sm:text-left">
          <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          {showClickHelper && !isPrintMode ? (
            <span>
              Haz clic en <strong>"1. Ingresos Mensuales Promedio"</strong> para desplegar u ocultar la tabla mensual auditada.
            </span>
          ) : (
            <span>
              Información financiera 100% verificada contra conciliaciones bancarias y libros contables auditados.
            </span>
          )}
        </span>
        <span className="font-semibold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 shrink-0">
          12 Meses Auditados (100% Real)
        </span>
      </div>
    </div>
  );
};
