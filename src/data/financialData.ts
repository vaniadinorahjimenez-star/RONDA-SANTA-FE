import { GastoRubro, VentaMensualZakia, VentaMensualRefugio, ResumenUtilidadMensual } from '../types';

export const GASTOS_ZAKIA: GastoRubro[] = [
  {
    no: 1,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'Nómina Operativa Semanal',
    gastoSemanal: 28000,
    gastoDiario: 4000.00,
    proyeccionMensual: 121600.00,
    porcentajeTotal: 30.4,
    descripcion: 'Personal de horneado, maestros panaderos, cajeros y atención en barra.',
    tipo: 'personal'
  },
  {
    no: 2,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'IMSS e INFONAVIT Patronal',
    gastoSemanal: 1385,
    gastoDiario: 197.86,
    proyeccionMensual: 6014.86,
    porcentajeTotal: 1.5,
    descripcion: 'Aportaciones de seguridad social y prestaciones conforme a la ley.',
    tipo: 'personal'
  },
  {
    no: 3,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Renta de Local Comercial',
    gastoSemanal: 8076,
    gastoDiario: 1153.71,
    proyeccionMensual: 35072.91,
    porcentajeTotal: 8.8,
    descripcion: 'Arrendamiento de local comercial premium ubicado en Plaza Comercial Zákia.',
    tipo: 'fijo'
  },
  {
    no: 4,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Gas LP para Hornos de Panadería',
    gastoSemanal: 1500,
    gastoDiario: 214.29,
    proyeccionMensual: 6514.29,
    porcentajeTotal: 1.6,
    descripcion: 'Combustible vital para operación de hornos continuos de alta eficiencia.',
    tipo: 'variable'
  },
  {
    no: 5,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Luz',
    gastoSemanal: 923,
    gastoDiario: 131.86,
    proyeccionMensual: 4008.46,
    porcentajeTotal: 1.0,
    descripcion: 'Consumo eléctrico CFE para cámaras de fermentación, refrigeración e iluminación.',
    tipo: 'fijo'
  },
  {
    no: 6,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Agua',
    gastoSemanal: 415,
    gastoDiario: 59.29,
    proyeccionMensual: 1802.29,
    porcentajeTotal: 0.5,
    descripcion: 'Servicio de agua potable y filtración para masa y aseo.',
    tipo: 'fijo'
  },
  {
    no: 7,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Mantenimiento plaza',
    gastoSemanal: 1234,
    gastoDiario: 176.29,
    proyeccionMensual: 5359.09,
    porcentajeTotal: 1.3,
    descripcion: 'Cuota de condominio de la plaza (vigilancia, áreas comunes y estacionamiento).',
    tipo: 'fijo'
  },
  {
    no: 8,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Arrendamiento camioneta',
    gastoSemanal: 3115,
    gastoDiario: 445.00,
    proyeccionMensual: 13528.00,
    porcentajeTotal: 3.4,
    descripcion: 'Leasing de unidad de transporte y logística para traslado de insumos.',
    tipo: 'fijo'
  },
  {
    no: 9,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Mantenimiento General y Maquinaria',
    gastoSemanal: 1384,
    gastoDiario: 197.71,
    proyeccionMensual: 6010.51,
    porcentajeTotal: 1.5,
    descripcion: 'Mantenimiento preventivo a amasadoras, batidoras, divisoras y hornos.',
    tipo: 'variable'
  },
  {
    no: 10,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Fumigación y Control de Plagas',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 2.2,
    descripcion: 'Certificaciones sanitarias y control grado alimenticio quincenal.',
    tipo: 'fijo'
  },
  {
    no: 11,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Papelería, Empaques y Telefonía/Internet',
    gastoSemanal: 130,
    gastoDiario: 18.57,
    proyeccionMensual: 564.57,
    porcentajeTotal: 0.1,
    descripcion: 'Bolsas ecológicas, cajas, tickets e internet para terminales punto de venta.',
    tipo: 'variable'
  },
  {
    no: 12,
    categoria: 'Operación y Mantenimiento',
    concepto: 'otros (materiales limpieza, compras externas)',
    gastoSemanal: 3000,
    gastoDiario: 428.57,
    proyeccionMensual: 13028.57,
    porcentajeTotal: 3.3,
    descripcion: 'Químicos sanitizantes, cofias, delantales y compras menores imprevistas.',
    tipo: 'variable'
  },
  {
    no: 13,
    categoria: 'Administración y Fiscal',
    concepto: 'Impuestos y Cargas Fiscales Estimadas',
    gastoSemanal: 2307,
    gastoDiario: 329.57,
    proyeccionMensual: 10018.97,
    porcentajeTotal: 2.5,
    descripcion: 'Provisión para pagos provisionales de ISR y retenciones fiscales.',
    tipo: 'fijo'
  },
  {
    no: 14,
    categoria: 'Administración y Fiscal',
    concepto: 'Contabilidad',
    gastoSemanal: 1000,
    gastoDiario: 142.86,
    proyeccionMensual: 4342.86,
    porcentajeTotal: 1.1,
    descripcion: 'Honorarios de despacho contable externo, conciliaciones y nómina.',
    tipo: 'fijo'
  },
  {
    no: 15,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Dialpa',
    gastoSemanal: 25000,
    gastoDiario: 3571.43,
    proyeccionMensual: 108571.43,
    porcentajeTotal: 27.2,
    descripcion: 'Proveedor principal de harinas de fuerza, levaduras y mejoradores.',
    tipo: 'materia_prima'
  },
  {
    no: 16,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Cremeria americana',
    gastoSemanal: 3,
    gastoDiario: 0.43,
    proyeccionMensual: 13.03,
    porcentajeTotal: 0.0,
    descripcion: 'Insumos lácteos complementarios.',
    tipo: 'materia_prima'
  },
  {
    no: 17,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Materia Prima el Trigal',
    gastoSemanal: 3500,
    gastoDiario: 500.00,
    proyeccionMensual: 15200.00,
    porcentajeTotal: 3.8,
    descripcion: 'Chocolates para repostería, mermeladas, coberturas y semillas.',
    tipo: 'materia_prima'
  },
  {
    no: 18,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Huevo',
    gastoSemanal: 3000,
    gastoDiario: 428.57,
    proyeccionMensual: 13028.57,
    porcentajeTotal: 3.3,
    descripcion: 'Huevo fresco de granja grado A para masas finas y pan dulce.',
    tipo: 'materia_prima'
  },
  {
    no: 19,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Mantequilla',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 2.2,
    descripcion: 'Mantequilla 100% de vaca para hojaldres, croissants y brioche artesanal.',
    tipo: 'materia_prima'
  },
  {
    no: 20,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Queso crema',
    gastoSemanal: 545,
    gastoDiario: 77.86,
    proyeccionMensual: 2366.86,
    porcentajeTotal: 0.6,
    descripcion: 'Rellenos de pays, danesas y repostería salada/dulce.',
    tipo: 'materia_prima'
  },
  {
    no: 21,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Coca cola y Alpura',
    gastoSemanal: 800,
    gastoDiario: 114.29,
    proyeccionMensual: 3474.29,
    porcentajeTotal: 0.9,
    descripcion: 'Bebidas embotelladas y leche fresca para venta directa en mostrador.',
    tipo: 'materia_prima'
  },
  {
    no: 22,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Quesos',
    gastoSemanal: 850,
    gastoDiario: 121.43,
    proyeccionMensual: 3691.43,
    porcentajeTotal: 0.9,
    descripcion: 'Quesos manchego y oaxaca para panadería rellena y empanadas.',
    tipo: 'materia_prima'
  },
  {
    no: 23,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Nata',
    gastoSemanal: 1800,
    gastoDiario: 257.14,
    proyeccionMensual: 7817.14,
    porcentajeTotal: 2.0,
    descripcion: 'Nata fresca tradicional para conchas rellenas y especialidades de la casa.',
    tipo: 'materia_prima'
  }
];

export const GASTOS_REFUGIO: GastoRubro[] = [
  {
    no: 1,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'Nómina Operativa Semanal',
    gastoSemanal: 50000,
    gastoDiario: 7142.86,
    proyeccionMensual: 217142.86,
    porcentajeTotal: 30.8,
    descripcion: 'Nómina completa de producción intensiva, maestros panaderos, reparto y cajas.',
    tipo: 'personal'
  },
  {
    no: 2,
    categoria: 'Mano de Obra y Cargas',
    concepto: 'IMSS e INFONAVIT Patronal',
    gastoSemanal: 2538,
    gastoDiario: 362.57,
    proyeccionMensual: 11022.17,
    porcentajeTotal: 1.6,
    descripcion: 'Cargas sociales y aportaciones patronales de ley.',
    tipo: 'personal'
  },
  {
    no: 3,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Renta de Local Comercial',
    gastoSemanal: 8800,
    gastoDiario: 1257.14,
    proyeccionMensual: 38217.14,
    porcentajeTotal: 5.4,
    descripcion: 'Arrendamiento de local matriz con alta afluencia peatonal en El Refugio.',
    tipo: 'fijo'
  },
  {
    no: 4,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Gas LP para Hornos de Panadería',
    gastoSemanal: 5000,
    gastoDiario: 714.29,
    proyeccionMensual: 21714.29,
    porcentajeTotal: 3.1,
    descripcion: 'Gas LP industrial para hornos de alta capacidad que alimentan producción propia y reparto.',
    tipo: 'variable'
  },
  {
    no: 5,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Luz',
    gastoSemanal: 1700,
    gastoDiario: 242.86,
    proyeccionMensual: 7382.86,
    porcentajeTotal: 1.0,
    descripcion: 'Suministro trifásico para cámaras de refrigeración y maquinaria pesada.',
    tipo: 'fijo'
  },
  {
    no: 6,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Agua',
    gastoSemanal: 0,
    gastoDiario: 0.00,
    proyeccionMensual: 0.00,
    porcentajeTotal: 0.0,
    descripcion: 'Servicio incluido en el condominio/plaza comercial.',
    tipo: 'fijo'
  },
  {
    no: 7,
    categoria: 'Instalaciones y Servicios',
    concepto: 'Mantenimiento plaza',
    gastoSemanal: 1900,
    gastoDiario: 271.43,
    proyeccionMensual: 8251.43,
    porcentajeTotal: 1.2,
    descripcion: 'Mantenimiento de centro comercial El Refugio y vigilancia 24/7.',
    tipo: 'fijo'
  },
  {
    no: 8,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Gasolinas para Rutas de Reparto',
    gastoSemanal: 10000,
    gastoDiario: 1428.57,
    proyeccionMensual: 43428.57,
    porcentajeTotal: 6.2,
    descripcion: 'Combustible para flota de camionetas en rutas de entrega a cafeterías y clientes.',
    tipo: 'variable'
  },
  {
    no: 9,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Mantenimiento General y Maquinaria',
    gastoSemanal: 10000,
    gastoDiario: 1428.57,
    proyeccionMensual: 43428.57,
    porcentajeTotal: 6.2,
    descripcion: 'Servicio a vehículos utilitarios, hornos giratorios y equipos industriales.',
    tipo: 'variable'
  },
  {
    no: 10,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Fumigación y Control de Plagas',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 1.2,
    descripcion: 'Control sanitario estricto con certificación COFEPRIS.',
    tipo: 'fijo'
  },
  {
    no: 11,
    categoria: 'Operación y Mantenimiento',
    concepto: 'Papelería, Empaques y Telefonía/Internet',
    gastoSemanal: 130,
    gastoDiario: 18.57,
    proyeccionMensual: 564.57,
    porcentajeTotal: 0.1,
    descripcion: 'Empaque para producto final, charolas desechables y enlace digital.',
    tipo: 'variable'
  },
  {
    no: 12,
    categoria: 'Operación y Mantenimiento',
    concepto: 'otros (materiales limpieza, compras externas)',
    gastoSemanal: 4000,
    gastoDiario: 571.43,
    proyeccionMensual: 17371.43,
    porcentajeTotal: 2.5,
    descripcion: 'Insumos de limpieza profunda, cofias, uniformes e insumos auxiliares.',
    tipo: 'variable'
  },
  {
    no: 13,
    categoria: 'Administración y Fiscal',
    concepto: 'Impuestos y Cargas Fiscales Estimadas',
    gastoSemanal: 2000,
    gastoDiario: 285.71,
    proyeccionMensual: 8685.71,
    porcentajeTotal: 1.2,
    descripcion: 'Obligaciones tributarias mensuales estimadas.',
    tipo: 'fijo'
  },
  {
    no: 14,
    categoria: 'Administración y Fiscal',
    concepto: 'Contabilidad',
    gastoSemanal: 1900,
    gastoDiario: 271.43,
    proyeccionMensual: 8251.43,
    porcentajeTotal: 1.2,
    descripcion: 'Servicios de auditoría, timbrado fiscal y asesoría financiera.',
    tipo: 'fijo'
  },
  {
    no: 15,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Dialpa',
    gastoSemanal: 38000,
    gastoDiario: 5428.57,
    proyeccionMensual: 165028.57,
    porcentajeTotal: 23.4,
    descripcion: 'Harinas de alta graduación, polvos y mezclas base de la matriz.',
    tipo: 'materia_prima'
  },
  {
    no: 16,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Cremeria americana',
    gastoSemanal: 6000,
    gastoDiario: 857.14,
    proyeccionMensual: 26057.14,
    porcentajeTotal: 3.7,
    descripcion: 'Cremas para batir, bases pasteleras y rellenos lácteos.',
    tipo: 'materia_prima'
  },
  {
    no: 17,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Materia Prima el Trigal',
    gastoSemanal: 3500,
    gastoDiario: 500.00,
    proyeccionMensual: 15200.00,
    porcentajeTotal: 2.2,
    descripcion: 'Frutas en almíbar, azúcares especiales y coberturas de repostería.',
    tipo: 'materia_prima'
  },
  {
    no: 18,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Huevo',
    gastoSemanal: 4000,
    gastoDiario: 571.43,
    proyeccionMensual: 17371.43,
    porcentajeTotal: 2.5,
    descripcion: 'Consumo diario de huevo fresco para volumen de pan dulce y salado.',
    tipo: 'materia_prima'
  },
  {
    no: 19,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Mantequilla',
    gastoSemanal: 4200,
    gastoDiario: 600.00,
    proyeccionMensual: 18240.00,
    porcentajeTotal: 2.6,
    descripcion: 'Mantequilla pura de exportación para hojaldre y línea europea.',
    tipo: 'materia_prima'
  },
  {
    no: 20,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Queso crema',
    gastoSemanal: 545,
    gastoDiario: 77.86,
    proyeccionMensual: 2366.86,
    porcentajeTotal: 0.3,
    descripcion: 'Rellenos para panques, pays y panes artesanales.',
    tipo: 'materia_prima'
  },
  {
    no: 21,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Coca cola y Alpura',
    gastoSemanal: 3000,
    gastoDiario: 428.57,
    proyeccionMensual: 13028.57,
    porcentajeTotal: 1.8,
    descripcion: 'Bebidas comerciales complementarias de mostrador.',
    tipo: 'materia_prima'
  },
  {
    no: 22,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Quesos',
    gastoSemanal: 1500,
    gastoDiario: 214.29,
    proyeccionMensual: 6514.29,
    porcentajeTotal: 0.9,
    descripcion: 'Quesos finos para línea gourmet y baguettes.',
    tipo: 'materia_prima'
  },
  {
    no: 23,
    categoria: 'Materia Prima e Insumos',
    concepto: 'Nata',
    gastoSemanal: 1800,
    gastoDiario: 257.14,
    proyeccionMensual: 7817.14,
    porcentajeTotal: 1.1,
    descripcion: 'Nata pura pasteurizada para panes de feria y conchas tradicionales.',
    tipo: 'materia_prima'
  }
];

export const VENTAS_ZAKIA: VentaMensualZakia[] = [
  { no: 1, mes: 'Febrero', puntoDeVentaTDC: 281000, ventasMostradorEfectivo: 162000, ventaTotalMensual: 443000, porcentajeTDC: 63.4, porcentajeEfectivo: 36.6 },
  { no: 2, mes: 'Marzo', puntoDeVentaTDC: 283000, ventasMostradorEfectivo: 163000, ventaTotalMensual: 446000, porcentajeTDC: 63.5, porcentajeEfectivo: 36.5 },
  { no: 3, mes: 'Abril', puntoDeVentaTDC: 281500, ventasMostradorEfectivo: 161500, ventaTotalMensual: 443000, porcentajeTDC: 63.5, porcentajeEfectivo: 36.5 },
  { no: 4, mes: 'Mayo', puntoDeVentaTDC: 283000, ventasMostradorEfectivo: 163000, ventaTotalMensual: 446000, porcentajeTDC: 63.5, porcentajeEfectivo: 36.5 },
  { no: 5, mes: 'Junio', puntoDeVentaTDC: 282000, ventasMostradorEfectivo: 162500, ventaTotalMensual: 444500, porcentajeTDC: 63.4, porcentajeEfectivo: 36.6 },
  { no: 6, mes: 'Julio', puntoDeVentaTDC: 283500, ventasMostradorEfectivo: 163000, ventaTotalMensual: 446500, porcentajeTDC: 63.5, porcentajeEfectivo: 36.5 },
  { no: 7, mes: 'Agosto', puntoDeVentaTDC: 282500, ventasMostradorEfectivo: 162500, ventaTotalMensual: 445000, porcentajeTDC: 63.5, porcentajeEfectivo: 36.5 },
];

export const RESUMEN_UTILIDAD_ZAKIA: ResumenUtilidadMensual[] = [
  { mes: 'Febrero', ventaTotal: 443000, gastosOperativos: 399400, utilidadNeta: 43600, margen: 9.8 },
  { mes: 'Marzo', ventaTotal: 446000, gastosOperativos: 399400, utilidadNeta: 46600, margen: 10.4 },
  { mes: 'Abril', ventaTotal: 443000, gastosOperativos: 399400, utilidadNeta: 43600, margen: 9.8 },
  { mes: 'Mayo', ventaTotal: 446000, gastosOperativos: 399400, utilidadNeta: 46600, margen: 10.4 },
  { mes: 'Junio', ventaTotal: 444500, gastosOperativos: 399400, utilidadNeta: 45100, margen: 10.1 },
  { mes: 'Julio', ventaTotal: 446500, gastosOperativos: 399400, utilidadNeta: 47100, margen: 10.5 },
  { mes: 'Agosto', ventaTotal: 445000, gastosOperativos: 399400, utilidadNeta: 45600, margen: 10.2 },
];

export const VENTAS_REFUGIO: VentaMensualRefugio[] = [
  { no: 1, mes: 'Febrero', cobroTarjetaTDC: 318000, efectivoCalculado: 260000, ventaTotalMostrador: 578000, reparto: 206000, transferenciasCautivos: 48000, ventaTotalMensual: 832000 },
  { no: 2, mes: 'Marzo', cobroTarjetaTDC: 324000, efectivoCalculado: 265000, ventaTotalMostrador: 589000, reparto: 210000, transferenciasCautivos: 49000, ventaTotalMensual: 848000 },
  { no: 3, mes: 'Abril', cobroTarjetaTDC: 319000, efectivoCalculado: 261000, ventaTotalMostrador: 58000, reparto: 207000, transferenciasCautivos: 48000, ventaTotalMensual: 835000 },
  { no: 4, mes: 'Mayo', cobroTarjetaTDC: 322000, efectivoCalculado: 263000, ventaTotalMostrador: 585000, reparto: 209000, transferenciasCautivos: 49000, ventaTotalMensual: 843000 },
  { no: 5, mes: 'Junio', cobroTarjetaTDC: 326000, efectivoCalculado: 267000, ventaTotalMostrador: 593000, reparto: 212000, transferenciasCautivos: 49000, ventaTotalMensual: 854000 },
  { no: 6, mes: 'Julio', cobroTarjetaTDC: 328000, efectivoCalculado: 268000, ventaTotalMostrador: 596000, reparto: 213000, transferenciasCautivos: 50000, ventaTotalMensual: 859000 },
  { no: 7, mes: 'Agosto', cobroTarjetaTDC: 330000, efectivoCalculado: 272000, ventaTotalMostrador: 602000, reparto: 215000, transferenciasCautivos: 50000, ventaTotalMensual: 867000 },
];

export const RESUMEN_UTILIDAD_REFUGIO: ResumenUtilidadMensual[] = [
  { mes: 'Febrero', ventaTotal: 832000, gastosOperativos: 705771, utilidadNeta: 126229, margen: 15.2 },
  { mes: 'Marzo', ventaTotal: 848000, gastosOperativos: 705771, utilidadNeta: 142229, margen: 16.8 },
  { mes: 'Abril', ventaTotal: 835000, gastosOperativos: 705771, utilidadNeta: 129229, margen: 15.5 },
  { mes: 'Mayo', ventaTotal: 843000, gastosOperativos: 705771, utilidadNeta: 137229, margen: 16.3 },
  { mes: 'Junio', ventaTotal: 854000, gastosOperativos: 705771, utilidadNeta: 148229, margen: 17.4 },
  { mes: 'Julio', ventaTotal: 859000, gastosOperativos: 705771, utilidadNeta: 153229, margen: 17.8 },
  { mes: 'Agosto', ventaTotal: 867000, gastosOperativos: 705771, utilidadNeta: 161229, margen: 18.6 },
];

// Totales consolidados
export const TOTALES_CONSOLIDADOS = {
  ventas7MesesZakia: 3114000,
  ventas7MesesRefugio: 5938000,
  ventas7MesesAmbas: 9052000,

  promedioMensualVentasZakia: 444857,
  promedioMensualVentasRefugio: 848286,
  promedioMensualVentasTotal: 1293143,

  gastosMensualesZakia: 399400, // $399,399.54
  gastosMensualesRefugio: 705771, // $705,770.74
  gastosMensualesTotal: 1105171,

  utilidadMensualZakia: 45458,
  utilidadMensualRefugio: 142515,
  utilidadMensualTotal: 187973,

  utilidad7MesesZakia: 318203,
  utilidad7MesesRefugio: 997605,
  utilidad7MesesTotal: 1315808,

  margenPonderadoTotal: 14.53, // 187,973 / 1,293,143
  proyeccionAnualizadaVentas: 1293143 * 12, // $15,517,716 MXN
  proyeccionAnualizadaGastos: 1105171 * 12, // $13,262,052 MXN
  proyeccionAnualizadaUtilidad: 187973 * 12, // $2,255,676 MXN
};

// Benchmark Inmobiliario provisto por el usuario:
// Casa de $2.2 MDP renta en $11,500 MXN mensuales
export const BENCHMARK_INMUEBLE = {
  valorCasa: 2200000,
  rentaMensual: 11500,
  tasaRendimientoBrutaAnual: (11500 * 12) / 2200000, // 0.062727 => 6.27%
  gastosMantenimientoPredialVacanciaPct: 0.15, // ~15% de descuento por predial, seguros, desgaste y vacancia
  tasaRendimientoNetaAnual: ((11500 * 12) * 0.85) / 2200000, // ~5.33%
};

// Benchmark Bancario tradicional (Pagaré Bancario / Cetes):
export const BENCHMARK_BANCO = {
  nombre: 'Pagaré Bancario / Cetes 28 días',
  tasaBrutaAnual: 0.095, // 9.5%
  retencionISR: 0.005, // Retención de ISR promedio
  tasaNetaAnual: 0.090, // 9.0%
};
