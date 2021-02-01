

/* Concejales tiene el listado de concejales */
import { Settings }         from '@maq-models/settings/settings.model';

export class Novedades<NovedadesInterface> {

  NumOrdenDiaNovedad2        : number; // NumOrdenDiaNovedad	int	Unchecked
  NumOrdenDiaCaratula       : number; // NumOrdenDiaCaratula	int	Unchecked
  NumOrdenDiaSubCaratula    : number; // NumOrdenDiaCaratula	int	Unchecked
  Fecha                     : Date;   // Fecha	datetime	Unchecked
  Rotulo                    : string; // Rotulo	nvarchar(100)	Unchecked
  Novedad                   : string; // Novedad	nvarchar(4000)	Unchecked
  Estado                    : boolean // Estado	bit	Unchecked

 
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
    
  }
}  

export interface NovedadesInterface {

 
  NumOrdenDiaNovedad2    : number, // NumOrdenDiaNovedad	int	Unchecked
  NumOrdenDiaCaratula   : number, // NumOrdenDiaCaratula	int	Unchecked
  NumOrdenDiaSubCaratula: number, // NumOrdenDiaSubCaratula	int	Unchecked
  Fecha                 : Date,   // Fecha	datetime	Unchecked
  Rotulo                : string, // Rotulo	nvarchar(100)	Unchecked
  Novedad               : string, // Novedad	nvarchar(4000)	Unchecked
  Estado                : boolean // Estado	bit	Unchecked

}  
