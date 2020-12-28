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
      this.nombreColeccion ='Ubicaciones';
      this.columnasAdicionalesLogTable = [];
        
      // Seteo Grilla
      this.grilla = {
            paginadoTipo          : 'local',    // local / servidor
            orderField            : 'fechaSesion',
            orderReverse          : false,
            orderServer           : ['key'],
            whereArray            : [],
            campoKeywords         : true,
            filtroNombre          : 'nombre',
            filtrosServer         : ['key','codigo','nombre','idEmpleado','idVehiculo','idStatus','yaImportado'],
            paginadoCantidad      : 50,
            paginadoAutoHide      : false,
            verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxPaises',
         nombreColeccion      : 'AuxPaises',
         where                : [],
         orderBy              : [],
         grabaLocalStorage    : true,   
         ignoraValoresMemoria : false         
      });                

      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxTimeZones',
         nombreColeccion      : 'AuxTimeZones',
         where                : [],
         orderBy              : [],
         grabaLocalStorage    : true,   
         ignoraValoresMemoria : false         
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
