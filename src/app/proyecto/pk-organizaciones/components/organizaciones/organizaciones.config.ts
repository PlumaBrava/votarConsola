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
      this.nombreColeccion ='Organizaciones';
      this.columnasAdicionalesLogTable = [];
      
      // Seteo Grilla
      this.grilla = {
         paginadoTipo          : 'local',    // local / servidor
         orderField            : 'nombre',
         orderReverse          : false,
         orderServer           : ['key', 'nombre'],
         whereArray            : argumentos['grillaWhereArray'],
         campoKeywords         : true,
         filtroNombre          : 'nombre',
         filtrosServer         : ['key', 'autoIncrement', 'nombre','direccion.calle','direccion.ciudad','distribuidor.key','settings.isActivo'],
         paginadoCantidad      : 50,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];
      
      this.configListadosCache.push({ 
         nombreListado        : 'listadoDistribuidores',
         nombreColeccion      : 'Distribuidores',
         where                : argumentos['listadosCacheWhereDistribuidores'],
         orderBy              : argumentos['listadosCacheOrderByDistribuidores'],
         grabaLocalStorage    : false
      });                
      
      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxIdiomas',
         nombreColeccion      : 'AuxIdiomas',
         where                : argumentos['whereAuxIdiomas'],
         orderBy              : [{ key:'nombre', ascDesc:'asc'}]
      });                

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[{
         nameField: 'logoIMG',
         type: 'IMG'
      }]; 

      // Formulario
      this.form = this.fb.group({

         key                      : null,
         autoIncrement            : null,
         keywords                 : 'Array',
         nombre                   : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         email                    : [null, Validators.compose([Validators.required, Validators.email])],
         web                      : null,
         idioma                   : [null, Validators.compose([Validators.required])],
         personaDeContacto        : null,
         rubro                    : [null, Validators.compose([Validators.required])],

         logoIMG: this.fb.group({
            link                  : null,
            linkThumb             : null,
            bytes                 : 0,
            bytesThumb            : 0,
         }),

         distribuidor             : [null, Validators.compose([Validators.required])],

         esquemaComercial: this.fb.group({

           cantidadLicencias              : [null, Validators.compose([Validators.required])],
           porcentajeExcesoPermitido      : [null, Validators.compose([Validators.required])],
           cantidadVecesExcesoPermitido   : [null, Validators.compose([Validators.required])],
           licenciasConBloqueo            : [false, Validators.compose([Validators.required])],

           logAuditoria                   : true,
         //   hojaRutaFicha                  : 'FichaBasica',   /* 'NoMostrar', 'FichaBasica','FichaConCantidades' (En Hoja de Ruta)  */
           logEstadosCelular              : true,  /* Graba o no la tabla RutaEstadosCelulares */           
           trackeaRutas                   : true,  /* Graba o no las tablas RutaMonitorEquipos y RutaTrackeo (Activa o no el GPS) */
           relevamientoParadas            : true,  /* Relevamiento de Paradas */
           gestionaParadas                : true,  /* Marca cambios de estado de paradas, carga cantidades entregadas, etc */
           hojaDeRutas                    : true,  /* Permite marcar las paradas como IndicacionesSolicitadas, Cancelada, Realizada y mostrar el goggle o waze para ver indicaciones. */  
           trackeaInBackgroundAppClose    : false, /* Aunque se cierre la App, la misma continua trackeando en background */
         }),
         
         soap: this.fb.group({
            hostRoadNet           : null,
            hostTerritoryPlanner  : null,
         }),          

         direccion: this.fb.group({
           calle                  : [null, Validators.compose([Validators.required])],
           numero                 : null,
           bloque                 : null,
           piso                   : null,
           departamento           : null,
           codigoPostal           : null,
           ciudad                 : [null, Validators.compose([Validators.required])],
           partido                : null,
           provinciaKN            : null,
           paisKN                 : [null, Validators.compose([Validators.required])],
           geoPoint:  this.fb.group({
               latitud            : null,
               longitud           : null,
           }),              
           timeZone               : [null, Validators.compose([Validators.required])],
           idiomaPais             : null,
         }),

         telefono: this.fb.group({
           tipoTelefono1          : [null, Validators.compose([Validators.required])],
           numeroTelefono1        : [null, Validators.compose([Validators.required])],
           tipoTelefono2          : null,
           numeroTelefono2        : null,
           tipoTelefono3          : null,
           numeroTelefono3        : null,
           tipoTelefono4          : null,
           numeroTelefono4        : null,
         }),

         redSocial: this.fb.group({
           facebook               : null,
           twitter                : null,
           google                 : null,
           instagram              : null,
           linkedin               : null
         }),

         settings                 : this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
