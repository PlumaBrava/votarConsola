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
      this.nombreColeccion ='Sucursales';
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
         filtrosServer         : ['key', 'nombre','direccion.calle','direccion.ciudad','areaNegocio.key'],
         paginadoCantidad      : 10,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];
      this.configListadosCache.push({ 
         nombreListado     : 'listadoAreasNegocio',
         nombreColeccion   : 'AreasNegocio',
         orderBy           : [{key:'nombre',ascDesc:'asc'}],  
         where             : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionInputKNAI.key}],
         grabaLocalStorage : false
          
      });     

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key                : null,
         codigo             : null,
         nombre             : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         keywords           : 'Array', 
         organizacionKNAI   : argumentos.organizacionInputKNAI,
         email              : null,
         areasNegocio       : 'Array',
         direccion: this.fb.group({
             calle          : [null, Validators.compose([Validators.required])],
             numero         : null,
             bloque         : null,
             piso           : null,
             departamento   : null,
             codigoPostal   : null,
             ciudad         : [null, Validators.compose([Validators.required])],
             partido        : null,
             provinciaKN    : null,
             paisKN         : [null, Validators.compose([Validators.required])],
             geoPoint:  this.fb.group({
                 latitud    : null,
                 longitud   : null,
             }),              
             timeZone       : [null, Validators.compose([Validators.required])],
             idiomaPais     : null,
         }),

         telefono: this.fb.group({
           tipoTelefono1    : [null, Validators.compose([Validators.required])],
           numeroTelefono1  : [null, Validators.compose([Validators.required])],
           tipoTelefono2    : null,
           numeroTelefono2  : null,
           tipoTelefono3    : null,
           numeroTelefono3  : null,
           tipoTelefono4    : null,
           numeroTelefono4  : null,
         }),

         settings           : this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
