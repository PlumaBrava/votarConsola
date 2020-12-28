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
      this.nombreColeccion ='Usuarios';
      this.columnasAdicionalesLogTable = [];
        
      // Seteo Grilla
      this.grilla = {
            paginadoTipo          : 'local',    // local / servidor
            orderField            : 'datosPersonales.apellidoNombre',
            orderReverse          : false,
            orderServer           : ['key', 'datosPersonales.apellidoNombre'],
            whereArray            : [],
            campoKeywords         : true,
            filtroNombre          : 'datosPersonales.apellidoNombre',
            filtrosServer         : ['key','codigo','datosPersonales.apellidoNombre','email','tipoEmpleadoId','status','isDriver','yaImportado'],
            paginadoCantidad      : 50,
            paginadoAutoHide      : false,
            verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado        : 'listadoPerfilChofer',
         nombreColeccion      : 'Perfiles',
         where                : argumentos['wherePerfiles'],
         orderBy              : [],
         grabaLocalStorage    : false,   
         ignoraValoresMemoria : true         
      });                
      
      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key                      : null,
         nombre                   : null,
         
         settings                 : this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
