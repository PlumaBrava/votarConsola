

export class SesionesConsola<SesionesConsolaInterfase> {

  NumConcejal             : number;  //	int
    NumDispositivo          : number;  //	int
    Funcion                 : boolean; //	bit
    Macaddresses            : string;  //	nvarchar(50)
    Habilitado              : boolean; //	bit
    IniciaTexto             : boolean; //	bit
    Titulo                  : string;  // nvarchar(300)
    Texto                   : string;  //	text
    InicioVoto              : boolean; //	bit
    ResultadoVoto           : number;  //	tinyint
    TiempoVotacion          : number;  //	int
    TiempoInicio            : string;  //		nvarchar(50)
    TiempoFin               : string;  //		nvarchar(50)
    Limpiar                 : boolean; //	bit
    Apagar                  : boolean; //	bit
    Estado                  : boolean; //	bit
    InfoVoto                : number;  //	tinyint
    InfoAprovacion          : number;  //	tinyint
    InfoVotacion            : number;  //	tinyint
    InfoReloj               : boolean; //	bit
    InfoNominal             : boolean; //	bit
    Excusado                : boolean; //	bit
    PidePalabra             : number;  //	tinyint
    PidePalabraIndice       : number;  //	int
    LoginForzado            : boolean; //	bit
    ConfirmacionPresencia   : boolean; //	bit

  constructor() {

    this.NumConcejal             =null;
    this.NumDispositivo          =null;
    this.Funcion                 =null;
    this.Macaddresses            =null;
    this.Habilitado              =null;
    this.IniciaTexto             =null;
    this.Titulo                  =null;
    this.Texto                   =null;
    this.InicioVoto              =null;
    this.ResultadoVoto           =null;
    this.TiempoVotacion          =null;
    this.TiempoInicio            =null;
    this.TiempoFin               =null;
    this.Limpiar                 =null;
    this.Apagar                  =null;
    this.Estado                  =null;
    this.InfoVoto                =null;
    this.InfoAprovacion          =null;
    this.InfoVotacion            =null;
    this.InfoReloj               =null;
    this.InfoNominal             =null;
    this.Excusado                =null;
    this.PidePalabra             =null;
    this.PidePalabraIndice       =null;
    this.LoginForzado            =null;
    this.ConfirmacionPresencia   =null;
   
  }
}  

export interface SesionesInterface {
    NumConcejal             : number;  //	int
    NumDispositivo          : number;  //	int
    Funcion                 : boolean; //	bit
    Macaddresses            : string;  //	nvarchar(50)
    Habilitado              : boolean; //	bit
    IniciaTexto             : boolean; //	bit
    Titulo                  : string;  // nvarchar(300)
    Texto                   : string;  //	text
    InicioVoto              : boolean; //	bit
    ResultadoVoto           : number;  //	tinyint
    TiempoVotacion          : number;  //	int
    TiempoInicio            : string;  //		nvarchar(50)
    TiempoFin               : string;  //		nvarchar(50)
    Limpiar                 : boolean; //	bit
    Apagar                  : boolean; //	bit
    Estado                  : boolean; //	bit
    InfoVoto                : number;  //	tinyint
    InfoAprovacion          : number;  //	tinyint
    InfoVotacion            : number;  //	tinyint
    InfoReloj               : boolean; //	bit
    InfoNominal             : boolean; //	bit
    Excusado                : boolean; //	bit
    PidePalabra             : number;  //	tinyint
    PidePalabraIndice       : number;  //	int
    LoginForzado            : boolean; //	bit
    ConfirmacionPresencia   : boolean; //	bit

    Abreviacion             : string;
    PartidoAbreviado        : string;
    nombreBanca             : string;
    Concejal                : string;
    concejalNombreabreviado : string;
    clase                   : string;
    partido                 : string;
    BancaFila               : number;
    BancaColumna            : number;

}  
