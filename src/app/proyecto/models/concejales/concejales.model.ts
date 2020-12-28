

/* Concejales tiene el listado de consejles */

export class Concejales<ConcejalesInterface> {

  NumConcejal   : number;
  Concejal      : string
  NumPropuesto  : number;
  Clasificacion : boolean;
  Estado        : boolean;
  Abreviacion   : string;
  BancaFila     : number;
  BancaColumna  : number;
  Email         : string;
 
  constructor(init?:Partial<ConcejalesInterface>) {
    Object.assign(this, init);
  }
}  

export interface ConcejalesInterface {

  NumConcejal   : number;
  Concejal      : string
  NumPropuesto  : number;
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
  
  constructor(init?:Partial<ConcejalesDispositivosInterface>) {
    Object.assign(this, init);
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