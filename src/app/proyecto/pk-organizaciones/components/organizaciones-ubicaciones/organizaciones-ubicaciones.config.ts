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
         paginadoTipo          : 'servidor',    // local / servidor
         orderField            : 'nombre',
         orderReverse          : false,
         orderServer           : ['key', 'nombre'],
         whereArray            : [{ 
                                   key:      'organizacionKNAI.key', 
                                   operador: '==', 
                                   value:    argumentos.organizacionKNAI.key
                                 }],              
         campoKeywords         : true,
         filtroNombre          : 'nombre',
         filtrosServer         : ['key', 'nombre','tipoUbicacionKN.key','tipoCuentaKN.key','direccion.ciudad','sucursalKN.key','areaNegocio.key','settings.isActivo'],
         camposDecimal         : ['radioEntrega'],
         paginadoCantidad      : 20,
         paginadoAutoHide      : false,
         verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
        nombreListado        : 'listadoAreasNegocio',
        nombreColeccion      : 'AreasNegocio',
        orderBy              : [{key:'nombre',ascDesc:'asc'}],
        where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionKNAI.key}],
        grabaLocalStorage    : false,
        ignoraValoresMemoria : true,
        datosPorOrganizacion : true,
      });     

      this.configListadosCache.push({ 
        nombreListado        : 'listadoSucursales',
        nombreColeccion      : 'Sucursales',
        orderBy              : [{key:'nombre',ascDesc:'asc'}],
        where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionKNAI.key}],
        grabaLocalStorage    : false,
        ignoraValoresMemoria : true,
        datosPorOrganizacion : true,
      });     
      
      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxTiposUbicacion',
         nombreColeccion      : 'AuxTiposUbicacion',
         orderBy              : [{key:'nombre',ascDesc:'asc'}],
         where                : [],
         grabaLocalStorage    : true,
         ignoraValoresMemoria : false
      });     

      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxTiposCuenta',
         nombreColeccion      : 'AuxTiposCuenta',
         orderBy              : [{key:'nombre',ascDesc:'asc'}],
         where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionKNAI.key}],
         grabaLocalStorage    : true,
         ignoraValoresMemoria : false,
         datosPorOrganizacion : true
      });     

      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxVentanasAtencion',
         nombreColeccion      : 'AuxVentanasAtencion',
         orderBy              : [{key:'nombre',ascDesc:'asc'}],
         where                : [{key:'organizacionKNAI.key',operador:'==',value:argumentos.organizacionKNAI.key}],
         grabaLocalStorage    : true,
         ignoraValoresMemoria : false,
         datosPorOrganizacion : true
      });     

      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[]; 

      // Formulario
      this.form = this.fb.group({

         key                    : null,
         codigo                 : null,
         nombre                 : [null, Validators.compose([Validators.required, Validators.minLength(3)])],
         keywords               : 'Array',
         organizacionKNAI       : argumentos.organizacionKNAI,
         sucursalKN             : [null, Validators.compose([Validators.required])],
         areaNegocio            : [null, Validators.compose([Validators.required])],
         tipoUbicacionKN        : [null, Validators.compose([Validators.required])],
         tipoCuentaKN           : [null, Validators.compose([Validators.required])],
         email                  : null,
         tiempoServicio         : [null, Validators.compose([Validators.required])],
         radioEntrega           : [null, Validators.compose([Validators.required])],

         ventanaAtencion: this.fb.group({
           key                  : null,
           nombre               : null,
           codigo               : null,
           tipoCuentaKN         : null,
           horarioAtencion:  this.fb.group({
               lunes:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               martes:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               miercoles:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               jueves:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               viernes:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               sabado:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               domingo:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               visperaFeriado:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
               feriado:  this.fb.group({
                   horaDesde1   : null,
                   horaHasta1   : null,
                   horaDesde2   : null,
                   horaHasta2   : null,
                   horaDesde3   : null,
                   horaHasta3   : null,
               }),              
           }),              
         }),

         direccion: this.fb.group({
           calle                : [null, Validators.compose([Validators.required])],
           numero               : null,
           bloque               : null,
           piso                 : null,
           departamento         : null,
           codigoPostal         : null,
           ciudad               : null,
           partido              : null,
           provinciaKN          : null,
           paisKN               : [null, Validators.compose([Validators.required])],
           geoPoint:  this.fb.group({
               latitud          : null,
               longitud         : null,
           }),              
           timeZone             : [null, Validators.compose([Validators.required])],
           idiomaPais           : null,
         }),
         telefono: this.fb.group({
             tipoTelefono1      : null,
             numeroTelefono1    : null,
             tipoTelefono2      : null,
             numeroTelefono2    : null,
             tipoTelefono3      : null,
             numeroTelefono3    : null,
             tipoTelefono4      : null,
             numeroTelefono4    : null,
           }),

         settings               : this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
