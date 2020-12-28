import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';



import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './rutas.config';

import { Subscription } from 'rxjs';
import { DragulaService } from 'ng2-dragula';
import { HereService }   from '@maq-servicios/here/here.service';


import { formatNumber } from '@angular/common'

import { GeoPoint }     from '@maq-models/geopoint/geopoint.model';
import { Direccion }    from '@maq-models/direccion/direccion.model';

import { LicenciasService }    from '@proyecto/servicios/licencias/licencias.service';


import firebase from 'firebase/app';
import 'firebase/firestore';

import { environment } from '@environments/environment';

declare let $: any;
declare let jQuery: any;

declare var H: any;  

@Component({
  selector: 'app-rutas',
  templateUrl: './rutas.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './rutas.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class RutasComponent extends PageGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef    : ChangeDetectorRef,
               private dragulaService         : DragulaService,
               public hereService             : HereService,
               public licencias               : LicenciasService
               ) {    
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
  
  public listadoRutaIntegrantes:any[]=[];
  public listadoRutaVehiculos:any[]=[];
  public listadoRutaParadas:any[]=[];

  public componenteIntegrantesAccionInicial:string='listado';
  public componenteIntegrantesDocumentoInicial:string=null;

  public componenteVehiculosAccionInicial:string='listado';
  public componenteVehiculosDocumentoInicial:string=null;

  public componenteParadasAccionInicial:string='listado';
  public componenteParadasDocumentoInicial:string=null;
  
  public BAG = "DRAGULA_EVENTS";
  public paradasDragAndDrop:any[]=[];
  public subsDragDrop = new Subscription();
  public dragDropOpcionActiva:boolean = false;
  public dragSegundosLastOver:any     = Date.now();
  public navigationSubscription       = null;
  
  // Variables Here
  public map                        : any=null;
  public viewBounds                 : any;
  public geocoderRequest            : any;
  public zoom                       : number = 15;
  public ubicacion                  : Direccion;
  public dif                        : string = Math.floor((99999) * Math.random()).toString();
  public heightMapa                 : string;
  



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
     this.heightMapa    = (screenHeigth - 175 -100).toString() + 'px';
     
     this.subscribirDragDrop();


   

     super.ngOnInit()
     
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    
    if(this.subscripcionSucursales)      this.subscripcionSucursales.unsubscribe();
    if(this.subscripcionAreasNegocio)    this.subscripcionAreasNegocio.unsubscribe();
    
    if(this.subscripcionRutaVehiculos)   this.subscripcionRutaVehiculos.unsubscribe();
    if(this.subscripcionRutaIntegrantes) this.subscripcionRutaIntegrantes.unsubscribe();
    if(this.subscripcionRutaParadas)     this.subscripcionRutaParadas.unsubscribe();


    // Desuscribo Drag&Drop
    this.dragDropDesusbcribir();  // Desubscribo
    this.dragulaService.destroy(this.BAG); // Destruyo el Grupo
    
    // log(...values('funcionComponente','ngOnDestroy Distribuidores'));
    
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
        }  
      
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
  
  actualizarRutaconComponente(documento){
      console.log("actualizarRutaconComponente",documento);
      
      this.form.get('ubicacionOrigenKN').setValue( documento.ubicacionOrigenKN );
      this.form.get('ubicacionDestinoKN').setValue( documento.ubicacionDestinoKN );
      
      let distanciaPlanificada = formatNumber( documento.distanciaPlanificada, 'es-Ar',"1.2-2");    
      this.form.get('distanciaPlanificada').setValue( distanciaPlanificada );

      this.form.get('fechaHoraInicioPlaneada').setValue( documento.fechaHoraInicioPlaneada );
      this.form.get('fechaHoraSalidaPlaneada').setValue( documento.fechaHoraSalidaPlaneada );
      this.form.get('fechaHoraArriboPlaneada').setValue( documento.fechaHoraArriboPlaneada );
      this.form.get('fechaHoraFinalizacionPlaneada').setValue( documento.fechaHoraFinalizacionPlaneada );
      
  }
  
  subscribirDragDrop() {
       console.log("susbcribirDragDrop");
       
       this.subsDragDrop.add(this.dragulaService.dropModel(this.BAG)
         .subscribe(({ el, target, source, sourceModel, targetModel, item }) => {
            console.log('Drag&DropElement - dropModel:');
              //  console.log(el);
              //  console.log(source);
              //  console.log(target);
              //  console.log(sourceModel);
              console.log('Drag&DropElement - item movido',item);
              console.log('Drag&DropElement - arrayResultante',targetModel);
              
              // Determino a que posición fue a parar
              let arrayResultante=targetModel;
              let posItem=arrayResultante.indexOf(item);
              console.log('Drag&DropElement - posItem',posItem);
              let itemReferencia:string;
              let paradaReferencia:any=null;

              if(posItem==0) {
                  itemReferencia = arrayResultante[1];
              } else {
                  itemReferencia = arrayResultante[posItem-1];
              }
              
              // Busco Item de Referencia (anterior o siguiente) para en base a ese calcular fecha/hora
              for(let i=0; i<this.listadoRutaParadas.length;i++) {
                    let parada=this.listadoRutaParadas[i];
                    if(parada.ubicacion.nombre==itemReferencia) {
                        paradaReferencia=parada;
                        console.log("paradaReferencia - nombre:",paradaReferencia.ubicacion.nombre);
                        console.log("paradaReferencia - fechaHoraInicioPlaneada:",paradaReferencia.fechaHoraInicioPlaneada);
                        break;
                    }
              }
              
              // Busco Item de Movido con el Drag&Drop
              for(let i=0; i<this.listadoRutaParadas.length;i++) {
                    if(this.listadoRutaParadas[i].ubicacion.nombre==item) {
                        if(posItem==0) {
                            this.listadoRutaParadas[i].fechaHoraInicioPlaneada       = paradaReferencia.fechaHoraInicioPlaneada;  
                            this.listadoRutaParadas[i].fechaHoraFinalizacionPlaneada = paradaReferencia.fechaHoraFinalizacionPlaneada;  
                            
                            this.listadoRutaParadas[0].fechaHoraInicioPlaneada = this.fn.addMinutosToDatetime(this.listadoRutaParadas[0].fechaHoraInicioPlaneada,+0.1);  
                        } else {
                            this.listadoRutaParadas[i].fechaHoraInicioPlaneada = this.fn.addMinutosToDatetime(paradaReferencia.fechaHoraInicioPlaneada,+0.1);  
                        }
                        console.log("modificó fechas ubicacion",this.listadoRutaParadas[i].ubicacion.nombre, this.listadoRutaParadas[i].fechaHoraInicioPlaneada);
                        break;
                    }
              }
              
              // Ordeno Array x fechaHoraInicioPlaneada 
              this.listadoRutaParadas.sort(this.fn.ordenarXAtributo( 'fechaHoraInicioPlaneada','asc',false));
              
              // Recalculo todas las Fechas/Horas
              let distanciaPlanificada=0;              
              for(let i=1; i<this.listadoRutaParadas.length;i++) {
                  let parada          = this.listadoRutaParadas[i];
                  let paradaAnterior  = this.listadoRutaParadas[i-1];
                  
                  let latitud1    = paradaAnterior.ubicacion.direccion.geoPoint.latitud;
                  let longitud1   = paradaAnterior.ubicacion.direccion.geoPoint.longitud;
                  let latitud2    = parada.ubicacion.direccion.geoPoint.latitud;
                  let longitud2   = parada.ubicacion.direccion.geoPoint.longitud;
                  let kmDistancia = this.fn.distancia_geopoints( latitud1, longitud1, latitud2, longitud2, "km");      
                  distanciaPlanificada += kmDistancia;
                  
                  let minutosEntreParadas;
                  if(kmDistancia>10) {
                      minutosEntreParadas = kmDistancia * 1;  
                  } else if(kmDistancia>2) {
                      minutosEntreParadas = kmDistancia * 2;  
                  } else {
                      minutosEntreParadas = kmDistancia * 5;  
                  }   
              
                  if(this.form.get('formaCarga').value=='calculaHorarios') {
                      this.listadoRutaParadas[i].fechaHoraInicioPlaneada       = this.fn.addMinutosToDatetime(paradaAnterior.fechaHoraFinalizacionPlaneada,minutosEntreParadas);  
                      let minutosServicio = this.fn.getMinutosServicio(parada.ubicacion.tiempoServicio);  
                      this.listadoRutaParadas[i].fechaHoraFinalizacionPlaneada = this.fn.addMinutosToDatetime(this.listadoRutaParadas[i].fechaHoraInicioPlaneada,minutosServicio);  
                  }    
              }    

              let valueFormatNumber = formatNumber( distanciaPlanificada, 'es-Ar',"1.2-2");    
              this.form.get('distanciaPlanificada').setValue( valueFormatNumber );
              
              // Me fijo si se modificó la Parada Origen y/o la de destino
              let modificoUbicacionRutaconParada=false;
              let cantParadas=this.listadoRutaParadas.length;
              let ubicacionOrigenKNParadaKey  = this.fn.mostrarKN( this.listadoRutaParadas[0].ubicacion,'key');
              let ubicacionDestinoKNParadaKey = this.fn.mostrarKN( this.listadoRutaParadas[cantParadas-1].ubicacion,'key');
              console.log("ubicacionOrigenKNParadaKey",ubicacionOrigenKNParadaKey);
              console.log("ubicacionDestinoKNParadaKey",ubicacionDestinoKNParadaKey);
              
              let ubicacionOrigenKNRutaKey    = this.fn.mostrarKN( this.form.get('ubicacionOrigenKN').value,'key');
              let ubicacionDestinoKNRutaKey   = this.fn.mostrarKN( this.form.get('ubicacionDestinoKN').value,'key');

              console.log("ubicacionOrigenKNRutaKey",ubicacionOrigenKNRutaKey);
              console.log("ubicacionDestinoKNRutaKey",ubicacionDestinoKNRutaKey);
              console.log("this.form.get('origenEsDestino').value",this.form.get('origenEsDestino').value);
              
              if( ubicacionOrigenKNParadaKey != ubicacionOrigenKNRutaKey) {
                  modificoUbicacionRutaconParada=true;
                  this.form.get('ubicacionOrigenKN').setValue( this.fn.setearKN(this.listadoRutaParadas[0].ubicacion) );
                  if(this.form.get('origenEsDestino').value) {
                      this.form.get('ubicacionDestinoKN').setValue( this.fn.setearKN(this.listadoRutaParadas[0].ubicacion) );
                  }
              }
              if(ubicacionDestinoKNParadaKey != ubicacionDestinoKNRutaKey && cantParadas>1) {
                  modificoUbicacionRutaconParada=true;
                  if(this.form.get('origenEsDestino').value==false) {
                    this.form.get('ubicacionDestinoKN').setValue( this.fn.setearKN(this.listadoRutaParadas[cantParadas-1].ubicacion) );
                  }
              }

              console.log("this.listadoRutaParadas",this.listadoRutaParadas);

              // Actualizo la fecha de grabación de todas las paradas en Firebase
              for(let i=0; i<this.listadoRutaParadas.length;i++) {
                  let documento=this.listadoRutaParadas[i];
                  
                  // Grabo Nueva Fecha/Hora en Parada
                  this.bdService.updateColeccion({
                        operacion        : 'modificar',
                        nombreColeccion  : 'RutasParadas',
                        documento        : documento,
                        distribuidorKN   : this.distribuidorKN,
                        organizacionKNAI : this.organizacionKNAI,                           
                        usuarioKANE      : this.usuarioKANE
                    }).then(dato=>{
                          let keyForm = dato.replace('|mensajes.grabacionOk', '');
                          let mensajeServicio = dato.replace(keyForm+'|', '');
                          log(...values('success','Grabación OK Drag&Drop Parada',mensajeServicio,keyForm));
                    }).catch(error=>{
                          log(...values("error","Error Grabación Drag&Drop Parada - error:",error));
                    });                  
              }    
              
              if(modificoUbicacionRutaconParada) {
                  // Grabo Nuevo Origen o Destino en Ruta
                  
                  let documento=this.form.value;
                  let controls=this.form.controls;  
                  
                  // Agrego campos eliminados de value por los disable()
                  documento = this.fn.agregarDisabledFields(documento,controls);
            
                  // Formateo campos de tipo decimal
                  for(let i=0; i<this.grilla.camposDecimal.length;i++) {
                      let fieldName = this.grilla.camposDecimal[i];
                      let value = this.fn.getDocField(documento,fieldName);
                      //console.log("xx1 fieldName, value1",fieldName, value);
                      if(value!=null) {              
                          let valueFloat = this.fn.convertMaskDecimalelToFloat( value, 2);    
                          documento = this.fn.setDocField(documento, fieldName, valueFloat);
                      }          
                  }
                  
                  // Actualizo el array de Estados Paradas
                  documento['estadosParadas']=[];
                  for(let i=0; i<this.listadoRutaParadas.length;i++) {
                      documento['estadosParadas'].push(this.listadoRutaParadas[i].estadoParadaKN?.key);
                  }      
                    
                  console.log("documento Rutas",documento);
                                  
                  this.bdService.updateColeccion({
                        operacion        : 'modificar',
                        nombreColeccion  : 'Rutas',
                        documento        : documento,
                        distribuidorKN   : this.distribuidorKN,
                        organizacionKNAI : documento.organizacionKNAI,                           
                        usuarioKANE      : this.usuarioKANE
                    }).then(dato=>{
                          let keyForm = dato.replace('|mensajes.grabacionOk', '');
                          let mensajeServicio = dato.replace(keyForm+'|', '');
                          log(...values('success','Grabación OK Drag&Drop Ruta',mensajeServicio,keyForm));
                    }).catch(error=>{
                          log(...values("error","Error Grabación Drag&Drop Ruta - error:",error));
                    });                    
              }
         })
       );
       
       this.subsDragDrop.add(this.dragulaService.removeModel(this.BAG)
         .subscribe(({ el, source, item, sourceModel }) => {
              console.log('Drag&DropElement - removeModel:');
              console.log('removeModel:');
              console.log(el);
              console.log(source);
              console.log(sourceModel);
              console.log(item);
         })
       );     
  }       

  dragDropDesusbcribir() {
    console.log("xx dragDropDesusbcribir !!!");
    this.subsDragDrop.unsubscribe();
  }
  
  onResultGetSubscripcionPrincipal() {
      log(...values('funcionComponente','componente.onResultGetSubscripcionPrincipal'));
     
      // Acciones especificas sobre ListadoPrincipal del Componente
      console.log("this.componenteIntegrantesDocumentoInicial",this.componenteIntegrantesDocumentoInicial);
      console.log("this.componenteVehiculosDocumentoInicial",this.componenteVehiculosDocumentoInicial);
      console.log("this.componenteParadasDocumentoInicial",this.componenteParadasDocumentoInicial);
      if(this.componenteIntegrantesDocumentoInicial)  this.forzarSolapa('Ficha',null,'consultar');
      if(this.componenteVehiculosDocumentoInicial)    this.forzarSolapa('Ficha',null,'consultar');
      if(this.componenteParadasDocumentoInicial)      this.forzarSolapa('Ficha',null,'consultar');
      
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
      
      super.onResultGetSubscripcionPrincipal();
  }  
  
  onResultGetSubscripcionSecundarias() {
    log(...values('funcionComponente','pageGenerica.nResultGetSubscripcionSecundarias'));
    
    super.onResultGetSubscripcionSecundarias();    
  }    
  
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
    
    if(this.accionForm=='agregar') {      
        if(this.subscripcionRutaVehiculos)   this.subscripcionRutaVehiculos.unsubscribe();
        if(this.subscripcionRutaIntegrantes) this.subscripcionRutaIntegrantes.unsubscribe();
        if(this.subscripcionRutaParadas)     this.subscripcionRutaParadas.unsubscribe();
        
        this.listadoRutaVehiculos=[];
        this.listadoRutaIntegrantes=[];
        this.listadoRutaParadas=[];
        
    } else {    
      
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
                this.paradasDragAndDrop=[];
                for(let j=0; j<data.length; j++) {
                    let documento=data[j];
                    documento=this.fn.corrigeTimestampDocumento(documento);  
                    this.listadoRutaParadas.push(documento);
                    this.paradasDragAndDrop.push(documento.ubicacion.nombre);
                }             
                log(...values("valores","listadoRutaParadas",this.listadoRutaParadas));

            },(error:any)=>{
                log(...values("error al obtener RutasParadas",error));
            });         
        
          
    } // fin id accion='agregar'

  
  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Rutas', accion));

    super.setAccionForm(accion);
    
    // Agregar acá, modificaciones adicionales al this.form
    if(this.accionForm=='agregar') {
        
        if(this.organizacionKNAI) {
            this.form.get('distribuidorKN').setValue( this.distribuidorKN );
            this.form.get('organizacionKNAI').setValue( this.organizacionKNAI );
        }
        
        this.form.get('fechaHoraCarga').setValue( new Date() );        
        this.form.get('formaCarga').setValue('calculaHorarios');
        
        this.form.get('estadoRutaKN').setValue({
            key: 'EnCarga',
            nombre: 'En Carga'
        });            
    }  
    
    if(this.accionForm=='agregar' || this.accionForm=='modificar') {
        this.form.get('fechaHoraInicioPlaneada').disable();      
        this.form.get('fechaHoraSalidaPlaneada').disable();        
        
        if(this.form.get('ubicacionOrigenKN').value) {
            this.form.get('organizacionKNAI').disable();      
            this.form.get('sucursalKN').disable();      
            this.form.get('areaNegocioKN').disable();                        
        }
        
        this.onChangeRutaEsDestino();
    }
    
    if(this.accionForm=='modificar' && this.listadoRutaParadas.length>0) {
        this.form.get('organizacionKNAI').disable();      
    }  
        

  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Rutas.onSubmit'));
    console.log("onSubmit",documento);

    if(this.licencias.seSuperoLimiteLicenciaPermitidas){
        this.alertService.confirm({ 
           
                title:   this.translate.instant('moduloRutas.alertaLicenciasTitulo'), 
                message: this.translate.instant('moduloRutas.alertaLicenciasmensaje') }).then(data=>{

                    if(this.licencias.bloqueadoPorLicencias){
                        return;
                    }else{

                     this.submitPermitido(documento);
                    }
         });
   
    } else {
        this.submitPermitido(documento);
    }


  }  
  
  submitPermitido(documento:any):void {

        // Agregar acá, modificaciones adicionales al this.form
        if(this.form.controls['origenEsDestino'].value) {
            documento['ubicacionDestinoKN']=this.form.controls['ubicacionOrigenKN'].value;
        }
        
        let estadoRutaKey = this.fn.mostrarKN(this.form.controls['estadoRutaKN'].value,'key');
        if([ 'PendienteEjecucion', 'EnOrigen','EnReparto', 'LlegadaDestino'].indexOf(estadoRutaKey)!=-1) {
            documento['mostrarEnMonitor']=true;
        } else { // PendienteEjecucion, CierreEjecucion
            documento['mostrarEnMonitor']=false;
        }
        
        super.onSubmit(documento);

  }


  // Funciones Específicas del Modulo
  
  onChangeRutaEsDestino() {
      let origenEsDestino = this.form.get('origenEsDestino').value;
      if(origenEsDestino==false) {
          this.form.get('fechaHoraArriboPlaneada').disable();      
          this.form.get('fechaHoraFinalizacionPlaneada').disable();      
      } else {
          this.form.get('fechaHoraArriboPlaneada').enable();      
          this.form.get('fechaHoraFinalizacionPlaneada').enable();
      }
    
  }  

  clickSolapa(solapa) {
      console.log("clickSolapa",solapa);

      this.componenteIntegrantesDocumentoInicial=null;
      this.componenteVehiculosDocumentoInicial=null;
      this.componenteParadasDocumentoInicial=null;
      
      if(solapa=='#tabRecorrido') {
        
        console.log("this.dif 1",this.dif);
        let difAnterior = this.dif;
        // if(difAnterior!='INICIAL') {
        //     document.getElementById('mapRuta'+difAnterior).style.display='none';
        // }
        //document.getElementById('mapRuta'+difAnterior).style.display='none';
        
        // document.getElementById('mapRuta'+difAnterior).remove();
        // var element = document.getElementById("element-id");
        // element.parentNode.removeChild(element);        
        
        this.dif = Math.floor((99999) * Math.random()).toString();
        // console.log("this.dif 2",this.dif);
          
        setTimeout (() => {
            
            console.log("this.dif",this.dif);
            //document.getElementById('mapRuta'+this.dif).style.display='block';
        
            this.hereService.drawRuta('mapRuta'+this.dif, this.listadoRutaParadas, [],
                            'ubicacion.direccion.geoPoint', this.organizacionKNAI, this.usuarioKANE, 'Rutas');
              
        }, 300);
            
      }
  }    
  
  forzarSolapa(solapa:string, documento:any, accion:string) {
      console.log("abrirSolapa",solapa, documento, accion);
      
      setTimeout (() => {
        
        $("#tabFicha").removeClass('active');  
        $("#tabIntegrantes").removeClass('active');  
        $("#tabVehiculos").removeClass('active');  
        $("#tabParadas").removeClass('active');  

        $("#panelFicha").removeClass('active');  
        $("#panelIntegrantes").removeClass('active');  
        $("#panelVehiculos").removeClass('active');  
        $("#panelParadas").removeClass('active');  

        if(solapa=="Ficha") {
            $("#tabFicha").addClass('active');  
            $("#panelFicha").addClass('active');  
        }        
        if(solapa=="Integrantes") {
            $("#tabIntegrantes").addClass('active');  
            $("#panelIntegrantes").addClass('active');  
            
            this.componenteIntegrantesAccionInicial    = 'consultar';
            this.componenteIntegrantesDocumentoInicial = documento;            
        }
        if(solapa=="Vehiculos") {
            $("#tabVehiculos").addClass('active');  
            $("#panelVehiculos").addClass('active');  
            
            this.componenteVehiculosAccionInicial    = 'consultar';
            this.componenteVehiculosDocumentoInicial = documento;                      
        }  
        if(solapa=="Paradas") {
            console.log("Activó Solapa Paradas");
            $("#tabParadas").addClass('active');  
            $("#panelParadas").addClass('active');  
            
            this.componenteParadasAccionInicial    = 'consultar';
            this.componenteParadasDocumentoInicial = documento;
        }
          
      }, 300);
  }
 
  formatearDocumentoconForm(documento:any, cual):any {
      let controls=this.form.controls;  
      
      let documentoClon={...documento};
  
      // Agrego campos eliminados de value por los disable()
      documentoClon = this.fn.agregarDisabledFields(documentoClon,controls);
      
      let aux=documentoClon.distanciaPlanificada;
      //console.log("documento.distanciaPlanificada1",aux);

      // Formateo campos de tipo decimal
      for(let i=0; i<this.grilla.camposDecimal.length;i++) {
          let fieldName = this.grilla.camposDecimal[i];
          let value = this.fn.getDocField(documento,fieldName);
          //console.log("xx1 fieldName, value1",fieldName, value);
          if(value!=null) {              
              let valueFloat = this.fn.convertMaskDecimalelToFloat( value, 2);    
              documentoClon = this.fn.setDocField(documentoClon, fieldName, valueFloat);
          }          
      }
      
      if( JSON.stringify(this.documentoOriginal) != JSON.stringify(documentoClon) ) {
            //log(...values('valores','formatearDocumentoconForm documento:',documentoClon));
            //log(...values('valores','controls:',controls));      
            this.documentoOriginal = documentoClon;
      }
      //console.log("documento.distanciaPlanificada2",documentoClon.distanciaPlanificada);
      
      return documentoClon;            
      
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

  

}