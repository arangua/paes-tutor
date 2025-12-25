/**
 * Sistema de Mensajes de Error Estructurado
 * Basado en mejores prácticas de UX mundial (Google, Apple, Microsoft)
 */
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
export interface ErrorMessage {
  code: string;
  title: string;
  description: string;
  solution: string;
  action?: {
    label: string;
    onClick?: () => void;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'validation' | 'network' | 'permission' | 'data' | 'system';
}
export const ERROR_CODES = {
  // Validación
  VALIDATION_REQUIRED: 'VAL-001',
  VALIDATION_INVALID_FORMAT: 'VAL-002',
  VALIDATION_TOO_LONG: 'VAL-003',
  VALIDATION_TOO_SHORT: 'VAL-004',
  VALIDATION_DUPLICATE: 'VAL-005',
  // Red
  NETWORK_TIMEOUT: 'NET-001',
  NETWORK_OFFLINE: 'NET-002',
  NETWORK_SERVER_ERROR: 'NET-003',
  // Permisos
  PERMISSION_DENIED: 'PERM-001',
  PERMISSION_UNAUTHORIZED: 'PERM-002',
  // Datos
  DATA_NOT_FOUND: 'DATA-001',
  DATA_EXPORT_FAILED: 'DATA-002',
  DATA_IMPORT_FAILED: 'DATA-003',
  DATA_TOO_LARGE: 'DATA-004',
  DATA_SAVE_FAILED: 'DATA-005',
  DATA_CREATE_FAILED: 'DATA-006',
  DATA_UPDATE_FAILED: 'DATA-007',
  DATA_DELETE_FAILED: 'DATA-008',
  // Sistema
  SYSTEM_UNKNOWN: 'SYS-001',
  SYSTEM_LOAD_FAILED: 'SYS-002'
} as const;
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

/**
 * Genera un mensaje de error estructurado basado en el código
 */
export function getErrorMessage(code: ErrorCode | string, context?: Record<string, unknown>): ErrorMessage {
  if (stryMutAct_9fa48("23701")) {
    {}
  } else {
    stryCov_9fa48("23701");
    const errorMap: Record<string, Omit<ErrorMessage, 'code'>> = stryMutAct_9fa48("23702") ? {} : (stryCov_9fa48("23702"), {
      // Validación
      [ERROR_CODES.VALIDATION_REQUIRED]: stryMutAct_9fa48("23703") ? {} : (stryCov_9fa48("23703"), {
        title: stryMutAct_9fa48("23704") ? "" : (stryCov_9fa48("23704"), 'Campo requerido'),
        description: stryMutAct_9fa48("23705") ? "" : (stryCov_9fa48("23705"), 'Este campo es obligatorio para continuar.'),
        solution: stryMutAct_9fa48("23706") ? "" : (stryCov_9fa48("23706"), 'Por favor, completa todos los campos marcados como requeridos.'),
        severity: stryMutAct_9fa48("23707") ? "" : (stryCov_9fa48("23707"), 'medium'),
        category: stryMutAct_9fa48("23708") ? "" : (stryCov_9fa48("23708"), 'validation')
      }),
      [ERROR_CODES.VALIDATION_INVALID_FORMAT]: stryMutAct_9fa48("23709") ? {} : (stryCov_9fa48("23709"), {
        title: stryMutAct_9fa48("23710") ? "" : (stryCov_9fa48("23710"), 'Formato inválido'),
        description: stryMutAct_9fa48("23711") ? `` : (stryCov_9fa48("23711"), `El formato ingresado no es válido. ${(stryMutAct_9fa48("23712") ? context.expected : (stryCov_9fa48("23712"), context?.expected)) ? stryMutAct_9fa48("23713") ? `` : (stryCov_9fa48("23713"), `Formato esperado: ${context.expected}`) : stryMutAct_9fa48("23714") ? "Stryker was here!" : (stryCov_9fa48("23714"), '')}`),
        solution: stryMutAct_9fa48("23715") ? "" : (stryCov_9fa48("23715"), 'Verifica que el formato sea correcto e intenta nuevamente.'),
        severity: stryMutAct_9fa48("23716") ? "" : (stryCov_9fa48("23716"), 'medium'),
        category: stryMutAct_9fa48("23717") ? "" : (stryCov_9fa48("23717"), 'validation')
      }),
      [ERROR_CODES.VALIDATION_TOO_LONG]: stryMutAct_9fa48("23718") ? {} : (stryCov_9fa48("23718"), {
        title: stryMutAct_9fa48("23719") ? "" : (stryCov_9fa48("23719"), 'Texto demasiado largo'),
        description: stryMutAct_9fa48("23720") ? `` : (stryCov_9fa48("23720"), `El texto excede el límite máximo de ${stryMutAct_9fa48("23723") ? context?.maxLength && 'caracteres' : stryMutAct_9fa48("23722") ? false : stryMutAct_9fa48("23721") ? true : (stryCov_9fa48("23721", "23722", "23723"), (stryMutAct_9fa48("23724") ? context.maxLength : (stryCov_9fa48("23724"), context?.maxLength)) || (stryMutAct_9fa48("23725") ? "" : (stryCov_9fa48("23725"), 'caracteres')))}.`),
        solution: stryMutAct_9fa48("23726") ? `` : (stryCov_9fa48("23726"), `Reduce el texto a ${stryMutAct_9fa48("23729") ? context?.maxLength && 'menos caracteres' : stryMutAct_9fa48("23728") ? false : stryMutAct_9fa48("23727") ? true : (stryCov_9fa48("23727", "23728", "23729"), (stryMutAct_9fa48("23730") ? context.maxLength : (stryCov_9fa48("23730"), context?.maxLength)) || (stryMutAct_9fa48("23731") ? "" : (stryCov_9fa48("23731"), 'menos caracteres')))} o menos.`),
        severity: stryMutAct_9fa48("23732") ? "" : (stryCov_9fa48("23732"), 'low'),
        category: stryMutAct_9fa48("23733") ? "" : (stryCov_9fa48("23733"), 'validation')
      }),
      [ERROR_CODES.VALIDATION_DUPLICATE]: stryMutAct_9fa48("23734") ? {} : (stryCov_9fa48("23734"), {
        title: stryMutAct_9fa48("23735") ? "" : (stryCov_9fa48("23735"), 'Elemento duplicado'),
        description: stryMutAct_9fa48("23736") ? "" : (stryCov_9fa48("23736"), 'Este elemento ya existe en el sistema.'),
        solution: stryMutAct_9fa48("23737") ? "" : (stryCov_9fa48("23737"), 'Verifica que no estés intentando agregar un elemento duplicado.'),
        severity: stryMutAct_9fa48("23738") ? "" : (stryCov_9fa48("23738"), 'medium'),
        category: stryMutAct_9fa48("23739") ? "" : (stryCov_9fa48("23739"), 'validation')
      }),
      // Red
      [ERROR_CODES.NETWORK_TIMEOUT]: stryMutAct_9fa48("23740") ? {} : (stryCov_9fa48("23740"), {
        title: stryMutAct_9fa48("23741") ? "" : (stryCov_9fa48("23741"), 'Tiempo de espera agotado'),
        description: stryMutAct_9fa48("23742") ? "" : (stryCov_9fa48("23742"), 'La solicitud tardó demasiado en responder.'),
        solution: stryMutAct_9fa48("23743") ? "" : (stryCov_9fa48("23743"), 'Verifica tu conexión a internet y vuelve a intentar. Si el problema persiste, el servidor puede estar sobrecargado.'),
        severity: stryMutAct_9fa48("23744") ? "" : (stryCov_9fa48("23744"), 'high'),
        category: stryMutAct_9fa48("23745") ? "" : (stryCov_9fa48("23745"), 'network'),
        action: stryMutAct_9fa48("23746") ? {} : (stryCov_9fa48("23746"), {
          label: stryMutAct_9fa48("23747") ? "" : (stryCov_9fa48("23747"), 'Reintentar')
        })
      }),
      [ERROR_CODES.NETWORK_OFFLINE]: stryMutAct_9fa48("23748") ? {} : (stryCov_9fa48("23748"), {
        title: stryMutAct_9fa48("23749") ? "" : (stryCov_9fa48("23749"), 'Sin conexión a internet'),
        description: stryMutAct_9fa48("23750") ? "" : (stryCov_9fa48("23750"), 'No se pudo conectar al servidor. Verifica tu conexión.'),
        solution: stryMutAct_9fa48("23751") ? "" : (stryCov_9fa48("23751"), 'Asegúrate de estar conectado a internet y vuelve a intentar. Tu progreso se guardará automáticamente cuando se restablezca la conexión.'),
        severity: stryMutAct_9fa48("23752") ? "" : (stryCov_9fa48("23752"), 'critical'),
        category: stryMutAct_9fa48("23753") ? "" : (stryCov_9fa48("23753"), 'network'),
        action: stryMutAct_9fa48("23754") ? {} : (stryCov_9fa48("23754"), {
          label: stryMutAct_9fa48("23755") ? "" : (stryCov_9fa48("23755"), 'Reintentar')
        })
      }),
      [ERROR_CODES.NETWORK_SERVER_ERROR]: stryMutAct_9fa48("23756") ? {} : (stryCov_9fa48("23756"), {
        title: stryMutAct_9fa48("23757") ? "" : (stryCov_9fa48("23757"), 'Error del servidor'),
        description: stryMutAct_9fa48("23758") ? "" : (stryCov_9fa48("23758"), 'El servidor encontró un error al procesar tu solicitud.'),
        solution: stryMutAct_9fa48("23759") ? "" : (stryCov_9fa48("23759"), 'El problema es temporal. Por favor, intenta nuevamente en unos momentos. Si el problema persiste, contacta al soporte.'),
        severity: stryMutAct_9fa48("23760") ? "" : (stryCov_9fa48("23760"), 'high'),
        category: stryMutAct_9fa48("23761") ? "" : (stryCov_9fa48("23761"), 'network'),
        action: stryMutAct_9fa48("23762") ? {} : (stryCov_9fa48("23762"), {
          label: stryMutAct_9fa48("23763") ? "" : (stryCov_9fa48("23763"), 'Reintentar')
        })
      }),
      // Permisos
      [ERROR_CODES.PERMISSION_DENIED]: stryMutAct_9fa48("23764") ? {} : (stryCov_9fa48("23764"), {
        title: stryMutAct_9fa48("23765") ? "" : (stryCov_9fa48("23765"), 'Permiso denegado'),
        description: stryMutAct_9fa48("23766") ? "" : (stryCov_9fa48("23766"), 'No tienes permisos para realizar esta acción.'),
        solution: stryMutAct_9fa48("23767") ? "" : (stryCov_9fa48("23767"), 'Contacta a un administrador si crees que deberías tener acceso a esta función.'),
        severity: stryMutAct_9fa48("23768") ? "" : (stryCov_9fa48("23768"), 'high'),
        category: stryMutAct_9fa48("23769") ? "" : (stryCov_9fa48("23769"), 'permission')
      }),
      [ERROR_CODES.PERMISSION_UNAUTHORIZED]: stryMutAct_9fa48("23770") ? {} : (stryCov_9fa48("23770"), {
        title: stryMutAct_9fa48("23771") ? "" : (stryCov_9fa48("23771"), 'Sesión expirada'),
        description: stryMutAct_9fa48("23772") ? "" : (stryCov_9fa48("23772"), 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'),
        solution: stryMutAct_9fa48("23773") ? "" : (stryCov_9fa48("23773"), 'Serás redirigido a la página de inicio de sesión.'),
        severity: stryMutAct_9fa48("23774") ? "" : (stryCov_9fa48("23774"), 'high'),
        category: stryMutAct_9fa48("23775") ? "" : (stryCov_9fa48("23775"), 'permission'),
        action: stryMutAct_9fa48("23776") ? {} : (stryCov_9fa48("23776"), {
          label: stryMutAct_9fa48("23777") ? "" : (stryCov_9fa48("23777"), 'Iniciar sesión')
        })
      }),
      // Datos
      [ERROR_CODES.DATA_NOT_FOUND]: stryMutAct_9fa48("23778") ? {} : (stryCov_9fa48("23778"), {
        title: stryMutAct_9fa48("23779") ? "" : (stryCov_9fa48("23779"), 'Datos no encontrados'),
        description: (stryMutAct_9fa48("23780") ? context.item : (stryCov_9fa48("23780"), context?.item)) ? stryMutAct_9fa48("23781") ? `` : (stryCov_9fa48("23781"), `No se encontró ${context.item}.`) : stryMutAct_9fa48("23782") ? "" : (stryCov_9fa48("23782"), 'Los datos solicitados no están disponibles.'),
        solution: stryMutAct_9fa48("23785") ? context?.suggestion && 'Verifica que los datos existan o intenta más tarde.' : stryMutAct_9fa48("23784") ? false : stryMutAct_9fa48("23783") ? true : (stryCov_9fa48("23783", "23784", "23785"), (stryMutAct_9fa48("23786") ? context.suggestion : (stryCov_9fa48("23786"), context?.suggestion)) || (stryMutAct_9fa48("23787") ? "" : (stryCov_9fa48("23787"), 'Verifica que los datos existan o intenta más tarde.'))),
        severity: stryMutAct_9fa48("23788") ? "" : (stryCov_9fa48("23788"), 'medium'),
        category: stryMutAct_9fa48("23789") ? "" : (stryCov_9fa48("23789"), 'data')
      }),
      [ERROR_CODES.DATA_EXPORT_FAILED]: stryMutAct_9fa48("23790") ? {} : (stryCov_9fa48("23790"), {
        title: stryMutAct_9fa48("23791") ? "" : (stryCov_9fa48("23791"), 'Error al exportar'),
        description: (stryMutAct_9fa48("23792") ? context.reason : (stryCov_9fa48("23792"), context?.reason)) ? stryMutAct_9fa48("23793") ? `` : (stryCov_9fa48("23793"), `No se pudo exportar: ${context.reason}`) : stryMutAct_9fa48("23794") ? "" : (stryCov_9fa48("23794"), 'Ocurrió un error al exportar los datos.'),
        solution: (stryMutAct_9fa48("23795") ? context.fileSize : (stryCov_9fa48("23795"), context?.fileSize)) ? stryMutAct_9fa48("23796") ? `` : (stryCov_9fa48("23796"), `El archivo es demasiado grande (${context.fileSize}). Intenta exportar menos datos o usa un formato diferente.`) : stryMutAct_9fa48("23797") ? "" : (stryCov_9fa48("23797"), 'Intenta exportar nuevamente. Si el problema persiste, verifica que tengas espacio suficiente en tu dispositivo.'),
        severity: stryMutAct_9fa48("23798") ? "" : (stryCov_9fa48("23798"), 'medium'),
        category: stryMutAct_9fa48("23799") ? "" : (stryCov_9fa48("23799"), 'data'),
        action: stryMutAct_9fa48("23800") ? {} : (stryCov_9fa48("23800"), {
          label: stryMutAct_9fa48("23801") ? "" : (stryCov_9fa48("23801"), 'Intentar de nuevo')
        })
      }),
      [ERROR_CODES.DATA_IMPORT_FAILED]: stryMutAct_9fa48("23802") ? {} : (stryCov_9fa48("23802"), {
        title: stryMutAct_9fa48("23803") ? "" : (stryCov_9fa48("23803"), 'Error al importar'),
        description: (stryMutAct_9fa48("23804") ? context.reason : (stryCov_9fa48("23804"), context?.reason)) ? stryMutAct_9fa48("23805") ? `` : (stryCov_9fa48("23805"), `No se pudo importar: ${context.reason}`) : stryMutAct_9fa48("23806") ? "" : (stryCov_9fa48("23806"), 'Ocurrió un error al importar los datos.'),
        solution: stryMutAct_9fa48("23807") ? "" : (stryCov_9fa48("23807"), 'Verifica que el archivo tenga el formato correcto y que no esté corrupto. Revisa la documentación para ver los formatos soportados.'),
        severity: stryMutAct_9fa48("23808") ? "" : (stryCov_9fa48("23808"), 'high'),
        category: stryMutAct_9fa48("23809") ? "" : (stryCov_9fa48("23809"), 'data')
      }),
      [ERROR_CODES.DATA_TOO_LARGE]: stryMutAct_9fa48("23810") ? {} : (stryCov_9fa48("23810"), {
        title: stryMutAct_9fa48("23811") ? "" : (stryCov_9fa48("23811"), 'Archivo demasiado grande'),
        description: stryMutAct_9fa48("23812") ? `` : (stryCov_9fa48("23812"), `El archivo excede el tamaño máximo permitido (${stryMutAct_9fa48("23815") ? context?.maxSize && 'límite' : stryMutAct_9fa48("23814") ? false : stryMutAct_9fa48("23813") ? true : (stryCov_9fa48("23813", "23814", "23815"), (stryMutAct_9fa48("23816") ? context.maxSize : (stryCov_9fa48("23816"), context?.maxSize)) || (stryMutAct_9fa48("23817") ? "" : (stryCov_9fa48("23817"), 'límite')))}).`),
        solution: stryMutAct_9fa48("23818") ? `` : (stryCov_9fa48("23818"), `Reduce el tamaño del archivo a ${stryMutAct_9fa48("23821") ? context?.maxSize && 'menos' : stryMutAct_9fa48("23820") ? false : stryMutAct_9fa48("23819") ? true : (stryCov_9fa48("23819", "23820", "23821"), (stryMutAct_9fa48("23822") ? context.maxSize : (stryCov_9fa48("23822"), context?.maxSize)) || (stryMutAct_9fa48("23823") ? "" : (stryCov_9fa48("23823"), 'menos')))} o divide los datos en múltiples archivos.`),
        severity: stryMutAct_9fa48("23824") ? "" : (stryCov_9fa48("23824"), 'medium'),
        category: stryMutAct_9fa48("23825") ? "" : (stryCov_9fa48("23825"), 'data')
      }),
      [ERROR_CODES.DATA_SAVE_FAILED]: stryMutAct_9fa48("23826") ? {} : (stryCov_9fa48("23826"), {
        title: stryMutAct_9fa48("23827") ? "" : (stryCov_9fa48("23827"), 'Error al guardar'),
        description: (stryMutAct_9fa48("23828") ? context.item : (stryCov_9fa48("23828"), context?.item)) ? stryMutAct_9fa48("23829") ? `` : (stryCov_9fa48("23829"), `No se pudo guardar ${context.item}.`) : (stryMutAct_9fa48("23830") ? context.reason : (stryCov_9fa48("23830"), context?.reason)) ? stryMutAct_9fa48("23831") ? `` : (stryCov_9fa48("23831"), `Error al guardar: ${context.reason}`) : stryMutAct_9fa48("23832") ? "" : (stryCov_9fa48("23832"), 'Ocurrió un error al guardar los datos.'),
        solution: stryMutAct_9fa48("23833") ? "" : (stryCov_9fa48("23833"), 'Verifica tu conexión a internet e intenta nuevamente. Si el problema persiste, los datos pueden estar corruptos o el servidor puede estar sobrecargado.'),
        severity: stryMutAct_9fa48("23834") ? "" : (stryCov_9fa48("23834"), 'high'),
        category: stryMutAct_9fa48("23835") ? "" : (stryCov_9fa48("23835"), 'data'),
        action: stryMutAct_9fa48("23836") ? {} : (stryCov_9fa48("23836"), {
          label: stryMutAct_9fa48("23837") ? "" : (stryCov_9fa48("23837"), 'Reintentar')
        })
      }),
      [ERROR_CODES.DATA_CREATE_FAILED]: stryMutAct_9fa48("23838") ? {} : (stryCov_9fa48("23838"), {
        title: stryMutAct_9fa48("23839") ? "" : (stryCov_9fa48("23839"), 'Error al crear'),
        description: (stryMutAct_9fa48("23840") ? context.item : (stryCov_9fa48("23840"), context?.item)) ? stryMutAct_9fa48("23841") ? `` : (stryCov_9fa48("23841"), `No se pudo crear ${context.item}.`) : (stryMutAct_9fa48("23842") ? context.reason : (stryCov_9fa48("23842"), context?.reason)) ? stryMutAct_9fa48("23843") ? `` : (stryCov_9fa48("23843"), `Error al crear: ${context.reason}`) : stryMutAct_9fa48("23844") ? "" : (stryCov_9fa48("23844"), 'Ocurrió un error al crear el elemento.'),
        solution: stryMutAct_9fa48("23845") ? "" : (stryCov_9fa48("23845"), 'Verifica que todos los campos requeridos estén completos y que no haya duplicados. Intenta nuevamente o contacta al soporte si el problema persiste.'),
        severity: stryMutAct_9fa48("23846") ? "" : (stryCov_9fa48("23846"), 'high'),
        category: stryMutAct_9fa48("23847") ? "" : (stryCov_9fa48("23847"), 'data'),
        action: stryMutAct_9fa48("23848") ? {} : (stryCov_9fa48("23848"), {
          label: stryMutAct_9fa48("23849") ? "" : (stryCov_9fa48("23849"), 'Reintentar')
        })
      }),
      [ERROR_CODES.DATA_UPDATE_FAILED]: stryMutAct_9fa48("23850") ? {} : (stryCov_9fa48("23850"), {
        title: stryMutAct_9fa48("23851") ? "" : (stryCov_9fa48("23851"), 'Error al actualizar'),
        description: (stryMutAct_9fa48("23852") ? context.item : (stryCov_9fa48("23852"), context?.item)) ? stryMutAct_9fa48("23853") ? `` : (stryCov_9fa48("23853"), `No se pudo actualizar ${context.item}.`) : (stryMutAct_9fa48("23854") ? context.reason : (stryCov_9fa48("23854"), context?.reason)) ? stryMutAct_9fa48("23855") ? `` : (stryCov_9fa48("23855"), `Error al actualizar: ${context.reason}`) : stryMutAct_9fa48("23856") ? "" : (stryCov_9fa48("23856"), 'Ocurrió un error al actualizar los datos.'),
        solution: stryMutAct_9fa48("23857") ? "" : (stryCov_9fa48("23857"), 'Verifica que los datos sean válidos y que tengas permisos para actualizar. Intenta nuevamente o contacta al soporte si el problema persiste.'),
        severity: stryMutAct_9fa48("23858") ? "" : (stryCov_9fa48("23858"), 'high'),
        category: stryMutAct_9fa48("23859") ? "" : (stryCov_9fa48("23859"), 'data'),
        action: stryMutAct_9fa48("23860") ? {} : (stryCov_9fa48("23860"), {
          label: stryMutAct_9fa48("23861") ? "" : (stryCov_9fa48("23861"), 'Reintentar')
        })
      }),
      [ERROR_CODES.DATA_DELETE_FAILED]: stryMutAct_9fa48("23862") ? {} : (stryCov_9fa48("23862"), {
        title: stryMutAct_9fa48("23863") ? "" : (stryCov_9fa48("23863"), 'Error al eliminar'),
        description: (stryMutAct_9fa48("23864") ? context.item : (stryCov_9fa48("23864"), context?.item)) ? stryMutAct_9fa48("23865") ? `` : (stryCov_9fa48("23865"), `No se pudo eliminar ${context.item}.`) : (stryMutAct_9fa48("23866") ? context.reason : (stryCov_9fa48("23866"), context?.reason)) ? stryMutAct_9fa48("23867") ? `` : (stryCov_9fa48("23867"), `Error al eliminar: ${context.reason}`) : stryMutAct_9fa48("23868") ? "" : (stryCov_9fa48("23868"), 'Ocurrió un error al eliminar el elemento.'),
        solution: stryMutAct_9fa48("23869") ? "" : (stryCov_9fa48("23869"), 'Verifica que tengas permisos para eliminar y que el elemento no esté en uso. Intenta nuevamente o contacta al soporte si el problema persiste.'),
        severity: stryMutAct_9fa48("23870") ? "" : (stryCov_9fa48("23870"), 'high'),
        category: stryMutAct_9fa48("23871") ? "" : (stryCov_9fa48("23871"), 'data'),
        action: stryMutAct_9fa48("23872") ? {} : (stryCov_9fa48("23872"), {
          label: stryMutAct_9fa48("23873") ? "" : (stryCov_9fa48("23873"), 'Reintentar')
        })
      }),
      // Sistema
      [ERROR_CODES.SYSTEM_UNKNOWN]: stryMutAct_9fa48("23874") ? {} : (stryCov_9fa48("23874"), {
        title: stryMutAct_9fa48("23875") ? "" : (stryCov_9fa48("23875"), 'Error inesperado'),
        description: stryMutAct_9fa48("23876") ? "" : (stryCov_9fa48("23876"), 'Ocurrió un error inesperado. Nuestro equipo ha sido notificado.'),
        solution: stryMutAct_9fa48("23877") ? "" : (stryCov_9fa48("23877"), 'Por favor, intenta nuevamente. Si el problema persiste, contacta al soporte con el código de error.'),
        severity: stryMutAct_9fa48("23878") ? "" : (stryCov_9fa48("23878"), 'high'),
        category: stryMutAct_9fa48("23879") ? "" : (stryCov_9fa48("23879"), 'system'),
        action: stryMutAct_9fa48("23880") ? {} : (stryCov_9fa48("23880"), {
          label: stryMutAct_9fa48("23881") ? "" : (stryCov_9fa48("23881"), 'Reintentar')
        })
      }),
      [ERROR_CODES.SYSTEM_LOAD_FAILED]: stryMutAct_9fa48("23882") ? {} : (stryCov_9fa48("23882"), {
        title: stryMutAct_9fa48("23883") ? "" : (stryCov_9fa48("23883"), 'Error al cargar'),
        description: stryMutAct_9fa48("23884") ? "" : (stryCov_9fa48("23884"), 'No se pudieron cargar los datos necesarios.'),
        solution: stryMutAct_9fa48("23885") ? "" : (stryCov_9fa48("23885"), 'Verifica tu conexión a internet y recarga la página. Si el problema persiste, contacta al soporte.'),
        severity: stryMutAct_9fa48("23886") ? "" : (stryCov_9fa48("23886"), 'high'),
        category: stryMutAct_9fa48("23887") ? "" : (stryCov_9fa48("23887"), 'system'),
        action: stryMutAct_9fa48("23888") ? {} : (stryCov_9fa48("23888"), {
          label: stryMutAct_9fa48("23889") ? "" : (stryCov_9fa48("23889"), 'Recargar página')
        })
      })
    });
    const error = errorMap[code];
    if (stryMutAct_9fa48("23891") ? false : stryMutAct_9fa48("23890") ? true : (stryCov_9fa48("23890", "23891"), error)) {
      if (stryMutAct_9fa48("23892")) {
        {}
      } else {
        stryCov_9fa48("23892");
        return stryMutAct_9fa48("23893") ? {} : (stryCov_9fa48("23893"), {
          code,
          ...error
        });
      }
    }

    // Error desconocido
    return stryMutAct_9fa48("23894") ? {} : (stryCov_9fa48("23894"), {
      code: ERROR_CODES.SYSTEM_UNKNOWN,
      title: stryMutAct_9fa48("23895") ? "" : (stryCov_9fa48("23895"), 'Error desconocido'),
      description: stryMutAct_9fa48("23898") ? context?.message && 'Ocurrió un error inesperado.' : stryMutAct_9fa48("23897") ? false : stryMutAct_9fa48("23896") ? true : (stryCov_9fa48("23896", "23897", "23898"), (stryMutAct_9fa48("23899") ? context.message : (stryCov_9fa48("23899"), context?.message)) || (stryMutAct_9fa48("23900") ? "" : (stryCov_9fa48("23900"), 'Ocurrió un error inesperado.'))),
      solution: stryMutAct_9fa48("23901") ? "" : (stryCov_9fa48("23901"), 'Por favor, intenta nuevamente o contacta al soporte si el problema persiste.'),
      severity: stryMutAct_9fa48("23902") ? "" : (stryCov_9fa48("23902"), 'high'),
      category: stryMutAct_9fa48("23903") ? "" : (stryCov_9fa48("23903"), 'system'),
      action: stryMutAct_9fa48("23904") ? {} : (stryCov_9fa48("23904"), {
        label: stryMutAct_9fa48("23905") ? "" : (stryCov_9fa48("23905"), 'Reintentar')
      })
    });
  }
}

/**
 * Extrae información de error de una respuesta o excepción
 */
export function extractErrorInfo(error: unknown): {
  code: ErrorCode | string;
  message: string;
  context?: Record<string, unknown>;
} {
  if (stryMutAct_9fa48("23906")) {
    {}
  } else {
    stryCov_9fa48("23906");
    if (stryMutAct_9fa48("23908") ? false : stryMutAct_9fa48("23907") ? true : (stryCov_9fa48("23907", "23908"), error instanceof Error)) {
      if (stryMutAct_9fa48("23909")) {
        {}
      } else {
        stryCov_9fa48("23909");
        // Intentar extraer código de error del mensaje
        const codeMatch = error.message.match(stryMutAct_9fa48("23913") ? /\[([A-Z]+-\D+)\]/ : stryMutAct_9fa48("23912") ? /\[([A-Z]+-\d)\]/ : stryMutAct_9fa48("23911") ? /\[([^A-Z]+-\d+)\]/ : stryMutAct_9fa48("23910") ? /\[([A-Z]-\d+)\]/ : (stryCov_9fa48("23910", "23911", "23912", "23913"), /\[([A-Z]+-\d+)\]/));
        if (stryMutAct_9fa48("23915") ? false : stryMutAct_9fa48("23914") ? true : (stryCov_9fa48("23914", "23915"), codeMatch)) {
          if (stryMutAct_9fa48("23916")) {
            {}
          } else {
            stryCov_9fa48("23916");
            return stryMutAct_9fa48("23917") ? {} : (stryCov_9fa48("23917"), {
              code: codeMatch[1],
              message: error.message.replace(stryMutAct_9fa48("23923") ? /\[([A-Z]+-\d+)\]\S*/ : stryMutAct_9fa48("23922") ? /\[([A-Z]+-\d+)\]\s/ : stryMutAct_9fa48("23921") ? /\[([A-Z]+-\D+)\]\s*/ : stryMutAct_9fa48("23920") ? /\[([A-Z]+-\d)\]\s*/ : stryMutAct_9fa48("23919") ? /\[([^A-Z]+-\d+)\]\s*/ : stryMutAct_9fa48("23918") ? /\[([A-Z]-\d+)\]\s*/ : (stryCov_9fa48("23918", "23919", "23920", "23921", "23922", "23923"), /\[([A-Z]+-\d+)\]\s*/), stryMutAct_9fa48("23924") ? "Stryker was here!" : (stryCov_9fa48("23924"), ''))
            });
          }
        }
        return stryMutAct_9fa48("23925") ? {} : (stryCov_9fa48("23925"), {
          code: ERROR_CODES.SYSTEM_UNKNOWN,
          message: error.message
        });
      }
    }
    if (stryMutAct_9fa48("23928") ? typeof error !== 'string' : stryMutAct_9fa48("23927") ? false : stryMutAct_9fa48("23926") ? true : (stryCov_9fa48("23926", "23927", "23928"), typeof error === (stryMutAct_9fa48("23929") ? "" : (stryCov_9fa48("23929"), 'string')))) {
      if (stryMutAct_9fa48("23930")) {
        {}
      } else {
        stryCov_9fa48("23930");
        return stryMutAct_9fa48("23931") ? {} : (stryCov_9fa48("23931"), {
          code: ERROR_CODES.SYSTEM_UNKNOWN,
          message: error
        });
      }
    }
    return stryMutAct_9fa48("23932") ? {} : (stryCov_9fa48("23932"), {
      code: ERROR_CODES.SYSTEM_UNKNOWN,
      message: stryMutAct_9fa48("23933") ? "" : (stryCov_9fa48("23933"), 'Error desconocido')
    });
  }
}