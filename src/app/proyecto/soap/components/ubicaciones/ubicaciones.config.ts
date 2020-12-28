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
            filtrosServer         : ['fechaHora','key','codigo','nombre','tipoUbicacionKN.key','tipoCuentaKN.key','yaImportado'],
            paginadoCantidad      : 100,
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
      
      // this.configListadosCache.push({ 
      //    nombreListado        : 'listadoAuxTiposUbicacion',
      //    nombreColeccion      : 'AuxTiposUbicacion',
      //    where                : argumentos['whereTiposUbicacion'],
      //    orderBy              : [{ key:'nombre', ascDesc:'asc'}],
      //    grabaLocalStorage    : true,   
      //    ignoraValoresMemoria : false         
      // });                
      
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
