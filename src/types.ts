export interface GastoRubro {
  no: number;
  categoria: string;
  concepto: string;
  gastoSemanal: number;
  gastoDiario: number;
  proyeccionMensual: number;
  porcentajeTotal: number;
  descripcion?: string;
  tipo?: 'fijo' | 'variable' | 'materia_prima' | 'personal';
  tendencia?: 'subio' | 'bajo';
  gastoAnteriorSemanal?: number;
}

export interface VentaMensualZakia {
  no: number;
  mes: string;
  puntoDeVentaTDC: number;
  ventasMostradorEfectivo: number;
  ventaTotalMensual: number;
  porcentajeTDC: number;
  porcentajeEfectivo: number;
}

export interface VentaMensualRefugio {
  no: number;
  mes: string;
  cobroTarjetaTDC: number;
  efectivoCalculado: number;
  ventaTotalMostrador: number;
  reparto: number;
  transferenciasCautivos: number;
  ventaTotalMensual: number;
}

export interface ResumenUtilidadMensual {
  mes: string;
  ventaTotal: number;
  gastosOperativos: number;
  utilidadNeta: number;
  margen: number;
  detallesAdicionales?: Record<string, number>;
}

export interface SucursalData {
  id: 'zakia' | 'refugio';
  nombre: string;
  ubicacion: string;
  gastos: GastoRubro[];
  totalGastosSemanal: number;
  totalGastosDiario: number;
  totalGastosMensual: number;
  ventasMensuales: (VentaMensualZakia | VentaMensualRefugio)[];
  resumenUtilidad: ResumenUtilidadMensual[];
  promedios: {
    ventaMensual: number;
    gastoMensual: number;
    utilidadMensual: number;
    margenPromedio: number;
  };
  totales7Meses: {
    ventas: number;
    gastos: number;
    utilidad: number;
    margen: number;
  };
}

export interface SimulacionInversion {
  monto: number;
  tasaAnual: number; // e.g. 12% -> 12
  plazoAnios: number;
  modoCapitalizacion: 'mensual_efectivo' | 'compuesto_anual';
}

export type TabId = 'inicio' | 'pitch' | 'zakia' | 'refugio' | 'unificado' | 'calculadora' | 'propuesta';
