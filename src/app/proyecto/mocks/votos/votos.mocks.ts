
export enum MOCK_ESTADOS

  {
     ESPERANDO_NOVEDADES   = 0,
     SINQUORUM             = 1,
     CONCUORUM             = 2,
     TEXTOS                = 3,
     VOTANDO               = 4,
     CALCULANDO_RESULTADOS = 5,
     EMPATE                = 6,
     RESULTADOS            = 7,
     USO_DE_PALABRA        = 8,
  };

  
export enum MOCK_INFOVOTO_ID {
  INICIAL = 0,//CARGA INICIAL
  GENERAL = 1,
  NOMINAL = 2
}

export const MOCK_INFOVOTO:MOCK_INFOVOTO_Interfase[]=
[
  {infoVoto:MOCK_INFOVOTO_ID.GENERAL,tipoVotacion:'Votacion General'},
  {infoVoto:MOCK_INFOVOTO_ID.NOMINAL,tipoVotacion:'Votacion Nominal'}
];  

export function getInfoVoto(number):string{
  let respuesta='';

  for (let index = 0; index < MOCK_INFOVOTO.length; index++) {
    const element:MOCK_INFOVOTO_Interfase = MOCK_INFOVOTO[index];
    if(number==element.infoVoto){
      respuesta=element.tipoVotacion;
      break;
    }    
  }
  return respuesta
}


export enum MOCK_INFOAPROBACION_ID {
  INICIAL = 0,//CARGA INICIAL
  UNANIMIDAD        = 1,
  MAYORIA_SIMPLE    = 2,
  MAYORIA_ABSOLUTA  = 3
}


export const MOCK_INFOAPROBACION:MOCK_INFOAPROBACION_Interfase[]=
[
  {infoAprobacion: MOCK_INFOAPROBACION_ID.UNANIMIDAD,       tipoAprobacion:'Unanimidad'},
  {infoAprobacion: MOCK_INFOAPROBACION_ID.MAYORIA_SIMPLE,   tipoAprobacion:'Mayoria Simple (1/2+1)'},
  {infoAprobacion: MOCK_INFOAPROBACION_ID.MAYORIA_ABSOLUTA, tipoAprobacion:'Mayoria Absoluta (2/3)'}
 
];  

export function getInfoAprobacion(number):string{
  let respuesta='';

  for (let index = 0; index < MOCK_INFOAPROBACION.length; index++) {
    const element:MOCK_INFOAPROBACION_Interfase = MOCK_INFOAPROBACION[index];
    if(number==element.infoAprobacion){
      respuesta=element.tipoAprobacion;
      break;
    }    
  }
  return respuesta
}


export enum MOCK_INFOAGRUPACION_ID {
  INICIAL = 0,//CARGA INICIAL
  AGRUPADA        = 1,
  INDIVIDUAL      = 2,
  PARTICULAR      = 3
}


export const MOCK_INFOAGRUPACION:MOCK_INFOAGRUPACION_Interfase[]=
[
  {infoVotacion:MOCK_INFOAGRUPACION_ID.AGRUPADA,    tipoAgrupacion:'Agrupada'},
  {infoVotacion:MOCK_INFOAGRUPACION_ID.INDIVIDUAL,  tipoAgrupacion:'Individual'},
  {infoVotacion:MOCK_INFOAGRUPACION_ID.PARTICULAR,  tipoAgrupacion:'Particular'}
];  


export function getInfoAgrupacion(number):string{
  let respuesta='';

  for (let index = 0; index < MOCK_INFOAGRUPACION.length; index++) {
    const element:MOCK_INFOAGRUPACION_Interfase = MOCK_INFOAGRUPACION[index];
    if(number==element.infoVotacion){
      respuesta=element.tipoAgrupacion;
      break;
    }    
  }
  return respuesta
}


export interface MOCK_INFOVOTO_Interfase 
  { infoVoto      :number;
    tipoVotacion  :string
  }

  

export interface MOCK_INFOAPROBACION_Interfase
  { infoAprobacion    : number;
    tipoAprobacion    : string
  };  
export interface MOCK_INFOAGRUPACION_Interfase
  {
    infoVotacion:number;
    tipoAgrupacion:string
  }

  export interface MOCK_TIPO_ORDEN_DIA_Interfase
  {
    id              : number;
    tipoOrdenDia    : string
  };
  
export enum MOCK_TIPO_ORDEN_DIA_ID {

  ORDINARIA         = 1,
  EXTRAORDINARIA    = 2,
  PRORROGA          = 3,
  ESPECIAL          = 4
}

  export const MOCK_TIPO_ORDEN_DIA:MOCK_TIPO_ORDEN_DIA_Interfase[]=
[
  {id:MOCK_TIPO_ORDEN_DIA_ID.ORDINARIA,       tipoOrdenDia:'Ordinaria'},
  {id:MOCK_TIPO_ORDEN_DIA_ID.EXTRAORDINARIA,  tipoOrdenDia:'ExtraOrdinaria'},
  {id:MOCK_TIPO_ORDEN_DIA_ID.PRORROGA,        tipoOrdenDia:'Prorroga'},
  {id:MOCK_TIPO_ORDEN_DIA_ID.ESPECIAL,        tipoOrdenDia:'Especial'},
  
];  

export enum MOCK_RESULTADO_VOTO_ID {

  NEGATIVO         = 0,
  POSITIVO         = 1,
  ABSTENCION       = 2,
  INICIAL          = 3,     // Se inicia la votación
  SIN_PROCESAR     = 4      // Se carga en el orden del día como valor inicial
}

export enum MOCK_QUORUM {

  SIN_QUORUM         = 'SIN QUORUM',
  CON_QUORUM         = 'CON QUORUM',
  
}