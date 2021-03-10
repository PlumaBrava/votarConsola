

/* Concejales tiene el listado de concejales */
import { Settings }         from '@maq-models/settings/settings.model';

export class OrdenDelDia<OrdenDelDiaInterface> {

  NumOrdenDia         : number;//	bigint
  Fecha               : Date;	//smalldatetime
  Orden               : string;	//nvarchar(50)
  SubOrden            : string;	//nvarchar(50)
  OrdenDiaCaratula    : string;	//nvarchar(300)
  OrdenDiaSubCaratula : string;	//nvarchar(300)
  Rotulo              : string;	//nvarchar(100)
  Item                : string;	//nvarchar(4000)
  Estado              : boolean;//	bit
  ResultadoVoto       : number; //	tinyint
  InfoVoto            : number; //	tinyint
  InfoAprovacion      : number; //	tinyint
  InfoVotacion        : number; //	tinyint
  Agrupa              : boolean;//	bit
  NumAgrupacion       : number; //	int
  TipoSesion          : number; //	tinyint
  NumTipoSesion       : string; //	nvarchar(10)
  Terminado           : boolean;//	bit
  nro_expediente      : string; //	string

  constructor() {

    this.NumOrdenDia         =null;
    this.Fecha               =null;
    this.Orden               =null;
    this.SubOrden            =null;
    this.OrdenDiaCaratula    =null;
    this.OrdenDiaSubCaratula =null;
    this.Rotulo              =null;
    this.Item                =null;
    this.Estado              =null;
    this.ResultadoVoto       =null;
    this.InfoVoto            =null;
    this.InfoAprovacion      =null;
    this.InfoVotacion        =null;
    this.Agrupa              =null;
    this.NumAgrupacion       =null;
    this.TipoSesion          =null;
    this.NumTipoSesion       =null;
    this.Terminado           =null;
    this.nro_expediente      =null;



    
  }
}  

export interface OrdenDelDiaInterface {

  NumOrdenDia         : number;//	bigint
  Fecha               : Date;	//smalldatetime
  Orden               : string;	//nvarchar(50)
  SubOrden            : string;	//nvarchar(50)
  OrdenDiaCaratula    : string;	//nvarchar(300)
  OrdenDiaSubCaratula : string;	//nvarchar(300)
  Rotulo              : string;	//nvarchar(100)
  Item                : string;	//nvarchar(4000)
  Estado              : boolean;//	bit
  ResultadoVoto       : number; //	tinyint
  InfoVoto            : number; //	tinyint
  InfoAprovacion      : number; //	tinyint
  InfoVotacion        : number; //	tinyint
  Agrupa              : boolean;//	bit
  NumAgrupacion       : number; //	int
  TipoSesion          : number; //	tinyint
  NumTipoSesion       : string; //	nvarchar(10)
  Terminado           : boolean;//	bit
  nro_expediente      : string; //	nvarchar(50)
  indiceExpediente    : number; 
  indiceCapitulo        : number; 
	
  
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