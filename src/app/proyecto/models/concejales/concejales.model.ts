

/* Concejales tiene el listado de concejales */
import { Settings }         from '@maq-models/settings/settings.model';

export class Concejales<ConcejalesInterface> {

  NumConcejal   : number;
  Concejal      : string
  NumPropuesto  : number;
  NumPartido    : number;
  Clasificacion : boolean;
  Estado        : boolean;
  Abreviacion   : string;
  BancaFila     : number;
  BancaColumna  : number;
  Email         : string;
  // settings      : Settings;
 
  // constructor(init?:Partial<ConcejalesInterface>) {
  //   Object.assign(this, init);
  // }
  constructor() {
    this.NumConcejal   =null;
    this.Concejal      =null;
    this.NumPropuesto  =null;
    this.NumPartido    =null;
    this.Clasificacion =null;
    this.Estado        =null;
    this.Abreviacion   =null;
    this.BancaFila     =null;
    this.BancaColumna  =null;
    this.Email         =null;
    // this.settings      =new Settings();
  }
}  

export interface ConcejalesInterface {

  NumConcejal   : number;
  Concejal      : string
  NumPropuesto  : number;
  NumPartido    : number;
  Clasificacion : boolean;
  Estado        : boolean;
  Abreviacion   : string;
  BancaFila     : number;
  BancaColumna  : number;
  Email         : string;
 
  
}  

export class ConcejalesDispositivos<ConcejalesDispositivosInterface> {
  NumConcejal       : number;
  NumDispositivo    : number;
  Funcion           : boolean;
  Clave             : string;
  Macaddresses      : string
  Presente          : boolean;
  // settings          : Settings;
  
  constructor() {
    this.NumConcejal    = null;
    this.NumDispositivo = null;
    this.Funcion        = null;
    this.Clave          = null;
    this.Macaddresses   = null;
    this.Presente       = null;
    // this.settings       = new Settings();
    
  }
  
} 


export class ConcejalesDispositivosInterface {
  NumConcejal       : number;
  NumDispositivo    : number;
  Funcion           : boolean;
  Clave             : string;
  Macaddresses      : string
  Presente          : boolean;
    
} 