

/* Concejales tiene el listado de concejales */
import { Settings }         from '@maq-models/settings/settings.model';

export class Panel<PanelInterface> {

  NumPanel                        : number;   //	int
  IniciaTexto                     : boolean;  //	bit
  Titulo                          : string;   //	nvarchar(300)
  Texto                           : string;   //	nvarchar(4000)
  InicioVoto                      : boolean;  //	bit
  TiempoVotacion                  : number;   //	int
  Limpiar                         : boolean;  //	bit
  Apagar                          : boolean;  //	bit
  Estado                          : boolean;  //	bit
  InfoVoto                        : number;   //	tinyint
  InfoAprovacion                  : number;   //	tinyint
  InfoVotacion                    : number;   //	tinyint
  InfoReloj                       : boolean;  //	bit
  TipoSesion                      : string;   //	nvarchar(15)
  NumTipoSesion                   : string;   //	nvarchar(10)
  ConfirmacionDePresencia         : boolean;  //	bit
  TiempoConfirmacionDePresencia   : boolean;  //	bit
  MuestraPDFFInal                 : boolean;  //	bit
  
  constructor() {
    
    this.NumPanel                        =null;
    this.IniciaTexto                     =null;
    this.Titulo                          =null;
    this.Texto                           =null;
    this.InicioVoto                      =null;
    this.TiempoVotacion                  =null;
    this.Limpiar                         =null;
    this.Apagar                          =null;
    this.Estado                          =null;
    this.InfoVoto                        =null;
    this.InfoAprovacion                  =null;
    this.InfoVotacion                    =null;
    this.InfoReloj                       =null;
    this.TipoSesion                      =null;
    this.NumTipoSesion                   =null;
    this.ConfirmacionDePresencia         =null;
    this.TiempoConfirmacionDePresencia   =null;
    this.MuestraPDFFInal                 =null;
  }
}  

export interface PanelInterface {

  NumPanel                        : number;   //	int
  IniciaTexto                     : boolean;  //	bit
  Titulo                          : string;   //	nvarchar(300)
  Texto                           : string;   //	nvarchar(4000)
  InicioVoto                      : boolean;  //	bit
  TiempoVotacion                  : number;   //	int
  Limpiar                         : boolean;  //	bit
  Apagar                          : boolean;  //	bit
  Estado                          : boolean;  //	bit
  InfoVoto                        : number;   //	tinyint
  InfoAprovacion                  : number;   //	tinyint
  InfoVotacion                    : number;   //	tinyint
  InfoReloj                       : boolean;  //	bit
  TipoSesion                      : string;   //	nvarchar(15)
  NumTipoSesion                   : string;   //	nvarchar(10)
  ConfirmacionDePresencia         : boolean;  //	bit
  TiempoConfirmacionDePresencia   : boolean;  //	bit
  MuestraPDFFInal                 : boolean;  //	bit
  VotacionEstado                   : number;  //	int
  votosPositivos                  : number;  //	int
  votosNegativos                  : number;  //	int
  votosAbstencion                 : number;  //	int
  resultadoVotacion               : string;  //	int
   
}  
