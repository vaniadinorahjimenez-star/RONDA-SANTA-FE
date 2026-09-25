import React, { useState } from 'react';
import { VENTAS_ZAKIA, RESUMEN_UTILIDAD_ZAKIA, TOTALES_CONSOLIDADOS } from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { CreditCard, Coins, TrendingUp, DollarSign, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface ZakiaSalesTableProps {
  title?: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  showToggle?: boolean;
}

export const ZakiaSalesTable: React.FC<ZakiaSalesTableProps> = ({
  title = "Análisis de Ventas Auditadas por Mes (12 Meses — Ene a Dic)",
  subtitle = "Desglose auditado conforme a libros contables: Cobro con Tarjeta (TDC) vs. Efectivo Mostrador, Gastos y Utilidad Neta.",
  defaultExpanded = true,
  showToggle = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Combine Ventas with Resumen de Utilidad
  const monthlyRows = VENTAS_ZAKIA.map(v => {
    const res = RESUMEN_UTILIDAD_ZAKIA.find(r => r.mes === v.mes) || {
      gastosOperativos: TOTALES_CONSOLIDADOS.gastosMensualesZakia,
      utilidadNeta: v.ventaTotalMensual - TOTALES_CONSOLIDADOS.gastosMensualesZakia,
      margen: ((v.ventaTotalMensual - TOTALES_CONSOLIDADOS.gastosMensualesZakia) / v.ventaTotalMensual) * 100
    };
    return {
      ...v,
      gastosOperativos: res.gastosOperativos,
      utilidadNeta: res.utilidadNeta,
      margen: res.margen
    };
  });

  const totalTdc = monthlyRows.reduce((acc, r) => acc + r.puntoDeVentaTDC, 0);
  const totalEfectivo = monthlyRows.reduce((acc, r) => acc + r.ventasMostradorEfectivo, 0);
  const totalVentas = monthlyRows.reduce((acc, r) => acc + r.ventaTotalMensual, 0);
  const totalGastos = monthlyRows.reduce((acc, r) => acc + r.gastosOperativos, 0);
  const totalUtilidad = monthlyRows.reduce((acc, r) => acc + r.utilidadNeta, 0);
  const pctTdcAnual = ((totalTdc / totalVentas) * 100).toFixed(1);
  const pctEfectivoAnual = ((totalEfectivo / totalVentas) * 100).toFixed(1);
  const margenAnual = ((totalUtilidad / totalVentas) * 100).toFixed(1);

  const promTdc = Math.round(totalTdc / monthlyRows.length);
  const promEfectivo = Math.round(totalEfectivo / monthlyRows.length);
  const promVentas = Math.round(totalVentas / monthlyRows.length);
  const promGastos = Math.round(totalGastos / monthlyRows.length);
  const promUtilidad = Math.round(totalUtilidad / monthlyRows.length);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all">
      {/* Header with optional collapse toggle */}
      <div 
        onClick={showToggle ? () => setIsExpanded(!isExpanded) : undefined}
        className={`p-5 sm:p-6 border-b border-stone-200 bg-gradient-to-r from-stone-50 to-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          showToggle ? 'cursor-pointer hover:bg-stone-50' : ''
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 mb-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
            Proyección Real Ene-Sep &bull; Oct-Dic Proyectados (Sucursal Zákia)
          </div>
          <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            {subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <div className="text-xs text-stone-500 font-medium">Total Anual Auditado</div>
            <div className="text-base font-extrabold text-stone-900 font-mono">
              {formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}
            </div>
          </div>

          {showToggle && (
            <button 
              type="button" 
              className="p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
              aria-label={isExpanded ? "Ocultar tabla" : "Desplegar tabla"}
            >
              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Quick Metrics Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200 text-xs">
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Tarjeta (TDC) 12M</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(totalTdc)}
              </div>
              <span className="text-[11px] text-stone-500">{pctTdcAnual}% del total</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <Coins className="w-3.5 h-3.5" />
                <span>Efectivo Mostrador 12M</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(totalEfectivo)}
              </div>
              <span className="text-[11px] text-stone-500">{pctEfectivoAnual}% del total</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-700 font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Venta Promedio Mes</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(promVentas)}
              </div>
              <span className="text-[11px] text-stone-500">12 meses auditados</span>
            </div>

            <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Utilidad Neta Anual</span>
              </div>
              <div className="text-base font-extrabold text-emerald-900 font-mono">
                {formatCurrency(totalUtilidad)}
              </div>
              <span className="text-[11px] text-emerald-700 font-semibold">{margenAnual}% margen neto anual</span>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-100/80 border-b border-stone-200 text-stone-700 uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3.5 text-center w-12">No.</th>
                  <th className="py-3 px-4 font-bold text-stone-900">Mes</th>
                  <th className="py-3 px-4 text-right">Punto de Venta (Tarjeta)</th>
                  <th className="py-3 px-3 text-right text-stone-500">% TDC</th>
                  <th className="py-3 px-4 text-right">Ventas Mostrador (Ef)</th>
                  <th className="py-3 px-3 text-right text-stone-500">% Ef</th>
                  <th className="py-3 px-4 text-right font-bold text-stone-900 bg-stone-100/50">Venta Total Mensual</th>
                  <th className="py-3 px-4 text-right text-stone-700">Gastos Operativos</th>
                  <th className="py-3 px-4 text-right font-bold text-emerald-950 bg-emerald-50/50">Utilidad Neta</th>
                  <th className="py-3 px-3.5 text-right font-semibold text-emerald-900">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {monthlyRows.map((v) => (
                  <tr key={v.no} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-2.5 px-3.5 text-center font-mono text-stone-400 font-medium">{v.no}</td>
                    <td className="py-2.5 px-4 font-semibold text-stone-900">{v.mes}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-800">{formatCurrency(v.puntoDeVentaTDC)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-800 font-medium">{formatPercent(v.porcentajeTDC)}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-800">{formatCurrency(v.ventasMostradorEfectivo)}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-stone-500">{formatPercent(v.porcentajeEfectivo)}</td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-stone-950 bg-stone-50/50">
                      {formatCurrency(v.ventaTotalMensual)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-stone-600">
                      {formatCurrency(v.gastosOperativos)}
                    </td>
                    <td className={`py-2.5 px-4 text-right font-mono font-bold bg-emerald-50/30 ${
                      v.utilidadNeta > 100000 ? 'text-emerald-950 font-extrabold' : 'text-emerald-900'
                    }`}>
                      {formatCurrency(v.utilidadNeta)}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-emerald-800">
                      {formatPercent(v.margen)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-stone-300 font-bold text-stone-900 bg-stone-50 text-xs sm:text-sm">
                {/* Total Anual Row */}
                <tr className="border-b border-stone-200">
                  <td colSpan={2} className="py-3.5 px-4 uppercase tracking-wider text-xs font-bold text-stone-800">
                    Total Anual (12 Meses)
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-900">{formatCurrency(totalTdc)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-amber-800">{pctTdcAnual}%</td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-900">{formatCurrency(totalEfectivo)}</td>
                  <td className="py-3.5 px-3 text-right font-mono text-stone-600">{pctEfectivoAnual}%</td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-950 font-extrabold bg-stone-100 text-sm sm:text-base">
                    {formatCurrency(totalVentas)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-stone-700">
                    {formatCurrency(totalGastos)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-950 font-extrabold bg-emerald-100/70 text-sm sm:text-base">
                    {formatCurrency(totalUtilidad)}
                  </td>
                  <td className="py-3.5 px-3.5 text-right font-mono text-emerald-900 font-extrabold">
                    {margenAnual}%
                  </td>
                </tr>

                {/* Promedio Mensual Row */}
                <tr className="bg-amber-50/60">
                  <td colSpan={2} className="py-3 px-4 uppercase tracking-wider text-xs font-bold text-amber-950">
                    Promedio Mensual Real
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(promTdc)}</td>
                  <td className="py-3 px-3 text-right font-mono text-amber-900">{pctTdcAnual}%</td>
                  <td className="py-3 px-4 text-right font-mono text-stone-800">{formatCurrency(promEfectivo)}</td>
                  <td className="py-3 px-3 text-right font-mono text-stone-600">{pctEfectivoAnual}%</td>
                  <td className="py-3 px-4 text-right font-mono text-amber-950 font-extrabold bg-amber-100/50">
                    {formatCurrency(promVentas)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-stone-700">
                    {formatCurrency(promGastos)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-950 font-extrabold bg-emerald-100/50">
                    {formatCurrency(promUtilidad)}
                  </td>
                  <td className="py-3 px-3.5 text-right font-mono text-emerald-900 font-extrabold">
                    {margenAnual}%
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-stone-500">
            <div>
              <strong>Nota contable:</strong> Enero ($608k), Octubre ($527k), Noviembre ($535k) y Diciembre ($612k) reflejan picos de alta temporada (Roscas de Reyes, Pan de Muerto y festividades navideñas).
            </div>
            <div className="text-stone-700 font-semibold whitespace-nowrap">
              Corte contable oficial 12 Meses
            </div>
          </div>
        </>
      )}
    </div>
  );
};
