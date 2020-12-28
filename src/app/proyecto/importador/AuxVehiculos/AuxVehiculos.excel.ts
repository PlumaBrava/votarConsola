import { log, logIf, logTable, values } from '@maq-console';

import { TransferenciaArchivos ,TransferenciaBaseDatos} from '@maq-models/transferenciaArchivos/transferenciaArchivos.model';
import { KNAI, KANE, KN }                               from '@settings/maqueta/models/typesKN/typesKN.model';
import { Importador, ConfigExcel}                       from '@maq-models/importador/importador.model';


export class ConfigTransferenciaExcell implements ConfigExcel {

   iniciarTransferencia       : boolean = false;
   tipoDeVerificaciones       : string  = null;
   transferenciaBaseDatos     : TransferenciaBaseDatos;
   criteriosTransferencia     : any[]   = [];
   eventArchivoExcel          : any=null;

   distribuidorKN             : KN      = null;
   organizacionKNAI           : KNAI    = null;
   usuarioKANE                : KANE    = null;
   listadoPrincipalCompleto   : any[]   = [];
   listadosCache              : any[]   = [];
   
   
   constructor(public bdService:any, argumentos:any) {

      this.distribuidorKN            = argumentos.distribuidorKN;    
      this.organizacionKNAI          = argumentos.organizacionKNAI;
      this.usuarioKANE               = argumentos.usuarioKANE;
      this.listadoPrincipalCompleto  = argumentos.listadosPrincipalCompleto;
      this.listadosCache             = argumentos.listadosCache;

      this.iniciarTransferencia    = false;                                
      this.tipoDeVerificaciones   = 'SoloTraducir';
      
      this.transferenciaBaseDatos = new TransferenciaBaseDatos({
          nombreColeccion:                          'Vehiculos',
          distribuidorKN:                           this.distribuidorKN,
          organizacionKNAI:                         this.organizacionKNAI,
          usuarioKANE:                              this.usuarioKANE,
          camposaVerificarEnBase:                   ['key'],
          camposClaveExcelParaVerificarEnBase:      ['codigo'],
          citerioParaAceptarUnCampoExistente:       ['merge'],
      });
      

    
      this.criteriosTransferencia = [
       // id->key  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'key',
           nombreColumnaExcel:     'id',   
           tipoValidacion:         'obligatorio',          
           datos:                  [4], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             true,           
           mensajeError:           'id es Obligatorio. ' 
         }), 
        // id->código  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'codigo',
          nombreColumnaExcel:     'id',   
          tipoValidacion:         'obligatorio',          
          datos:                  [4], 			            
          datosClaveBusqueda:     null,   
          claveUnica:             true,           
          mensajeError:           'id es Obligatorio. ' 
        }),
        // codigo->patente       
         new TransferenciaArchivos({
           nombreCampoDocumento:   'patente',
           nombreColumnaExcel:     'codigo',   
           tipoValidacion:         'minimaCantidadCaracteres',          
           datos:                  [1], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'La pantente  debe tener un caracter como mínimo. ' 
         }), 
        // descripcion->nombre       
        new TransferenciaArchivos({
          nombreCampoDocumento:   'nombre',
          nombreColumnaExcel:     'descripcion',   
          tipoValidacion:         'minimaCantidadCaracteres',          
          datos:                  [1], 			            
          datosClaveBusqueda:     null,   
          claveUnica:             false,           
          mensajeError:           'La descripción  debe tener un caracter como mínimo. ' 
        }),          


         // Tipo de Equipo->tipoVehiculoKN
         new TransferenciaArchivos({
          nombreCampoDocumento:   'tipoVehiculoKN',
          nombreColumnaExcel:     'Tipo de Equipo',   
          tipoValidacion:         'estaEnArrayBuscoEnString',
          datos:                  this.listadosCache['AuxTiposVehiculos'], 			            
          datosClaveBusqueda:     'key', 
          claveUnica:             false,           
          mensajeError:           'Tipo Vehiculo Inexistente. ' 
        }),
        // Tipo de organizacion->OrganizacionKNAI
          new TransferenciaArchivos({
          nombreCampoDocumento:   'organizacionKNAI',
          nombreColumnaExcel:     'organizacion',   
          tipoValidacion:         'BuscoEnArray_RetornoKNAI',
          datos:                  this.listadosCache['Organizaciones'], 			            
          datosClaveBusqueda:     'nombre', 
          claveUnica:             false,           
          mensajeError:           'organizacion Inexistente. ' 
        }),

  
      ];
                              
   } // fin contructor
   
   ejcutarAccionPosterior(){
      // No realiza acción posterior
   } 

}
