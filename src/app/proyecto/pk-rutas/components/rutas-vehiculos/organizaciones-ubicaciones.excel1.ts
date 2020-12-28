import { log, logIf, logTable, values } from '@maq-console';

import { TransferenciaArchivos ,TransferenciaBaseDatos} from '@maq-models/transferenciaArchivos/transferenciaArchivos.model';
import { KN, KANE, KNAI }                               from '@maq-models/typesKN/typesKN.model';

export class ConfigExcel1 {

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

      this.iniciarTransferencia    = false;                                
      this.tipoDeVerificaciones   = 'SoloTraducir';
      
      this.transferenciaBaseDatos = new TransferenciaBaseDatos({
          nombreColeccion:                          'Ubicaciones',
          organizacionKNAI:                         this.organizacionKNAI,
          usuarioKANE:                              this.usuarioKANE,
          camposaVerificarEnBase:                   ['key'],
          camposClaveExcelParaVerificarEnBase:      ['codigo'],
          citerioParaAceptarUnCampoExistente:       ['merge'],
      });

      this.criteriosTransferencia = [
       // codigo  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'codigo',
           nombreColumnaExcel:     'Location Key',   
           tipoValidacion:         'obligatorio',          
           datos:                  [4], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             true,           
           mensajeError:           'Location Key es Obligatorio. ' 
         }), 
        // nombre       
         new TransferenciaArchivos({
           nombreCampoDocumento:   'nombre',
           nombreColumnaExcel:     'Description',   
           tipoValidacion:         'minimaCantidadCaracteres',          
           datos:                  [1], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Description debe tener un caracter como mínimo. ' 
         }), 
        // keywords  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'keywords',
           nombreColumnaExcel:     'Description',   
           tipoValidacion:         'keywords',          
           datos:                  [], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Error generando Keywords. ' 
         }), 
         // organizacionKNAI
         new TransferenciaArchivos({
           nombreCampoDocumento:   'organizacionKNAI',
           nombreColumnaExcel:     'presentacionCantidad',   
           tipoValidacion:         'constante',          
           datos:                  [this.organizacionKNAI], 			            
           datosClaveBusqueda:     null, 
           claveUnica:             false,           
           mensajeError:           'Organizacion Indeterminada. ' 
         }), 
         //sucursalKN---
         new TransferenciaArchivos({
           nombreCampoDocumento:   'sucursalKN',
           nombreColumnaExcel:     'pr',   
           tipoValidacion:         'estaEnArrayBuscoEnString',          
           datos:                  this.listadosCache['Aux'], 			            
           datosClaveBusqueda:     'key',  
           claveUnica:             false,           
           mensajeError:           'Error al determinar la sucursal. ' 
         }), 
         
         
         //AreaNegocio
         new TransferenciaArchivos({
           nombreCampoDocumento:   'AreaNegocio',
           nombreColumnaExcel:     'pr',   
           tipoValidacion:         'estaEnArrayBuscoEnString',          
           datos:                  this.listadosCache['AuxUnidadesPeso'], 			            
           datosClaveBusqueda:     'key',  
           claveUnica:             false,           
           mensajeError:           'Error al determinar la sucursal. ' 
         }),
         //tipoUbicacionKN
         new TransferenciaArchivos({
          nombreCampoDocumento:   'tipoUbicacionKN',
          nombreColumnaExcel:     'Type',   
          tipoValidacion:         'estaEnArrayBuscoEnString',          
          datos:                  this.listadosCache['AuxTiposUbicacion'], 			            
          datosClaveBusqueda:     'key',  
          claveUnica:             false,           
          mensajeError:           'Error al determinar la sucursal. ' 
        }),
        
         //tipoCuentaKN--
         new TransferenciaArchivos({
          nombreCampoDocumento:   'tipoCuentaKN',
          nombreColumnaExcel:     'pr',   
          tipoValidacion:         'estaEnArrayBuscoEnString',          
          datos:                  this.listadosCache['AuxTiposCuenta'], 			            
          datosClaveBusqueda:     'key',  
          claveUnica:             false,           
          mensajeError:           'Error al determinar la sucursal. ' 
        }),         
         //  email: string;
  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'comentarios',
           nombreColumnaExcel:     'comentariosCabecera',   
           tipoValidacion:         'minimaCantidadCaracteres',          
           datos:                  [1], 			            
           datosClaveBusqueda:     null,  
           claveUnica:             false,           
           mensajeError:           'Comentario Error. ' 
         }), 
         
      //  direccion:Direccion;

         new TransferenciaArchivos({
           nombreCampoDocumento:   'categoriaExternaKN',
           nombreColumnaExcel:     'categoria',   
           tipoValidacion:         'estaEnArrayBuscoEnString',          
           datos:                  this.listadosCache['AuxCategoriasExternas_MP'], 			            
           datosClaveBusqueda:     'key',   
           claveUnica:             false,           
           mensajeError:           'categoriaExternaKN. error ' 
         }),
       //  telefono:Telefono;
  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'subcategoriaExternaKN',
           nombreColumnaExcel:     'subCategoria',   
           tipoValidacion:         'estaEnArrayBuscoEnString',          
           datos:                  this.listadosCache['AuxSubcategoriasExternas'], 			            
           datosClaveBusqueda:     'nombre',   
           claveUnica:             false,           
           mensajeError:           'subCategoriaExternaKN,  error ' 
         }),
       //  tiempoServicio: number;

         new TransferenciaArchivos({
           nombreCampoDocumento:   'valorNutricional.porcentajeProteina',
           nombreColumnaExcel:     'porcentajeProteina',   
           tipoValidacion:         'numero',          
           datos:                  null, 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Error en % Proteina. Verifique que sea un número o que el campo no esté vacío' 
         }),
        //  radioEntrega:number;

        new TransferenciaArchivos({
          nombreCampoDocumento:   'valorNutricional.porcentajeProteina',
          nombreColumnaExcel:     'porcentajeProteina',   
          tipoValidacion:         'numero',          
          datos:                  null, 			            
          datosClaveBusqueda:     null,   
          claveUnica:             false,           
          mensajeError:           'Error en % Proteina. Verifique que sea un número o que el campo no esté vacío' 
        }), 

      //  ventanaAtencion:VentanaAtencion;
        new TransferenciaArchivos({
          nombreCampoDocumento:   'ventanaAtencion',
          nombreColumnaExcel:     '',   
          tipoValidacion:         'estaEnArrayBuscoEnString',          
          datos:                  this.listadosCache['AuxVentanasAtencion'], 			            
          datosClaveBusqueda:     'nombre',   
          claveUnica:             false,           
          mensajeError:           'Ventana de atención Incorrecta. ' 
        }),
  
      ];
                              
   } // fin contructor
   
   ejcutarAccionPosterior(){
      // No realiza acción posterior
   } 

}
