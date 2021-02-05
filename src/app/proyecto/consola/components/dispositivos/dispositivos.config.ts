import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Dispositivos, DispositivosInterface }   from '@proyecto/models/dispositivos/dispositivos.model';

export class ConfigComponente {

   public grilla                       : any;
   public nombreColeccion              : string;
   public campoClave                   : string;
   public usaSettings                  : boolean;
   public columnasAdicionalesLogTable  : any[];
   public configListadosCache          : any[];
   public arrayFiles                   : any[]; 
   public form                         : any;
   public t                            : any;// variable para comparar el modelo con el formulario
   public mostrarDiferenciaModeloFomulario : boolean=true;// muestra las diferencas entre el modelo y el formulario
   
   constructor(public argumentos:any,
               public fb:any,
               public fn:any) {

      // Colección Principal
      this.nombreColeccion ='dispositivos';
      this.campoClave      ='NumDispositivo';
      this.usaSettings     = false;
      this.t               = new Dispositivos(); //Construir una clase con todos los campos. 
      this.mostrarDiferenciaModeloFomulario=true;

      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'NumDispositivo',
         orderReverse          : false,
         orderServer           : ['NumDispositivo'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : false,
         filtroNombre          : 'NumDispositivo',
         filtrosServer         : ['NumDispositivo', 'Dispositivo','Serie','Imei','Macaddresses','Estado'],
         camposDecimal         : [],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
    
      // Colecciones Auxiliares
      this.configListadosCache=[];

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({


         NumDispositivo    : null,
         Dispositivo       : [null, Validators.compose([Validators.required])],
         Serie             : [1],
         Imei              : null,
         Macaddresses      : null,
         Estado            : null,
       
         // settings       : this.fb.group( this.fn.getSettings() ),      

             
         
      });
         
   } 

}
