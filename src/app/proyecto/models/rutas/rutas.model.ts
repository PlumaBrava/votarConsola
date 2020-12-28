import { IMG                 } from '@maq-models/typesIMG/typesIMG.model';
import { KN, KANE, KNAI      } from '@maq-models/typesKN/typesKN.model';
import { Direccion           } from '@maq-models/direccion/direccion.model';
import { GeoPoint            } from '@maq-models/geopoint/geopoint.model';
import { Settings            } from '@maq-models/settings/settings.model';
import { UnidadesMedida      } from '../unidadesMedida/unidadesMedida.model';
import { Ubicacion           } from '../ubicaciones/ubicaciones.model';

/* Graba sólo el estado actual de la ruta */
/* Cuando la ruta pasa a estado 'concluida' se borra el documento de esta tabla */
export class RutaMonitorCelulares {             
  rutaKey               : string;   // Es el key del documento, en los get accedes de ruta.key
  rutaNombre            : string;
  rutaCodigo            : KN;
  
  distribuidorKN        : KN;
  organizacionKNAI      : KNAI;
  areaNegocioKN         : KN;
  sucursalkn            : KN;  
  vehiculoKN            : KN;                 // Busco el Estado actual del celular de un vehículo  
  usuarioKANE           : KANE;               // Busco el Estado actual del celular de un integrante o usuario
  
  fechaHora             : Date;
  
  estado                : string;             // Activo-Background-Kill
  geoPoint              : GeoPoint;           // falta agregar campo hash para rutas
  velocidadKmXH         : number;
  errorTrackeo          : number;             // Error del celular en mts
  detenido              : boolean;            // El Celular, si pasa más de 3 minutos en la misma ubicación, indica true
  
}  

/* Se graban todos los cambios de estado del celular (Activo-Background-Kill) */
export class RutaEstadosCelulares {
  key                   : string;

  rutaKey               : string;   // Es el key del documento, en los get accedes de ruta.key
  rutaNombre            : string;
  rutaCodigo            : KN;
  
  distribuidorKN        : KN;
  organizacionKNAI      : KNAI;
  areaNegocioKN         : KN;
  sucursalkn            : KN;  
  vehiculoKN            : KN;                 // Busco el Estado actual del celular de un vehículo  
  usuarioKANE           : KANE;               // Busco el Estado actual del celular de un integrante o usuario
  
  fechaHora             : Date;
  
  estado                : string;             // Activo-Background-Kill
  versionSO             : string;             // Versión del SO
  plataforma            : string;             // web-ios-android
  isEmulador            : boolean;            // es un emulador o un caso real
  fabricante            : string;             // fabricante
  modelo                : string;             // fabricante
  batteryLevel          : string;             // Nivel de bateria
  isOnLine              : boolean;
  tieneServicioDatos    : boolean;
  lenguaje              : string;
}  

/* Todos los trackeos del Celular en una ruta */
export class RutaTrackeo {
    key           : string;
    
    keyRuta       : string;
    keyVehiculo   : string;
    usuarioKANE   : string;
    
    fechaHora     : Date;
    
    geoPoint      : GeoPoint;   // falta agregar campo hash para rutas
    velocidadKmXH : number;
    errorTrackeo  : number;             // Error del celular en mts
}                      

export class Ruta {
  key                             : string;
  codigo                          : string;
  sesionKN                        : KN;
  nombre                          : string;
  keywords                        : string;

  distribuidorKN                  : KN;
  organizacionKNAI                : KNAI;
  areaNegocioKN                   : KN;
  sucursalKN                      : KN;

  estadoRutaKN                    : KN;     // EnCarga (carga de datos de la ruta en la web),PendienteEjecucion, EnReparto, SalidaOrigen, LlegadaDestino, CierreEjecucion
  mostrarEnMonitor                : Boolean;
  fechaHoraCarga                  : Date;
  
  fechaHoraInicioPlaneada         : Date;
  fechaHoraSalidaPlaneada         : Date;
  fechaHoraArriboPlaneada         : Date;
  fechaHoraFinalizacionPlaneada   : Date;

  fechaHoraInicioReal             : Date;
  fechaHoraSalidaReal             : Date;
  fechaHoraArriboReal             : Date;
  fechaHoraFinalizacionReal       : Date;
  
  vehiculoPrincipalKN             : Vehiculos;
  vehiculoGeoPoint                : GeoPoint;
  integranteChoferKANE            : KANE;

  ubicacionOrigenKN               : RutaParadas;
  ubicacionDestinoKN              : RutaParadas;
  origenEsDestino                 : boolean;
  formaCarga                      : string;
  distanciaPlanificada            : number;
  costoPlanificado                : number;
  
  cantidadParadasEjecutadas       : number;

  settings                        : Settings;
}

export class RutaVehiculos {
  key: string;
  keyRuta: string;
  vehiculo: Vehiculos;
  principal:boolean;
  settings:Settings;   
}

export class Vehiculos {
  key: string;
  patente: string;
  codigo: string;
  nombre: string;
  tipoVehiculoKN: TiposVehiculo;
  organizacionKNAI: KN;
  settings: Settings;
}

export class TiposVehiculo {
  key: string;
  codigo: string;
  nombre: string;
  altura: number;
  peso: number;
  unidadesMedida: UnidadesMedida;
  costoFijoXUnidad: number;
  costoVariableXKm: number;
}

export class RutaIntegrantes {
  key: string;
  keyRuta: string;
  usuarioKANE: KANE;
  tipoIntegranteKN:TiposIntegrantes;
  settings:Settings;
}

export class TiposIntegrantes {
  key: string;
  nombre: string;
}

export class RutaParadas {
  key:                                string;
  keyRuta:                            string;
  codigoPedido:                       string;

  tipoParada:                         TiposParada;
  ubicacion:                          Ubicacion;     //112747-(STOP LOCATION KEY) id de la ubicacion
  geoPointReal:                       GeoPoint;
  orden:                              number;  
  ordenReal:                          number;
  estadoParadaKN:                     KN;           // 'Planificada','Replanificada','LLegoAParada','SeRetiroParada','Cancelada'

  unidadesMedidaEntregarPlanificadas: UnidadesMedida;
  unidadesMedidaEntregarReales:       UnidadesMedida;

  unidadesMedidaRetirarPlanificadas:  UnidadesMedida;
  unidadesMedidaRetirarReales:        UnidadesMedida;

  instruccionesParaConductor:         string;
  comentariosDelConductor:            string;

  fechaHoraInicioPlaneada:            Date;
  fechaHoraFinalizacionPlaneada:      Date;

  fechaHoraInicioReal:                Date;   // Estado = 'LLegoAParada'
  fechaHoraFinalizacionReal:          Date;   // Estado = 'SeRetiroParada'

  settings:Settings;   
}

export class RutaParadasEstados {
  key: string;
  keyParada: string;
  fechaHora:Date;
  estado: string;
  settings:Settings;
}

export class TiposParada {
  key: string;
  nombre: string;
  entregaMercaderia:boolean;
}

export class RutasActivasDiarias {
  key: string;
  organizacionKNAI:KNAI;
  fecha:string; //AAAAMMDD
  cantidadRutasActivas:number;
}