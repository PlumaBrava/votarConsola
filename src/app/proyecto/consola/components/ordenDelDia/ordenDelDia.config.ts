import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { OrdenDelDia, OrdenDelDiaInterface }                            from '@proyecto/models/ordenDelDia/ordenDelDia.model';

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
      this.nombreColeccion = 'OrdenDelDia';
      this.campoClave      = 'NumOrdenDia';
      this.usaSettings     = false;
      this.t               = new OrdenDelDia(); //Construir una clase con todos los campos. 
      this.mostrarDiferenciaModeloFomulario=true;

      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'NumOrdenDia',
         orderReverse          : false,
         orderServer           : ['NumOrdenDia'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : false,
         filtroNombre          : 'NumOrdenDia',
         filtrosServer         : ['NumOrdenDia', 'Concejal','NumPropuesto','Clasificacion','Estado',
                                  'Abreviacion','BancaFila','BancaColumna','Email', 'nro_expediente'],
         camposDecimal         : [],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoDistribuidoresCompleta',
      //    nombreColeccion : 'Distribuidores',
      //    orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      // });     
      
      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoAuxVehiculos',
      //    nombreColeccion : 'AuxVehiculos',
      //    orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      // });     
      
      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoAuxEstadosRutas',
      //    nombreColeccion : 'AuxEstadosRutas',
      //    orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      // });     

      // let fecha= this.fn.getFechaActual('AAAAMMDD');
      // this.configListadosCache.push({ 
      //    nombreListado   : 'listadoRutasActivasDiarias',
      //    nombreColeccion : 'RutasActivasDiarias',
      //    orderBy         : [{ fecha:fecha, ascDesc:'asc'}]
      // });
      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         NumOrdenDia        : null,
         Fecha              : null,
         Orden              : null,
         SubOrden           : null,
         OrdenDiaCaratula   : null,
         OrdenDiaSubCaratula: null,
         Rotulo             : null,
         Item               : null,
         Estado             : null,
         ResultadoVoto      : null,
         InfoVoto           : null,
         InfoAprovacion     : null,
         InfoVotacion       : null,
         Agrupa             : null,
         NumAgrupacion      : null,
         TipoSesion         : null,
         NumTipoSesion      : null,
         Terminado          : null,
         nro_expediente     : null,
         
         
      });
         
   } 

}
