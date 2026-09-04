import React from 'react';
import { TOTALES_CONSOLIDADOS, BENCHMARK_INMUEBLE, BENCHMARK_BANCO } from '../data/financialData';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Store, ShieldCheck, Printer, X, CheckCircle2 } from 'lucide-react';

interface PrintExecutiveReportProps {
  onClose: () => void;
}

export const PrintExecutiveReport: React.FC<PrintExecutiveReportProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 overflow-hidden border border-stone-200">
        {/* Actions Bar */}
        <div className="bg-stone-900 text-white p-4 px-6 flex justify-between items-center print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm">Vista Previa para Impresión / Exportación PDF</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Guardar PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-stone-300 transition-colors"
              title="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Content */}
        <div className="p-8 sm:p-12 space-y-8 print:p-0 text-stone-900 font-sans" id="printable-report">
          {/* Header */}
          <div className="border-b-2 border-amber-900 pb-6 flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
                Resumen Ejecutivo para Inversionistas &bull; Confidencial
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                Plan de Negocios &bull; Adquisición Panadería Santa Fé 10 MDP
              </h1>
              <p className="text-xs text-stone-600 mt-1">
                Panadería Santa Fé &bull; Sucursales Zákia y El Refugio &bull; Santiago de Querétaro
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-stone-700 block">Ronda de Capital</span>
              <span className="text-xl font-bold text-amber-900 font-mono">$10,000,000 MXN</span>
            </div>
          </div>

          {/* Core Numbers Table */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
              1. Métricas Financieras Consolidadas (Ventas &amp; Utilidad Neta)
            </h3>
            <table className="w-full text-xs text-left border border-stone-200">
              <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5 border-b">Concepto</th>
                  <th className="p-2.5 border-b text-right">Sucursal Zákia</th>
                  <th className="p-2.5 border-b text-right">Sucursal El Refugio</th>
                  <th className="p-2.5 border-b text-right font-bold text-stone-900">Total Consolidado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-2.5 font-medium">Venta Promedio Mensual</td>
                  <td className="p-2.5 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasZakia)}</td>
                  <td className="p-2.5 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasRefugio)}</td>
                  <td className="p-2.5 text-right font-mono font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.promedioMensualVentasTotal)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Gasto Operativo Mensual</td>
                  <td className="p-2.5 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesZakia)}</td>
                  <td className="p-2.5 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesRefugio)}</td>
                  <td className="p-2.5 text-right font-mono font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.gastosMensualesTotal)}</td>
                </tr>
                <tr className="bg-amber-50/60 font-bold">
                  <td className="p-2.5 text-amber-950 font-bold">Utilidad Neta Mensual</td>
                  <td className="p-2.5 text-right font-mono text-amber-900">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualZakia)}</td>
                  <td className="p-2.5 text-right font-mono text-amber-900">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualRefugio)}</td>
                  <td className="p-2.5 text-right font-mono text-amber-950 font-extrabold">{formatCurrency(TOTALES_CONSOLIDADOS.utilidadMensualTotal)}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Margen Operativo (%)</td>
                  <td className="p-2.5 text-right font-mono">17.6%</td>
                  <td className="p-2.5 text-right font-mono">17.0%</td>
                  <td className="p-2.5 text-right font-mono font-bold">{TOTALES_CONSOLIDADOS.margenPonderadoTotal}%</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Venta Anual Auditada (12 Meses)</td>
                  <td className="p-2.5 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesZakia12M)}</td>
                  <td className="p-2.5 text-right font-mono">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesRefugio12M)}</td>
                  <td className="p-2.5 text-right font-mono font-bold">{formatCurrency(TOTALES_CONSOLIDADOS.ventasAnualesCadenaTotal)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Comparativa vs Banco y Bienes Raíces */}
          <div>
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
              2. Comparativa de Retornos: Panadería Santa Fé vs. Banco vs. Casa (Bienes Raíces)
            </h3>
            <p className="text-xs text-stone-600 mb-3">
              Basado en el caso de referencia de una <strong>casa de $2.2 MDP cobrando renta de $11,500/mes</strong>:
            </p>
            <table className="w-full text-xs text-left border border-stone-200">
              <thead className="bg-stone-100 text-stone-700 uppercase font-bold text-[10px]">
                <tr>
                  <th className="p-2.5 border-b">Alternativa</th>
                  <th className="p-2.5 border-b text-right">Inversión ($2.2 MDP)</th>
                  <th className="p-2.5 border-b text-right">Tasa Efectiva</th>
                  <th className="p-2.5 border-b text-right">Flujo Mensual en Efectivo</th>
                  <th className="p-2.5 border-b text-right font-bold">Flujo Anual</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                <tr>
                  <td className="p-2.5 font-medium">Casa / Bienes Raíces (Renta Bruta)</td>
                  <td className="p-2.5 text-right font-mono">$2,200,000</td>
                  <td className="p-2.5 text-right font-mono">6.27% anual</td>
                  <td className="p-2.5 text-right font-mono">$11,500 / mes</td>
                  <td className="p-2.5 text-right font-mono">$138,000</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-stone-700">Casa / Bienes Raíces (Renta Neta -15% gastos)</td>
                  <td className="p-2.5 text-right font-mono text-stone-700">$2,200,000</td>
                  <td className="p-2.5 text-right font-mono text-stone-700">5.33% anual</td>
                  <td className="p-2.5 text-right font-mono text-stone-700">$9,775 / mes</td>
                  <td className="p-2.5 text-right font-mono text-stone-700">$117,300</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-medium">Pagaré Bancario / Cetes</td>
                  <td className="p-2.5 text-right font-mono">$2,200,000</td>
                  <td className="p-2.5 text-right font-mono">9.00% anual</td>
                  <td className="p-2.5 text-right font-mono">$16,500 / mes</td>
                  <td className="p-2.5 text-right font-mono">$198,000</td>
                </tr>
                <tr className="bg-amber-100/70 font-bold">
                  <td className="p-2.5 text-amber-950">Panadería Santa Fé (Escala 13% - 16%)</td>
                  <td className="p-2.5 text-right font-mono text-amber-950">$2,200,000</td>
                  <td className="p-2.5 text-right font-mono text-amber-950">13.0% - 16.0%</td>
                  <td className="p-2.5 text-right font-mono font-extrabold text-amber-900 text-sm">
                    $23,833 - $29,333 / mes
                  </td>
                  <td className="p-2.5 text-right font-mono font-bold text-amber-950">
                    $286,000 - $352,000
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Garantías y Seguridad */}
          <div className="pt-2">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <h4 className="text-xs font-bold uppercase text-stone-800 mb-2">
                Seguridad Jurídica &amp; Cobertura Operativa
              </h4>
              <div className="grid grid-cols-2 gap-4 text-xs text-stone-700">
                <ul className="space-y-1">
                  <li>&bull; <strong>Utilidad Neta Actual:</strong> $187,973/mes promedio auditado.</li>
                  <li>&bull; <strong>Respaldo de Activos:</strong> Hornos continuos, maquinaria, camionetas e inventarios.</li>
                </ul>
                <ul className="space-y-1">
                  <li>&bull; <strong>Instrumento Jurídico:</strong> Contrato mercantil notariado con calendario de pagos fijos.</li>
                  <li>&bull; <strong>Razón de Cobertura:</strong> Flujo de caja comprobado cubre holgadamente los rendimientos.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Signatures placeholder */}
          <div className="pt-8 border-t border-stone-300 grid grid-cols-2 gap-12 text-center text-xs text-stone-700">
            <div>
              <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
              <p className="font-bold text-stone-900">Dirección General &bull; Panadería Santa Fé</p>
              <p className="text-[10px]">Representante Legal &bull; Ronda de Capital 10 MDP</p>
            </div>
            <div>
              <div className="w-48 h-px bg-stone-400 mx-auto mb-2" />
              <p className="font-bold text-stone-900">Inversionista / Participante</p>
              <p className="text-[10px]">Nombre y Firma de Conformidad</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
