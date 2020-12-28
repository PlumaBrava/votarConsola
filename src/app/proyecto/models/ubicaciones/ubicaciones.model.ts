import { IMG                 } from '@maq-models/typesIMG/typesIMG.model';
import { KN, KANE, KNAI      } from '@maq-models/typesKN/typesKN.model';
import { Direccion           } from '@maq-models/direccion/direccion.model';
import { Telefono            } from '@maq-models/telefono/telefono.model';
import { VentanaAtencion     } from '@maq-models/horariosAtencion/horariosAtencion.model';
import { Settings            } from '@maq-models/settings/settings.model';
import { AreaNegocio         } from '@maq-models/usuarios/usuarios.model';

export class Ubicacion {    // ToDo: Hacer sub-formularios de Organización
   key                : string;
   codigo             : string;
   nombre             : string;
   keywords           : string;
   organizacionKNAI   : KN;
   sucursalKN         : KN;
   AreaNegocio        : AreaNegocio;
   tipoUbicacionKN    : TiposUbicacion;
   tipoCuentaKN       : TiposCuenta;
   email              : string;
   direccion          : Direccion;
   telefono           : Telefono;
   tiempoServicio     : {hour:number,minute:number,second:number};
   radioEntrega       : number;
   ventanaAtencion    : VentanaAtencion;
   settings           : Settings;
 }
 
 export class TiposCuenta {    // ToDo: Hacer sub-formularios de Organización
   key:string;
   nombre:string;
   tiempoServicio: number;
   organizacionKN: KN;
 }
 
 export class TiposUbicacion {    // ToDo: Hacer sub-formularios de Organización
  key:string;
  nombre:string;
}