import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { Parametros } from '@proyecto-models/parametros/parametros.model';


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
        this.nombreColeccion ='parametros';
        this.campoClave      ='NumParametro';
        this.usaSettings     = false;
        this.t               = new Parametros(); //Construir una clase con todos los campos. 
        this.mostrarDiferenciaModeloFomulario=true;
  
        this.columnasAdicionalesLogTable = [];
        
      // Seteo Grilla
      this.grilla = {
            paginadoTipo          : 'servidor',    // local / servidor
            orderField            : 'nombre',
            orderReverse          : false,
            orderServer           : ['key', 'nombre'],
            whereArray            : [],
            campoKeywords         : true,
            filtroNombre          : 'nombre',
            filtrosServer         : ['key', 'nombre','direccion.pais','settings.isActivo'],
            paginadoCantidad      : 50,
            paginadoAutoHide      : false,
            verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      // arrayFiles
      this.arrayFiles=[];

      // Formulario
      this.form = this.fb.group({

         // key                      : null,
         // nombre                   : [null, Validators.compose([Validators.required, Validators.minLength(6)])],

         NumParametro                    : [1],    //	1
         CaminoAplicacion                : null,
         CaminoTransaccion               : null,  //	OD\
         CaminoReportes                  : null,  //HCD\REPORTS\
         CaminoImagenes                  : null,  //	IMAGENES\
         CaminoWallpaper                 : null,  //	WALLPAPER\
         Wallpaper                       : null,  //	HCDZARATE.jpg
         Archivo                         : null,  //	179
         CaminoDecretos                  : null,  //	HCD\
         CaminoOrdenanzas                : null,  //	HCD\
         CaminoComunicaciones            : null,  //	HCD\
         Logo                            : null,  //	HCDZARATE-LOGO.jpg
         Logo_Imagen                     : null,  //	0xFFD8FFE000104A4649
         UnidadDecretos                  : null,  //
         UnidadOrdenanzas                : null,  //HCD
         UnidadComunicaciones            : null,  //Z:\
         EntradasUtilizacion             : null,  //	1
         EntradasIndiceBuscador          : null,  //	0
         InstrumentosIndiceBuscador      : null,  //	0
         Dispositivo_Clave               : null,  //	123abc
         Sesiones_TiempoVotacion         : null,  //20
         Sesiones_SinVoto                : null,  //	0
         Sesiones_Token                  : null,  //	5
         Sesiones_Espera_Titulo          : null,  //	En sesión
         Sesiones_Espera_Texto           : null,  //	Por favor espere...
         Sesiones_Quorum                 : null,  //	18
         Sesiones_ResultadoVoto          : null,  //	0
         Sesiones_Ordinarias             : null,  //17
         Sesiones_Extraordinaria         : null,  //	0
         Sesiones_AgrupacionOrdenDia     : null,  //	102
         Sesiones_Reloj_Titulo           : null,  //	USO DE LA PALABRA
         Sesiones_Prorroga               : null,  //	0
         Sesiones_Especial               : null,  //	0
         Sesiones_Reloj_Orden            : null,  //	0
         Sesiones_Reloj_Tiempo           : null,  //	3600000
         Sesiones_FinalizaTiempoVotacion : null,  //	1
         Sesiones_MuestraQuorumPanel     : null,  //	0
         Sesiones_ModalidadQuorum        : null,   //	0
         Sesiones_SensorSillaQuorum      : null,  //	0
         Sesiones_EnviaMailConcejales    : null,  //	1
         Sesiones_TextoAgrupadoPanel     : null,  //	1
         Sesiones_ExcusacionSobreTablas  : null,  //1
         Sesiones_ExcusacionSobreTablas_Caratula   : null,  //	5
         Sesiones_Inicio_TipoVoto                  : null,  //	0
         Sesiones_Inicio_TipoAprobacion            : null,  //	1
         Sesiones_Inicio_TipoVotacion              : null,  //	1
         Sesiones_UsaConfirmacionDePresencia       : null,  //	1
         Sesiones_TiempoConfirmacionDePresencia    : null,  //	0
         Sesiones_MuestraPDFFinalSesion            : null,  //	1
         Sesiones_PDFFinalSesion                   : null,  //	Reporte
         CaminoNode                                : null,  //	HCD\NODE\DIST\
       
      });
         
   }

}
