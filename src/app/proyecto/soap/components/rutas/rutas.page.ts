import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, Input, DoCheck } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { SoapGenerica }     from '@maq-modules/soap-generica/soap-generica.page';
import { ConfigComponente } from './rutas.config';

import { SearchFiltroPipe }           from '@maq-shared/pipes/search/search-filtro.pipe';
import {ESTADOS_RUTA,ESTADOS_PARADAS} from '@proyecto/mocks/rutas_y_paradas/rutasParadas.mocks'
import { LicenciasService }           from '@proyecto/servicios/licencias/licencias.service';

@Component({
  selector: 'soap-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: [
    '../../../../maqueta/modules/soap-generica/soap-generica.page.scss',
    './rutas.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class SoapRutasComponent extends SoapGenerica implements OnInit, OnDestroy, DoCheck {

  @Input() public idSesion: string; 
  @Input() public nombreSesion: string; 
  @Input() public organizacionSoapInput: string; 
  @Input() public filtroSoapConector: any; 
  @Input() public filtroSoapSucursalKeyInput: string; 
  @Input() public listadoSucursalesInput:any[]=[];
  @Input() public listadoAreasNegocioInput:any[]=[];  
  
  constructor (protected changeDetectorRef: ChangeDetectorRef,      
               public licencias           : LicenciasService) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'Rutas'));
  
  public listadoSoapTiposRutas:any[]=[];  
  public idSesionAnterior: string = null;
  public filtroSoapAreaNegocio:any=null;

  ngDoCheck() {
      //console.log("ngDocheck rutas.ts - idSesion",this.idSesion, this.idSesionAnterior);
      if(this.idSesionAnterior!=this.idSesion && this.idSesion!==undefined &&  this.idSesion!=null) {

          // Me desuscribo y blanqueo el array de las subscripciones a Sesiones elegidas antes
          let keyImportacionAnterior = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-rutas-'+this.sucursalCodigo+'-'+this.idSesionAnterior;  
          
          this.soapService.clearImportados(keyImportacionAnterior);
          
          this.ngOnInit();
      }    
      
  }
      
  ngOnInit() {
     console.log("ngOnInit rutas.ts - idSesion",this.idSesion)

     log(...values('funcionComponente', 'ngOnInit Rutas'));
     
     if(this.idSesionAnterior==this.idSesion || this.idSesion===undefined || this.idSesion==null) {
          return;
     }    
     
     this.filtroSoapSucursalKey = this.filtroSoapSucursalKeyInput;
     this.listadoSucursales     = this.listadoSucursalesInput;
     this.listadoAreasNegocio   = this.listadoAreasNegocioInput;
     
     if(this.listadoAreasNegocio.length==1) {
         this.filtroSoapAreaNegocio=this.listadoAreasNegocio[0];
     }
        
     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     this.ignorarSoapUsuario    = true;
     this.organizacionSoap      = this.organizacionSoapInput;
     this.soap                  = (this.organizacionSoap && this.organizacionSoap.soap!==undefined) ? this.organizacionSoap.soap : null;
     
     
    //  this.bdService.getUTCofTimeZone(this.organizacionKNAI, this.usuarioKANE, this.organizacionSoap.direccion)
    //     .then(utc=>{
    //         this.organizacionUTC = utc;
    //         console.log("organizacionUTC", this.organizacionUTC);
    //     }).catch(error=>{
    //         this.organizacionUTC = error;
    //     });
     
     
     super.ngOnInit()
          
  }
 
  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy Rutas'));
    
    
    if(this.soapService.cacheImportadosObs[this.keyImportacion]) {
        this.soapService.cacheImportados[this.keyImportacion]=[];
        this.soapService.cacheImportadosObs[this.keyImportacion].unsubscribe();
    }
    
    let keyImportacionAnterior = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-rutas-'+this.sucursalCodigo+'-'+this.idSesionAnterior;  
    if(this.soapService.cacheImportadosObs[keyImportacionAnterior]) {
      this.soapService.cacheImportados[keyImportacionAnterior]=[];
      this.soapService.cacheImportadosObs[keyImportacionAnterior].unsubscribe();
    }

  }  
  
  configuracionComponente() {
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
        
        argumentos['whereSucursales']=[{
          key        : 'organizacionKNAI.key',
          operador   : '==',
          value      : this.fn.mostrarKN(this.organizacionKNAI,"key")
        }],
      
        this.configComponente = new ConfigComponente(argumentos, this.fb, this.fn);
    
        super.configuracionComponente();                  
  }
  
  configuracionFormulario() {
      // Seteo el Formulario
      super.configuracionFormulario();
  }  

  inicializarVariablesTraducibles(){
      // log(...values('funcionComponente','inicializarVariablesTraducibles'));
      // log(...values("valores","this.translate:",this.translate));  
      // log(...values("valores","this.translate.store.currentLang:",this.translate.store.currentLang));  
  }
  
  onResultGetSubscripcionSecundarias() {
    log(...values('funcionComponente','pageGenerica.nResultGetSubscripcionSecundarias'));
    
    super.onResultGetSubscripcionSecundarias();        
    
    if(this.idSesionAnterior!=this.idSesion && this.idSesion!==undefined &&  this.idSesion!=null) {
        this.idSesionAnterior = this.idSesion;
        this.ejecutarSoapRutas();  
    }
    
  }    
  
  filtrarGrilla(nameFiltro?:string) { 
    
      super.filtrarGrilla(nameFiltro);
      
      for(let i=0; i<this.listadoPrincipal.length; i++) {
        this.listadoPrincipal[i].importar = false;        
      }
      this.importarTodos=false;

  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Rutas', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form

  }  
  
  ejecutarSoapRutas() {
        console.log('ejecutarSoapRutas');            
        
        this.cualSpinner = 'buscando';
        this.spinner.show();
         
        this.sucursalCodigo = this.fn.getAtributoFromListado( this.listadoSucursales, this.filtroSoapSucursalKey, 'key', 'codigo');
        this.keyImportacion = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-rutas-'+this.sucursalCodigo+'-'+this.idSesion;  
        
        // Cargo Documentos Ya Importados de Rutas
        this.finalizoDownloadFiles['rutas']=false;            
        this.soapService.getImportados(this.usuarioKANE, this.organizacionSoap, this.keyImportacion)
        .subscribe((resultado:any)=>{
            console.log("getImportados resultado",resultado);
            
            this.finalizoDownloadFiles['rutas']=true;
            this.ActualizarListadoPrincipalconArchivoImportado('rutas');                      
            
        }, error=>{
            console.log("getImportados error",error);
        });                  

        // Cargo Documentos Ya Importados de Empleados
        this.finalizoDownloadFiles['empleados']=false;            
        let keyImportacionEmpleados = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-empleados-'+this.sucursalCodigo;  
        this.soapService.getImportados(this.usuarioKANE, this.organizacionSoap, keyImportacionEmpleados)
        .subscribe((resultado:any)=>{
            console.log("getImportados resultado",resultado);
            
            this.finalizoDownloadFiles['empleados']=true;
            this.ActualizarListadoPrincipalconArchivoImportado('empleados');                      
            
        }, error=>{
            console.log("getImportados error",error);
        });  
        
        // Cargo Documentos Ya Importados de Vehículos
        this.finalizoDownloadFiles['vehiculos']=false;            
        let keyImportacionVehiculos = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-vehiculos-'+this.sucursalCodigo;  
        this.soapService.getImportados(this.usuarioKANE, this.organizacionSoap, keyImportacionVehiculos)
        .subscribe((resultado:any)=>{
            console.log("getImportados resultado",resultado);
            
            this.finalizoDownloadFiles['vehiculos']=true;
            this.ActualizarListadoPrincipalconArchivoImportado('vehiculos');                      
            
        }, error=>{
            console.log("getImportados error",error);
        });  
        
        // Proceso Soap
        let vecRetrieves=[];
        vecRetrieves=['RetrieveRoutingRoutesByCriteria',          
                      'RetrieveLocationTypesByCriteriaEx',
                      'RetrieveAccountTypesByCriteriaEx',
                      'RetrieveEquipmentTypesByCriteria'
        ];
        
        console.log("vecRetrieves",vecRetrieves);
        
        this.generadorImportadores.getSoap( vecRetrieves )
        .then((vecResponse:any[])=>{
          
            console.log("generadorImportadores.getSoap - vecResponse",vecResponse);                  
            
            let nivelDatos = 'rdlRoute';
            let rutaId     = '';
            let idVehiculo = '';
            
            this.vecEjecucionesSoap=[];
            for(let i=0; i<vecResponse.length; i++) {
                let response = vecResponse[i];
                response.xml = response.xml.replace("((SUCURSAL))",this.sucursalCodigo);
                
                response.xml = response.xml.replace("((ID_SESION))",this.idSesion);
                
                response.xml = response.xml.replace("((ID_RUTA))",rutaId);
                
                response.xml = response.xml.replace("((ID_VEHICULO))",idVehiculo);
                
                response.xml = response.xml.replace("((NIVEL_DATOS))",nivelDatos);  // rdlSession,rdlRoute,rdlStop,rdlOrder,rdlLineItem

                let parameters = {
                    xml    : response.xml,
                    action : response.action,
                    host   : this.getHostConector()
                }
                console.log(response.method + " - parameters:",parameters);
                
                this.vecEjecucionesSoap.push( 
                    this.httpPOSTSoap(response.method, parameters) 
                );
            } // fin for
            
            Promise.all( this.vecEjecucionesSoap).then(vecJsonResult=>{
                log(...values('funcionEnd','promise.All'));
                log(...values('valores','vecJsonResult:',vecJsonResult));

                this.spinner.hide();
                
                this.setListadosSoap(vecJsonResult);  

            }).catch(error=>{
                log(...values("valores","Error de Conexión al Cloud Funcion soapRoadNet:",error));
                
                this.spinner.hide();
                
                alert( this.translate.instant('mensajeSoap.laConsultaSaturoServidorAchiqueRangoFechas') );

            });            
            
        });   
 
  }  
  
  setListadosSoap(vecJsonResult:any[]) {
    
    if(vecJsonResult.length > 0 && vecJsonResult[0].error) {
        //alert('error de Conexión');
        console.log("error soap", vecJsonResult[0].error);
        alert( this.translate.instant('mensajeSoap.seProdujoUnErrorAlObtenerDatosDelContector') );
        return;
    }

    this.listadoPrincipal             = [];
    this.listadoSoapTiposUbicacion    = [];
    this.listadoSoapTiposCuenta       = [];
    this.listadoSoapTiposVehiculos    = [];

    for(let i=0; i<vecJsonResult.length; i++) {
        let jsonResult = vecJsonResult[i];
        
        let jsonValues1 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveRoutingRoutesByCriteriaResponse','ns1:routes') );
        let jsonValues2 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveLocationTypesByCriteriaExResponse','ns1:locationTypes') );
        let jsonValues3 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveAccountTypesByCriteriaExResponse','ns1:accountTypes') );
        let jsonValues4 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveEquipmentTypesByCriteriaResponse','ns1:equipment') );
        
        if(jsonValues1) { // Rutas (RetrieveRoutingRoutesByCriteriaResponse)
            for(let j=0; j<jsonValues1.length; j++) {
                let json=jsonValues1[j];  
                
                // fechas vienen formato 2020-09-22T13:34:17.0000000Z
                // Estados Rutas RoadNet = Activas ("rsActiveRoute"), Confirmadas, Construídas ("rsBuiltRoute")
                // Consultar con Javier el campo costo, provisorio totalCost
                
                let fechaHoraInicioPlaneada         = this.parseJsonSoap(json,'ns1:startTime','_text');
                let fechaHoraSalidaPlaneada         = this.parseJsonSoap(json,'ns1:departTime','_text');
                let fechaHoraArriboPlaneada         = this.parseJsonSoap(json,'ns1:arriveTime','_text');
                let fechaHoraFinalizacionPlaneada   = this.parseJsonSoap(json,'ns1:completeTime','_text');
                
                console.log("fechaHoraInicioPlaneada",fechaHoraInicioPlaneada);
                console.log("fechaHoraSalidaPlaneada",fechaHoraSalidaPlaneada);
                console.log("fechaHoraArriboPlaneada",fechaHoraArriboPlaneada);
                console.log("fechaHoraFinalizacionPlaneada",fechaHoraFinalizacionPlaneada);
                
                // Drivers
                let idEmpleado=null;
                let empleados:any[] = this.parseJsonSoap(json,'ns1:drivers');
                for(let z=0; z<empleados.length;z++) {
                    let empleado=empleados[z];
                    let idEmpleadoAux = this.parseJsonSoap(empleado,'ns1:employeeID','_text');
                    if(idEmpleadoAux!=null && idEmpleadoAux!='') {
                       idEmpleado = idEmpleadoAux; 
                    }
                }

                let routeId     = this.parseJsonSoap(json,'ns1:routeID','_text');
                let routeNumber = this.parseJsonSoap(json,'ns1:routeNumber','_text');
                
                //if(routeId==null) routeId = routeNumber;
                let codigo = routeId;
                
                let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
                
                let nombre:string = auxNombre;
                if(auxNombre==null || auxNombre=='') {
                    let fechaRuta = (!fechaHoraInicioPlaneada) ? '' : fechaHoraInicioPlaneada.substr(8,2)+'/'+fechaHoraInicioPlaneada.substr(5,2)+'/'+fechaHoraInicioPlaneada.substr(0,4);
                        
                    nombre = this.translate.instant('moduloRutas.ruta') + " Nº "+codigo+" - "+fechaRuta;
                }
            
                let documento = {
                  
                    internalRouteID                 : this.parseJsonSoap(json,'ns1:routeIdentity','ns1:internalRouteID','_text'),
                    routeId                         : routeId,
                
                    key                             : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' +
                                                      this.sucursalCodigo + '-' + this.idSesion + '-' + this.parseJsonSoap(json,'ns1:routeID','_text'),
                                                      
                    codigo                          : codigo,
                    nombre                          : nombre,
                    sesionKN                        : { key: this.idSesion, nombre: this.nombreSesion },                    
                    estadoRutaKN                    : null,
                    status                          : this.parseJsonSoap(json,'ns1:status','_text'),

                    fechaHoraInicioPlaneada         : new Date(fechaHoraInicioPlaneada),
                    fechaHoraSalidaPlaneada         : new Date(fechaHoraSalidaPlaneada),
                    fechaHoraArriboPlaneada         : new Date(fechaHoraArriboPlaneada),
                    fechaHoraFinalizacionPlaneada   : new Date(fechaHoraFinalizacionPlaneada),
                    
                    // fechaHoraInicioPlaneada         : this.fn.newDateUTC(fechaHoraInicioPlaneada, this.organizacionUTC),
                    // fechaHoraSalidaPlaneada         : this.fn.newDateUTC(fechaHoraSalidaPlaneada, this.organizacionUTC),
                    // fechaHoraArriboPlaneada         : this.fn.newDateUTC(fechaHoraArriboPlaneada, this.organizacionUTC),
                    // fechaHoraFinalizacionPlaneada   : this.fn.newDateUTC(fechaHoraFinalizacionPlaneada, this.organizacionUTC),
                    
                    // fechaHoraInicioPlaneada         : new Date(fechaHoraInicioPlaneada),
                    // newDateOfTimeZone(formato:string, idiomaPais:string, timeZone:string, fechaInput:Date):string {
                    
                    distanciaPlanificada            : this.parseJsonSoap(json,'ns1:distance','_text'),
                    costoPlanificado                : this.parseJsonSoap(json,'ns1:totalCost','_text'),
                    
                    idEmpleado                      : idEmpleado,
                    nombreEmpleado                  : null,
                    integranteChoferKANE            : null,
                    idVehiculo                      : this.parseJsonSoap(json,'ns1:routeEquipment','ns1:equipmentID','_text'),
                    nombreVehiculo                  : null,
                    vehiculoPrincipalKN             : null,
                    vehiculoGeoPoint                : null,
                    
                    origin_locationID               : this.parseJsonSoap(json,'ns1:origin','ns1:locationID','_text'),
                    origin_locationType             : this.parseJsonSoap(json,'ns1:origin','ns1:locationType','_text'),
                    origin_Documento                : null,
                    ubicacionOrigenKN               : null,
                    
                    origenEsDestino                 : this.fn.textToBoolean( this.parseJsonSoap(json,'ns1:originIsDestination','_text') ),
    
                    destination_locationId          : this.parseJsonSoap(json,'ns1:destination','ns1:locationID','_text'),
                    destination_locationType        : this.parseJsonSoap(json,'ns1:destination','ns1:locationType','_text'),
                    destination_Documento           : null,
                    ubicacionDestinoKN              : null,
                         
                    yaImportado                     : false,
                    importar                        : false,
                    aptoImportar                    : false,
                    errorValidacion                 : null,
                    errorRutaYaIniciada             : null,
                    errorEmpleadoNoImportadaAntes   : null,
                    errorVehiculoNoImportadaAntes   : null,
                }
                
                if(documento.status=='rsActiveRoute')    documento.status='Activa';
                if(documento.status=='rsPublishedRoute') documento.status='Publicada';
                if(documento.status=='rsBuiltRoute')     documento.status='Construída';
                if(documento.status=='rsBuiltedRoute')   documento.status='Construída';
                
                if(documento.routeId!='Sin asignar') {
                    this.listadoPrincipal.push(documento);
                }    
            }
            console.log("this.listadoPrincipal",this.listadoPrincipal);            
            
            this.finalizoSoapComponente=true;
            
            this.ActualizarListadoPrincipalconArchivoImportado('rutas');                                  
                    
        }
        
        if(jsonValues2) { // Tipos de Ubicación (RetrieveLocationTypesByCriteriaExResponse)
          
          for(let j=0; j<jsonValues2.length; j++) {
              let json=jsonValues2[j];  
              
              let codigo:string    = this.parseJsonSoap(json,'ns1:locationTypeIdentity','ns1:locationTypeId','_text');
              let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
              let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
              
              if(codigo=='SIT') nombre = 'moduloRutas.tipoUbicacionSIT';
              if(codigo=='DPT') nombre = 'moduloRutas.tipoUbicacionDPT';
              if(codigo=='LD')  nombre = 'moduloRutas.tipoUbicacionLD';
              if(codigo=='PER') nombre = 'moduloRutas.tipoUbicacionPER';
              
              let documento = {
                  key               : codigo,
                  codigo            : codigo,
                  nombre            : nombre,
                  organizacionKNAI  : this.organizacionSoap
              }
              this.listadoSoapTiposUbicacion.push(documento);
          }

          this.listadoSoapTiposUbicacion.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
          
          console.log("this.listadoSoapTiposUbicacion",this.listadoSoapTiposUbicacion);
        }  

        if(jsonValues3) { // Tipos de Cuenta (RetrieveAccountTypesByCriteriaEx)
          
          // Agrego el tipo de Cuenta DTP dado que no viene de RoadNet (Soap Paradas), y se lo tengo que asignar a las Ubicacion es de Tipo de Cuenta Depósito (DPT)
          let documentoDeposito = {
              key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-DPT',
              codigo            : 'DPT',
              nombre            : 'Depósito',
              organizacionKNAI  : this.organizacionSoap
          }
          this.listadoSoapTiposCuenta.push(documentoDeposito);

          // Agrego el tipo de Cuenta NOIndicada dado que no viene de RoadNet (Soap Paradas), y se lo tengo que asignar a las Ubicacion es de Tipo de Cuenta Depósito (SIT)
          let documentoNoIndicada = {
                key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-NoIndicada',
                codigo            : 'NoIndicada',
                nombre            : 'No Indicada',
                organizacionKNAI  : this.organizacionSoap
          }
          this.listadoSoapTiposCuenta.push(documentoNoIndicada);
            
          for(let j=0; j<jsonValues3.length; j++) {
              let json=jsonValues3[j];  
              
              let codigo:string    = this.parseJsonSoap(json,'ns1:accountTypeIdentity','ns1:code','_text');
              let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
              let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
              
              let documento = {
                  key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + codigo,
                  codigo            : codigo,
                  nombre            : nombre,
                  organizacionKNAI  : this.organizacionSoap
              }
              this.listadoSoapTiposCuenta.push(documento);
          }

          this.listadoSoapTiposCuenta.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
          
          console.log("this.listadoSoapTiposCuenta",this.listadoSoapTiposCuenta);
          
        }
        
        if(jsonValues4) { // Tipos de Vehículos (RetrieveEquipmentTypesByCriteriaResponse)
          this.listadoSoapTiposVehiculos = [];
          
          for(let j=0; j<jsonValues4.length; j++) {
              let json=jsonValues4[j];  
              
              let codigo:string    = this.parseJsonSoap(json,'ns1:equipmentTypeIdentity','ns1:equipmentTypeID','_text');
              let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
              let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
              
              let documento = {
                  key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + this.parseJsonSoap(json,'ns1:equipmentTypeIdentity','ns1:equipmentTypeID','_text'),
                  codigo            : codigo,
                  nombre            : nombre,
                  organizacionKNAI  : this.organizacionSoap
              }
              this.listadoSoapTiposVehiculos.push(documento);
          }

          this.listadoSoapTiposVehiculos.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
          
          console.log("this.listadoSoapTiposVehiculos",this.listadoSoapTiposVehiculos);
      
        }
        
        
        
    } // fin for
    
  }

  ejecutarSoapParadas(routeId, idVehiculo, documentoArgumento) {
        console.log('ejecutarSoapParadas',routeId, idVehiculo, documentoArgumento);            
        
        let documento = {...documentoArgumento};
        
        this.cualSpinner = 'grabando';
         this.spinner.show();
         
        this.sucursalCodigo = this.fn.getAtributoFromListado( this.listadoSucursales, this.filtroSoapSucursalKey, 'key', 'codigo');
        this.keyImportacion = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-rutas-'+this.sucursalCodigo+'-'+this.idSesion;  
        
        // Proceso Soap
        let vecRetrieves=[];
            
        if(documento.origin_locationID==null && documento.destination_locationId==null) {
            vecRetrieves=['RetrieveRoutingRoutesByCriteria',
                          'RetrieveEquipmentByCriteria'
            ]; 
               
        } else if(documento.origin_locationID!=null && 
                  (documento.origenEsDestino || documento.origin_locationID==documento.destination_locationId)) {
                      
            vecRetrieves=['RetrieveRoutingRoutesByCriteria', 
                          'RetrieveEquipmentByCriteria',
                          'RetrieveLocationsByCriteriaEx'];    

        } else if(documento.origenEsDestino==false && documento.origin_locationID!=null) {
            vecRetrieves=['RetrieveRoutingRoutesByCriteria', 
                          'RetrieveEquipmentByCriteria',
                          'RetrieveLocationsByCriteriaEx'];    
                                          
        } else if(documento.origin_locationID!=null && documento.destination_locationId!=null) {
            vecRetrieves=['RetrieveRoutingRoutesByCriteria', 
                          'RetrieveEquipmentByCriteria',
                          'RetrieveLocationsByCriteriaEx', 
                          'RetrieveLocationsByCriteriaEx'];    
                          
        } else if(documento.origin_locationID!=null && documento.destination_locationId==null) {
            vecRetrieves=['RetrieveRoutingRoutesByCriteria', 
                          'RetrieveEquipmentByCriteria',
                          'RetrieveLocationsByCriteriaEx'];                              
        }            
        
        console.log("vecRetrieves",vecRetrieves);
        
        this.generadorImportadores.getSoap( vecRetrieves )
        .then((vecResponse:any[])=>{
          
            console.log("generadorImportadores.getSoap - vecResponse",vecResponse); 
            
            let nivelDatos = 'rdlStop';
            let ejecutoFirstRetrieveLocationsByCriteriaEx=false;
            
            this.vecEjecucionesSoap=[];
            for(let i=0; i<vecResponse.length; i++) {
                let response = vecResponse[i];
                response.xml = response.xml.replace("((SUCURSAL))",this.sucursalCodigo);
                
                response.xml = response.xml.replace("((ID_SESION))",this.idSesion);
                
                response.xml = response.xml.replace("((ID_RUTA))",routeId);
                
                response.xml = response.xml.replace("((ID_VEHICULO))",idVehiculo);
                
                response.xml = response.xml.replace("((NIVEL_DATOS))",nivelDatos);  // rdlSession,rdlRoute,rdlStop,rdlOrder,rdlLineItem
                
                if(response.method=='RetrieveLocationsByCriteriaEx') {
                    if(ejecutoFirstRetrieveLocationsByCriteriaEx==false) {
                        response.xml = response.xml.replace("((LOCATIONID))",documento.origin_locationID);        
                        ejecutoFirstRetrieveLocationsByCriteriaEx=true;
                    } else {
                        response.xml = response.xml.replace("((LOCATIONID))",documento.destination_locationId);        
                    }
                }
                
                response.xml = response.xml.replace("((DESCRIPCION))",'');   // Se usan en el Conector de Ubicaciones
                response.xml = response.xml.replace("((FECHA_DESDE))",'');   // Se usan en el Conector de Ubicaciones
                response.xml = response.xml.replace("((FECHA_HASTA))",'');   // Se usan en el Conector de Ubicaciones
                
              
                let parameters = {
                    xml    : response.xml,
                    action : response.action,
                    host   : this.getHostConector()
                }
                console.log(response.method + " - parameters:",parameters);
                
                this.vecEjecucionesSoap.push( 
                    this.httpPOSTSoap(response.method, parameters) 
                );
            } // fin for
            
            Promise.all( this.vecEjecucionesSoap).then(vecJsonResult=>{
                log(...values('funcionEnd','promise.All'));
                log(...values('valores','vecJsonResult:',vecJsonResult));

                this.spinner.hide();
                
                this.grabarRutaYParadas(vecJsonResult, documento);  

            }).catch(error=>{
                log(...values("valores","Error al intentar grabar las paradas obtenidas de la ruta para importar:",error));
                
                this.spinner.hide();
                
                alert( this.translate.instant('mensajeSoap.laConsultaSaturoServidorAchiqueRangoFechas') );
                
            });            
            
        });   
 
  }  
  
  
  aptoImportacion(documento) {
    //console.log("aptoImportacion");
    
    let rta=true;        
    documento.errorValidacion='';
    
    // if(!documento.nombre || documento.nombre=='') {        
    //     documento.errorValidacion += this.translate.instant('mensajeSoap.rutaSinDescripcionIndicada') +' \n';
    //     rta=false;
    // }    
    
    // if(!documento.idVehiculo) {
    //     documento.errorValidacion += this.translate.instant('mensajeSoap.rutaSinVehiculoIndicado') +' \n';
    //     rta=false;
    // }    
    
    // if(!documento.idEmpleado) {
    //     documento.errorValidacion += this.translate.instant('mensajeSoap.rutaSinConductorIndicado') + ' \n';
    //     rta=false;
    // }    

    if(documento.routeId==null || documento.routeId=='Não atendido' || documento.routeId=='No atendido') {        
        documento.errorValidacion += this.translate.instant('mensajeSoap.rutaSinRouteID') +' \n';
        rta=false;
    }    
    
    if(documento.errorRutaYaIniciada) {
        documento.errorValidacion += documento.errorRutaYaIniciada + '\n';
        rta=false;
        console.log("errorRutaYaIniciada");
    }    
    
    if(documento.errorEmpleadoNoImportadaAntes) {
        documento.errorValidacion += documento.errorEmpleadoNoImportadaAntes + '\n';
        rta=false;
        console.log("errorEmpleadoNoImportadaAntes");
    }    

    // if(documento.errorVehiculoNoImportadaAntes) {
    //     documento.errorValidacion += documento.errorVehiculoNoImportadaAntes + '\n';
    //     rta=false;
    // }    
        
    documento.aptoImportar=rta;
    
    return rta;
  }
  
  onPostSeleccionarItem(documento:any, posInListado:number) {
    
      this.contarCantSeleccionados(); // Cuando no realizo validaciones (llamar a buscarDatoEnBD, debo contar aquí, sino no va este línea)
      
      this.buscarDatoEnBD(
        "Rutas",
        [{key:'key',operador:'==',value:documento.key}],
        posInListado,
        "estadoRutaKN",
        "verificaRutaNoIniciada"
      );
    
      super.onPostSeleccionarItem(documento, posInListado);
  }  
  
  seleccionarTodosImportar() {
    console.log("importarTodos",this.importarTodos);
    
    this.importarTodos = !this.importarTodos;
    
    let listadoParcial0 = new SearchFiltroPipe().transform(this.listadoPrincipal, 'local', 'key',               this.grilla.filtros['key'], 'string');
    let listadoParcial1 = new SearchFiltroPipe().transform(listadoParcial0,       'local', 'idSesion',          this.grilla.filtros['idSesion'], 'string');
    let listadoParcial2 = new SearchFiltroPipe().transform(listadoParcial1,       'local', 'nombre',            this.grilla.filtros['nombre'], 'string');
    let listadoParcial3 = new SearchFiltroPipe().transform(listadoParcial2,       'local', 'escenario',         this.grilla.filtros['escenario'], 'string');
    let listadoParcialn = new SearchFiltroPipe().transform(listadoParcial3,       'local', 'yaImportado',       this.grilla.filtros['yaImportado'], 'boolean');
    console.log("listadoParcialn", listadoParcialn);
  
    for(let i=0; i<this.listadoPrincipal.length; i++) {
        let keySearch = this.listadoPrincipal[i].key;
        if( listadoParcialn.find((el => el.key == keySearch)) ) {
          
            this.listadoPrincipal[i].importar = this.importarTodos;  
            
            if(this.importarTodos && this.listadoPrincipal[i].yaImportado==false) {
                this.buscarDatoEnBD(
                    "Rutas",
                    [{key:'key',operador:'==',value:this.listadoPrincipal[i].key}],
                    i,
                    "estadoRutaKN",
                    "verificaRutaNoIniciada"
                  );
            }      
            
        } else {
            this.listadoPrincipal[i].importar = false;  
        }
    }
    console.log("listadoPrincipal", this.listadoPrincipal);
  }
  
  buscarDatoEnBD(coleccion:string, whereArray:any[], indexListadoPrincipal:number, fieldDestino:string, operacion:string) {    
    
    let argumentos:any={
      nombreColeccion  : coleccion,
      where            : whereArray,
      orderBy          : [],
      limit            : null,
      paginado         : null,
      offset           : null,
      organizacionKNAI : this.organizacionSoap,
      usuarioKANE      : this.usuarioKANE
    };
    
    console.log('bdService.getBDPromesa argumentos',argumentos);
         
    this.bdService.getBDPromesa(argumentos) 
      .then((resultado:any[])=>{
        console.log('bdService.getBDPromesa ok',indexListadoPrincipal, resultado, operacion);
        
        // if(operacion=='verificaRutaNoIniciada') {
        //     this.listadoPrincipal[ indexListadoPrincipal ]['errorRutaYaIniciada'] = resultado; // ???
        // }    
        
        if(resultado.length==1) {
            console.log("resultado[0]['estadoRutaKN']",this.fn.mostrarKN(resultado[0]['estadoRutaKN'],'key'));
            
            if(operacion=='verificaRutaNoIniciada') {
                //Pregunta Juan: dejo los estadps anteriore
                if(['EnCarga','PendienteEjecucion','Creacion','NoIniciada'].indexOf( this.fn.mostrarKN(resultado[0]['estadoRutaKN'],'key') )==-1) {  
                    this.listadoPrincipal[ indexListadoPrincipal ].importar = true;
                    this.listadoPrincipal[ indexListadoPrincipal ].errorRutaYaIniciada = this.translate.instant('mensajeSoap.rutaYaIniciadaNoSePuedeImportar',{ codigoRuta : this.listadoPrincipal[ indexListadoPrincipal ]['codigo']});
                    console.log("NO se puede importar, ya iniciada");
                } else {
                    this.listadoPrincipal[ indexListadoPrincipal ].importar = true;
                    this.listadoPrincipal[ indexListadoPrincipal ].errorRutaYaIniciada = null;                    
                    console.log("se puede importar");
                }    
            } 
            
        } else if(resultado.length>1) {
            console.log('bdService.getBDPromesa error se encontrar muchos resultados');
            this.listadoPrincipal[ indexListadoPrincipal ].importar = true;     
            this.listadoPrincipal[ indexListadoPrincipal ].errorRutaYaIniciada = this.translate.instant('mensajeSoap.multiplesResultadosConflictoDatosAviseSupervisor');
  
        } else {   // lenght==0
            console.log('bdService.getBDPromesa no se encontrar resultados');
            
            this.listadoPrincipal[ indexListadoPrincipal ].importar = true;     
            this.listadoPrincipal[ indexListadoPrincipal ].errorRutaYaIniciada = null;
        }
        
        this.contarCantSeleccionados();

      }).catch((error:any)=>{
        console.log('bdService.getBDPromesa error',indexListadoPrincipal, error);
      });  
    
  }
  
  comenzarImportacion() { 
        console.log("comenzarImportacion");
    
        if(this.cantSeleccionadosOk==0) {
            alert( this.translate.instant('mensajeSoap.noHayRegistrosSeleccionadossValidosParaImportar') );                        
            return;
        }

        if(this.filtroSoapAreaNegocio==null) {
            alert( this.translate.instant('mensajeSoap.seleccioneAreaNegocioAlQAsignaLaRuta') );                        
            return;
        }
        
        this.confirmService.confirm({ 
            title:   this.translate.instant('soap.importacionSoap'), 
            message: this.translate.instant('mensajeSoap.comenzarImportacionDatosObtenidosDelConector') })
        .then((resultadoOK) => {       
          
            // Actualizo Tabla Rutas
            for(let i=0; i<this.listadoPrincipal.length; i++) {

                if(this.listadoPrincipal[i].importar && this.listadoPrincipal[i].aptoImportar) {
                  
                    let documento={...this.listadoPrincipal[i]};
                    
                    this.ejecutarSoapParadas(documento.routeId, documento.idVehiculo, documento);                      
                }                    
            }

      }).catch(error=>{      // catch Confirm  
      });
              
  } // fin funcion comenzarImportacion

  grabarRutaYParadas(vecJsonResult, documento) {
    
            this.cualSpinner = 'grabando';
            this.spinner.show();
            
            let indexUltimaParada=null;
                
            // Acomodo el documento (ruta), le quito campos de más, y le calculo los campos que dejé incompletos para que no ocupen memoria
            // -------------------------------------------------------------------------------------------------

            documento.distribuidorKN    = this.organizacionSoap.distribuidor;
            documento.organizacionKNAI  = this.fn.setearKNAI( this.organizacionSoap);
            documento.areaNegocioKN     = this.fn.setearKN(this.filtroSoapAreaNegocio);
            
            let sucursalNombre = this.fn.getAtributoFromListado( this.listadoSucursales, this.filtroSoapSucursalKey, 'key', 'nombre');
            documento.sucursalKN        = { key: this.filtroSoapSucursalKey, nombre: sucursalNombre };

            documento.estadoRutaKN      = ESTADOS_RUTA['NoIniciada'];
            // documento.estadoRutaKN      = { key: 'NoIniciada', nombre: 'estadoRuta.noIniciada' };
            
            documento.mostrarEnMonitor  = false;
            documento.fechaHoraCarga    = new Date();

            /* ----- Seteo Keywords ------------------------- */      
            let stringKeywords = documento.nombre;
            documento['keywords'] = this.fn.generateKeywords( stringKeywords );
            //log(...values('valores',"documento['keywords']:", documento['keywords']));                    

            documento.fechaHoraInicioReal       = null;
            documento.fechaHoraSalidaReal       = null;
            documento.fechaHoraArriboReal       = null;
            documento.fechaHoraFinalizacionReal = null;

            let keyImportacionVehiculos = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-vehiculos-'+this.sucursalCodigo;
            let nombreVehiculo = this.getValueOfListadoYaImportados( this.soapService.cacheImportados[keyImportacionVehiculos], documento.idVehiculo, 'codigo', 'nombre');
            if(nombreVehiculo==null) {
                documento.vehiculoPrincipalKN   = null;
            } else {
                documento.vehiculoPrincipalKN   = { 
                    key       : this.fn.setearOrganizacionAI(this.organizacionSoap)+'-'+documento.idVehiculo,
                    nombre    : nombreVehiculo
                };
            }
            documento.vehiculoGeoPoint          = null;
            
            let keyImportacionEmpleados = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-empleados-'+this.sucursalCodigo;  
            let nombreEmpleado = this.getValueOfListadoYaImportados( this.soapService.cacheImportados[keyImportacionEmpleados], documento.idEmpleado, 'codigo', 'nombre');
            let emailEmpleado  = this.getValueOfListadoYaImportados( this.soapService.cacheImportados[keyImportacionEmpleados], documento.idEmpleado, 'codigo', 'email');
            if(nombreEmpleado==null) {
                documento.integranteChoferKANE   = null;
            } else {
                documento.integranteChoferKANE   = { 
                    key               : emailEmpleado,
                    apellidoNombre    : nombreEmpleado,
                    email             : emailEmpleado
                };
            }
            
            documento.ubicacionOrigenKN          = null;
            documento.ubicacionDestinoKN         = null;
            
            documento.formaCarga                 = 'ingresaHorarios';
 
            console.log("documento",documento);            
            
            let datos:any=[];

            datos.push({
                operacion        : 'importar',
                nombreColeccion  : 'Rutas',
                documento        : documento,
                incluyeSettings  : true     
            });
            
            let vecTiposUbicacion={};
            let vecTiposCuenta={};
            let vecTiposVehiculos={};
            
            let jsonValues1_Ok=null;
  
            // Parseo Json de Paradas, Origen y Destino
            console.log("vecJsonResult",vecJsonResult);
            for(let i=0; i<vecJsonResult.length; i++) {
                let jsonResult = vecJsonResult[i];
        
                let jsonValues1 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveRoutingRoutesByCriteriaResponse','ns1:routes') );
                let jsonValues2 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveLocationsByCriteriaExResponse','ns1:locations') );                
                let jsonValues3 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveEquipmentByCriteriaResponse','ns1:equipment') );                
                // console.log("jsonValues1 verify",jsonValues1);
                // console.log("jsonValues2 verify",jsonValues2);
                // console.log("jsonValues3 verify",jsonValues3);
                    
                if(jsonValues1) { // Rutas (RetrieveRoutingRoutesByCriteriaResponse)  // Paradas
                    jsonValues1_Ok=jsonValues1;
                        
                } // fin if(jsonValues1) (Soap Ruta con Paradas)

                if(jsonValues2 && jsonValues2.length>0) { // Rutas (RetrieveLocationsByCriteriaEx)  // Parada Origen / Destino
                    
                    console.log("jsonValues2",jsonValues2);
                    
                    let json = jsonValues2[0];
                    let locationId   = this.parseJsonSoap(json,'ns1:locationIdentity','ns1:locationID','_text');  // Id Ubicación
                    let locationType = this.parseJsonSoap(json,'ns1:locationIdentity','ns1:locationType','_text');  // Tipo de Ubicación
                    
                    console.log("jsonValues2 - documento.origin_locationID,  documento.destination_locationId, documento.origenEsDestino",documento.origin_locationID,  documento.destination_locationId, documento.origenEsDestino);
                    console.log("jsonValues2 - locationId",locationId);
                    
                    if(documento.origin_locationID == locationId) {
                        // Ubicación Origen
                        let documentoUbicacion       = this.setDocumentoUbicacion(json, null);
                        
                        console.log("jsonValues2 origen documentoUbicacion",documentoUbicacion);
                        documento.ubicacionOrigenKN  = this.fn.setearKN(documentoUbicacion);
                        documento.origin_Documento   = {...documentoUbicacion};

                        datos.push({
                            operacion        : 'importar',
                            nombreColeccion  : 'Ubicaciones',
                            documento        : documentoUbicacion,
                            incluyeSettings  : true     
                        });
                        
                        // Parada (Ubicación Origen)
                        let documentoParada = this.setDocumentoParada(json , documento, documentoUbicacion, null, null);                        
                        documentoParada.key = documento.key + '-0';
                        documentoParada.orden = 0;

                        documentoParada.fechaHoraInicioPlaneada       = documento.fechaHoraInicioPlaneada;
                        documentoParada.fechaHoraFinalizacionPlaneada = documento.fechaHoraSalidaPlaneada;
                        
                        documentoParada.tipoParada=null;
                        if(locationType == 'DPT')  documentoParada.tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:false };
                        if(locationType == 'SIT')  documentoParada.tipoParada = { key : 'Parada', nombre: 'tipoParada.parada', entregaMercaderia:true };
                        
                        console.log("jsonValues2 ORIGEN insertado",documentoParada);
                        console.log("jsonValues2 ORIGEN documentoUbicacion",documentoUbicacion);
                        
                        datos.push({
                            operacion        : 'importar',
                            nombreColeccion  : 'RutasParadas',
                            documento        : documentoParada,
                            incluyeSettings  : true     
                        });
                        
                        if(documento.origenEsDestino || documento.origin_locationID == documento.destination_locationId) {
                            // Ubicación Destino
                            documento.ubicacionDestinoKN    = documento.ubicacionOrigenKN;
                            documento.destination_Documento = documento.origin_Documento;
                            
                            console.log("ubicacion destino",documentoUbicacion);
                            
                            // Parada (Ubicación Destino)
                            let documentoParadaDestino = {...documentoParada};                            
                            documentoParadaDestino.key = documento.key + '-999';
                            documentoParadaDestino.orden = 999;

                            documentoParadaDestino.fechaHoraInicioPlaneada       = documento.fechaHoraArriboPlaneada;
                            documentoParadaDestino.fechaHoraFinalizacionPlaneada = documento.fechaHoraFinalizacionPlaneada;

                            if(locationType == 'DPT')  documentoParadaDestino.tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:false };
                            if(locationType == 'SIT')  documentoParadaDestino.tipoParada = { key : 'Parada', nombre: 'tipoParada.parada', entregaMercaderia:true };
                                
                            console.log("sequenceNumber", 999);
                            
                            console.log("jsonValues2 DESTINO (idem ORIGEN) insertado",documentoParada);
                            
                            datos.push({
                                operacion        : 'importar',
                                nombreColeccion  : 'RutasParadas',
                                documento        : documentoParadaDestino,
                                incluyeSettings  : true     
                            });
                            
                            indexUltimaParada = datos.length-1;
                        }
                        
                    } else if(documento.destination_locationId == locationId) {
                        
                        // Ubicación Destino                        
                        let documentoUbicacion          = this.setDocumentoUbicacion(json, null);                                            
                            
                        documento.ubicacionDestinoKN    = this.fn.setearKN(documentoUbicacion);
                        documento.destination_Documento = {...documentoUbicacion};
                        
                        console.log("jsonValues2 destino documentoUbicacion",documentoUbicacion);
                        
                        datos.push({
                            operacion        : 'importar',
                            nombreColeccion  : 'Ubicaciones',
                            documento        : documentoUbicacion,
                            incluyeSettings  : true     
                        });

                        // Parada (Ubicación Destino)                        
                        let documentoParada = this.setDocumentoParada(json, documento, documentoUbicacion, null, null);
                        documentoParada.key = documento.key + '-999';
                        documentoParada.orden = 999;

                        documentoParada.fechaHoraInicioPlaneada       = documento.fechaHoraArriboPlaneada;
                        documentoParada.fechaHoraFinalizacionPlaneada = documento.fechaHoraFinalizacionPlaneada;

                        if(locationType == 'DPT')  documentoParada.tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:false };
                        if(locationType == 'SIT')  documentoParada.tipoParada = { key : 'Parada', nombre: 'tipoParada.parada', entregaMercaderia:true };

                        console.log("jsonValues2 DESTINO insertado",documentoParada);
                        
                        datos.push({
                            operacion        : 'importar',
                            nombreColeccion  : 'RutasParadas',
                            documento        : documentoParada,
                            incluyeSettings  : true     
                        });
                        
                        indexUltimaParada = datos.length -1;
                        
                    }    
                    
                    console.log("fin jsonvalue2");                    
                    
                }  // fin if(jsonValues2) (Soap Uicación Origen y Ubicación Destino)  
                
                if(jsonValues3) { // Vehículos (RetrieveEquipmentByCriteriaResponse)
                    
                    console.log("jsonValues3", jsonValues3);
                    for(let j=0; j<jsonValues3.length; j++) {
                        let json=jsonValues3[j];  
                        
                        let codigo:string    = this.parseJsonSoap(json,'ns1:equipmentIdentity','ns1:equipmentID','_text');
                        let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
                        let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;

                        let tipoVehiculoKey    = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + this.parseJsonSoap(json,'ns1:equipmentIdentity','ns1:equipmentTypeID','_text');
                        let tipoVehiculoNombre = this.fn.getAtributoFromListado( this.listadoSoapTiposVehiculos, tipoVehiculoKey, 'key', 'nombre');
                        
                        let documentoVehiculo = {
                            key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + this.parseJsonSoap(json,'ns1:equipmentIdentity','ns1:equipmentID','_text'),
                            codigo            : codigo,
                            nombre            : nombre,
                            patente           : null,
                            tipoVehiculoKN    : {
                                key    : tipoVehiculoKey,
                                nombre : tipoVehiculoNombre
                            },    
                            organizacionKNAI  : this.organizacionSoap,
                        }
                        
                        let documentoRutasVehiculos = {
                            key                 : documento.key + '-'+documentoVehiculo.key,
                            keyRuta             : documento.key,
                            vehiculo            : documentoVehiculo,
                            principal           : true,
                            usuarioKANE         : this.fn.setearKANE(this.organizacionSoap.usuario)
                        }
                        
                        datos.push({
                            operacion        : 'importar',
                            nombreColeccion  : 'Vehiculos',
                            documento        : documentoVehiculo,
                            incluyeSettings  : true     
                        }); 
                    
                        datos.push({
                            operacion        : 'importar',
                            nombreColeccion  : 'RutasVehiculos',
                            documento        : documentoRutasVehiculos,
                            incluyeSettings  : true     
                        }); 
                        
                        if(tipoVehiculoKey) vecTiposVehiculos[tipoVehiculoKey]=tipoVehiculoKey;
                        
                    } // fin for
                    
                    console.log("fin jsonvalue3");
                    
                } // fin jsonValue3
                
            }    

            if(jsonValues1_Ok) { // Rutas (RetrieveRoutingRoutesByCriteriaResponse)  // Paradas
                console.log("jsonValues1",jsonValues1_Ok);
                
                for(let k=0; k<jsonValues1_Ok.length; k++) {  // siempre trae de existir un array de 1 posición con la ruta
                    let json = jsonValues1_Ok[k];
                
                    let vecParadasJson= this.parseJsonSoap(json,'ns1:stops');
                    console.log("vecParadasJson",vecParadasJson);
                    for(let j=0; j<vecParadasJson.length;j++) {
                        let jsonParada = vecParadasJson[j];
                        
                        let nombreParada = this.parseJsonSoap(jsonParada,'ns1:locationName','_text');
                        
                        let documentoUbicacion = this.setDocumentoUbicacion(jsonParada, nombreParada);
                        
                        let documentoParada = this.setDocumentoParada(jsonParada, documento, documentoUbicacion, vecParadasJson, j);
                        
                        documentoUbicacion = {...documentoParada.ubicacion};
                        
                        if(documentoParada!=null) {   // Por ahora los ignoro a los tipos de paradas no resueltos por setDocumentoParada()

                            datos.push({
                                operacion        : 'importar',
                                nombreColeccion  : 'RutasParadas',
                                documento        : documentoParada,
                                incluyeSettings  : true     
                            });

                            if(documentoUbicacion) {
                                    datos.push({
                                        operacion        : 'importar',
                                        nombreColeccion  : 'Ubicaciones',
                                        documento        : documentoUbicacion,
                                        incluyeSettings  : true     
                                    });                                    
                            }
                              
                            if(documentoUbicacion && documentoUbicacion.tipoUbicacionKN) {
                                vecTiposUbicacion[documentoUbicacion.tipoUbicacionKN.key]=documentoUbicacion.tipoUbicacionKN.key;
                            }    
                            if(documentoUbicacion && documentoUbicacion.tipoCuentaKN) {
                                vecTiposCuenta[documentoUbicacion.tipoCuentaKN.key]=documentoUbicacion.tipoCuentaKN.key;
                            }   
                                  
                        }
                        
                        
                    } // fin for paradas
                    
                } // fin for k (1 ruta)    
                
                console.log("fin jsonvalue1");
                    
            } // fin if(jsonValues1) (Soap Ruta con Paradas)

            // Actualizo Orden de Paradas que quedaron con orden=-1 (Descansos, Escalas, Esperas, etc)
            let ultimoOrden=0;
            for(let i=0; i<datos.length; i++) {
                if(datos[i].nombreColeccion=='RutasParadas' && datos[i].documento.orden!=999) {
                    let tipoParadaKey = this.fn.mostrarKN(datos[i].documento.tipoParada,'key');
                    if(['Espera','Descanso','Escala-Cliente','Escala-Hotel','Deposito'].indexOf(tipoParadaKey)!=-1) {
                        datos[i].documento.orden = ultimoOrden + 0.1; 
                        datos[i].documento.key = datos[i].documento.keyRuta+'-'+datos[i].documento.orden.toString();                    
                    } else {
                        datos[i].documento.key = datos[i].documento.keyRuta+'-'+datos[i].documento.orden.toString();                        
                        ultimoOrden=datos[i].documento.orden;                        
                    }   
                }
            }
            ultimoOrden = Math.trunc(ultimoOrden);
            
            // Actualizo Orden del Ultima Parada (Oriden o Destino indicado en la Ruta)
            if(indexUltimaParada) {
                // console.log("indexUltimaParada,ordenUltimaParada, datos",indexUltimaParada,ultimoOrden,datos);
                datos[indexUltimaParada]['documento']['orden'] = ultimoOrden+1;                    
                datos[indexUltimaParada]['documento']['key']   = datos[indexUltimaParada]['documento']['keyRuta']+'-'+datos[indexUltimaParada]['documento']['orden'].toString();                    
            }
            
            console.log("vecTiposVehiculos",vecTiposVehiculos);
            console.log("vecTiposCuenta",vecTiposCuenta);
            console.log("vecTiposUbicacion",vecTiposUbicacion);

            // Actualizo Tabla AuxTiposVehículos            
            for(let i=0; i<this.listadoSoapTiposVehiculos.length; i++) {
                
                let tipoVehiculoKey = this.listadoSoapTiposVehiculos[i].key;
                if(vecTiposVehiculos[tipoVehiculoKey]) {                
                    datos.push({
                      operacion        : 'agregar',
                      nombreColeccion  : 'AuxTiposVehiculos',
                      documento        : this.listadoSoapTiposVehiculos[i],
                      incluyeSettings  : true     
                    });
                }
            }

            // Actualizo Tabla AuxTiposUbicacion            
            for(let i=0; i<this.listadoSoapTiposUbicacion.length; i++) {

                let tipoUbicacionKey = this.listadoSoapTiposUbicacion[i].key;
                if(vecTiposUbicacion[tipoUbicacionKey] &&
                    ['SIT','DTP','LD','PER'].indexOf(tipoUbicacionKey)==-1) {
                        
                    datos.push({
                        operacion        : 'agregar',
                        nombreColeccion  : 'AuxTiposUbicacion',
                        documento        : this.listadoSoapTiposUbicacion[i],
                        incluyeSettings  : true     
                      });                                        
                }                
            }

            // Actualizo Tabla AuxTiposCuenta
            for(let i=0; i<this.listadoSoapTiposCuenta.length; i++) {

                let tipoCuentaKey = this.listadoSoapTiposCuenta[i].key;
                if(vecTiposCuenta[tipoCuentaKey]) {                
                    datos.push({
                      operacion        : 'agregar',
                      nombreColeccion  : 'AuxTiposCuenta',
                      documento        : this.listadoSoapTiposCuenta[i],
                      incluyeSettings  : true     
                    });              
                }    
            }
            
            // Genero Push de RutasIntegrantes
            if(documento.integranteChoferKANE) {
                let documentoRutasIntegrantes = {
                    key                 : documento.key + '-'+documento.integranteChoferKANE.key,
                    keyRuta             : documento.key,
                    tipoIntegranteKN    : { key: 'Chofer', nombre: 'Chofer' },
                    usuarioKANE         : documento.integranteChoferKANE
                }
                
                datos.push({
                    operacion        : 'importar',
                    nombreColeccion  : 'RutasIntegrantes',
                    documento        : documentoRutasIntegrantes,
                    incluyeSettings  : true     
                }); 
            }
            
            console.log("rutaKey",documento.key,"datos",datos);
            
            for(let i=0; i<datos.length; i++) {
                 if(datos[i].nombreColeccion=='RutasParadas') {
                     console.log("i",i, "tipoParada", this.fn.mostrarKN(datos[i].documento.tipoParada,'nombre'), "orden", datos[i].documento.orden, datos[i].documento.key);
                    //  if(datos[i].documento['ubicacion']!==undefined) console.log("xx",i,datos[i].documento['ubicacion'].direccion.geoPoint);
                    //  if(datos[i].documento['direccion']!==undefined) console.log("xx",i,datos[i].documento['direccion'].geoPoint);
                 }   
            }
            
            let userKeys = {
                distribuidorKN   : this.distribuidorKN,
                organizacionKNAI : this.fn.setearKNAI(this.organizacionSoap),
                usuarioKANE      : this.usuarioKANE
            }

            console.log("userKeys",userKeys);
            
            //return;
            
            // Borro del documento principal (rutas) los campos agregados de roadNet y de manejo de grilla (ej documento.yaImportado)
            delete documento.yaImportado
            delete documento.importar;
            delete documento.aptoImportar;
            delete documento.errorValidacion;    
            
            delete documento.errorRutaYaIniciada;
            delete documento.errorEmpleadoNoImportadaAntes;
            delete documento.errorVehiculoNoImportadaAntes;
            
            delete documento.internalRouteID;
            delete documento.routeId;
            delete documento.status;
            delete documento.idEmpleado;
            delete documento.nombreEmpleado;
            delete documento.idVehiculo;
            delete documento.nombreVehiculo;
            
            delete documento.origin_locationID;
            delete documento.origin_locationType;
            delete documento.origin_Documento;
            
            delete documento.destination_locationId;
            delete documento.destination_locationType;
            delete documento.destination_Documento;
            
            this.bdService.updateColeccionBatch(userKeys, datos)
              .then((resultado:any)=>{
                  console.log("resultado",resultado);
                  
                  // Marco en listadoPrincipal ya importados y agrego los importados al vecYaImportados, y hago upload del archivo
                  this.onPostImportacion('rutas',this.idSesion);                  
                  
                  this.desSeleccionarTodos();
                  
                  this.spinner.hide();
                 
              }).catch((error:any)=>{
                  console.log("resultado",error);
                  this.spinner.hide();
                  alert( this.translate.instant('mensajeSoap.seProdujoUnErrorEnlaImportacion') );
            });  
              
  } // fin funcion grabarRutaYParadas  

  
  setDocumentoParada(json, documento, documentoUbicacion, vecParadasJson, indexParada) {
    // console.log("setDocumentoParada indexParada, json",indexParada, json);  
    // console.log("setDocumentoParada vecParadasJson",vecParadasJson);  

    let stopIx = null;
    let sequenceNumber=null;
    let keyTipoParadaRoadNet=null;
    
    if(indexParada!=null) {  // Se llamó desde el For de Paradas
        stopIx = parseInt( this.parseJsonSoap(json,'ns1:stppIx','_text') );  // Número de Secuencia de la Parada (le estaba sumando 1, se lo quité)
        sequenceNumber = parseInt( this.parseJsonSoap(json,'ns1:sequenceNumber','_text') ) ;  // Número de Secuencia, +1 le estaba sumando 1, se lo quité 
        keyTipoParadaRoadNet = this.parseJsonSoap(json,'ns1:stopType','_text');  // Tipo de Parada            
        
    } else {  // Se llamo cuando se resuelve la parada inicial o final
        keyTipoParadaRoadNet='stpStop';
        if(this.fn.mostrarKN(documentoUbicacion.tipoParada,'key')=='Depósito')          keyTipoParadaRoadNet='DPT';
        if(this.fn.mostrarKN(documentoUbicacion.tipoParada,'key')=='Parada')            keyTipoParadaRoadNet='stpStop';
        if(this.fn.mostrarKN(documentoUbicacion.tipoParada,'key')=='Espera')            keyTipoParadaRoadNet='stpUnpaidWait';
        if(this.fn.mostrarKN(documentoUbicacion.tipoParada,'key')=='Escala-Cliente')    keyTipoParadaRoadNet='stpUnpaidOvernight';
        if(this.fn.mostrarKN(documentoUbicacion.tipoParada,'key')=='Escala-Hotel')      keyTipoParadaRoadNet='stpUnpaidOvernight';
        if(this.fn.mostrarKN(documentoUbicacion.tipoParada,'key')=='Descanso')          keyTipoParadaRoadNet='stpUnpaidBreak';        
    }
    //console.log("sequenceNumber",sequenceNumber);
    
    // Obteno datos de Parada Anterior
    let documentoUbicacionAnterior = null;  
    if(indexParada!=null && indexParada > 0) {
        let jsonParada = vecParadasJson[indexParada-1];
        let nombreParada = this.parseJsonSoap(jsonParada,'ns1:locationName','_text');
        documentoUbicacionAnterior = this.setDocumentoUbicacion(jsonParada, nombreParada);
        // console.log(indexParada, "documento.origin_Documento", documento.origin_Documento)
        // console.log("documentoUbicacionAnterior", documentoUbicacionAnterior)
        
    } else {
        documentoUbicacionAnterior = {...documento.origin_Documento}
        // console.log(indexParada, "documento.origin_Documento", documento.origin_Documento)
        // console.log("documentoUbicacionAnterior", documentoUbicacionAnterior)        
    }   

    // Obteno datos de Parada Posterior
    let documentoUbicacionPosterior = null; 
    if(indexParada!=null && indexParada < vecParadasJson.length-1) {
        let jsonParada = vecParadasJson[indexParada+1];
        let nombreParada = this.parseJsonSoap(jsonParada,'ns1:locationName','_text');            
        documentoUbicacionPosterior = this.setDocumentoUbicacion(jsonParada, nombreParada);

        // console.log(indexParada, "setDocumentoUbicacion posterior json",jsonParada);            
        // console.log("setDocumentoUbicacion posterior documentoUbicacionPosterior",documentoUbicacionPosterior);    
    
    } else {
        if(documento.destination_Documento != null) {
            documentoUbicacionPosterior = {...documento.destination_Documento};
        }
        // console.log(indexParada, "documento.destination_Documento", documento.destination_Documento)
        // console.log("documentoUbicacionPosterior", documentoUbicacionPosterior)
    }    
    
    // ------ tipoParada --------------
    let tipoParada=null;
    let ubicacionAsociada=null;  // null (no tiene), 'Parada', 'ParadaAnterior', 'ParadaPosterior', ParadaAnterior/Otra
    
    // Depósito
    if(keyTipoParadaRoadNet == 'DPT')               { ubicacionAsociada='Parada'; tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:true } }; 

    // Depósito
    if(keyTipoParadaRoadNet == 'stpDepot')          { ubicacionAsociada='Parada'; tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:true } }; 
    
    // Parada de Carga de Mercadería
    if(keyTipoParadaRoadNet == 'stpLoadStop')       { ubicacionAsociada='Parada'; tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:true } }; 
    
    // Depósito a mitad de ruta
    if(keyTipoParadaRoadNet == 'stpMidRouteSource') { ubicacionAsociada='Parada'; tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:false } };

    // Punto de Encuentro de Carga
    if(keyTipoParadaRoadNet == 'stpLoadMeetPoint')  { ubicacionAsociada='Parada'; tipoParada = { key : 'Deposito', nombre: 'tipoParada.deposito', entregaMercaderia:false } };
    
    
    // Parada
    if(keyTipoParadaRoadNet == 'stpStop')           { ubicacionAsociada='Parada'; tipoParada = { key : 'Parada', nombre: 'tipoParada.parada', entregaMercaderia:true } }; 

    // Parada de Origen
    if(keyTipoParadaRoadNet == 'stpOrigin')         { ubicacionAsociada='Parada'; tipoParada = { key : 'Parada', nombre: 'tipoParada.parada', entregaMercaderia:true } }; 

    // Parada de Destino
    if(keyTipoParadaRoadNet == 'stpDestination')    { ubicacionAsociada='Parada'; tipoParada = { key : 'Parada', nombre: 'tipoParada.parada', entregaMercaderia:true } }; 
    
    // Descanso (Pagado y No Pagado) - Coordenadas de la parada anterior
    if(keyTipoParadaRoadNet == 'stpUnpaidBreak')    { ubicacionAsociada='ParadaAnterior'; tipoParada = { key : 'Descanso', nombre: 'tipoParada.descanso', entregaMercaderia:false } };    
    if(keyTipoParadaRoadNet == 'StpPaidBreak')      { ubicacionAsociada='ParadaAnterior'; tipoParada = { key : 'Descanso', nombre: 'tipoParada.descanso', entregaMercaderia:false } };
    
    // Escala   (Pagado y No Pagado) - Coordenadas de la parada anterior o en otra Ubicación (Ej. Hotel), por eso hay que verificar si vienen coordenadas
    if(keyTipoParadaRoadNet == 'StpPaidLayover')    { ubicacionAsociada='ParadaAnterior/Otra'; tipoParada = { key : 'Descanso', nombre: 'tipoParada.descanso',     entregaMercaderia:false } };
    if(keyTipoParadaRoadNet == 'StpUnpaidLayover')  { ubicacionAsociada='ParadaAnterior/Otra'; tipoParada = { key : 'Descanso', nombre: 'tipoParada.descanso',     entregaMercaderia:false } };

    // ????????????? (no viene Layover, viene Overnight)
    if(keyTipoParadaRoadNet == 'stpPaidOvernight')  { ubicacionAsociada='ParadaAnterior/Otra'; tipoParada = { key : 'Escala-Cliente', nombre: 'tipoParada.escalaEnCliente',     entregaMercaderia:false } };
    if(keyTipoParadaRoadNet == 'stpUnpaidOvernight'){ ubicacionAsociada='ParadaAnterior/Otra'; tipoParada = { key : 'Escala-Cliente', nombre: 'tipoParada.escalaEnCliente',     entregaMercaderia:false } };
    
    // Espera   (Pagado y No Pagado) - Coordenadas de la próxima parada - Espera a que abra el comercio
    if(keyTipoParadaRoadNet == 'stpPaidWait')       { ubicacionAsociada='ParadaPosterior'; tipoParada = { key : 'Espera', nombre: 'tipoParada.espera', entregaMercaderia:false } };
    if(keyTipoParadaRoadNet == 'stpUnpaidWait')     { ubicacionAsociada='ParadaPosterior'; tipoParada = { key : 'Espera', nombre: 'tipoParada.espera', entregaMercaderia:false } };
    
    // Pre Ruta (Parada previa a ruta) - Espera luego del depósito antes de ir al primer cliente ???)
    if(keyTipoParadaRoadNet == 'stpPreRoute')       { ubicacionAsociada='ParadaAnterior'; tipoParada = { key : 'Espera', nombre: 'tipoParada.espera', entregaMercaderia:false } };

    // Pre Ruta (Parada post ruta) - Espera antes de llegar al destino final ???)
    if(keyTipoParadaRoadNet == 'stpPostRoute')      { ubicacionAsociada='ParadaAnterior'; tipoParada = { key : 'Espera', nombre: 'tipoParada.espera', entregaMercaderia:false } };

    // let ubicacionAsociada=null;  // null (no tiene), 'Parada', 'ParadaAnterior', 'ParadaPostarior', ParadaAnterior/Otra
    console.log(indexParada, "tipoParada.key",this.fn.mostrarKN(tipoParada,'key'),"ubicacionAsociada",ubicacionAsociada);
    let documentoUbicacion_Ok = null;
    if(ubicacionAsociada=='Parada') {
        documentoUbicacion_Ok = {...documentoUbicacion};
        
    } else if(ubicacionAsociada=='ParadaAnterior' && documentoUbicacionAnterior) {
        documentoUbicacion_Ok = {...documentoUbicacionAnterior};

    } else if(ubicacionAsociada=='ParadaPosterior' && documentoUbicacionPosterior) {
        documentoUbicacion_Ok = {...documentoUbicacionPosterior};

    } else if(ubicacionAsociada=='ParadaAnterior/Otra') {
        if(documentoUbicacion) {
            documentoUbicacion_Ok = {...documentoUbicacion};
            tipoParada = { key : 'Escala-Hotel', nombre: 'tipoParada.escalaEnHotel', entregaMercaderia:false };
        } else {
            documentoUbicacion_Ok = {...documentoUbicacionAnterior};
            tipoParada = { key : 'Escala-Cliente', nombre: 'tipoParada.escalaEnHotel', entregaMercaderia:false };
        }        
    } else {
        console.warn("ERROR documentoUbicacion_Ok","??????????????");
    }
    // console.log("documentoUbicacion_Ok",documentoUbicacion_Ok);    
    
    let fechaHoraInicioPlaneada=null;
    let auxFechaHoraInicioPlaneada = this.parseJsonSoap(json,'ns1:arrival','_text');
    if(auxFechaHoraInicioPlaneada) {
        fechaHoraInicioPlaneada = new Date(auxFechaHoraInicioPlaneada);
    }

    let fechaHoraFinalizacionPlaneada=null;
    if(fechaHoraInicioPlaneada && documentoUbicacion && documentoUbicacion.tiempoServicio) {
        let segundosServicio = documentoUbicacion.tiempoServicio.hour * 3600 +
                               documentoUbicacion.tiempoServicio.minute * 60 +
                               documentoUbicacion.tiempoServicio.second 
        fechaHoraFinalizacionPlaneada = this.fn.addSegundosToDatetime(fechaHoraInicioPlaneada, segundosServicio);    
    }
    
    let unidad1Entegar = this.parseJsonSoap(json,'ns1:deliveryQuantity','ns1:size1','_text');
    let unidad2Entegar = this.parseJsonSoap(json,'ns1:deliveryQuantity','ns1:size2','_text');
    let unidad3Entegar = this.parseJsonSoap(json,'ns1:deliveryQuantity','ns1:size3','_text');
    let unidadesMedidaEntregarPlanificadas = {
        unidad1 : unidad1Entegar ? parseFloat(unidad1Entegar) : null,
        unidad2 : unidad2Entegar ? parseFloat(unidad2Entegar) : null,
        unidad3 : unidad3Entegar ? parseFloat(unidad3Entegar) : null,
    }
    
    let unidad1Retirar = this.parseJsonSoap(json,'ns1:pickupQuantity','ns1:size1','_text');
    let unidad2Retirar = this.parseJsonSoap(json,'ns1:pickupQuantity','ns1:size2','_text');
    let unidad3Retirar = this.parseJsonSoap(json,'ns1:pickupQuantity','ns1:size3','_text');    
    let unidadesMedidaRetirarPlanificadas = {
        unidad1 : unidad1Retirar ? parseFloat(unidad1Retirar) : null,
        unidad2 : unidad2Retirar ? parseFloat(unidad2Retirar) : null,
        unidad3 : unidad3Retirar ? parseFloat(unidad3Retirar) : null,
    }
            
    let documentoParada = {
          key                                   : documento.key + '-' + sequenceNumber,
          keyRuta                               : documento.key,
          codigoPedido                          : null,
          tipoParada                            : tipoParada,
          ubicacion                             : documentoUbicacion_Ok,

          geoPointReal                          : null,
          orden                                 : sequenceNumber,
          estadoParadaKN                        : ESTADOS_PARADAS['ParadaPendiente'],
        //   estadoParadaKN                        : { key: 'ParadaPendiente', nombre: 'estadoParada.paradaPendiente' },
        
          unidadesMedidaEntregarPlanificadas    : unidadesMedidaEntregarPlanificadas,
          unidadesMedidaEntregarReales          : null,
        
          unidadesMedidaRetirarPlanificadas     : unidadesMedidaRetirarPlanificadas,
          unidadesMedidaRetirarReales           : null,
        
          instruccionesParaConductor            : null,
          comentariosDelConductor               : null,
        
          fechaHoraInicioPlaneada               : fechaHoraInicioPlaneada,
          fechaHoraFinalizacionPlaneada         : fechaHoraFinalizacionPlaneada,
        
          fechaHoraInicioReal                   : null,
          fechaHoraFinalizacionReal             : null,
          
          distribuidorKN                        : this.fn.setearKN(this.organizacionSoap.distribuidor),
          organizacionKNAI                      : this.fn.setearKNAI( this.organizacionSoap)
                          
    };
    
    if(documento.orden==null) {
        documento=null;
    }
    
    return documentoParada;
  }
  
}