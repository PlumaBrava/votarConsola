

/* Concejales tiene el listado de concejales */
import { Settings }         from '@maq-models/settings/settings.model';

export class Partidos<PartidoInterface> {

  NumPartido          : number;
  Partido             : string
  PartidoAbreviado    : number;

 
  // constructor(init?:Partial<ConcejalesInterface>) {
  //   Object.assign(this, init);
  // }
  constructor() {
    this.NumPartido         = null;
    this.Partido            = null;
    this.PartidoAbreviado   = null;

  }
}  

export interface PartidoInterface {

  NumPartido          : number;
  Partido             : string
  PartidoAbreviado    : number;
  
 
  
}  
