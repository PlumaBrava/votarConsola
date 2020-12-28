
import { KN, KANE, KNAI      } from '@maq-models/typesKN/typesKN.model';
   

export const ESTADOS_RUTA:any=
{
  Creacion        : {key:'Creacion',      nombre:'estadoRuta.creacion'},
  NoIniciada      : {key:'NoIniciada',    nombre:'estadoRuta.noIniciada'},
  Iniciada        : {key:'Iniciada',      nombre:'estadoRuta.iniciada'},
  RutaEnCurso     : {key:'RutaEnCurso',   nombre:'estadoRuta.rutaEnCurso'},
  ParadaEnCurso   : {key:'ParadaEnCurso', nombre:'estadoRuta.paradaEnCurso'},
  EscalaEnCurso   : {key:'EscalaEnCurso', nombre:'estadoRuta.escalaEnCurso'},
  LlegoAlDestino  : {key:'LlegoAlDestino',nombre:'estadoRuta.llegoAlDestino'}, 
  Concluida       : {key:'Concluida',     nombre:'estadoRuta.concluida'}
  
};  

export const ESTADOS_PARADAS :any=
{
  ParadaPendiente           : {key:'ParadaPendiente',         nombre:'estadoParada.paradaPendiente'},
  ParadaEnCurso             : {key:'ParadaEnCurso',           nombre:'estadoParada.paradaEnCurso'},
  EntregaCompleta           : {key:'EntregaCompleta',         nombre:'estadoParada.entregaCompleta'},
  EntregaParcial            : {key:'EntregaParcial',          nombre:'estadoParada.entregaParcial'},
  Cancelada                 : {key:'Cancelada',               nombre:'estadoParada.cancelada'},
  Rechazada                 : {key:'Rechazada',               nombre:'estadoParada.rechazada'},
  Replanificada             : {key:'Replanificada',           nombre:'estadoParada.replanificada'},
  IndicacionesSolicitadas   : {key:'IndicacionesSolicitadas', nombre:'estadoParada.indicacionesSolicitadas'},
  ParadaRealizada           : {key:'ParadaRealizada'        , nombre:'estadoParada.paradaRealizada'}
}