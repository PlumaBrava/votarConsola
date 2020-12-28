import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

export class ConfigComponente {

   public grilla                       : any;
   public nombreColeccion              : string;
   public columnasAdicionalesLogTable  : any[];
   public configListadosCache          : any[];
   public arrayFiles                   : any[]; 
   public form                         : any;
   
   constructor(public argumentos:any,
               public fb:any,
               public fn:any) {

      // Colección Principal
      this.nombreColeccion ='RutasVehiculos';
      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'vehiculo.nombre',
         orderReverse          : true,
         orderServer           : ['key', 'vehiculo.tipoVehiculoKN.nombre', 'vehiculo.nombre','vehiculo.patente','principal'],
         whereArray            : [{ 
                                   key:      'keyRuta', 
                                   operador: '==', 
                                   value:    argumentos.ruta.key
                                 }],              
         filtroNombre          : 'vehiculo.nombre',
         campoKeywords         : false,
         filtrosServer         : ['key', 'vehiculo.tipoVehiculoKN.key', 'vehiculo.nombre','vehiculo.patente','principal'],
         camposDecimal         : [],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado   : 'listadoAuxTiposVehiculos',
         nombreColeccion : 'AuxTiposVehiculos',
         orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     
        
      this.configListadosCache.push({ 
         nombreListado   : 'listadoVehiculos',
         nombreColeccion : 'Vehiculos',
         orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key:                        null,
         keyRuta:                    argumentos.ruta.key,
         vehiculo:                   [null, Validators.compose([Validators.required])], 
         principal:                  true,
         
         settings: this.fb.group( this.fn.getSettings() ),         

      });
         
   }

}
