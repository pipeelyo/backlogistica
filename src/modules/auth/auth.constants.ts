import {
  ROL_ID_CLIENTE,
  ROL_ID_REPARTIDOR,
} from '../logistica/logistica-rol.constants';

export { ROL_ID_CLIENTE, ROL_ID_REPARTIDOR };
export {
  ROL_ID_ADMINISTRADOR,
  ROL_ID_SUPERVISOR,
  ROL_CODIGO_CLIENTE,
  ROL_CODIGO_REPARTIDOR,
  ROL_CODIGO_ADMINISTRADOR,
  ROL_CODIGO_SUPERVISOR,
} from '../logistica/logistica-rol.constants';

/** Lee `REPARTIDOR_ROL_ID` o `ASIGNACION_ROL_REPARTIDOR_ID`; si no hay entero válido, usa `ROL_ID_REPARTIDOR`. */
export function resolveRolIdRepartidor(
  get: (key: string) => string | undefined,
): number {
  const fromEnv =
    get('REPARTIDOR_ROL_ID')?.trim() || get('ASIGNACION_ROL_REPARTIDOR_ID')?.trim();
  if (fromEnv) {
    const n = Number.parseInt(fromEnv, 10);
    if (Number.isInteger(n) && n > 0) {
      return n;
    }
  }
  return ROL_ID_REPARTIDOR;
}

export {
  TIPO_DOCUMENTO_ID_CEDULA as TIPO_DOCUMENTO_ID_REGISTRO,
  TIPO_DOCUMENTO_ID_CEDULA,
  TIPO_DOCUMENTO_ID_NIT,
  TIPO_DOCUMENTO_ID_PASAPORTE,
  TIPO_DOCUMENTO_ID_CEDULA_EXTRANJERIA,
  TIPO_DOCUMENTO_ID_TARJETA_IDENTIDAD,
  TIPO_DOCUMENTO_ID_PEP,
  TIPO_DOCUMENTO_ID_PPT,
} from '../logistica/logistica-tipo-documento.constants';
