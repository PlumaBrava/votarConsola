import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

export class ConfigListadoCache_AuxVehiculos {


   public configListadosCache          : any[]=[];


   
   constructor(public argumentos:any) {

    console.log('Aimportadores ConfigListadoCache_AuxVehiculos',argumentos);

 
      // Colecciones Auxiliares

      
            this.configListadosCache.push({ 
                nombreListado                 : 'listadoAuxTiposVehiculos',
                nombreColeccion               : 'AuxTiposVehiculos',
                orderBy                       : [{key:'key',ascDesc:'asc'}],
                grabaLocalStorage             : true,
                organizacionKNAI              : argumentos.organizacionKNAI,
                nombreColeccionSolicitante    : 'Soliciud de AuxVehiculos transf Excel', //se usa en el log.
            });

            this.configListadosCache.push({ 
              nombreListado                 : 'listadoOrganizaciones',
              nombreColeccion               : 'Organizaciones',
              orderBy                       : [{key:'key',ascDesc:'asc'}],
              grabaLocalStorage             : true,
              organizacionKNAI              : argumentos.organizacionKNAI,
              nombreColeccionSolicitante    : 'Soliciud de AuxVehiculos transf Excel', //se usa en el log.
          });

      
    //   this.configListadosCache.push({ 
    //     nombreListado        : 'listadoAreasNegocio',
    //     nombreColeccion      : 'AreasNegocio',
    //     orderBy              : [{key:'nombre',ascDesc:'asc'}],
    //     where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionInputKNAI.key}],
    //     grabaLocalStorage    : false
    //   });     

    //   this.configListadosCache.push({ 
    //     nombreListado        : 'listadoSucursales',
    //     nombreColeccion      : 'Sucursales',
    //     orderBy              : [{key:'nombre',ascDesc:'asc'}],
    //     where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionInputKNAI.key}],
    //     grabaLocalStorage    : false
    //   });     
      
    //   this.configListadosCache.push({ 
    //      nombreListado        : 'listadoAuxTiposUbicacion',
    //      nombreColeccion      : 'AuxTiposUbicacion',
    //      orderBy              : [{key:'nombre',ascDesc:'asc'}],
    //      where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionInputKNAI.key}],
    //      grabaLocalStorage    : false
    //   });     

    //   this.configListadosCache.push({ 
    //      nombreListado        : 'listadoAuxTiposCuenta',
    //      nombreColeccion      : 'AuxTiposCuenta',
    //      orderBy              : [{key:'nombre',ascDesc:'asc'}],
    //      where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionInputKNAI.key}],
    //      grabaLocalStorage    : false
    //   });     

    //   this.configListadosCache.push({ 
    //      nombreListado        : 'listadoAuxVentanasAtencion',
    //      nombreColeccion      : 'AuxVentanasAtencion',
    //      orderBy              : [{key:'nombre',ascDesc:'asc'}],
    //      where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionInputKNAI.key}],
    //      grabaLocalStorage    : false
    //   });     

      
              
   }

}
