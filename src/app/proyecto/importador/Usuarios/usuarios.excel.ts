import { log, logIf, logTable, values } from '@maq-console';

import { TransferenciaArchivos ,TransferenciaBaseDatos} from '@maq-models/transferenciaArchivos/transferenciaArchivos.model';
import { KNAI, KANE, KN }                               from '@settings/maqueta/models/typesKN/typesKN.model';
import { LISTA_DE_TIPOS_DE_TELEFONOS }                  from '@maq-mocks/usuarios/usuarios';

export class ConfigTransferenciaExcell {


  iniciarTransferencia:            boolean = false;                  
  tipoDeVerificaciones:            string  = null;
  transferenciaBaseDatos:          TransferenciaBaseDatos;
  criteriosTransferencia:          any[]   = [];

  organizacionKNAI:                KNAI    = null;  
  distribuidorKN:                  KN      = null;
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
      nombreColeccion:                          'Usuarios',
      distribuidorKN:                           this.distribuidorKN,
      organizacionKNAI:                         this.organizacionKNAI,
      usuarioKANE:                              this.usuarioKANE,
      camposaVerificarEnBase:                   [''],
      camposClaveExcelParaVerificarEnBase:      [''],
      citerioParaAceptarUnCampoExistente:       [''],
  });
  
     
    this.criteriosTransferencia = [

       

        /*  

                    
            export class Usuario {
              key                       : string;
              userKey                   : string;    // Uid de auth firestore
              codigo              : string;
              email                     : string;
              emailRecuperacion         : string;
              keywords                  : string[];
              datosPersonales           : DatosPersonales;
              direccion                 : Direccion;
              telefono                  : Telefono ;

              perfilUsuario             : PerfilUsuario;
              distribuidor              : Distribuidor;
              organizacion              : Organizacion;
              sucursalesAreasNegocio    : string[];   // ['keySucursal@@@keyAreaNegocio','keySucursal@@@keyAreaNegocio','keySucursal@@@keyAreaNegocio']

              settings                  : Settings;
              menuesFavoritos           : any[];

              datosImportacion          : any;
              timeStampCreaciom         : string;
        
        
        */


       // 'Email'-> key  
        new TransferenciaArchivos({
          nombreCampoDocumento:   'key',
          nombreColumnaExcel:     'Email',   
          tipoValidacion:         'emailValido',          
          datos:                  null,			            
          datosClaveBusqueda:     null,   
          claveUnica:             true,           
          mensajeError:           'Email Incorrecto (key). ' 
        }),

       // 'Location Key'-> codigo  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'codigo',
           nombreColumnaExcel:     'Codigo',   
           tipoValidacion:         'obligatorio',          
           datos:                  null, 			            
           datosClaveBusqueda:     null,   
           claveUnica:             true,           
           mensajeError:           'Codigo es Obligatorio. ' 
         }), 
        //Email -> email       
         new TransferenciaArchivos({
           nombreCampoDocumento:   'email',
           nombreColumnaExcel:     'Email',   
           tipoValidacion:         'emailValido',          
           datos:                  null, 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Email incorecto. (campo email). ' 
         }), 

        //emailRecuperacion -> emailRecuperacion       
        new TransferenciaArchivos({
        nombreCampoDocumento    : 'emailRecuperacion',
        mensajeError            : 'Email incorecto. (campo emailRecuperacion). ',
        nombreColumnaExcel      : 'EmailRecuperacion',
        tipoValidacion          : 'emailValido',
        datos                   : null,
        datosClaveBusqueda      : null,
        claveUnica              : false,
      }), 






        // Email -> keywords  
         new TransferenciaArchivos({
           nombreCampoDocumento:   'keywords',
           nombreColumnaExcel:     'Email',   
           tipoValidacion:         'keywords',          
           datos:                  [], 			            
           datosClaveBusqueda:     null,   
           claveUnica:             false,           
           mensajeError:           'Error generando Keywords. ' 
         }), 

      /*-------------------------------------------------------------------------
      ---------------------------------------------------------------------------
      -------------       datosPersonales:DatosPersonales    --------------------
      -------------------------------------------------------------------------*/


                          // apellido          : string;
                          // nombre            : string;
                          // apellidoNombre    : string;
                          // fechaNacimiento   : Object;
                          // genero            : string;
                          // fotoIMG           : IMG;
                          // idioma            : string;

      
              //apellido
              new TransferenciaArchivos({
                nombreCampoDocumento:   'datosPersonales.apellido',
                nombreColumnaExcel:     'Apellido',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en la datosPersonales, Apellido.  ' 
              }),

              //nombre
              new TransferenciaArchivos({
                nombreCampoDocumento:   'datosPersonales.nombre',
                nombreColumnaExcel:     'Nombre',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en la datosPersonales, Nombre.  ' 
              }),


            
              //ApellidoNombre
              new TransferenciaArchivos({
                nombreCampoDocumento:   'datosPersonales.ApellidoNombre',
                nombreColumnaExcel:     'ApellidoNombre',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en la datosPersonales. ApellidoNombre.  ' 
              }),


              //genero
              new TransferenciaArchivos({
                nombreCampoDocumento:   'datosPersonales.genero',
                nombreColumnaExcel:     'Genero',   
                tipoValidacion:         'buscarEnArrayDeStrings',          
                datos:                  ['male','female'], 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en la datosPersonales, Genero.  ' 
              }),

              
              //fechaNacimiento
              new TransferenciaArchivos({
                nombreCampoDocumento:   'datosPersonales.fechaNacimiento',
                nombreColumnaExcel:     'FechaNacimiento',   
                tipoValidacion:         'dd/mm/aaaa_OBJ',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en la datosPersonales, Fecha de Nacimiento.  ' 
              }),

                            
              //idioma
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.idioma',
                nombreColumnaExcel:     'IdiomaPais',   
                tipoValidacion:         'BuscoEnArray_RetornoClave',     
                datos:                  this.listadosCache['AuxIdiomas'],  			            
                datosClaveBusqueda:     'key',   
                claveUnica:             false,           
                mensajeError:           'Error en  idioma dato personal, Idioma.  ' 
              }),
        

      /*>>>>>>>>>>>>>>>> Fin Dirección <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< */  
       
         
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
                mensajeError:           'Error en la calle. ' 
              }),



              //Número
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.numero',
                nombreColumnaExcel:     'Address',   
                tipoValidacion:         'getNumber',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Numero Calle. ' 
              }),
 
              //Bloque
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.bloque', 
                nombreColumnaExcel:     'Bloque',   
                tipoValidacion:         'minimaCantidadCaracteres',          
                datos:                  [1], 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Boque Dirección. Debe tener un caracter. ' 
              }),

              //Piso
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.piso',
                nombreColumnaExcel:     'Piso',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en piso Dirección. ' 
              }),

              
              //Departamento
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.departamento',
                nombreColumnaExcel:     'Departamento',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en departamento Dirección. ' 
              }),

              //Código Postal
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.codigoPostal',
                nombreColumnaExcel:     'Zip Code',   
                tipoValidacion:         'minimaCantidadCaracteres',          
                datos:                  [1],  			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en codigoPostal Dirección. ' 
              }),

    

             
              //ciudad
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.ciudad',
                nombreColumnaExcel:     'City',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en ciudad Dirección ' 
              }),
              
              
              //partido
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.partido',
                nombreColumnaExcel:     'Partido',   
                tipoValidacion:         'getText',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en partido Dirección ' 
              }),
              
              //provinciaKN: KN; 
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.provinciaKN',
                nombreColumnaExcel:     'Provincia',   
                tipoValidacion:         'BuscoEnArray_RetornoKN',          
                datos:                  this.listadosCache['AuxProvincias'],  			            
                datosClaveBusqueda:     'key',   
                claveUnica:             false,           
                mensajeError:           'Error en provincia Dirección ' 
              }),

              
              // paisKN: KN; 
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.paisKN',
                nombreColumnaExcel:     'Country',   
                tipoValidacion:         'BuscoEnArray_RetornoKN',          
                datos:                  this.listadosCache['AuxPaises'],  			            
                datosClaveBusqueda:     'key',  
                claveUnica:             false,           
                mensajeError:           'Error en país Dirección. ' 
              }),
              
              //geoPoint
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.geoPoint.latitud',
                nombreColumnaExcel:     'Latitude',   
                tipoValidacion:         'numero',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Latitud. ' 
              }),
              	

              //geoPoint
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.geoPoint.longitud',
                nombreColumnaExcel:     'Longitude',   
                tipoValidacion:         'numero',          
                datos:                  null, 			            
                datosClaveBusqueda:     null,   
                claveUnica:             false,           
                mensajeError:           'Error en Longitud. ' 
              }),
              
              //timeZone
              new TransferenciaArchivos({
                nombreCampoDocumento:   'direccion.timeZone',
                nombreColumnaExcel:     'TimeZone',   
                tipoValidacion:         'BuscoEnArray_RetornoNombre',          
                datos:                   this.listadosCache['AuxTimeZones'], 			            
                datosClaveBusqueda:     'key',   
                claveUnica:             false,           
                mensajeError:           'Error en timeZone timeZone ' 
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

        
        //  perfilUsuario->perfilUsuario
        new TransferenciaArchivos({
          nombreCampoDocumento:   'perfilUsuario',
          nombreColumnaExcel:     'Perfil',   
          tipoValidacion:         'estaEnArrayBuscoEnArray',
          datos:                   this.listadosCache['Perfiles'],
          datosClaveBusqueda:     'key', 
          claveUnica:             false,           
          mensajeError:           'Perfil de Usuario Inexistente. ' 
        }),
        
        //  distribuidor->distribuidor
        new TransferenciaArchivos({
          nombreCampoDocumento:   'distribuidor',
          nombreColumnaExcel:     'Distribuidor',   
          tipoValidacion:         'estaEnArrayBuscoEnArray',
          datos:                   this.listadosCache['Distribuidores'],
          datosClaveBusqueda:     'nombre', 
          claveUnica:             false,           
          mensajeError:           'Distribuidor Inexistente. ' 
        }), 
        
        //  Organización->organizacion
        new TransferenciaArchivos({
          nombreCampoDocumento:   'organizacion',
          nombreColumnaExcel:     'Organización',   
          tipoValidacion:         'estaEnArrayBuscoEnArray',
          datos:                   this.listadosCache['Organizaciones'],
          datosClaveBusqueda:     'nombre', 
          claveUnica:             false,           
          mensajeError:           'Organizacion Inexistente. ' 
        }), 

        


        //  Sucursales
        new TransferenciaArchivos({
          nombreCampoDocumento:   'sucursal',
          nombreColumnaExcel:     'Sucursal',   
          tipoValidacion:          'estaEnArrayBuscoEnArray',
          datos:                   this.listadosCache['Sucursales'],
          datosClaveBusqueda:     'codigo', 
          claveUnica:             false,           
          mensajeError:           'Sucursal Inexistente. ' 
        }),

        //AreasNegocio
        new TransferenciaArchivos({
          nombreCampoDocumento:   'areasNegocio',
          nombreColumnaExcel:     'AreaNegocio',   
          tipoValidacion:          'estaEnArrayBuscoEnArray',
          datos:                   this.listadosCache['AreasNegocio'],
          datosClaveBusqueda:     'codigo', 
          claveUnica:             false,           
          mensajeError:           'AreaNegocio Inexistente. ' 
        }),
        
        //  sucursalesAreasNegocio->sucursalesAreasNegocio
        new TransferenciaArchivos({
          nombreCampoDocumento:   'sucursalesAreasNegocio',
          nombreColumnaExcel:     'sucursal.key|@@@|areasNegocio.key|PUSH',   
          tipoValidacion:         'Calculado',         
          datos:                   [], 			            
          datosClaveBusqueda:     '',   
          claveUnica:             false,           
          mensajeError:           'Error calculando sucursalesAreasNegocio. ' 
        }),                 

       
        //  Sucursales
        new TransferenciaArchivos({
          nombreCampoDocumento    : 'sucursal',
          nombreColumnaExcel      : '',
          tipoValidacion          : 'SetNull',
          datos                   : null,
          datosClaveBusqueda      : null,
          claveUnica              : false,
          mensajeError            : 'Sucursal Inexistente. '
        }),

        //AreasNegocio
        new TransferenciaArchivos({
          nombreCampoDocumento    : 'areasNegocio',
          nombreColumnaExcel      : '',
          tipoValidacion          : 'SetNull',
          datos                   : null,
          datosClaveBusqueda      : null,
          claveUnica              : false,
          mensajeError            : 'AreaNegocio Inexistente. '
        }),
  
       ];
                              
   } // fin contructor
   
   ejcutarAccionPosterior(){
 
      console.log('ejcutarAccionPosterior');
     
  }

  

}
