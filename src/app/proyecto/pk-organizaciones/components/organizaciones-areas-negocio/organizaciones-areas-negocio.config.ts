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
      this.nombreColeccion ='AreasNegocio';
      this.columnasAdicionalesLogTable = [];
    
      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'nombre',
         orderReverse          : false,
         orderServer           : ['key', 'nombre'],
         whereArray            : [{ 
                                   key:      'organizacionKNAI.key', 
                                   operador: '==', 
                                   value:    argumentos.organizacionInputKNAI.key
         }],              
         campoKeywords         : true,
         filtroNombre          : 'nombre',
         filtrosServer         : ['key', 'nombre','nombresUnidadesMedida.unidad1','nombresUnidadesMedida.unidad2','nombresUnidadesMedida.unidad3','settings.isActivo'],
         paginadoCantidad      : 2,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key                : null,
         codigo             : null,
         nombre             : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         keywords           : null,
         organizacionKNAI   : argumentos.organizacionInputKNAI,

         nombresUnidadesMedida: this.fb.group({
           unidad1          : [null, Validators.compose([Validators.required])],
           unidad2          : null,
           unidad3          : null
         }),        

         settings           : this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
