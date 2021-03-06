import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Novedades, NovedadesInterface }              from '@proyecto/models/novedades/novedades.model';


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
      this.nombreColeccion ='';
      this.campoClave      ='';
      // this.t               = new Novedades(); //Construir una clase con todos los campos. 
      this.t               = {}; //Construir una clase con todos los campos. 
      this.mostrarDiferenciaModeloFomulario=true;

      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'NumOrdenDiaNovedad',
         orderReverse          : false,
         orderServer           : ['NumOrdenDiaNovedad'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : false,
         filtroNombre          : 'NumOrdenDiaNovedad',
         filtrosServer         : ['NumOrdenDiaNovedad', 'NumOrdenDiaCaratula','Fecha','Rotulo','Novedad','Estado'],
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

       

         // NumOrdenDiaNovedad       : null,
         // NumOrdenDiaSubCaratula   : null,
         // NumOrdenDiaCaratula      : null,
         // Fecha                    : null,
         // Rotulo                   : null,
         // Novedad                  : null,
         // Estado                   : null,
       
         // // settings       : this.fb.group( this.fn.getSettings() ),      

             
         
      });
         
   } 

}
