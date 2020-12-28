import { log, logIf, logTable, values } from '@maq-console';

import { TransferenciaArchivos ,TransferenciaBaseDatos} from '@maq-models/transferenciaArchivos/transferenciaArchivos.model';
import { KN, KNAI, KANE }                               from '@maq-models/typesKN/typesKN.model';


export class ConfigExcel2 {

   iniciarTransferencia:            boolean = false;                
   tipoDeVerificaciones:            string  = null;
   transferenciaBaseDatos:          TransferenciaBaseDatos;
   criteriosTransferencia:          any[]   = [];
   
   organizacionKNAI:                KNAI    = null;
   usuarioKANE:                     KANE    = null;
   listadoPrincipalCompleto:        any[]   = [];
   listadosCache:                   any[]   = [];

   constructor(public bdService:any, argumentos:any) {

      this.organizacionKNAI          = argumentos.organizacionKNAI;
      this.usuarioKANE               = argumentos.usuarioKANE;
      this.listadoPrincipalCompleto  = argumentos.listadosPrincipalCompleto;
      this.listadosCache             = argumentos.listadosCache;
   
      this.iniciarTransferencia  = false;                                          
      this.tipoDeVerificaciones ='SoloTraducir';

      this.transferenciaBaseDatos=new TransferenciaBaseDatos({
        nombreColeccion:                          'MateriasPrimasCostos',
        organizacionKNAI:                         this.organizacionKNAI,
        usuarioKANE:                              this.usuarioKANE,
        camposaVerificarEnBase:                   ['key'],
        camposClaveExcelParaVerificarEnBase:      ['codigo'],
        citerioParaAceptarUnCampoExistente:       ['merge'],
      });
      
      this.criteriosTransferencia = [

        new TransferenciaArchivos({
          nombreCampoDocumento:   'materiaPrimaKN',
          nombreColumnaExcel:     'codigo',   
          tipoValidacion:         'BuscoEnArray_RetornoKN',          
          datos:                  this.listadoPrincipalCompleto, 			            
          datosClaveBusqueda:     'key',   
          claveUnica:             false,           
          mensajeError:           'No existe el código en la tabla de Materias Primas. ' 
        }), 
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'key',
          nombreColumnaExcel:     'materiaPrimaKN.key|DATE',   
          tipoValidacion:         'Calculado',         
          datos:                   [], 			            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'Error calculando Key. ' 
        }), 
        new TransferenciaArchivos({
          nombreCampoDocumento:   'fechaHoraVigencia',
          nombreColumnaExcel:     '',   
          tipoValidacion:         'setDate',         
          datos:                   [], 			            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'Error fechaHoraVigencia. ' 
        }), 
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'proveedorKN',
          nombreColumnaExcel:     'proveedor',   
          tipoValidacion:         'BuscoEnArray_RetornoKN',         
          datos:                   this.listadosCache['AuxProveedores'], 			            
          datosClaveBusqueda:     'key',   
          claveUnica:             false,           
          mensajeError:           'No existe el código en la Proveedor. ' 
        }), 
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'metodoCalculoKN',
          nombreColumnaExcel:     'formadeCalculo',   
          tipoValidacion:         'BuscoEnArray_RetornoKN',         
          datos:                   this.listadosCache['AuxFormasCalculoMP'], 			            
          datosClaveBusqueda:     'key',   
          claveUnica:             false,           
          mensajeError:           'No existe el código en la Forma de Calculo. ' 
        }),      
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'monedaKMONEY',
          nombreColumnaExcel:     'Moneda',   
          tipoValidacion:         'estaEnArrayBuscoEnString',         
          datos:                   this.listadosCache['AuxMonedas'], 			            
          datosClaveBusqueda:     'key',   
          claveUnica:             false,           
          mensajeError:           'No existe el código en la Moneda. ' 
        }),      
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'precioDistribuidor',
          nombreColumnaExcel:     'DISTRIBUIDOR',   
          tipoValidacion:         'obligatorio',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'DISTRIBUIDOR es obligatorio. ' 
        }),
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'precioPublico',
          nombreColumnaExcel:     'PUBLICO',   
          tipoValidacion:         'obligatorio',         
          datos:                   [], 			            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'PUBLICO es obligatorio. ' 
        }),
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'precioIB_DCOT',
          nombreColumnaExcel:     'IIBB_DIF_COT',
          tipoValidacion:         'obligatorio',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'IIBB_DIF_COT Obligatorio. ' 
        }),
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'porceRecargoNueveDeJulio',
          nombreColumnaExcel:     'coef9deJulio',
          tipoValidacion:         'obligatorio',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'coef9deJulio Obligatorio. ' 
        }),
        
        new TransferenciaArchivos({
          nombreCampoDocumento:   'porceRecargoTrenqueLauquen',
          nombreColumnaExcel:     'coefTrenque',
          tipoValidacion:         'obligatorio',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'coefTrenque Obligatorio. ' 
        }),
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'porceRecargoQuiroga',
          nombreColumnaExcel:     'coefQuiroga',
          tipoValidacion:         'obligatorio',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'coefQuiroga Obligatorio. ' 
        }),  
        
        new TransferenciaArchivos({
          nombreCampoDocumento:   'costoNueveDeJulio',
          nombreColumnaExcel:     'precioDistribuidor*porceRecargoNueveDeJulio',
          tipoValidacion:         'Calculado',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'costoNueveDeJulio calculado. ' 
        }),  
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'costoTrenqueLauquen',
          nombreColumnaExcel:     'precioDistribuidor*porceRecargoTrenqueLauquen',
          tipoValidacion:         'Calculado',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'costoTrenqueLauquen calculado. ' 
        }),  
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'costoQuiroga',
          nombreColumnaExcel:     'precioDistribuidor*porceRecargoQuiroga',
          tipoValidacion:         'Calculado',         
          datos:                   [], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'costoQuiroga calculado. ' 
        }),  
  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'comentarios',
          nombreColumnaExcel:     'ComentariosPrecios',
          tipoValidacion:         'minimaCantidadCaracteres',         
          datos:                   [0], 				            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'ComentariosPrecios . ' 
        }),
  
       ];
                              
   } // fin contructor
   
   ejcutarAccionPosterior(){
 
  }

}
