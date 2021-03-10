

/* Concejales tiene el listado de concejales */
import { Settings }         from '@maq-models/settings/settings.model';

export class Novedades<NovedadesInterface> {

  NumOrdenDiaNovedad        : number; // NumOrdenDiaNovedad	int	Unchecked
  NumOrdenDiaCaratula       : number; // NumOrdenDiaCaratula	int	Unchecked
  NumOrdenDiaSubCaratula    : number; // NumOrdenDiaCaratula	int	Unchecked
  Fecha                     : Date;   // Fecha	datetime	Unchecked
  Rotulo                    : string; // Rotulo	nvarchar(100)	Unchecked
  Novedad                   : string; // Novedad	nvarchar(4000)	Unchecked
  Estado                    : boolean; // Estado	bit	Unchecked
  fecha_ingreso_expediente  : string; //Fecha del expediente
  archivos_expediente       : string; // array de expediente. lo guardo como json
  nro_expediente            : string; // array de expediente. lo guardo como json

 
  // constructor(init?:Partial<ConcejalesInterface>) {
  //   Object.assign(this, init);
  // }
  constructor() {
    this.NumOrdenDiaNovedad       = null;
    this.NumOrdenDiaCaratula      = null;
    this.NumOrdenDiaSubCaratula   = null;
    this.Fecha                    = null;
    this.Rotulo                   = null;
    this.Novedad                  = null;
    this.Estado                   = null;
    this.fecha_ingreso_expediente = null;
    this.archivos_expediente      = null;
    this.nro_expediente           = null;
    
  }
}  

export interface NovedadesInterface {

 
  NumOrdenDiaNovedad        : number, // NumOrdenDiaNovedad	int	Unchecked
  NumOrdenDiaCaratula       : number, // NumOrdenDiaCaratula	int	Unchecked
  NumOrdenDiaSubCaratula    : number, // NumOrdenDiaSubCaratula	int	Unchecked
  Fecha                     : Date,   // Fecha	datetime	Unchecked
  Rotulo                    : string, // Rotulo	nvarchar(100)	Unchecked
  Novedad                   : string, // Novedad	nvarchar(4000)	Unchecked
  Estado                    : boolean // Estado	bit	Unchecked,
  fecha_ingreso_expediente  : string; // Fecha del expediente
  archivos_expediente       : string; // array de expediente. lo guardo como json
  nro_expediente            : string; // nro_expediente,
  
  indiceExpediente          : number; // numero correlativo para identificar un Expediente dentro de las novedad
                                      // no uso el nro de expediente porque quiero que sea idependiente para asociar los items o capitulos que tiene
                                      // se repetiran en cada orden del día.
  indiceCapitulo            : number; // cuenta los items/ capitulos asociados.
 

}  

export interface News{
  caratula                    : number;
  subcaratula                 : number;
  apartado                    : string; //Lo leo pero queda definido por carátula y subcarátula. No es necesario importarlo
  rotulo                      : string;
  novedad                     : string;
  fecha_ingreso_expediente    : string;
  archivos_expediente         : string;
  nro_expediente              : string;
  indiceExpediente            : number;
  indiceCapitulo              : number; 
}