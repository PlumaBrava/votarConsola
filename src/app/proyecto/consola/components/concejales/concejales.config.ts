import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
// import Grilla, argumentosGrilla

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
      this.nombreColeccion ='concejales';
      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'NumConcejal',
         orderReverse          : false,
         orderServer           : ['NumConcejal'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : false,
         filtroNombre          : 'NumConcejal',
         filtrosServer         : ['NumConcejal', 'Concejal','NumPropuesto','Clasificacion','Estado',
                                  'Abreviacion','BancaFila','BancaColumna','Email'],
         camposDecimal         : ['BancaFila','BancaColumna'],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoDistribuidoresCompleta',
      //    nombreColeccion : 'Distribuidores',
      //    orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      // });     
      
      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoAuxVehiculos',
      //    nombreColeccion : 'AuxVehiculos',
      //    orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      // });     
      
      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoAuxEstadosRutas',
      //    nombreColeccion : 'AuxEstadosRutas',
      //    orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      // });     

      // let fecha= this.fn.getFechaActual('AAAAMMDD');
      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoRutasActivasDiarias',
      //    nombreColeccion : 'RutasActivasDiarias',
      //    orderBy         : [{ fecha:fecha, ascDesc:'asc'}]
      // });
      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({


         NumConcejal    : null,
         Concejal       : [null, Validators.compose([Validators.required])],
         NumPropuesto   : [1],
         Clasificacion  : null,
         Estado         : null,
         Abreviacion    : [null, Validators.compose([Validators.required, Validators.maxLength(6)])],
         BancaFila      : [null, Validators.compose([Validators.required])],
         BancaColumna   : [null, Validators.compose([Validators.required])],
         Email          : [null, Validators.compose([Validators.required,Validators.email])],
         
         
      });
         
   } 

}
