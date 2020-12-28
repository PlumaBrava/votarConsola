import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './monitor-rutas.config';

import { MapsAPILoader }          from '@agm/core';

import { HereService }        from '@maq-servicios/here/here.service';
import { AppSettingsService } from '@settings/app.settings';
import { ResumenRutaService } from './../resumen-ruta/resumen-ruta.service';

import { formatNumber } from '@angular/common'

import { GeoPoint }     from '@maq-models/geopoint/geopoint.model';
import { Direccion }    from '@maq-models/direccion/direccion.model';

// Mocks de Rutas
import { ESTADOS_PARADAS,ESTADOS_RUTA }                 from '@proyecto/mocks/rutas_y_paradas/rutasParadas.mocks';


import firebase from 'firebase/app';
import 'firebase/firestore';

import { environment } from '@environments/environment';

declare let $: any;
declare let jQuery: any;

declare var H: any;  

@Component({
  selector: 'app-rutas',
  templateUrl: './monitor-rutas.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './monitor-rutas.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class MonitorRutasComponent extends PageGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef,
               public hereService: HereService,
               public appSettings:AppSettingsService,
               public resumenRutaService: ResumenRutaService) {    
                   
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'Rutas'));
  
  public subscripcionSucursales:any=null;
  public subscripcionAreasNegocio:any=null;
  public listadoSucursales:any=[];
  public listadoAreasNegocio:any=[];

  public subscripcionRutaVehiculos:any=null;
  public subscripcionRutaIntegrantes:any=null;
  public subscripcionRutaParadas:any=null;
  public subscripcionRutaTrackeo:any=null;
  public subscripcionRutasMonitorEquipos:any=null;
  
  public listadoRutaIntegrantes:any[]=[];
  public listadoRutaVehiculos:any[]=[];
  public listadoRutaParadas:any[]=[];
  public listadoRutaTrackeo:any=[];
  public listadoRutasMonitorCelulares:any=[];

  public componenteIntegrantesAccionInicial:string='listado';
  public componenteIntegrantesDocumentoInicial:string=null;

  public componenteVehiculosAccionInicial:string='listado';
  public componenteVehiculosDocumentoInicial:string=null;

  public componenteParadasAccionInicial:string='listado';
  public componenteParadasDocumentoInicial:string=null;
  
  // Variables Here
  public map                        : any=null;
  public viewBounds                 : any;
  public geocoderRequest            : any;
  public zoom                       : number = 14;
  public ubicacion                  : Direccion;
  public dif                        : string = Math.floor((99999) * Math.random()).toString();
  public heightMapa                 : string;           
  public heightListado              : string;           
  public mapReadyParadas            : boolean=false;
  public mapReadyTrackeo            : boolean=false;
  public layerEnUso                 : any=null;
  public clusteredDataProvider      : any=null;
  public vecDataPoints              : any[]=[];
      
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Rutas'));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });
     
     // Escondo Menú Izquierdo
     let self=this;
     setTimeout(function () {
        self.appSettings.settings2.panel.showMenu = false;      
     }, 500);                   
     
     // Calculo Ancho de Mapa y Listado
     let screenHeigth   = this.appSettings.settings2.equipo.screenHeigth;
     this.heightMapa    = (screenHeigth - 175 -50).toString() + 'px';
     this.heightListado = (screenHeigth - 175 -50).toString() + 'px';
     
     log(...values("valores","screenHeigth:",screenHeigth,"heightMapa:",this.heightMapa));

     
     super.ngOnInit()
     
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    
    
    // log(...values('funcionComponente','ngOnDestroy monitor-rutas'));
  }  

  configuracionComponente() {
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
        
        if(this.tipoPerfilUsuario=='Organizacion' && this.organizacionKNAI) {
          argumentos['grillaWhereArray']=[{ 
              key:      'organizacionKNAI.key', 
              operador: '==', 
              value:    this.organizacionKNAI.key
          }];                    
        }  
        if(this.tipoPerfilUsuario=='Distribuidor' && this.distribuidorKN) {
            argumentos['grillaWhereArray']=[{ 
                key:      'distribuidorKN.key', 
                operador: '==', 
                value:    this.distribuidorKN.key
            }];                    
        } else {
            argumentos['grillaWhereArray']=[];    
        }

        argumentos['grillaWhereArray'].push({ 
            key: 'mostrarEnMonitor', 
            operador: '==',
            value: true
        })
        
        // argumentos['grillaWhereArray'].push({ 
        //     key: 'rutaKey', 
        //     operador: 'in',
        //     value: ['PendienteEjecucion','EnOrigen', 'EnReparto', 'LlegadaDestino']
        // })
      
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
  
  onResultGetSubscripcionPrincipal() {
      log(...values('funcionComponente','componente.onResultGetSubscripcionPrincipal'));
     
      // Acciones especificas sobre ListadoPrincipal del Componente
      
      // Filtro las Rutas de Sucursales / Areas de Negocio no habilitadas para el Usuario
      let quitoRutas=false;
      if(this.tipoPerfilUsuario=='Organizacion') {
           for(let i=0; i<this.listadoPrincipal.length;i++) {          
               let ruta=this.listadoPrincipal[i];
               let sucursalAreaNegocio = this.fn.mostrarKN(ruta.sucursalKN,'key') + '@@@' + this.fn.mostrarKN(ruta.areaNegocioKN,'key');
               let habilitada=false;
               for(let j=0; j<this.usuario.sucursalesAreasNegocio.length;j++) {
                    let sucursalAreaNegocioUsuario = this.usuario.sucursalesAreasNegocio[j];
                    if(sucursalAreaNegocio==sucursalAreaNegocioUsuario) {
                        habilitada=true;                        
                        break;
                    }
               } 
               if(!habilitada) {
                   this.listadoPrincipal.splice(i,1);
                   quitoRutas=true;
               }
           }    
           if(quitoRutas) {
               console.log("this.listadoPrincipal",this.listadoPrincipal);
           }
      }     
      
      // Creo Array de Colores      
      for(let i=0; i<this.listadoPrincipal.length;i++) {          
           this.listadoPrincipal[i].coloresParadas=[]; 
           for(let j=0; j<this.listadoPrincipal[i].estadosParadas.length;j++) {          
                let estadoParada=this.listadoPrincipal[i].estadosParadas[j];
                
                let color='gray';
                if(estadoParada=='ParadaPendiente')         color='blue';
                if(estadoParada=='ParadaEnCurso')           color='orange';
                if(estadoParada=='EntregaCompleta')         color='green';
                if(estadoParada=='EntregaParcial')          color='greenyellow';
                if(estadoParada=='Cancelada')               color='red';
                if(estadoParada=='Rechazada')               color='rgb(128, 30, 0)';
                if(estadoParada=='Rreplanificada')          color='brown';
                if(estadoParada=='IndicacionesSolicitadas') color='rgb(13, 82, 128)';
                if(estadoParada=='ParadaRealizada')         color='green';


                    // "paradaPendiente"           : "Pendiente",
                    // "paradaEnCurso"             : "En Curso",
                    // "entregaCompleta"           : "Completa",
                    // "entregaParcial"            : "Entrega Parcial",
                    // "cancelada"                 : "Cancelada",
                    // "rechazada"                 : "Rechazada",
                    // "replanificada"             : "Replanificada",
                    // "indicacionesSolicitadas"   : "Indicaciones Solicitadas",
                    // "paradaRealizada"           : "Parada Realizada",

                
                this.listadoPrincipal[i].coloresParadas.push( color );                
           }           
      }    
      console.log("this.listadoPrincipal",this.listadoPrincipal);

      
    // GET ULTIMO ESTADO de las Rutas del Monitor (GeoPoint y Estado del Equipo)
    this.listadoRutasMonitorCelulares=[];
    if(this.subscripcionRutasMonitorEquipos) this.subscripcionRutasMonitorEquipos.unsubscribe();
    this.subscripcionRutasMonitorEquipos=this.bdService	
        .getBDSubscripcion({
            nombreColeccion  : 'RutasMonitorCelulares',
            where            : [],  // falta filtrar x distribuidor,organizacion,sucursal,area de negocio de acuerdo al usuario
            orderBy          : [],
            limit            : 100,
            paginado         : 'primera',
            organizacionKNAI : this.organizacionKNAI,
            usuarioKANE      : this.usuarioKANE                
        }).subscribe((data:any)=>{
            log(...values('funcionEnd','bdService.getBDSubscripcion RutasTrackeo (Ultimo)')); 
            log(...values('valores','subscripcion RutasTrackeo (Ultimo) data:',data)); 
            this.listadoRutasMonitorCelulares=[];       
            for(let j=0; j<data.length; j++) {
                  let documento=data[j];
                  documento=this.fn.corrigeTimestampDocumento(documento);  
                  let indexListadoPrincipal = this.getIndexListadoPrincipal(documento.rutaKey);
                  if(indexListadoPrincipal) { 
                        documento.indexListadoPrincipal = indexListadoPrincipal;
                        this.listadoRutasMonitorCelulares.push(documento);        
                  }
                  
            }             
            log(...values("valores","listadoRutasMonitorCelulares:",this.listadoRutasMonitorCelulares));
            
            this.mostrarMapaRutas();
      
        },(error:any)=>{
            log(...values("error al obtener RutasTrackeo",error));
        });         
      
      super.onResultGetSubscripcionPrincipal();
  }  
  
  getIndexListadoPrincipal(rutaKey) {
      for(let i=0; i<this.listadoPrincipal.length;i++) {
          if(this.listadoPrincipal[i].key == rutaKey) {
              return (i+1);
          }
      }
      return null;
  }

  getDocumentolistadoRutasMonitorCelulares(rutaKey) {
    for(let i=0; i<this.listadoRutasMonitorCelulares.length;i++) {
        if(this.listadoRutasMonitorCelulares[i].rutaKey == rutaKey) {
            return this.listadoRutasMonitorCelulares[i];
        }
    }
    return null;
  }

  onResultGetSubscripcionSecundarias() {
    log(...values('funcionComponente','pageGenerica.nResultGetSubscripcionSecundarias'));
    
    super.onResultGetSubscripcionSecundarias();    
  }    
  
  abrirFormulario(documento) {
    log(...values('funcionComponente','abrirFormulario Componente', documento));

    super.abrirFormulario(documento);

    // Agregar acá, modificaciones adicionales al this.form

    this.form.get('organizacionKNAI').valueChanges.subscribe((organizacionKNAI:any) => {
        console.log("valueChanges organizacionKNAI");
        this.getListadoSucursales();
    });
    this.getListadoSucursales();

    this.form.get('sucursalKN').valueChanges.subscribe((sucursalKN:any) => {
        this.getListadoAreasNegocio();
    });
    this.getListadoAreasNegocio();
    
    this.listadoRutaVehiculos=[];
    this.listadoRutaIntegrantes=[];
    this.listadoRutaParadas=[];
        
    // GET Vehículos de la Ruta
    if(this.subscripcionRutaVehiculos)   this.subscripcionRutaVehiculos.unsubscribe();
    this.subscripcionRutaVehiculos=this.bdService	
        .getBDSubscripcion({
            nombreColeccion  : 'RutasVehiculos',
            where            : [{key:'keyRuta', operador:'==', value:documento.key},
                                {key:'settings.isBorrado', operador:'==', value:false}],
            orderBy          : [{key:'vehiculo.nombre',ascDesc:'asc'}],
            limit            : 10,
            paginado         : 'primera',
            organizacionKNAI : documento.organizacionKNAI,
            usuarioKANE      : this.usuarioKANE                
        }).subscribe((data:any)=>{
            log(...values('funcionEnd','bdService.getBDSubscripcion RutasVehiculos')); 
            log(...values('valores','subscripcion RutasVehiculos data:',data)); 
            this.listadoRutaVehiculos=[];                                
            for(let j=0; j<data.length; j++) {
              let documento=data[j];
              documento=this.fn.corrigeTimestampDocumento(documento);  
              this.listadoRutaVehiculos.push(documento);
            }             
            log(...values("valores","listadoRutaVehiculos:",this.listadoRutaVehiculos));
        },(error:any)=>{
            log(...values("error al obtener RutasVehiculos",error));
        });         

    // GET Integrantes de la Ruta
    if(this.subscripcionRutaIntegrantes) this.subscripcionRutaIntegrantes.unsubscribe();
    this.subscripcionRutaIntegrantes=this.bdService	
        .getBDSubscripcion({
            nombreColeccion  : 'RutasIntegrantes',
            where            : [{key:'keyRuta', operador:'==', value:documento.key},
                                {key:'settings.isBorrado', operador:'==', value:false}],
            orderBy          : [{key:'usuarioKANE.apellidoNombre',ascDesc:'asc'}],
            limit            : 10,
            paginado         : 'primera',
            organizacionKNAI : documento.organizacionKNAI,
            usuarioKANE      : this.usuarioKANE                
        }).subscribe((data:any)=>{
            log(...values('funcionEnd','bdService.getBDSubscripcion RutasVehiculos')); 
            log(...values('valores','subscripcion RutasIntegrantess data:',data)); 
            this.listadoRutaIntegrantes=[];                
            for(let j=0; j<data.length; j++) {
              let documento=data[j];
              documento=this.fn.corrigeTimestampDocumento(documento);  
              this.listadoRutaIntegrantes.push(documento);
            }             
            log(...values("valores","listadoRutaIntegrantes:",this.listadoRutaIntegrantes));
        },(error:any)=>{
            log(...values("error al obtener RutasIntegrantes",error));
        });         
    
    // GET Paradas de la Ruta
    this.mapReadyParadas=false;
    if(this.subscripcionRutaParadas)     this.subscripcionRutaParadas.unsubscribe();
    this.subscripcionRutaParadas=this.bdService	
        .getBDSubscripcion({
            nombreColeccion  : 'RutasParadas',
            where            : [{key:'keyRuta', operador:'==', value:documento.key},
                                {key:'settings.isBorrado', operador:'==', value:false}],
            orderBy          : [{key:'fechaHoraInicioPlaneada',ascDesc:'asc'}],
            limit            : 1000,
            paginado         : 'primera',
            organizacionKNAI : documento.organizacionKNAI,
            usuarioKANE      : this.usuarioKANE                
        }).subscribe((data:any)=>{
            log(...values('funcionEnd','bdService.getBDSubscripcion RutasParadas')); 
            log(...values('valores','subscripcion RutasParadas data:',data));                 
            
            this.listadoRutaParadas=[];
            for(let j=0; j<data.length; j++) {
                let documento=data[j];
                documento=this.fn.corrigeTimestampDocumento(documento);  
                this.listadoRutaParadas.push(documento);
            }             
            log(...values("valores","listadoRutaParadas",this.listadoRutaParadas));
            
            this.mapReadyParadas=true;
            this.mostrarMapaResumenRuta(documento);

        },(error:any)=>{
            log(...values("error al obtener RutasParadas",error));
        });         

    // GET Ruta Track
    this.mapReadyTrackeo=false;
    if(this.subscripcionRutaTrackeo) this.subscripcionRutaTrackeo.unsubscribe();
    this.subscripcionRutaTrackeo=this.bdService	
        .getBDSubscripcion({
            nombreColeccion  : 'RutasTrackeo',
            where            : [{key:'keyRuta', operador:'==', value:documento.key}],
            orderBy          : [{key:'orden',ascDesc:'asc'}],
            limit            : 300,
            paginado         : 'primera',
            organizacionKNAI : documento.organizacionKNAI,
            usuarioKANE      : this.usuarioKANE                
        }).subscribe((data:any)=>{
            log(...values('funcionEnd','bdService.getBDSubscripcion RutasTrackeo')); 
            log(...values('valores','subscripcion RutasTrackeo data:',data)); 
            this.listadoRutaTrackeo=[];       
            let geoPointAnterior:any=null;         
            for(let j=0; j<data.length; j++) {
                  let documento=data[j];
                  documento=this.fn.corrigeTimestampDocumento(documento);  
                  if(j==0) {
                    this.listadoRutaTrackeo.push(documento);
                    geoPointAnterior=documento.geoPoint;
                  } else {                      
                    let distanciaPuntoAnterior = this.kmDistanciaTrackeoAnterior(geoPointAnterior, data[j].geoPoint);
                    //console.log("distanciaPuntoAnterir",distanciaPuntoAnterior, typeof distanciaPuntoAnterior);
                    if(distanciaPuntoAnterior>0.1) {
                        this.listadoRutaTrackeo.push(documento);    
                        geoPointAnterior=documento.geoPoint;
                    }
                    
                  }              
            }             
            log(...values("valores","listadoRutaTrackeo:",this.listadoRutaTrackeo));
            
            this.mapReadyTrackeo=true;
            this.mostrarMapaResumenRuta(documento);
      
        },(error:any)=>{
            log(...values("error al obtener RutasTrackeo",error));
        });         
        
        
  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Rutas', accion));

    super.setAccionForm(accion);
    //  Estaba Estado PLANIFICADA. Pregunta Juan: que funcion comple. No veo grabar en el formulario
    this.form.get('estadoRutaKN').setValue(ESTADOS_RUTA['NoIniciada']);

    // Agregar acá, modificaciones adicionales al this.form
    if(this.accionForm=='listado') {
        console.log("refreshMapa");
        this.dif=Math.floor((99999) * Math.random()).toString();            
        
        setTimeout (() => {
            
            //this.map.getViewPort().resize(); 
            
            this.mostrarMapaRutas();
                  
        }, 1000);
    
    }
        
  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Rutas.onSubmit'));
    console.log("onSubmit",documento);
    
    // Agregar acá, modificaciones adicionales al this.form
    
    super.onSubmit(documento);
  }  
  
  // Funciones Específicas del Modulo

  getListadoSucursales() {
        let organizacionKNAI:any=this.form.get('organizacionKNAI').value;

        // GET Sucursales
        this.listadoSucursales=[];
        if(organizacionKNAI) {
                if(this.subscripcionSucursales)   this.subscripcionSucursales.unsubscribe();
                this.subscripcionSucursales=this.bdService	
                    .getBDSubscripcion({
                        nombreColeccion  : 'Sucursales',
                        where            : [{key:'organizacionKNAI.key', operador:'==', value:organizacionKNAI.key}],
                        orderBy          : [{key:'nombre',ascDesc:'asc'}],
                        limit            : 100,
                        paginado         : 'primera',
                        organizacionKNAI : organizacionKNAI,
                        usuarioKANE      : this.usuarioKANE                
                    }).subscribe((data:any)=>{
                        log(...values('funcionEnd','bdService.getBDSubscripcion Sucursales')); 
                        log(...values('valores','subscripcion Sucursales data:',data)); 
                        
                        this.subscripcionSucursales.unsubscribe();
                        this.listadoSucursales=[];                        
                        for(let i=0; i<data.length; i++) {
                              let documento=data[i];
                              documento=this.fn.corrigeTimestampDocumento(documento);  
                              // Verifico que el usuario la tenga habilitada
                              if(this.tipoPerfilUsuario=='Organizacion') {
                                   for(let j=0; j<this.usuario.sucursalesAreasNegocio.length;j++) {
                                        let sucursalKey = this.usuario.sucursalesAreasNegocio[j].split('@@@')[0];
                                        if(sucursalKey==documento.key) {
                                            this.listadoSucursales.push(documento);    
                                            break;
                                        }
                                   } 
                              } else {
                                    this.listadoSucursales.push(documento);    
                              }    
                        }             
                        log(...values("valores","listadoSucursales:",this.listadoSucursales));
                        if(this.listadoSucursales.length==1) {
                            this.form.get('sucursalKN').setValue( this.fn.setearKN(this.listadoSucursales[0]) );
                        }
                        
                        this.getListadoAreasNegocio();
 
                    },(error:any)=>{
                        log(...values("error al obtener Sucursales",error));
                    });         
            }            
      
  }

  getListadoAreasNegocio() {
      
        let organizacionKNAI:any=this.form.get('organizacionKNAI').value;
        let sucursalKN:any=this.form.get('sucursalKN').value;
        
        let sucursal=null;
        for(let i=0; i<this.listadoSucursales.length;i++) {
            // console.log(this.listadoSucursales[i].key," == ",this.fn.mostrarKN(sucursalKN,'key'));
            if(this.listadoSucursales[i].key == this.fn.mostrarKN(sucursalKN,'key')) {
                sucursal=this.listadoSucursales[i];
                break;
            }
        } 
        //console.log("sucursal",sucursal);

        // GET AreasNegocio
        this.listadoAreasNegocio=[];
        if(sucursalKN) {
                if(this.subscripcionAreasNegocio)   this.subscripcionAreasNegocio.unsubscribe();
                this.subscripcionAreasNegocio=this.bdService	
                    .getBDSubscripcion({
                        nombreColeccion  : 'AreasNegocio',
                        where            : [{key:'organizacionKNAI.key', operador:'==', value:organizacionKNAI.key}],
                        orderBy          : [{key:'nombre',ascDesc:'asc'}],
                        limit            : 100,
                        paginado         : 'primera',
                        organizacionKNAI : organizacionKNAI,
                        usuarioKANE      : this.usuarioKANE                
                    }).subscribe((data:any)=>{
                        log(...values('funcionEnd','bdService.getBDSubscripcion AreasNegocio')); 
                        log(...values('valores','subscripcion AreasNegocio data:',data)); 
                        
                        this.listadoAreasNegocio=[];                                                        
                        this.subscripcionAreasNegocio.unsubscribe();
                        
                        for(let i=0; i<data.length; i++) {
                              let documento=data[i];
                              documento=this.fn.corrigeTimestampDocumento(documento);  
                              
                              // Verifico que esté entre las definidas para la sucursal
                              let incluidaEnSucursal=false;
                              for(let j=0; sucursal && j<sucursal.areasNegocio.length;j++) {
                                    let sucursakAreaNegocioKey = sucursal.areasNegocio[j].key;
                                    // console.log(i,j, documento.key,"==",sucursakAreaNegocioKey);
                                    if(documento.key==sucursakAreaNegocioKey) {
                                        // console.log("Includad en Sucursal");
                                        incluidaEnSucursal=true;
                                        break;
                                    }
                              } 
                              
                              // Verifico que esté entre las definidas para el usuario la tenga habilitada
                              if(incluidaEnSucursal) {
                                  if(this.tipoPerfilUsuario=='Organizacion') {
                                       for(let j=0; j<this.usuario.sucursalesAreasNegocio.length;j++) {
                                            let areaNegocioKey = this.usuario.sucursalesAreasNegocio[j].split('@@@')[1];
                                            if(areaNegocioKey==documento.key) {
                                                this.listadoAreasNegocio.push(documento);    
                                                break;
                                            }
                                       } 
                                  } else {
                                        this.listadoAreasNegocio.push(documento);    
                                  }     
                              }     
                        }             
                        log(...values("valores","listadoAreasNegocio:",this.listadoAreasNegocio));
                        if(this.listadoAreasNegocio.length==1) {
                            this.form.get('areaNegocioKN').setValue( this.fn.setearKN(this.listadoAreasNegocio[0]) );
                        }
                        
                    },(error:any)=>{
                        log(...values("error al obtener Sucursales",error));
                    });         
            }            
      
  }
  
  resumenRuta(documento:any) {
        this.resumenRutaService.setRuta(documento);
        
        this.router.navigate(['/rutas/resumen/'+documento.codigo+'/'+documento.key]);
  }
  
  kmDistanciaDireccionAnterior(index:number):number {
    if(index>0) {
        let latitud1    = this.listadoRutaParadas[ index-1 ].ubicacion.direccion.geoPoint.latitud;
        let longitud1   = this.listadoRutaParadas[ index-1 ].ubicacion.direccion.geoPoint.longitud;
        let latitud2    = this.listadoRutaParadas[ index ].ubicacion.direccion.geoPoint.latitud;
        let longitud2   = this.listadoRutaParadas[ index ].ubicacion.direccion.geoPoint.longitud;

        let kmDistancia = this.fn.distancia_geopoints( latitud1, longitud1, latitud2, longitud2, "km");  
        return kmDistancia;
    }    
    return 0;

  }

  kmDistanciaTrackeoAnterior(geoPoint1:any, geoPoint2:any):number {
    let latitud1    = geoPoint1.latitud;
    let longitud1   = geoPoint1.longitud;
    let latitud2    = geoPoint2.latitud;
    let longitud2   = geoPoint2.longitud;

    let kmDistancia = this.fn.distancia_geopoints( latitud1, longitud1, latitud2, longitud2, "km");  
    return kmDistancia;

  }
 
  mostrarMapaResumenRuta(ruta:any) {
      
      let listadoRutaParadas = this.fn.copiarArray(this.listadoRutaParadas);
      if(ruta.origenEsDestino) {
            listadoRutaParadas.push(listadoRutaParadas[0]);    
      }     
      if(this.mapReadyTrackeo && this.mapReadyParadas) {
            setTimeout (() => {
                
                this.hereService.drawRuta('mapResumenRuta'+this.dif, listadoRutaParadas, this.listadoRutaTrackeo,
                                         'ubicacion.direccion.geoPoint', this.organizacionKNAI, this.usuarioKANE, 'Rutas');
                  
            }, 1000);
      }      

  }
  
  mostrarUbicacionEnMapa(ruta) {
        console.log("mostrarUbicacionEnMapa ruta",ruta);
        
        let documentoMonitor = this.getDocumentolistadoRutasMonitorCelulares(ruta.key);
        console.log("mostrarUbicacionEnMapa documentoMonitor",documentoMonitor);
        
        let group = new H.map.Group();  

        let svgUbicacion = this.getIconoSvg('svgUbicacion');

        // var svgUbicacion = '<svg width="64" height="64" viewBox="0 0 511.585 511.585" style="enable-background:new 0 0 511.585 511.585;" xmlns="http://www.w3.org/2000/svg"> '+   
        
        //var ubicacionIcon = new H.map.Icon(svgUbicacion);
        var ubicacionIcon = new H.map.Icon(svgUbicacion, {anchor: {x:32, y:32}});
            
        let marker = new H.map.Marker({
            lat: documentoMonitor.geoPoint.latitud,
            lng: documentoMonitor.geoPoint.longitud },
            {icon: ubicacionIcon});
        
        group.addObject(marker);
        this.map.addObject(group);      
        //this.map.setCenter(documentoMonitor.geoPoint.latitud, documentoMonitor.geoPoint.longitud, true);
        
        setTimeout (() => {
            console.log("Hello from setTimeout");
            this.map.removeObject(group);      
            
              
          }, 2000);
            
  }
  
  mostrarMapaRutas() {

    let self=this;
    
    // Si el mapa aún no tiene dirección, obtengo la del navegante

    // Centro de Junín
    let latitudInicial = -34.5882346;
    let longitudInicial = -60.9652609;
    
    // Check whether the environment should use hi-res maps
    var hidpi = ('devicePixelRatio' in window && devicePixelRatio > 1);
    // console.log('jjHere hidpi',hidpi);
		
	// check if the site was loaded via secure connection
	var secure = (location.protocol === 'https:') ? true : false;
    
    // Create a platform object to communicate with the HERE REST APIs
    var platform = new H.service.Platform({
      useCIT    : true,
      apikey    : environment.apis.hereMaps.apiKey,
	  useHTTPS  : secure
    });
    
	// maptypes = platform.createDefaultLayers(hidpi ? 512 : 256, hidpi ? 320 : null),
	var	maptypes = platform.createDefaultLayers({pois: true});
    var geocoder = platform.getGeocodingService();
    
    // console.log('Here platform',platform);
    // console.log('Here maptypes',maptypes);
    // console.log('Here geocoder',geocoder);
 
    let zoom=7;
    
    if(!this.layerEnUso) { 
        // Instantiate a map in the 'map' div, set the base map to normal
        this.map = new H.Map(document.getElementById('mapMonitor'+this.dif), 
          maptypes.vector.normal.map, {
          zoom: zoom,
          center: { 
            lat: latitudInicial, 
            lng: longitudInicial
          },
          pixelRatio: hidpi ? 2 : 1
        });        

    	// Enable the map event system
    	var mapevents = new H.mapevents.MapEvents(this.map);

    	// Enable map interaction (pan, zoom, pinch-to-zoom)
    	var behavior = new H.mapevents.Behavior(mapevents);
        
    	// setup the Streetlevel imagery
    	//platform.configure(H.map.render.panorama.RenderEngine);  // Me tira error

        // if the window is resized, we need to resize the viewport
        window.addEventListener('resize', function() { self.map.getViewPort().resize(); });

        // Genero Agrupamiento de Puntos
        startClustering(this.map, this.listadoRutasMonitorCelulares);
        
        // Totalizo la visualización del Mapa al iniciar el componente
        this.apis.LogApiFuncion({
          eventoQueDisparo : 'Visualización del Mapa del Monitor de Rutas',
          apiFuncionKey    : 'HereMapsView', 
          organizacionKNAI : this.organizacionKNAI,
          usuarioKANE      : this.usuarioKANE,
          nombreColeccion  : this.nombreColeccion,
          cloudFunction    : null,
          cantidad         : 1, 
        });    

    } else {

        
        console.log("this.vecDataPoints",this.vecDataPoints);
        for(let i=0; i<this.listadoRutasMonitorCelulares.length; i++) {
            let newData  = this.listadoRutasMonitorCelulares[i];
            let estadoNew = this.getEstadoCamion(newData);
            let geoPointNew =  newData.geoPoint;
            let keyNewPoint =  newData.key;

            let newDataPoint = new H.clustering.DataPoint(geoPointNew.latitud, geoPointNew.longitud, null, newData);                    
            let encontroDataPoint=false;
            
            for(let j=0; j<this.vecDataPoints.length; j++) {
                let dataPoint      = this.vecDataPoints[j];
                let dataPointData  = this.vecDataPoints[j]['data'];
                //console.log("dataPointData",dataPointData);
                
                let estado = this.getEstadoCamion(dataPointData)
                let geoPoint =  dataPointData.geoPoint;
                let keyDataPoint = dataPointData.key;
                
                //console.log(i,j, estadoNew, estado);
                
                console.log(keyDataPoint,keyNewPoint);
                
                if(keyDataPoint==keyNewPoint) {
                    
                    encontroDataPoint=true;
                    console.log(estadoNew,estado,geoPointNew.latitud,geoPoint.latitud,geoPointNew.longitud,geoPoint.longitud);
                    
                    if(estadoNew!=estado || geoPointNew.latitud!=geoPoint.latitud || geoPointNew.longitud!=geoPoint.longitud) {

                        this.clusteredDataProvider.removeDataPoint( dataPoint );      
                        
                        this.clusteredDataProvider.addDataPoint( newDataPoint );                    

                        this.vecDataPoints[j]=newDataPoint;
                        console.log("zz actualizo vecDataPoints pos",j, keyNewPoint);    
                        
                    }    
                    break;
                }
            } // fin for this.vecDataPoint
            
            if(encontroDataPoint==false) {
                this.clusteredDataProvider.addDataPoint( newDataPoint );    
                
                this.vecDataPoints.push(newDataPoint);
                console.log("zz agrego vecDataPoints pos",this.vecDataPoints.length, keyNewPoint);                                    
            }

            
        }  // fin for this.listadoRutasMonitorCelulares 
        console.log("zz this.vecDataPoints",this.vecDataPoints);
            

        // this.map.removeLayer(this.layerEnUso);
    }   
    
	// Enable the default UI
	let ui = H.ui.UI.createDefault(this.map, maptypes);
        
    function startClustering(map, data) {
        
        let theme = {
            getClusterPresentation: function(cluster) {   // Agrupamientos (Circulos)
            //   console.log("cluster",cluster);  
            //   console.log("cluster.getMinZoom()", cluster.getMinZoom());
            //   console.log("cluster.getMaxZoom()", cluster.getMaxZoom());
            //   console.log("cluster.isCluster()", cluster.isCluster());
            
              // Get a reference to data object that DataPoint holds
              var dataPoints = getDataPointsOfCluster(cluster);
              console.log("cluster data",dataPoints);
              
              let cantFragmentos;
              if( Math.trunc(dataPoints.length/5)==(dataPoints.length/5)) {
                  cantFragmentos=20;
              } else {
                  cantFragmentos=24;
              }

              let vec_estado=['parado','sin_conexion','en_movimiento','apagado'];
              vec_estado['parado']         = { cant :0, porce:0, cant_color:0} ;
              vec_estado['sin_conexion']   = { cant :0, porce:0, cant_color:0}
              vec_estado['en_movimiento']  = { cant :0, porce:0, cant_color:0}
              vec_estado['apagado']        = { cant :0, porce:0, cant_color:0}
              console.log("cluster ---------------------------");
              console.log("cluster dataPoints.length",dataPoints.length);
              for(let i=0; i<dataPoints.length; i++) {
                  let obj = dataPoints[i].getData();
                  console.log("cluster obj",obj);                    
                  let estadoCaminon:string = self.getEstadoCamion(obj);
                  console.log("cluster estadoCaminon",estadoCaminon);
                  vec_estado[estadoCaminon].cant++;                  
              }
              
              //console.log("cluster vec_estado",vec_estado);
              let estados=['parado','sin_conexion','en_movimiento','apagado'];
              let vec_colores=[];
              for(let j=0; j<4; j++) {
                  let estado = estados[j];
                  vec_estado[estado].porce         = (vec_estado[estado].cant * 100) / dataPoints.length;
                  vec_estado[estado].cant_color    = Math.trunc( (cantFragmentos * vec_estado[estado].porce) / 100 );
                  let cant_residual = (8 * vec_estado[estado].porce) / 100 - vec_estado[estado].cant_color;
                  vec_colores.push({
                      estado: estado,
                      cant_color: vec_estado[estado].cant_color,
                      cant_residual: cant_residual
                  });
              }
              
              vec_colores.sort(self.fn.ordenarXAtributo('cant_color', 'desc',false));
              console.log("cluster vec_colores", vec_colores);
              
              let svgCluster = self.getIconoSvg('svgCirculoMulticolor'+cantFragmentos.toString());
              
              let indexColor=0;
              for(let i=0; i<4; i++) {
                    let color = vec_colores[i];
                    for(let j=1; j<=color.cant_color; j++) {
                        indexColor++;
                        if(color.estado=='en_movimiento') svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#61e01c'); // green
                        if(color.estado=='parado')        svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#d7e350'); // yellow
                        if(color.estado=='apagado')       svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#000000'); // black
                        if(color.estado=='sin_conexion')  svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#fc0505'); // red
                        //console.log("indexColor",indexColor,color.estado);
                    }
              }            
              for(let i=0; indexColor<8 && i<4; i++) {
                    let color = vec_colores[i];
                    if(color.cant_residual>0) {
                        indexColor++;
                        let colorEstado = vec_colores[i].estado;
                        if(colorEstado=='en_movimiento') svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#61e01c');  // green
                        if(colorEstado=='parado')        svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#d7e350');  // yellow
                        if(colorEstado=='apagado')       svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#000000');  // black
                        if(colorEstado=='sin_conexion')  svgCluster=svgCluster.replace('${COLOR'+indexColor.toString()+'}', '#fc0505');  // red          
                        //console.log("indexColor",indexColor,colorEstado);
                    }    
              }          
              
              let marker = new H.map.Marker(cluster.getPosition(), {
                    icon: new H.map.Icon(svgCluster.replace('${SIZE}', '14pt').replace('${TEXT}', cluster.getWeight()), 
                        {anchor: {x:16, y:16}}
                    ),
                    min: cluster.getMinZoom(),
                    max: cluster.getMaxZoom()
              });

              marker.addEventListener('tap', function (evt) {
                    var target = evt.target;
                    map.getViewModel().setLookAtData({ zoom: 14 });
                    map.setCenter(cluster.getPosition(), true);
              });              
     
              return marker;
            },
            
            getNoisePresentation: function(noisePoint) {    // Markers (Camiones)
              let obj = noisePoint.getData();              
              let visibility = true;
              
              let estadoCamion = self.getEstadoCamion(obj);
              let colorEstadoCamion;
              if(estadoCamion=='parado')        colorEstadoCamion='#d7e350'; // yellow
              if(estadoCamion=='sin_conexion')  colorEstadoCamion='#fc0505'; // red
              if(estadoCamion=='en_movimiento') colorEstadoCamion='#61e01c'; // green
              if(estadoCamion=='apagado')       colorEstadoCamion='#000000'; // black

              let svgCamion = self.getIconoSvg('svgCamion');      

              let marker = new H.map.Marker(noisePoint.getPosition(), {
                icon: new H.map.Icon(svgCamion.replace('${COLOR}', colorEstadoCamion)
                                              .replace('${TEXT}',obj['rutaCodigo'])
                                              .replace('${INDEXPRINCIPAL}',obj['indexListadoPrincipal'].toString()),{
                    anchor: {x:10, y:14 }                              
                  }
                ),
                min: noisePoint.getMinZoom(),
                visibility,
                obj
              });

              let html = '<div><b>'+obj.rutaCodigo +'</b></div>'+
                         '<div>'+obj.rutaNombre +'</div>'+
                         '<div>'+obj.vehiculoKN?.nombre +'</div>'+
                         '<div><u>'+estadoCamion+'<u></div>';
              
              marker.setData(html);
              
              marker.addEventListener('tap', function (evt) {
                    var bubble =  new H.ui.InfoBubble(evt.target.getGeometry(), {
                      content: evt.target.getData()
                    });
                    ui.addBubble(bubble);
              }, false);

            //   marker.addEventListener('dbltap', function (evt) {
            //         var target = evt.target;
            //         map.getViewModel().setLookAtData({ zoom: 13 });
            //         map.setCenter(noisePoint.getPosition(), true);
            //   });                            
              
              return marker;
              
            }
        };        
        
        // First we need to create an array of DataPoint objects,
        // for the ClusterProvider
        var dataPoints = data.map(function (item) {          
              let latitud    = item.geoPoint.latitud;
              let longitud   = item.geoPoint.longitud;
              let opt_weight = 5;
              
              let dataPoint = new H.clustering.DataPoint(latitud, longitud, null, item);
              
              self.vecDataPoints.push(dataPoint);
              console.log("zz agrego vecDataPoints pos",self.vecDataPoints.length, item.key);                                    
              
              return dataPoint;
        });
        
        // Create a clustering provider with custom options for clusterizing the input
        self.clusteredDataProvider = new H.clustering.Provider(dataPoints, {
          clusteringOptions: {
            // Maximum radius of the neighbourhood
            eps: 5,
            // minimum weight of points required to form a cluster
            minWeight: 2
          },
          theme: theme
        });

        // To make objects from clustering provder visible, we need to add our layer to the map        
        // Create a layer tha will consume objects from our clustering provider
        var clusteringLayer = new H.map.layer.ObjectLayer(self.clusteredDataProvider);        
        map.addLayer(clusteringLayer);
        
        self.layerEnUso=clusteringLayer;
        
   }
   
   function getDataPointsOfCluster(cluster) {
        var dataPoints = [];

        // Iterate through all points which fall into the cluster and store references to them
        cluster.forEachDataPoint(dataPoints.push.bind(dataPoints));

        return dataPoints;
   }
   
  } // fin mostrarMapaRutas()

  getEstadoCamion(obj) {
    let rta:string=null;
    //console.log("cluster fechas",new Date(),obj['fechaHora']);
    let diferenciaMilisegundos:any = this.fn.diferenciaFechas(new Date(),obj['fechaHora']);
    let diferenciaSegundos:number  = (diferenciaMilisegundos) ? (diferenciaMilisegundos/1000) : 0;
    //console.log("diferenciaMilisegundos",diferenciaMilisegundos,"diferenciaSegundos",diferenciaSegundos);
    if(diferenciaSegundos > 4000) {  // Si es de hace más de 30 minutos que no reporta
    // if(diferenciaSegundos > 1200) {  // Si es de hace más de 30 minutos que no reporta
              rta = 'sin_conexion';      
              
    } else if(obj['estado']=='Activo' || obj['estado']=='Background') {
          if(obj['detenido']==true) {
              rta =  'parado';      
          } else {
              rta = 'en_movimiento';
          }
    } else if(obj['estado']=='Kill') {
              rta = 'apagado';      
    }    
    return rta;
 }

  
  getIconoSvg(cual) {
       
    var svgCirculoMulticolor20 = '<svg width="32" height="32" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xmlns="http://www.w3.org/2000/svg">' +
            '<circle r="256" cy="256" cx="256" style="fill:#ffffff;stroke:#0e161f;stroke-width:1.06704;stroke-linejoin:round" /> '+
            '<g transform="matrix(.1 0 0 -.1 0 512)"> '+
                '<path style="fill:${COLOR1}"  d="m2820 4699v-359l23-4c12-3 65-12 117-22 52-9 129-28 170-40 41-13 76-21 79-18 4 3 191 661 191 671 0 5-171 54-270 77-58 14-151 31-207 39l-103 14z"/> '+
                '<path style="fill:${COLOR2}"  d="m3407 4572c-48-174-90-327-93-339-5-19 5-27 87-68 51-26 128-69 172-96s81-48 83-47c8 9 367 554 371 565 7 19-191 144-352 223-77 37-149 71-160 74-19 5-27-18-108-312z"/> '+
                '<path style="fill:${COLOR3}"  d="m3926 4245-188-284 133-133 134-133 260 209c143 115 261 211 263 215 8 20-381 412-408 411-3 0-90-128-194-285z"/> '+
                '<path style="fill:${COLOR4}"  d="m4335 3829c-138-110-254-205-259-209-5-5 14-43 43-87 28-43 73-120 99-170 26-51 52-93 58-93 12 0 604 217 611 224 6 6-60 155-114 256s-169 280-180 280c-5 0-121-90-258-201z"/> '+
                '<path style="fill:${COLOR51}" d="m4623 3285c-166-61-305-113-307-116-3-3 8-45 23-95 16-50 39-148 52-217l23-127h323 323v38c0 112-81 506-123 600l-12 28z"/> '+
                '<path style="fill:${COLOR6}"  d="m4417 2458c-4-95-13-204-21-243-8-38-11-73-8-76 9-9 574-209 588-209 27 0 80 325 90 553l7 147h-325-325z"/> '+
                '<path style="fill:${COLOR7}"  d="m4355 2026c-21-77-68-195-117-299-34-70-59-129-57-131 31-28 481-376 487-376 14 0 127 205 180 325 56 125 109 271 102 279-3 2-137 52-298 109-183 65-295 100-297 93z"/> '+
                '<path style="fill:${COLOR8}"  d="m4061 1435c-29-41-96-120-148-175-61-64-92-104-87-112 31-55 338-498 345-498 4 0 68 60 142 133 119 118 183 190 271 309l27 36-241 189c-132 103-244 189-248 190s-31-31-61-72z"/> '+
                '<path style="fill:${COLOR9}"  d="m3695 1064c-47-39-194-128-296-179-52-26-95-48-97-50-4-3 158-569 168-584 8-14 159 50 299 126 92 50 281 174 299 196 10 12-20 62-159 266-95 138-175 251-178 251-3-1-19-12-36-26z"/> '+
                '<path style="fill:${COLOR10}" d="m3125 775c-38-12-113-29-165-39-52-9-105-19-117-22l-23-4v-314-313l103 14c105 14 261 49 380 84 54 16 67 24 63 37-3 9-40 139-82 287-42 149-79 275-83 281-4 7-29 3-76-11z"/> '+
                
                '<path style="fill:${COLOR11}" d="m2321 686c-16-50-161-572-161-578 0-12 237-32 390-33h165l3 313 2 312-137 1c-76 0-164 4-195 8l-58 7z"/> '+
                '<path style="fill:${COLOR12}" d="m1555 679c-88-133-168-254-179-270l-18-29 123-59c68-32 174-77 234-99 123-44 330-100 340-90 3 3 44 139 89 303 55 193 80 298 72 300-6 2-49 13-95 25-100 25-229 74-329 124-39 20-73 36-74 36-2 0-75-109-163-241z"/> '+
                '<path style="fill:${COLOR13}" d="m965 1119c-137-111-252-206-254-211-5-16 201-213 311-298 104-81 233-170 245-170 4 0 88 120 185 267l177 266-57 37c-76 48-223 173-295 249-32 33-59 61-60 61s-114-91-252-201z"/> '+
                '<path style="fill:${COLOR14}" d="m553 1792c-172-63-313-119-313-124 0-22 117-265 173-360 58-97 142-220 201-293l24-29 247 199c137 110 252 203 257 206s-20 51-57 105c-67 102-158 272-190 357-10 26-21 49-24 51s-147-49-318-112z"/> '+
                '<path style="fill:${COLOR15}" d="m73 2483c9-189 37-378 82-550 20-75 39-142 43-148 5-9 96 20 325 104 288 105 317 118 312 136-34 117-56 277-62 433l-6 172h-350-350z"/> '+
                '<path style="fill:${COLOR16}" d="m241 3478c-4-13-18-49-30-82-57-153-131-509-131-628v-38h348 349l17 103c24 136 50 233 92 341 19 49 33 90 31 92-5 5-648 234-658 234-5 0-13-10-18-22z"/> '+
                '<path style="fill:${COLOR17}" d="m609 4117c-146-187-327-494-304-516 7-7 648-241 661-241 1 0 17 26 35 58 53 94 120 193 186 271l61 74-26 22c-15 12-81 64-147 115-66 52-182 142-257 202l-137 108z"/> '+
                '<path style="fill:${COLOR18}" d="m1175 4643c-129-90-234-174-333-269l-93-89 285-223 286-223 93 79c51 43 130 103 176 132 45 30 80 59 79 65-6 23-393 585-403 584-5 0-46-25-90-56z"/> '+
                '<path style="fill:${COLOR19}" d="m1875 4970c-130-37-258-87-401-154-87-42-113-59-107-69 8-14 393-579 399-586 2-2 41 13 86 34 89 40 278 105 308 105 10 0 21 4 25 9 8 14-188 691-200 690-5 0-55-13-110-29z"/> '+
                '<path style="fill:${COLOR20}" d="m2405 5063c-22-1-100-10-173-19-128-16-133-18-128-38 3-11 47-169 98-349l93-328 35 5c19 3 115 9 213 12l177 7v352c0 313-2 354-16 359-15 6-222 6-299-1z"/> '+
            '</g> '+                
           ' <text x="252" y="340" font-size="260px" font-family="Arial" font-weight="bold" text-anchor="middle" fill="black">${TEXT}</text> '+
        '</svg> ';    

    var svgCirculoMulticolor24 = '<svg width="32" height="32" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xmlns="http://www.w3.org/2000/svg">' +
            '<circle r="256" cy="256" cx="256" style="fill:#ffffff;stroke:#0e161f;stroke-width:1.06704;stroke-linejoin:round" /> '+
            '<g transform="matrix(.1 0 0 -.1 0 512)"> '+
                '<path style="fill:${COLOR1}"  d="m2700 4708v-355l123-17c67-9 136-20 152-22l30-6 63 234c34 128 75 281 91 340l29 107-36 11c-68 19-266 51-359 57l-93 6z"/> '+
                '<path style="fill:${COLOR2}"  d="m3285 4948c-13-37-175-642-175-653 0-8 24-21 53-31 28-9 88-32 131-50 60-25 83-31 93-23 7 6 13 15 13 19s66 123 146 266c80 142 152 272 160 287l15 28-94 43c-94 44-308 126-327 126-6 0-13-6-15-12z"/> '+
                '<path style="fill:${COLOR3}"  d="m3757 4643c-30-54-107-191-170-305l-115-208 84-50c46-28 107-69 135-92l52-41 238 244c131 134 238 247 238 251 2 17-250 204-371 277l-36 22z"/> '+
                '<path style="fill:${COLOR4}"  d="m4220 4293c-40-43-144-150-231-239-88-88-159-165-159-170s23-32 51-59c27-28 76-80 107-117 31-38 60-68 64-68 5 0 25 11 46 24 20 13 145 88 277 166s244 146 248 150c16 14-295 390-322 390-4 0-41-35-81-77z"/> '+
                '<path style="fill:${COLOR5}"  d="m4405 3729c-154-93-284-170-290-172-5-2 9-33 32-68 22-36 60-103 83-149 23-47 43-86 44-87 2-3 407 110 569 158 82 24 81 15 6 182-41 94-156 309-162 306-1 0-128-77-282-170z"/> '+
                '<path style="fill:${COLOR6}"  d="m4625 3244c-165-48-302-88-304-90s8-43 22-91c14-49 34-132 44-185l18-98h328 328l-6 58c-25 206-90 485-116 489-7 1-149-36-314-83z"/> '+
                '<path style="fill:${COLOR7}"  d="m4420 2541c0-76-3-165-6-197l-6-59 308-86c170-47 310-86 311-85 9 6 35 266 40 399l6 167h-326-327z"/> '+
                '<path style="fill:${COLOR8}"  d="m4384 2153c-22-101-49-197-73-259l-28-73 56-34c31-19 135-80 231-137 96-56 192-113 214-127 21-14 42-21 46-16 38 42 188 491 169 506-5 5-592 167-601 167-4 0-10-12-14-27z"/> '+
                '<path style="fill:${COLOR9}"  d="m4225 1701c-9-28-111-197-157-259-22-30-38-55-36-57 158-164 433-435 440-433 27 9 308 421 308 451 0 3-48 33-107 68-60 34-179 104-266 156-87 51-162 93-167 93s-11-9-15-19z"/> '+
                '<path style="fill:${COLOR10}" d="m3895 1240c-33-34-99-93-148-133-48-39-86-77-85-83 7-26 294-524 302-524 37 0 430 339 424 366-3 14-416 434-427 434-4 0-33-27-66-60z"/> '+
                '<path style="fill:${COLOR11}" d="m3455 914c-55-29-130-66-167-80-38-15-68-31-68-35 0-14 158-581 164-586 13-13 409 165 469 211 16 12 6 33-131 277-82 145-153 264-158 265s-54-22-109-52z"/> '+
                '<path style="fill:${COLOR12}" d="m3088 765c-8-8-189-43-290-55l-98-12v-309-309h53c76 0 296 34 417 65 58 15 106 28 108 30 2 1-19 83-47 181-27 99-64 232-82 297-28 104-42 130-61 112z"/> '+
                
                '<path style="fill:${COLOR13}" d="m2145 739c-2-8-40-144-83-304l-80-290 42-13c67-20 301-51 444-58l132-7v315 315l-112 6c-98 5-241 25-315 44-14 3-25 0-28-8z"/> '+
                '<path style="fill:${COLOR14}" d="m1635 843c-198-353-255-458-255-466 0-20 380-181 475-201l30-6 57 217c32 120 69 257 82 304l23 87-86 32c-47 18-125 52-173 76s-91 44-96 44c-4 0-30-39-57-87z"/> '+
                '<path style="fill:${COLOR15}" d="m1109 1092c-90-92-193-198-229-235l-65-69 65-59c115-105 393-310 404-298 3 2 64 110 136 239 73 129 143 254 156 276l23 41-87 66c-48 36-121 97-163 135l-76 71z"/> '+
                '<path style="fill:${COLOR16}" d="m690 1515c-151-91-278-165-282-165-19 0-3-33 60-131 73-110 158-224 230-305l43-48 162 165c89 90 193 196 230 235l69 71-64 85c-34 46-85 123-113 171-27 47-52 86-55 86s-129-74-280-164z"/> '+
                '<path style="fill:${COLOR17}" d="m472 2066-323-91 6-39c9-61 82-269 135-389 27-60 51-112 54-114 5-5 576 337 576 346 0 4-18 54-39 112-21 57-47 138-56 179-10 41-21 78-24 81-3 4-151-35-329-85z"/> '+
                '<path style="fill:${COLOR18}" d="m74 2503c5-151 35-417 47-427 2-2 143 36 314 85 171 48 319 90 331 93 18 5 20 10 13 63-4 32-8 127-8 211l-1 152h-352-351z"/> '+
                '<path style="fill:${COLOR19}" d="m196 3352c-25-41-116-478-116-559 0-10 77-13 353-13h352l19 102c10 55 31 142 47 192 15 50 26 92 25 94-2 2-145 43-317 91-173 48-324 91-336 95s-24 3-27-2z"/> '+
                '<path style="fill:${COLOR20}" d="m439 3877c-70-109-211-409-198-421 7-6 655-186 671-186 8 0 25 24 39 52 13 29 52 98 85 154l61 101-51 30c-28 16-118 69-201 118-82 49-199 117-258 152l-108 63z"/> '+
                '<path style="fill:${COLOR21}" d="m779 4313c-56-60-133-148-171-197-63-81-67-90-51-101 10-7 83-50 163-97s211-124 292-172l147-88 32 39c18 21 73 78 122 127l88 89-248 252c-136 139-253 253-259 253-7 1-58-46-115-105z"/> '+
                '<path style="fill:${COLOR22}" d="m1293 4719c-118-71-316-216-311-228 2-5 114-122 250-261l246-253 84 55c46 30 106 68 133 83 28 16 55 32 62 37 8 6-7 40-51 116-34 59-113 198-175 310-63 111-119 202-125 202s-57-28-113-61z"/> '+
                '<path style="fill:${COLOR23}" d="m1915 4983c-87-22-380-130-404-149-2-1 77-144 174-318l178-315 46 19c25 11 90 33 144 51 79 25 97 34 93 47-6 20-81 295-141 512-43 157-46 164-90 153z"/> '+
                '<path style="fill:${COLOR24}" d="m2400 5063c-68-5-286-34-313-41l-24-7 94-345c52-189 95-345 96-347 1-1 47 5 102 12 55 8 133 15 173 15h72v360 360l-77-2c-43-1-98-3-123-5z"/> '+            
            '</g> '+            
            '<text x="252" y="340" font-size="260px" font-family="Arial" font-weight="bold" text-anchor="middle" fill="black">${TEXT}</text> '+
        '</svg> ';    
        
     var svgCamion= '<svg width="144" height="24" viewBox="0 0 3072 512"  style="enable-background:new 0 0 3072 512;" '+
                                   ' xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +                      
                                   
             '<defs><filter x="-0.02" y="0" width="1.04" height="1.1" id="removebackground"><feFlood flood-color="#ccc"/></filter></defs> '+
             '<use xlink:href="#mygroup" filter="url(#removebackground)" /> '+
             '<g id="mygroup"> '+
             '     <text x="512" y="256" style="text-anchor:start; font-size:180px; font-weight:bold;">${TEXT}</text> '+  
             '</g> '+

             '<defs id="defs88"><clipPath id="clipPath652" clipPathUnits="userSpaceOnUse"> '+
             '<path style="fill:#ff0000;fill-opacity:1;fill-rule:nonzero;stroke:none" d="M 0,45.675781 V 447.67188 H 493.34961 V 311.16797 c -23.17139,0.003 -46.34226,0.036 -69.51367,0.10937 -51.87372,-0.0949 -103.75366,-1.25931 -155.6211,0.18164 -9.90341,0.29468 -19.80916,0.53918 -29.71093,0.88477 -4.33719,0.15138 -8.6657,0.48658 -13.00391,0.60547 -3.04514,0.0834 -6.09434,0 -9.14062,0 h -20.50586 c -14.57744,0 -19.37907,-9.85331 -14.43555,-16.36914 -0.1584,-1.09857 -0.11432,-2.21092 0.16992,-3.29688 V 259.11914 194.5293 162.98633 139.47656 122.86133 c 1.32401,0.64387 0.0242,-1.27764 -0.13281,-2.08203 -2.03198,-0.18436 -1.405,-0.44608 4.11133,-0.52344 -1.39141,-0.17363 -2.74815,-0.37004 -3.97852,-0.62695 -0.4628,-0.0966 -0.52778,-0.51671 -0.45703,-1.04688 h -20.3457 c -5.38671,0 -9.43509,-1.34864 -12.15625,-3.375 -4.31473,-1.76025 -6.76088,-4.78855 -7.3086,-7.99805 -0.31435,-0.97355 -0.45179,-1.97557 -0.40625,-2.9746 -11.95071,-2.9447 -13.24628,-14.948537 -2.48828,-19.533208 h -2.9043 c -21.77163,0 -21.77163,-21.992188 0,-21.992188 h 9.11133 c 1.71132,-0.378751 3.62313,-0.59375 5.75,-0.59375 h 4.52539 c -5.73532,-4.84246 -4.77833,-12.958875 3.67188,-16.439453 z M 445.54883,223.19531 c 0.0107,0.0827 0.0253,0.16536 0.0391,0.24805 1.10321,-0.0629 2.20656,-0.11554 3.31055,-0.16016 0.002,-0.0292 0.002,-0.0587 0.004,-0.0879 -1.11784,2e-5 -2.23564,-2e-5 -3.35351,0 z" /> '+
             '</clipPath></defs> '+
             '<g> '+
             '<path clip-path="url(#clipPath652)" d="M487.932,51.1c-3.613-3.612-7.905-5.424-12.847-5.424h-292.36c-4.948,0-9.233,1.812-12.847,5.424   c-3.615,3.617-5.424,7.902-5.424,12.85v54.818h-45.683c-5.14,0-10.71,1.237-16.705,3.711c-5.996,2.478-10.801,5.518-14.416,9.135   l-56.532,56.531c-2.473,2.474-4.612,5.327-6.424,8.565c-1.807,3.23-3.14,6.14-3.997,8.705c-0.855,2.572-1.477,6.089-1.854,10.566   c-0.378,4.475-0.62,7.758-0.715,9.853c-0.091,2.092-0.091,5.71,0,10.85c0.096,5.142,0.144,8.47,0.144,9.995v91.36   c-4.947,0-9.229,1.807-12.847,5.428C1.809,347.076,0,351.363,0,356.312c0,2.851,0.378,5.376,1.14,7.562   c0.763,2.19,2.046,3.949,3.858,5.284c1.807,1.335,3.378,2.426,4.709,3.285c1.335,0.855,3.571,1.424,6.711,1.711   s5.28,0.479,6.423,0.575c1.143,0.089,3.568,0.089,7.279,0c3.715-0.096,5.855-0.144,6.427-0.144h18.271   c0,20.17,7.139,37.397,21.411,51.674c14.277,14.274,31.501,21.413,51.678,21.413c20.175,0,37.401-7.139,51.675-21.413   c14.277-14.276,21.411-31.504,21.411-51.674H310.63c0,20.17,7.139,37.397,21.412,51.674c14.271,14.274,31.498,21.413,51.675,21.413   c20.181,0,37.397-7.139,51.675-21.413c14.277-14.276,21.412-31.504,21.412-51.674c0.568,0,2.711,0.048,6.42,0.144   c3.713,0.089,6.14,0.089,7.282,0c1.144-0.096,3.289-0.288,6.427-0.575c3.139-0.287,5.373-0.855,6.708-1.711s2.901-1.95,4.709-3.285   c1.81-1.335,3.097-3.094,3.856-5.284c0.77-2.187,1.143-4.712,1.143-7.562V63.953C493.353,59.004,491.546,54.724,487.932,51.1z    M153.597,400.28c-7.229,7.23-15.797,10.854-25.694,10.854c-9.898,0-18.464-3.62-25.697-10.854   c-7.233-7.228-10.848-15.797-10.848-25.693c0-9.897,3.619-18.47,10.848-25.701c7.232-7.228,15.798-10.848,25.697-10.848   c9.897,0,18.464,3.617,25.694,10.848c7.236,7.231,10.853,15.804,10.853,25.701C164.45,384.483,160.833,393.052,153.597,400.28z    M164.45,228.403H54.814v-8.562c0-2.475,0.855-4.569,2.568-6.283l55.674-55.672c1.712-1.714,3.809-2.568,6.283-2.568h45.111   V228.403z M409.41,400.28c-7.23,7.23-15.797,10.854-25.693,10.854c-9.9,0-18.47-3.62-25.7-10.854   c-7.231-7.228-10.849-15.797-10.849-25.693c0-9.897,3.617-18.47,10.849-25.701c7.23-7.228,15.8-10.848,25.7-10.848   c9.896,0,18.463,3.617,25.693,10.848c7.231,7.235,10.852,15.804,10.852,25.701C420.262,384.483,416.648,393.052,409.41,400.28z" /> '+
             '</g> '+
             '<g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g> '+
             
             '<rect y="77.846321" x="193.15921" height="222.34346" width="299.0206" style="fill:${COLOR};stroke:#0e161f;stroke-width:3.74032;stroke-linejoin:round" /> '+
             
             '<text x="330" y="250" font-size="180px" font-family="Arial" font-weight="bold" text-anchor="middle" fill="white">${INDEXPRINCIPAL}</text>'+                          
             
         '</svg> ';  
     
    var svgUbicacion = '<svg width="64" height="64" viewBox="0 0 511.585 511.585" style="enable-background:new 0 0 511.585 511.585;" xmlns="http://www.w3.org/2000/svg"> '+   
               '<path style="fill:#120de4" d="M201.129,462.676c-6.258-1.647-12.428-3.578-18.494-5.785c-11.072-4.029-23.313,1.681-27.342,12.753 '+
               '    c-4.029,11.072,1.681,23.313,12.753,27.342c7.289,2.652,14.704,4.973,22.224,6.952c11.394,2.999,23.062-3.807,26.06-15.201 '+
               '    S212.523,465.675,201.129,462.676z"/> '+
               '<path style="fill:#120de4" d="M115.642,417.372c-4.882-4.247-9.571-8.714-14.05-13.385c-8.155-8.504-21.66-8.786-30.163-0.631 '+
               '    c-8.504,8.155-8.786,21.66-0.631,30.163c5.369,5.599,10.989,10.953,16.842,16.044c8.889,7.733,22.364,6.795,30.097-2.094 '+
               '    S124.532,425.105,115.642,417.372z"/> '+
               '<path style="fill:#120de4" d="M161.526,40.236c-5.67-10.328-18.639-14.105-28.967-8.435c-6.804,3.735-13.435,7.779-19.87,12.115 '+
               '    c-9.771,6.584-12.354,19.843-5.769,29.613c6.584,9.771,19.843,12.354,29.613,5.769c5.364-3.615,10.889-6.984,16.558-10.096 '+
               '    C163.419,63.533,167.196,50.564,161.526,40.236z"/> '+
               '<path style="fill:#120de4" d="M51.938,320.113c-3.517-11.245-15.484-17.51-26.729-13.993c-11.245,3.517-17.51,15.484-13.993,26.729 '+
               '    c2.321,7.42,4.978,14.722,7.962,21.885c4.531,10.876,17.021,16.02,27.897,11.489c10.876-4.531,16.02-17.021,11.489-27.897 '+
               '    C56.081,332.363,53.87,326.287,51.938,320.113z"/> '+
               '<path style="fill:#120de4" d="M456.784,185.235c2.151,6.086,4.025,12.274,5.615,18.549c2.893,11.421,14.498,18.335,25.919,15.441 '+
               '    c11.421-2.893,18.334-14.498,15.441-25.919c-1.91-7.54-4.162-14.977-6.747-22.29c-3.927-11.109-16.115-16.931-27.224-13.004 '+
               '    C458.679,161.938,452.857,174.127,456.784,185.235z"/> '+
               '<path style="fill:#120de4" d="M42.63,243.534c0.384-6.483,1.058-12.916,2.019-19.288c1.757-11.65-6.263-22.519-17.913-24.276 '+
               '    S4.217,206.233,2.46,217.883c-1.153,7.645-1.962,15.361-2.422,23.131c-0.696,11.761,8.275,21.86,20.036,22.556 '+
               '    C31.835,264.266,41.934,255.295,42.63,243.534z"/> '+
               '<path style="fill:#120de4" d="M41.324,158.15c10.217,5.868,23.256,2.342,29.124-7.875c3.221-5.608,6.695-11.066,10.412-16.359 '+
               '    c6.771-9.642,4.443-22.948-5.2-29.718c-9.642-6.771-22.948-4.443-29.718,5.2c-4.459,6.35-8.628,12.899-12.492,19.628 '+
               '    C27.582,139.243,31.108,152.282,41.324,158.15z"/> '+
               '<path style="fill:#120de4" d="M385.329,425.709c-5.133,3.938-10.44,7.642-15.907,11.099c-9.958,6.297-12.927,19.474-6.63,29.432 '+
               '    s19.474,12.927,29.432,6.63c6.558-4.147,12.924-8.589,19.08-13.312c9.347-7.173,11.11-20.565,3.937-29.912 '+
               '    C408.068,420.299,394.676,418.537,385.329,425.709z"/> '+
               '<path style="fill:#120de4" d="M243.109,0.65c-7.777,0.374-15.503,1.097-23.161,2.164c-11.669,1.627-19.81,12.405-18.184,24.074 '+
               '    c1.627,11.669,12.405,19.81,24.074,18.184c6.384-0.89,12.828-1.493,19.319-1.805c11.768-0.566,20.85-10.564,20.285-22.333 '+
               '    S254.878,0.084,243.109,0.65z"/> '+
               '<path style="fill:#120de4" d="M448.388,120.862c8.983-7.624,10.085-21.086,2.462-30.069c-5.02-5.915-10.305-11.6-15.838-17.038 '+
               '    c-8.403-8.258-21.91-8.141-30.169,0.263c-8.258,8.403-8.141,21.91,0.263,30.169c4.616,4.537,9.026,9.28,13.213,14.214 '+
               '    C425.942,127.383,439.404,128.485,448.388,120.862z"/> '+
               '<path style="fill:#120de4" d="M490.252,235.018c-11.782,0-21.333,9.551-21.333,21.333c0,6.511-0.291,12.983-0.869,19.406 '+
               '    c-1.057,11.735,7.599,22.104,19.334,23.161c11.735,1.057,22.104-7.599,23.161-19.334c0.693-7.694,1.041-15.444,1.041-23.233 '+
               '    C511.585,244.569,502.034,235.018,490.252,235.018z"/> '+
               '<path style="fill:#120de4" d="M475.519,341.112c-10.561-5.223-23.357-0.895-28.58,9.666c-2.866,5.795-5.995,11.456-9.375,16.966 '+
               '    c-6.162,10.042-3.016,23.178,7.026,29.34c10.042,6.162,23.178,3.016,29.34-7.026c4.058-6.613,7.813-13.409,11.254-20.366 '+
               '    C490.408,359.131,486.08,346.335,475.519,341.112z"/> '+
               '<path style="fill:#120de4" d="M298.143,465.443c-6.319,1.279-12.71,2.272-19.16,2.975c-11.713,1.276-20.173,11.806-18.897,23.519 '+
               '    c1.276,11.713,11.806,20.173,23.519,18.897c7.739-0.843,15.411-2.036,22.999-3.571c11.548-2.337,19.015-13.592,16.679-25.14 '+
               '    S309.691,463.106,298.143,465.443z"/> '+
               '<path style="fill:#120de4" d="M368.615,49.541c4.697-10.805-0.255-23.372-11.06-28.07c-7.119-3.095-14.381-5.864-21.766-8.299 '+
               '    c-11.19-3.689-23.251,2.392-26.94,13.582s2.392,23.251,13.582,26.94c6.146,2.026,12.189,4.331,18.114,6.907 '+
               '    C351.35,65.298,363.918,60.346,368.615,49.541z"/> '+
           '</svg>';
           
    if(cual=='svgCamion')                return svgCamion;     

    if(cual=='svgUbicacion')             return svgUbicacion;     
     
    if(cual=='svgCirculoMulticolor20')   return svgCirculoMulticolor20;       
    if(cual=='svgCirculoMulticolor24')   return svgCirculoMulticolor24;     
    
    return null;
   
}


}