import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Partidos, PartidoInterface }   from '@proyecto/models/partidos/partidos.model';

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
      this.nombreColeccion ='partidos';
      this.campoClave      ='NumPartido';
      this.usaSettings     = false;
      this.t               = new Partidos(); //Construir una clase con todos los campos. 
      this.mostrarDiferenciaModeloFomulario=true;

      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'NumPartido',
         orderReverse          : false,
         orderServer           : ['NumPartido'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : false,
         filtroNombre          : 'NumConcejal',
         filtrosServer         : ['NumPartido', 'Partido', 'PartidoAbreviado' ],
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


         NumPartido         : null,
         Partido            : [null, Validators.compose([Validators.required])],
         PartidoAbreviado   : [null, Validators.compose([Validators.required, Validators.maxLength(8)])],
         // settings           : this.fb.group( this.fn.getSettings() ),
         
         
      });
         
   } 

}
