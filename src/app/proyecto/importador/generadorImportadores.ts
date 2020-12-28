import { MensajesService }                from '@maq-servicios/mensajes/mensajes.service';
import { Importador, ConfigExcel}         from '@maq-models/importador/importador.model';
import { KNAI, KANE}                      from '@settings/maqueta/models/typesKN/typesKN.model';

import {ConfigListadoCache_AuxVehiculos}  from './AuxVehiculos/auxVehiculos.listadosChache.config'
import {ConfigListadoCache_Ubicaciones}   from './Ubicaciones/ubicaciones.listadosChache.config'
import {ConfigListadoCache_Usuarios}      from './Usuarios/usuarios.listadosChache.config'

import { take } from 'rxjs/operators';

export class GeneradorImportadores {


  public msg                               : MensajesService=null;

  // Colecciones Secundarias
  public subscripcionCache                            : any[]=[];
  public listadosCache                                : any[]=[];
  public configListadosCache                          : any[]=[];

  public cantidadSubscripcionesSecundariasLanzadas    : number=0;
  public finalizoGETSecundarias                       : boolean=false;

  public organizacionKNAI                             : KNAI=null;
  public usuarioKANE                                  : KANE=null;
    
  constructor(public  nombreColeccion: string) {
    // console.log('importadores constructor',nombreColeccion);
  }

  existeSOAP_RoadNet():boolean {

    switch (this.nombreColeccion) {
      
      case 'Vehiculos':  
        return true;
      break;

      case 'Ubicaciones':  
        return true;     
      break;

      case 'Usuarios':  
        return true;
      break;

      case 'Rutas':  
        return true;
      break;
      
      default:
        return false;
      break  
    };
  };
  
  existeImportador():boolean {

    switch (this.nombreColeccion) {
      
      case 'Vehiculos':  
        return true;
      break;

      case 'Ubicaciones':  
        return true;     
      break;

      case 'Usuarios':  
        return true;
      break;

      case 'Rutas':  
        return true;
      break;
      
      default:
        return false;
      break  
    };
  };
  
  getSoap(methods:string[]) {
      return new Promise ((resolve:any,reject:any)=>{
            import('@proyecto/mocks/soap/RoadNetRetrieve')
            .then(respuesta => {
                // console.log("respuesta",respuesta, methods);
                
                let vecResponse:any[]=[];
                for(let i=0; i<methods.length; i++) {
                  vecResponse.push({
                    method : methods[i],
                    action : respuesta.getSoapAction(methods[i]),
                    xml    : respuesta.getSoapXML(methods[i])
                  });
                }
                resolve(vecResponse);  
            })
            .catch(error=>{
                reject(null);
            });  
      });    
  };
  
  getImportador( bdService:any, msg:   MensajesService, argumentos:any):Promise<ConfigExcel>{
    // console.log('importadores getImportador bdService',bdService);
    // console.log('importadores getImportador msg',msg);
    // console.log('importadores getImportador argumentos',argumentos);
    // console.log('importadores getImportador nombreColeccion',this.nombreColeccion);
    
    this.organizacionKNAI   = argumentos.organizacionKNAI;
    this.usuarioKANE        = argumentos.usuarioKANE;
    this.msg     = msg;

    return new Promise ((resolve:any,reject:any)=>{
      switch (this.nombreColeccion) {
          case 'Vehiculos':  
            import('./AuxVehiculos/AuxVehiculos.excel') 
            .then(respuesta => {
            
              this.configListadosCache =new ConfigListadoCache_AuxVehiculos(argumentos).configListadosCache;
              this.getSubscripcionSecundarias()
                .then(listadocache=>{
                  argumentos['listadosCache']= listadocache;
                  resolve( new respuesta.ConfigTransferenciaExcell(bdService,argumentos));
                })
                .catch(error=>{
                   resolve( null);
                });
            })
            .catch(error=>{
                reject(null);
            });  
          break;

          case 'Ubicaciones':  
            import('./Ubicaciones/organizaciones-ubicaciones.excel')
            .then(respuesta => {
              
              // Busco colecciones auxiliares que faltan para traducir
              this.configListadosCache =new ConfigListadoCache_Ubicaciones(argumentos).getConfigListadosCache();
              // console.log('importadores getImportador configListadosCache',this.configListadosCache);
              this.getSubscripcionSecundarias() 
                .then((listadocache:any[])=>{                
                  // cuado llegan los listados (colecciones que faltan, los sumo al listado de cache)
                  for (const listado in listadocache) {                                  
                    argumentos['listadosCache'][listado]=listadocache[listado];
                  }
                  console.log('importadores getImportador argumentos',argumentos['listadosCache']);
                  // resuelvo la promesa con todos los datos para la traduccion.
                  resolve( new respuesta.ConfigTransferenciaExcell(bdService,argumentos));
                })
                .catch(error=>{
                  // console.log('importadores getImportador catchGetSuscripcionSecundaria',error);
                  resolve( null);
                });
            })
            .catch(error=>{
                // console.log('importadores getImportador getExel',error);
                reject(null);
            });  
          break;

          case 'Usuarios':  
            import('./Usuarios/usuarios.excel')
            .then(respuesta => {
              
              // Busco colecciones auxiliares que faltan para traducir
              this.configListadosCache =new ConfigListadoCache_Usuarios(argumentos).getConfigListadosCache();
              // console.log('importadores getImportador configListadosCache',this.configListadosCache);
              this.getSubscripcionSecundarias() 
                .then((listadocache:any[])=>{                
                  // cuado llegan los listados (colecciones que faltan, los sumo al listado de cache)
                  for (const listado in listadocache) {                                  
                    argumentos['listadosCache'][listado]=listadocache[listado];
                  }
                  // console.log('importadores getImportador argumentos',argumentos['listadosCache']);
                  // resuelvo la promesa con todos los datos para la traduccion.
                  resolve( new respuesta.ConfigTransferenciaExcell(bdService,argumentos));
                })
                .catch(error=>{
                  // console.log('importadores getImportador catchGetSuscripcionSecundaria',error);
                  resolve( null);
                });
            })
            .catch(error=>{
                // console.log('importadores getImportador getExel',error);
                reject(null);
            }); 
          break;

          default:
            // console.log('Esta tabla no tine importador excel', );
            reject(null)
            break;
          }
      });
  };
  
  getSubscripcionSecundarias():Promise<any[]> {

    return new Promise((resolve:any,reject:any)=>{
      // console.log('funcionComponente','getSubscripcionSecundarias');

      /* Subscripción a Colecciones Secundarias */
      this.cantidadSubscripcionesSecundariasLanzadas=0;
      this.finalizoGETSecundarias=false;              
      
      this.cantidadSubscripcionesSecundariasLanzadas=this.configListadosCache.length;
      
      for(let i=0; i<this.configListadosCache.length; i++) {
          
          this.subscripcionCache.push( 
              this.msg.getListadoCache({
                  nombreListado                       : this.configListadosCache[i].nombreListado,
                  nombreColeccion                     : this.configListadosCache[i].nombreColeccion,
                  where                               : this.configListadosCache[i].where  !== undefined  ? this.configListadosCache[i].where  :[],
                  orderBy                             : this.configListadosCache[i].orderBy !== undefined ? this.configListadosCache[i].orderBy:[],
                  limit                               : this.configListadosCache[i].limit !== undefined   ? this.configListadosCache[i].limit  :null,
                  grabaLocalStorage                   : this.configListadosCache[i].grabaLocalStorage!== undefined    ? this.configListadosCache[i].grabaLocalStorage:true,
                  ignoraValoresMemoria                : this.configListadosCache[i].ignoraValoresMemoria!== undefined    ? this.configListadosCache[i].ignoraValoresMemoria:false,
                  datosPorOrganizacion                : this.configListadosCache[i].datosPorOrganizacion!== undefined  ? this.configListadosCache[i].datosPorOrganizacion:false,
                  organizacionKNAI                    : this.organizacionKNAI,
                  usuarioKANE                         : this.usuarioKANE,
                  nombreColeccionSolicitante          : this.nombreColeccion,
                  limpiaSettingUsuarioOrganizacion    : true
                }).pipe(take(1)).subscribe(data=>{
                  let nombreListado =this.configListadosCache[i].nombreListado.replace('listado','').replace('Listado','')

                  // console.log("valores",
                  //           "msg.cacheColecciones[" + nombreListado + "]:", 
                  //           this.msg.cacheColecciones[nombreListado]);
                  
                  this.cantidadSubscripcionesSecundariasLanzadas--;
                  
                  // console.log("cantidadSubscripcionesSecundariasLanzadas",this.cantidadSubscripcionesSecundariasLanzadas);
                  if(this.cantidadSubscripcionesSecundariasLanzadas==0) {  // Devolvió resultados la última subscripción
                       this.finalizoGETSecundarias=true; 
                       resolve(this.msg.cacheColecciones);                 
                  }

              },(error:any)=>{
                  // console.log("error",error);

              }) 
          );    
      }

      if(this.configListadosCache.length==0){
          resolve([]);   
      }

    });  
}


}
