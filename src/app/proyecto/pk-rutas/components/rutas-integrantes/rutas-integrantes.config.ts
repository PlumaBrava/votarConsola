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
      this.nombreColeccion ='RutasIntegrantes';
      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
            paginadoTipo          : 'local',    // local / servidor
            orderField            : 'usuarioKANE.apellidoNombre',
            orderReverse          : true,
            orderServer           : ['key', 'usuarioKANE.apellidoNombre', 'tipoIntegranteKN.nombre'],
            whereArray            : [{ 
                                      key:      'keyRuta', 
                                      operador: '==', 
                                      value:    argumentos.ruta.key
                                    }],              
            filtroNombre          : 'usuarioKANE.apellidoNombre',
            campoKeywords         : false,
            filtrosServer         : ['key', 'usuarioKANE.key', 'tipoIntegranteKN.key'],
            camposDecimal         : [],
            paginadoCantidad      : 20,
            paginadoAutoHide      : false,
            verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado   : 'listadoAuxTiposIntegrantes',
         nombreColeccion : 'AuxTiposIntegrantes',
         orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key:                        null,
         keyRuta:                    argumentos.ruta.key,
         usuarioKANE:                [null, Validators.compose([Validators.required])], 
         tipoIntegranteKN:           [null, Validators.compose([Validators.required])], 
         
         settings: this.fb.group( this.fn.getSettings() ),         

      });
         
   }

}
