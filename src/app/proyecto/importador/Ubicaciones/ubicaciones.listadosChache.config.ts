import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

// provee los listados que no figuran en el componente y se concantenan para realizar las traducciones.
export class ConfigListadoCache_Ubicaciones {


   public configListadosCache          : any[]=[];


   
   constructor(public argumentos:any) {

    console.log('Aimportadores ConfigListadoCache_AuxVehiculos',argumentos);

 
      // Colecciones Auxiliares

      
            this.configListadosCache.push({ 
                nombreListado                 : 'listadoAuxProvincias',
                nombreColeccion               : 'AuxProvincias',
                orderBy                       : [{key:'key',ascDesc:'asc'}],
                grabaLocalStorage             : true,
                organizacionKNAI              : argumentos.organizacionKNAI,
                nombreColeccionSolicitante    : 'Soliciud de Provincias transf  Ubicaciones', //se usa en el log.
            });

            
            this.configListadosCache.push({ 
              nombreListado                 : 'listadoAuxPaises',
              nombreColeccion               : 'AuxPaises',
              orderBy                       : [{key:'key',ascDesc:'asc'}],
              grabaLocalStorage             : true,
              organizacionKNAI              : argumentos.organizacionKNAI,
              nombreColeccionSolicitante    : 'Soliciud de AuxPaises transf Excel Ubicaciones', //se usa en el log.
          });


                      
          this.configListadosCache.push({ 
            nombreListado                 : 'listadoAuxTimeZones',
            nombreColeccion               : 'AuxTimeZones',
            orderBy                       : [{key:'key',ascDesc:'asc'}],
            grabaLocalStorage             : true,
            organizacionKNAI              : argumentos.organizacionKNAI,
            nombreColeccionSolicitante    : 'Soliciud de AuxTimeZones transf Excel Ubicaciones', //se usa en el log.
        });

                    
        this.configListadosCache.push({ 
          nombreListado                 : 'listadoAuxIdiomas',
          nombreColeccion               : 'AuxIdiomas',
          orderBy                       : [{key:'key',ascDesc:'asc'}],
          grabaLocalStorage             : true,
          organizacionKNAI              : argumentos.organizacionKNAI,
          nombreColeccionSolicitante    : 'Soliciud de AuxIdiomas transf Excel Ubicaciones', //se usa en el log.
      });
      
  

      
              
   }

   getConfigListadosCache():any[]{

      if(this.argumentos['organizacionKNAI']){
        //si exite organizacionKNAU se usa la del usuario

      }else{
        // Si no existe, se busca
        this.configListadosCache.push({ 
          nombreListado                 : 'listadoOrganizaciones',
          nombreColeccion               : 'Organizaciones',
          orderBy                       : [{key:'key',ascDesc:'asc'}],
          grabaLocalStorage             : true,
          organizacionKNAI              : this.argumentos.organizacionKNAI,
          nombreColeccionSolicitante    : 'Soliciud de AuxVehiculos transf Excel', //se usa en el log.
        });

      }

      return  this.configListadosCache;

   }

}
