import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import {ConcejalesDispositivos, ConcejalesDispositivosInterface}   from '@proyecto/models/concejales/concejales.model';
import {getListadoCacheModel2 }                                    from '@maq-models/mensajes/mensajes.model';

export class ConfigComponente {

   public grilla                       : any;
   public nombreColeccion              : string;
   public campoClave                   : string;
   public columnasAdicionalesLogTable  : any[];
   public configListadosCache          : getListadoCacheModel2[];
   public arrayFiles                   : any[]; 
   public form                         : any;
   public t                            : any;// variable para comparar el modelo con el formulario
   public mostrarDiferenciaModeloFomulario : boolean=true;// muestra las diferencas entre el modelo y el formulario
   
   // Listado de campos no desados, se ponen en el formulario
   //  para que formen parte del listado principal pero no los queremos grabar.
   public listadoCamposNoDeseados : string[]=[];
   
   constructor(public argumentos:any,
               public fb:any,
               public fn:any) {

      // Colección Principal
      this.nombreColeccion ='concejalesDispositivosQry';
      this.campoClave      ='NumConcejal';
      this.t               = new ConcejalesDispositivos(); //Construir una clase con todos los campos. 
      this.mostrarDiferenciaModeloFomulario=true;

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
         filtrosServer         : ['NumConcejal', 'Concejal','Funcion','Macaddresses','dispositvoEstado',
                                  'Abreviacion','BancaFila','BancaColumna','Dispositivo'],
         camposDecimal         : [],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado        : 'listadoConcejales',
         nombreColeccion      : 'concejales',
         campoClave           : 'NumConcejal',
         // orderBy              : [{ key:'nombre', ascDesc:'asc'}],
         grabaLocalStorage    : false,
         ignoraValoresMemoria : true
      });     

      this.configListadosCache.push({ 
         nombreListado        : 'listadoDispositivos',
         nombreColeccion      : 'dispositivos',
         campoClave           : 'NumDispositivo',
         // orderBy              : [{ key:'nombre', ascDesc:'asc'}],
         grabaLocalStorage    : false,
         ignoraValoresMemoria : true
      });     
      

      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         // Campos de la tabla
         NumConcejal        : null,
         NumDispositivo     : null,
         Funcion            : null,
         Clave              : null,
         Macaddresses       : null,
         Presente           : null,
         settings           : this.fb.group( this.fn.getSettings() ),

         // Campos de Concejales
         Concejal           : null,
         NumPropuesto       : null,
         Clasificacion      : null,
         concejalEstado     : null,
         Abreviacion        : null,
         BancaFila          : null,
         BancaColumna       : null,
         Email              : null,

         // Campos Dispositivos
         dispositvoEstado   : null,
         Dispositivo        : null,
         Imei               : null,
         Serie              : null,

         
      });
     
      this.listadoCamposNoDeseados=[
         'Concejal','NumPropuesto','Clasificacion','concejalEstado','Abreviacion','BancaFila','BancaColumna',
         'Email','dispositvoEstado','Dispositivo','Imei','Serie'
      ]
      
   } 

}
