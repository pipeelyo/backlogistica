import { METODO_PAGO_EFECTIVO_ID } from '../../modules/logistica/logistica-metodo-pago.constants';
import {
  RESULTADO_ENTREGA_EXITO_ID,
  RESULTADO_ENTREGA_NO_ENTREGADO_ID,
  RESULTADO_ENTREGA_NOVEDADES_ID,
} from '../../modules/logistica/logistica-resultado-entrega.constants';

export const EJEMPLO_ENTREGA_EXITO_EFECTIVO = {
  idResultadoEntrega: RESULTADO_ENTREGA_EXITO_ID,
  pagadoPorRemitente: false,
  idMetodoPago: METODO_PAGO_EFECTIVO_ID,
  valorRecaudado: 15000,
  observaciones: 'Se entregó en portería con el vigilante Juan Pérez',
  fotosEntregaUrls: ['https://example.com/evidencias/entrega-ejemplo.jpg'],
} as const;

export const EJEMPLO_ENTREGA_NOVEDADES = {
  idResultadoEntrega: RESULTADO_ENTREGA_NOVEDADES_ID,
  pagadoPorRemitente: true,
  valorRecaudado: 0,
  observaciones: 'Caja con golpe menor; cliente aceptó el paquete',
  fotosEntregaUrls: ['https://example.com/evidencias/entrega-novedad.jpg'],
} as const;

export const EJEMPLO_ENTREGA_NO_ENTREGADO = {
  idResultadoEntrega: RESULTADO_ENTREGA_NO_ENTREGADO_ID,
  pagadoPorRemitente: false,
  valorRecaudado: 0,
  observaciones: 'Domicilio cerrado, cliente ausente; se intentó llamar dos veces',
} as const;
