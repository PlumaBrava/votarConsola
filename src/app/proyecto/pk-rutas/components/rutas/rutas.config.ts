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
      this.nombreColeccion ='Rutas';
      this.columnasAdicionalesLogTable = [];

      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'servidor',    // local / servidor
         orderField            : 'fechaHoraInicioPlaneada',
         orderReverse          : false,
         orderServer           : ['key', 'fechaHoraInicioPlaneada'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : true,
         filtroNombre          : 'nombre',
         filtrosServer         : ['key', 'codigo','nombre','vehiculoPrincipalKN.key','integranteChoferKANE.key',
                                  'estadoRutaKN.key','fechaHoraInicioPlaneada','organizacionKNAI.key'],
         camposDecimal         : ['distanciaPlanificada','costoPlanificado'],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado   : 'listadoDistribuidoresCompleta',
         nombreColeccion : 'Distribuidores',
         orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     
      
      this.configListadosCache.push({ 
         nombreListado   : 'listadoAuxVehiculos',
         nombreColeccion : 'AuxVehiculos',
         orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     
      
      this.configListadosCache.push({ 
         nombreListado   : 'listadoAuxEstadosRutas',
         nombreColeccion : 'AuxEstadosRutas',
         orderBy         : [{ key:'nombre', ascDesc:'asc'}]
      });     

      let fecha= this.fn.getFechaActual('AAAAMMDD');
      this.configListadosCache.push({ 
         nombreListado   : 'listadoRutasActivasDiarias',
         nombreColeccion : 'RutasActivasDiarias',
         orderBy         : [{ fecha:fecha, ascDesc:'asc'}]
      });
      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key:                            null,
         codigo:                         null,                
         nombre:                         [null, Validators.compose([Validators.required, Validators.minLength(6)])], 
         keywords:                       'Array',
         estadoRutaKN:                   null,
         estadosParadas:                 'Array',                   
         
         mostrarEnMonitor:               false,
         
         distribuidorKN:                 null,
         organizacionKNAI:               [null, Validators.compose([Validators.required])],
         areaNegocioKN:                  [null, Validators.compose([Validators.required])],
         sucursalKN:                     [null, Validators.compose([Validators.required])],

         fechaHoraCarga:                 null,
         
         fechaHoraInicioPlaneada:        null,
         fechaHoraSalidaPlaneada:        null,
         fechaHoraArriboPlaneada:        null,
         fechaHoraFinalizacionPlaneada:  null,

         fechaHoraInicioReal:            null,
         fechaHoraSalidaReal:            null,
         fechaHoraArriboReal:            null,
         fechaHoraFinalizacionReal:      null,
         
         vehiculoPrincipalKN:            null,
         vehiculoGeoPoint:               this.fb.group({
               latitud            : null,
               longitud           : null,
         }),        
         
         integranteChoferKANE:           null,
         
         ubicacionOrigenKN:              null,   
         ubicacionDestinoKN:             null,                   
         origenEsDestino:                false,  
         formaCarga:                     null,                  
             
         distanciaPlanificada:           null, 
         costoPlanificado:               null, 
         
         cantidadParadasEjecutadas:      0, 
         
         settings: this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
