import { log, logIf, logTable, values } from '@maq-console';

import { TransferenciaArchivos ,TransferenciaBaseDatos} from '@maq-models/transferenciaArchivos/transferenciaArchivos.model';
import { KNAI, KANE, KN }                               from '@settings/maqueta/models/typesKN/typesKN.model';
import { LISTA_DE_TIPOS_DE_TELEFONOS }                  from '@maq-mocks/usuarios/usuarios';

export class ConfigTransferenciaExcell {

   iniciarTransferencia:            boolean = false;                  
   tipoDeVerificaciones:            string  = null;
   transferenciaBaseDatos:          TransferenciaBaseDatos;
   criteriosTransferencia:          any[]   = [];

   distribuidorKN:                  KN      = null;
   organizacionKNAI:                KNAI    = null;
   usuarioKANE:                     KANE    = null;
   listadoPrincipalCompleto:        any[]   = [];
   listadosCache:                   any[]   = [];
   
   constructor(public bdService:any, argumentos:any) {

      this.distribuidorKN            = argumentos.distribuidorKN;    
      this.organizacionKNAI          = argumentos.organizacionKNAI;
      this.usuarioKANE               = argumentos.usuarioKANE;
      this.listadoPrincipalCompleto  = argumentos.listadosPrincipalCompleto;
      this.listadosCache             = argumentos.listadosCache;

      this.iniciarTransferencia    = false;                                
      this.tipoDeVerificaciones   = 'SoloTraducir';
      
      this.transferenciaBaseDatos = new TransferenciaBaseDatos({
          nombreColeccion:                          'Ubicaciones',
          distribuidorKN:                           this.distribuidorKN,
          organizacionKNAI:                         this.organizacionKNAI,
          usuarioKANE:                              this.usuarioKANE,
          camposaVerificarEnBase:                   ['key'],
          camposClaveExcelParaVerificarEnBase:      ['codigo'],
          citerioParaAceptarUnCampoExistente:       ['merge'],
      });
      

  //  key:string;
  // * codigo:string;
  // * nombre:string;
  // * keywords:string;
  //  * organizacionKNAI: KN;
  //  * sucursalKN:string;
  //  * AreaNegocio:string;
  //  * tipoUbicacionKN: string;
  //  * tipoCuentaKN: TiposCuenta;
  //  email: string;
  //  direccion:Direccion;
  //  telefono:Telefono;
  //  tiempoServicio: number;
  //  radioEntrega:number;
  //  ventanaAtencion:VentanaAtencion;
  //  settings: Settings;

      this.criteriosTransferencia = [

        // 'Location Key'-> key-- Para pisar los existes  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'key',
          nombreColumnaExcel:     'Location Key',   
          tipoValidacion:         'obligatorio',          
          datos:                  [4], 			            
          datosClaveBusqueda:     null,   
          claveUnica:             true,           
          mensajeError:           'Location Key es Obligatorio. ' 
        }),

       // 'Location Key'-> codigo  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'codigo',
           nombreColumnaExcel:     'Location Key',   
           tipoValidacion:         'obligatorio',          
           datos:                  [4], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             true,           
           mensajeError:           'Location Key es Obligatorio. ' 
         }), 
        //Description -> nombre       
         new TransferenciaArchivos({
           nombreCampoDocumento:   'nombre',
           nombreColumnaExcel:     'Description',   
           tipoValidacion:         'minimaCantidadCaracteres',          
           datos:                  [1], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Description debe tener un caracter como mínimo. ' 
         }), 
        // Description -> keywords  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'keywords',
           nombreColumnaExcel:     'Description',   
           tipoValidacion:         'keywords',          
           datos:                  [], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Error generando Keywords. ' 
         }), 


        //  organizacion->OrganizacionKNAI
        new TransferenciaArchivos({
            nombreCampoDocumento:   'organizacionKNAI',
            nombreColumnaExcel:     'Organization',   
            tipoValidacion:         'BuscoEnArray_RetornoKNAI',
            datos:                  [this.organizacionKNAI], 			            
            datosClaveBusqueda:     'nombre', 
            claveUnica:             false,           
            mensajeError:           'Organizacion Inexistente. ' 
          }),       
        
         //sucursalKN---
         new TransferenciaArchivos({
           nombreCampoDocumento:   'sucursalKN',
           nombreColumnaExcel:     'Sucursal',   
           tipoValidacion:         'estaEnArrayBuscoEnArray',          
           datos:                  this.listadosCache['Sucursales'], 			            
           datosClaveBusqueda:     'nombre',  
           claveUnica:             false,           
           mensajeError:           'Error al determinar la sucursal. ' 
         }), 
         
         
         //AreaNegocio
         new TransferenciaArchivos({
           nombreCampoDocumento:   'areaNegocio',
           nombreColumnaExcel:     'AreaNegocio',   
           tipoValidacion:         'estaEnArrayBuscoEnArray',          
           datos:                  this.listadosCache['AreasNegocio'], 			            
           datosClaveBusqueda:     'nombre',  
           claveUnica:             false,           
           mensajeError:           'Error al determinar área Negocio. ' 
         }),

         //tipoUbicacionKN
         new TransferenciaArchivos({
          nombreCampoDocumento:   'tipoUbicacionKN',
          nombreColumnaExcel:     'Type',   
          tipoValidacion:         'BuscoEnArray_RetornoKN',          
          datos:                  this.listadosCache['AuxTiposUbicacion'], 			            
          datosClaveBusqueda:     'codigoExterno',  
          claveUnica:             false,           
          mensajeError:           'Error al determinar  tipoUbicacion. ' 
        }),
        
         //tipoCuentaKN--
         new TransferenciaArchivos({
          nombreCampoDocumento:   'tipoCuentaKN', 
          nombreColumnaExcel:     'TipoCuenta',   
          tipoValidacion:         'BuscoEnArray_RetornoKN',          
          datos:                  this.listadosCache['AuxTiposCuenta'], 			            
          datosClaveBusqueda:     'codigoExterno',  
          claveUnica:             false,           
          mensajeError:           'Error al determinar tipo Cuenta. ' 
        }),  

         //  email: string;
         new TransferenciaArchivos({
           nombreCampoDocumento:   'email',
           nombreColumnaExcel:     'Email',   
           tipoValidacion:         'emailValido',          
           datos:                  [1], 			            
           datosClaveBusqueda:     null,  
           claveUnica:             false,           
           mensajeError:           'Error en el email. ' 
         }), 
         
      /*-------------------------------------------------------------------------
      ---------------------------------------------------------------------------
      -------------       direccion:Dirección                --------------------
      -------------------------------------------------------------------------*/

                        // calle: string;
                        // numero: string;  
                        // bloque: string;  
                        // piso: string;  
                        // departamento: string;  
                        // codigoPostal: string;  
                        // ciudad: string;  
                        // partido: string;  
                        // provinciaKN: KN;  
                        // paisKN: KN; 
                        // geoPoint:GeoPoint;
                        // timeZone:string;
                        // idiomaPais:string;

                        //  GeoPoint {  
                        //   latitud:number;
                        //   longitud:number;
                        //  }
                        
      

              //Calle
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.calle',
                nombreColumnaExcel:     'Address',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en la calle ' 
              }),



              //Número
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.numero',
                nombreColumnaExcel:     'Address',   
                tipoValidacion:         'getNumber',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Numero Calle ' 
              }),
 
              //Bloque
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.bloque', 
                nombreColumnaExcel:     'Bloque',   
                tipoValidacion:         'minimaCantidadCaracteres',          
                datos:                  [1], 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Boque Direccion. Debe tener un caracter. ' 
              }),

              //Piso
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.piso',
                nombreColumnaExcel:     'Piso',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en piso Direccion ' 
              }),

              
              //Departamento
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.departamento',
                nombreColumnaExcel:     'Departamento',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en departamento Direccion ' 
              }),

              //Código Postal
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.codigoPostal',
                nombreColumnaExcel:     'Zip Code',   
                tipoValidacion:         'minimaCantidadCaracteres',          
                datos:                  [1],  			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en codigoPostal Direccion ' 
              }),

    

             
              //ciudad
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.ciudad',
                nombreColumnaExcel:     'City',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en ciudad Direccion ' 
              }),
              
              
              //partido
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.partido',
                nombreColumnaExcel:     'Partido',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en partido Direccion ' 
              }),
              
              //provinciaKN: KN; 
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.provinciaKN',
                nombreColumnaExcel:     'Provincia',   
                tipoValidacion:         'BuscoEnArray_RetornoKN',          
                datos:                  this.listadosCache['AuxProvincias'],  			            
                datosClaveBusqueda:     'key',   
                claveUnica:             false,           
                mensajeError:           'Error en provincia Direccion ' 
              }),

              
              // paisKN: KN; 
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.paisKN',
                nombreColumnaExcel:     'Country',   
                tipoValidacion:         'BuscoEnArray_RetornoKN',          
                datos:                  this.listadosCache['AuxPaises'],  			            
                datosClaveBusqueda:     'key',  
                claveUnica:             false,           
                mensajeError:           'Error en pais Direccion ' 
              }),
              
              //geoPoint
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.geoPoint.latitud',
                nombreColumnaExcel:     'Latitude',   
                tipoValidacion:         'numero',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Latitud ' 
              }),
              	

              //geoPoint
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.geoPoint.longitud',
                nombreColumnaExcel:     'Longitude',   
                tipoValidacion:         'numero',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Longitud ' 
              }),
              
              //timeZone
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.timeZone',
                nombreColumnaExcel:     'TimeZone',   
                tipoValidacion:         'BuscoEnArray_RetornoNombre',          
                datos:                   this.listadosCache['AuxTimeZones'], 			            
                datosClaveBusqueda:     'key',   
                claveUnica:             false,           
                mensajeError:           'Error en timeZone ' 
              }),
              
              //idiomaPais
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.idiomaPais',
                nombreColumnaExcel:     'IdiomaPais',   
                tipoValidacion:         'BuscoEnArray_RetornoClave',     
                datos:                  this.listadosCache['AuxIdiomas'],  			            
                datosClaveBusqueda:     'key',   
                claveUnica:             false,           
                mensajeError:           'Error en  idiomaPais ' 
              }),

      /*>>>>>>>>>>>>>>>> Fin Dirección <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */        



      /*-------------------------------------------------------------------------
      ---------------------------------------------------------------------------
      -------------       Telefono                           --------------------
      -------------------------------------------------------------------------*/
                      
                      // Telefono {
                      //   tipoTelefono1: string;    // tipo Telefono fijo, móvil y  laboral : Persona de Contacto (familiar).
                      //   numeroTelefono1: string;
                      //   tipoTelefono2: string;
                      //   numeroTelefono2: string;
                      //   tipoTelefono3: string;
                      //   numeroTelefono3: string;
                      //   tipoTelefono4: string;
                      //   numeroTelefono4: string;
                      // }

        //  tipoTelefono1;
        new TransferenciaArchivos({
          nombreCampoDocumento:   'telefono.tipoTelefono1',
          nombreColumnaExcel:     'Phone Type 1',   
          tipoValidacion:         'BuscoEnArray_RetornoClave',          
          datos:                  LISTA_DE_TIPOS_DE_TELEFONOS, 			            
          datosClaveBusqueda:     'id',   
          claveUnica:             false,           
          mensajeError:           'Error (Phone Type 1)' 
        }), 
        //  numeroTelefono1;
        new TransferenciaArchivos({
          nombreCampoDocumento:   'telefono.numeroTelefono1',
          nombreColumnaExcel:     'Phone 1',  
          tipoValidacion:         'numero',          
          datos:                  null, 			            
          datosClaveBusqueda:     null,   
          claveUnica:             false,           
          mensajeError:           'Error en (Phone 1)' 
        }), 
        
         //  tipoTelefono2;
         new TransferenciaArchivos({
          nombreCampoDocumento:   'telefono.tipoTelefono2',
          nombreColumnaExcel:     'Phone Type 2',   
          tipoValidacion:         'BuscoEnArray_RetornoClave',          
          datos:                  LISTA_DE_TIPOS_DE_TELEFONOS, 			            
          datosClaveBusqueda:     'id',   
          claveUnica:             false,           
          mensajeError:           'Error  (Phone Type 2)' 
        }), 
        //  numeroTelefono2;
        new TransferenciaArchivos({
          nombreCampoDocumento:   'telefono.numeroTelefono2',
          nombreColumnaExcel:     'Phone 2',  
          tipoValidacion:         'numero',          
          datos:                  null, 			            
          datosClaveBusqueda:     null,   
          claveUnica:             false,           
          mensajeError:           'Error en Nurmero Telefono1(Phone 2)' 
        }), 

       /*>>>>>>>>>>>>>>>> Fin Telefono <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */     

  
       //  tiempoServicio: number;



        new TransferenciaArchivos({
          nombreCampoDocumento:   'tiempoServicio',
          nombreColumnaExcel:     'TiempoServicioHHmmss',   
          tipoValidacion:         'hh:mm:ss_OBJ',          
          datos:                  null, 			            
          datosClaveBusqueda:     null,   
          claveUnica:             false,           
          mensajeError:           'Error en tiempoServicio' 
        }), 



        //  radioEntrega:number;

        new TransferenciaArchivos({
          nombreCampoDocumento:   'radioEntrega',
          nombreColumnaExcel:     'Delivery Radius',   
          tipoValidacion:         'numero',          
          datos:                  null, 			            
          datosClaveBusqueda:     null,   
          claveUnica:             false,           
          mensajeError:           'Error en radioEntrega' 
        }), 

      //  ventanaAtencion:VentanaAtencion;
        new TransferenciaArchivos({
          nombreCampoDocumento:   'ventanaAtencion',
          nombreColumnaExcel:     'VentanaAtencion',   
          tipoValidacion:         'estaEnArrayBuscoEnArray',          
          datos:                  this.listadosCache['AuxVentanasAtencion'], 			            
          datosClaveBusqueda:     'codigo',   
          claveUnica:             false,           
          mensajeError:           'Error Ventana de atención Incorrecta. ' 
        }),
  
      ];
                              
   } // fin contructor
   
   ejcutarAccionPosterior(){
      // No realiza acción posterior
   } 

}
