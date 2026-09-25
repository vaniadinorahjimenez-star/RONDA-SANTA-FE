import React, { useState } from 'react';
import { VENTAS_REFUGIO, RESUMEN_UTILIDAD_REFUGIO, TOTALES_CONSOLIDADOS } from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { CreditCard, Coins, Truck, Building2, TrendingUp, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface RefugioSalesTableProps {
  title?: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  showToggle?: boolean;
}

export const RefugioSalesTable: React.FC<RefugioSalesTableProps> = ({
  title = "Tabla de Ventas e Ingresos por Canal (12 Meses: Ene - Dic)",
  subtitle = "Desglose auditado y anualizado conforme a libros contables: Cobro Tarjeta (TDC), Efectivo Mostrador, Reparto Mayorista, Transferencias Cautivos y Utilidad Neta.",
  defaultExpanded = true,
  showToggle = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Dynamic totals and averages computed directly from validated data
  const totalTdc = VENTAS_REFUGIO.reduce((s, v) => s + v.cobroTarjetaTDC, 0);
  const totalEfectivo = VENTAS_REFUGIO.reduce((s, v) => s + v.efectivoCalculado, 0);
  const totalMostrador = VENTAS_REFUGIO.reduce((s, v) => s + v.ventaTotalMostrador, 0);
  const totalReparto = VENTAS_REFUGIO.reduce((s, v) => s + v.reparto, 0);
  const totalCautivos = VENTAS_REFUGIO.reduce((s, v) => s + v.transferenciasCautivos, 0);
  const totalVentas = TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M;
  const totalGastos = TOTALES_CONSOLIDADOS.gastosAnualesRefugio12M;
  const totalUtilidad = TOTALES_CONSOLIDADOS.utilidadAnualRefugio12M;
  const margenAnual = ((totalUtilidad / totalVentas) * 100).toFixed(1);

  // Combine Ventas with Resumen de Utilidad
  const monthlyRows = VENTAS_REFUGIO.map(v => {
    const res = RESUMEN_UTILIDAD_REFUGIO.find(r => r.mes === v.mes) || {
      gastosOperativos: TOTALES_CONSOLIDADOS.gastosMensualesRefugio,
      utilidadNeta: v.ventaTotalMensual - TOTALES_CONSOLIDADOS.gastosMensualesRefugio,
      margen: ((v.ventaTotalMensual - TOTALES_CONSOLIDADOS.gastosMensualesRefugio) / v.ventaTotalMensual) * 100
    };
    return {
      ...v,
      gastosOperativos: res.gastosOperativos,
      utilidadNeta: res.utilidadNeta,
      margen: res.margen
    };
  });

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
            Proyección Real Ene-Sep &bull; Oct-Dic Proyectados (Sucursal El Refugio)
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
            <div className="text-xs text-stone-500 font-medium">Venta Total Anual (12M)</div>
            <div className="text-base font-extrabold text-stone-900 font-mono">
              {formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M)}
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
          {/* Quick Channel Breakdown Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3 p-4 sm:p-5 bg-stone-50/70 border-b border-stone-200 text-xs">
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Tarjeta (TDC) Real</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(totalTdc)}
              </div>
              <span className="text-[11px] text-stone-500">Promedio: {formatCurrency(Math.round(totalTdc / 12))}/m ({((totalTdc / totalVentas) * 100).toFixed(1)}%)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <Coins className="w-3.5 h-3.5" />
                <span>Efectivo Validado</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(totalEfectivo)}
              </div>
              <span className="text-[11px] text-stone-500">Promedio: {formatCurrency(Math.round(totalEfectivo / 12))}/m ({((totalEfectivo / totalVentas) * 100).toFixed(1)}%)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-stone-700 font-semibold mb-1">
                <TrendingUp className="w-3.5 h-3.5 text-stone-800" />
                <span>Venta Total Mostrador</span>
              </div>
              <div className="text-base font-bold text-amber-950 font-mono">
                {formatCurrency(totalMostrador)}
              </div>
              <span className="text-[11px] text-stone-500">Promedio: {formatCurrency(Math.round(totalMostrador / 12))}/m ({((totalMostrador / totalVentas) * 100).toFixed(1)}%)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold mb-1">
                <Truck className="w-3.5 h-3.5" />
                <span>Rutas de Reparto</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(totalReparto)}
              </div>
              <span className="text-[11px] text-stone-500">Promedio: {formatCurrency(Math.round(totalReparto / 12))}/m ({((totalReparto / totalVentas) * 100).toFixed(1)}%)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200 col-span-2 lg:col-span-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold mb-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>Transf. Cautivos</span>
              </div>
              <div className="text-base font-bold text-stone-900 font-mono">
                {formatCurrency(totalCautivos)}
              </div>
              <span className="text-[11px] text-stone-500">Promedio: {formatCurrency(Math.round(totalCautivos / 12))}/m ({((totalCautivos / totalVentas) * 100).toFixed(1)}%)</span>
            </div>
          </div>

          {/* Full Audited 12-Month Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[11px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-3 sm:px-4">No.</th>
                  <th className="py-3 px-3 sm:px-4">Mes</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Cobro Tarjeta (TDC) Real</th>
                  <th className="py-3 px-3 sm:px-4 text-right">Efectivo Validado</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-bold text-amber-950">Venta Total Mostrador</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-semibold text-stone-800">REPARTO</th>
                  <th className="py-3 px-3 sm:px-4 text-right">TRANSFERENCIAS CAUTIVOS</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-extrabold text-stone-900 bg-amber-50/40">VENTA TOTAL MENSUAL</th>
                  <th className="py-3 px-3 sm:px-4 text-right text-stone-500">Gastos Op.</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-bold text-emerald-800">Utilidad Neta</th>
                  <th className="py-3 px-3 sm:px-4 text-right font-semibold text-emerald-900">Margen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {monthlyRows.map((v) => (
                  <tr key={v.mes} className="hover:bg-amber-50/30 transition-colors">
                    <td className="py-3 px-3 sm:px-4 font-mono text-stone-400 font-semibold">{v.no}</td>
                    <td className="py-3 px-3 sm:px-4 font-semibold text-stone-900 whitespace-nowrap">{v.mes}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono text-stone-700 whitespace-nowrap">{formatCurrency(v.cobroTarjetaTDC)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono text-stone-700 whitespace-nowrap">{formatCurrency(v.efectivoCalculado)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold text-amber-900 whitespace-nowrap">{formatCurrency(v.ventaTotalMostrador)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono font-semibold text-stone-800 whitespace-nowrap">{formatCurrency(v.reparto)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono text-stone-700 whitespace-nowrap">{formatCurrency(v.transferenciasCautivos)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono font-extrabold text-stone-900 bg-amber-50/30 whitespace-nowrap">{formatCurrency(v.ventaTotalMensual)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono text-stone-500 whitespace-nowrap">{formatCurrency(v.gastosOperativos)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">{formatCurrency(v.utilidadNeta)}</td>
                    <td className="py-3 px-3 sm:px-4 text-right font-mono font-semibold text-emerald-800 whitespace-nowrap">{formatPercent(v.margen)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-stone-300 font-bold text-stone-900">
                {/* Total Anual Row */}
                <tr className="bg-stone-100/80">
                  <td colSpan={2} className="py-3 px-3 sm:px-4 uppercase text-xs tracking-wider">TOTAL ANUAL (12 MESES)</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono">{formatCurrency(totalTdc)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono">{formatCurrency(totalEfectivo)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold text-amber-950">{formatCurrency(totalMostrador)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono font-bold">{formatCurrency(totalReparto)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono">{formatCurrency(totalCautivos)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-amber-950 text-base font-extrabold bg-amber-100/60">
                    {formatCurrency(totalVentas)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-stone-700">{formatCurrency(totalGastos)}</td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-emerald-800 text-base font-extrabold">
                    {formatCurrency(totalUtilidad)}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-right font-mono text-emerald-900 font-bold">{margenAnual}%</td>
                </tr>

                {/* Promedio Mensual Row */}
                <tr className="bg-amber-50/70 border-t border-amber-200">
                  <td colSpan={2} className="py-2.5 px-3 sm:px-4 uppercase text-xs text-amber-950 tracking-wider">PROMEDIO MENSUAL</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-stone-800">{formatCurrency(Math.round(totalTdc / 12))}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-stone-800">{formatCurrency(Math.round(totalEfectivo / 12))}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono font-bold text-amber-950">{formatCurrency(Math.round(totalMostrador / 12))}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-stone-800 font-bold">{formatCurrency(Math.round(totalReparto / 12))}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-stone-800">{formatCurrency(Math.round(totalCautivos / 12))}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-amber-950 font-extrabold text-base bg-amber-200/50">
                    {formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-stone-800">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesRefugio)}</td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-emerald-900 font-extrabold text-base">
                    {formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}
                  </td>
                  <td className="py-2.5 px-3 sm:px-4 text-right font-mono text-emerald-950 font-bold">{margenAnual}%</td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-stone-600 gap-2">
            <div>
              <strong>Canales de Venta:</strong> Mostrador Tienda ({((totalMostrador / totalVentas) * 100).toFixed(1)}% = {((totalTdc / totalVentas) * 100).toFixed(1)}% Tarjeta + {((totalEfectivo / totalVentas) * 100).toFixed(1)}% Efectivo) &bull; Rutas de Reparto ({((totalReparto / totalVentas) * 100).toFixed(1)}%) &bull; Clientes Cautivos ({((totalCautivos / totalVentas) * 100).toFixed(1)}%).
            </div>
            <div className="font-semibold text-amber-900">
              Auditoría Validada: {formatCurrency(totalVentas)} MXN / Año
            </div>
          </div>
        </>
      )}
    </div>
  );
};
