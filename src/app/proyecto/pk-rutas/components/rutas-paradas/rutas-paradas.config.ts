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
      this.nombreColeccion ='RutasParadas';
      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
            paginadoTipo          : 'local',    // local / servidor
            orderField            : 'orden',
            orderReverse          : false,
            orderServer           : ['key', 'codigo', 'ubicacion.nombre','ubicacion.direccion.calle','ubicacion.direccion.localidad',
                                     'estadoParadaKN.key','fechaHoraInicioPlaneada','orden'],
            whereArray            : [{ 
                                      key:      'keyRuta', 
                                      operador: '==', 
                                      value:    argumentos.ruta.key,
                                    }],              
            filtroNombre          : 'ubicacion.nombre',
            campoKeywords         : false,
            filtrosServer         : ['key', 'codigo', 'ubicacion.nombre','ubicacion.direccion.calle','ubicacion.direccion.localidad',
                                     'estadoParadaKN.key','fechaHoraInicioPlaneada'],
            camposDecimal         : ['unidadesMedidaEntregarPlanificadas.unidad1','unidadesMedidaEntregarPlanificadas.unidad2','unidadesMedidaEntregarPlanificadas.unidad3',
                                     'unidadesMedidaEntregarReales.unidad1','unidadesMedidaEntregarReales.unidad2','unidadesMedidaEntregarReales.unidad3',
                                     'unidadesMedidaRetirarPlanificadas.unidad1','unidadesMedidaRetirarPlanificadas.unidad2','unidadesMedidaRetirarPlanificadas.unidad3',
                                     'unidadesMedidaRetirarReales.unidad1','unidadesMedidaRetirarReales.unidad2','unidadesMedidaRetirarReales.unidad3'],
            paginadoCantidad      : 30,
            paginadoAutoHide      : false,
            verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
          nombreListado   : 'listadoAuxEstadosParadas',
          nombreColeccion : 'AuxEstadosParadas',
          orderField      : 'nombre',
          orderAscDesc    : 'asc',
      });     
      
      this.configListadosCache.push({ 
          nombreListado   : 'listadoAuxTiposParadas',
          nombreColeccion : 'AuxTiposParadas',
          orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key:                                null,
         keyRuta:                            argumentos.ruta.key,
         codigo:                             null,
         codigoPedido:                       null,
         tipoParada:                         [null, Validators.compose([Validators.required])], 
         ubicacion:                          [null, Validators.compose([Validators.required])], 
         geoPointReal:                       null,
         estadoParadaKN:                     null,
         orden:                              null,
         ordenReal:                          null,

         unidadesMedidaEntregarPlanificadas: this.fb.group({
            unidad1: null,
            unidad2: null,
            unidad3: null,
         }),         
         unidadesMedidaEntregarReales:       this.fb.group({
            unidad1: null,
            unidad2: null,
            unidad3: null,
         }),
       
         unidadesMedidaRetirarPlanificadas:  this.fb.group({
            unidad1: null,
            unidad2: null,
            unidad3: null,
         }),
         unidadesMedidaRetirarReales:        this.fb.group({
            unidad1: null,
            unidad2: null,
            unidad3: null,
         }),

         instruccionesParaConductor:         null,
         comentariosDelConductor:            null,
       
         fechaHoraInicioPlaneada:            null,
         fechaHoraFinalizacionPlaneada:      null,
       
         fechaHoraInicioReal:                null,
         fechaHoraFinalizacionReal:          null,
         
         settings: this.fb.group( this.fn.getSettings() ),         

      });
         
   }

}
