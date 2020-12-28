import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, DoCheck, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { formatNumber }                                                              from '@angular/common'
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule }              from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './rutas-paradas.config';

// Firebase
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Query } from '@angular/fire/firestore';
import { take, first } from 'rxjs/operators';

// Cosas Extras a page-generica
import { getApisFunciones }   from '@maq-mocks/apis/apis';
// Mocks de Rutas
import { ESTADOS_PARADAS,ESTADOS_RUTA }                 from '@proyecto/mocks/rutas_y_paradas/rutasParadas.mocks';


// Otras Librerías
import { formatCurrency, getCurrencySymbol } from '@angular/common'
import * as Inputmask from "inputmask";

import { KN, KANE, KNAI }       from '@maq-models/typesKN/typesKN.model';
import { Ruta }                 from '../../../models/rutas/rutas.model';

@Component({
  selector: 'app-rutas-paradas',
  templateUrl: './rutas-paradas.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './rutas-paradas.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class RutasParadasComponent extends PageGenerica implements OnInit, OnDestroy, DoCheck {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  
  
  @Input() public ruta             : Ruta;
  @Input() public permisos         : any;
  @Input() public accionInicial    : any;
  @Input() public documentoInicial : any;  
  
  @Output() actualizarRutaconComponente= new EventEmitter<any>();

  public logComponente = log(...values('componente', 'rutasParadas'));  
  
  public nombresUnidadesMedida:any = {
    unidad1: null,
    unidad2: null,
    unidad3: null,
  };
  
  public ubicacion_direccion:string=null;
  
  public whereUbicaciones:any[]=[];
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit rutasParadas'));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     super.ngOnInit()
          
  }

  ngDoCheck() {
      if(this.accionInicial!='listado') {
          console.log("ngDoCheck",this.accionInicial, this.documentoInicial);
          this.accionInicial='listado';
          this.abrirFormulario(this.documentoInicial);
      } 
      this.whereUbicaciones = [{ key: 'sucursalKN.key',  operador: '==', value: this.fn.mostrarKN(this.ruta.sucursalKN,'key')},
                               { key: 'areaNegocio.key', operador: '==', value: this.fn.mostrarKN(this.ruta.areaNegocioKN,'key')}];
  }
  
  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy rutasParadas'));
  }  
  
  configuracionComponente() {
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={
          ruta: this.ruta
        };
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
      
      super.onResultGetSubscripcionPrincipal();
  }  
  
  onResultGetSubscripcionSecundarias() {
    log(...values('funcionComponente','pageGenerica.nResultGetSubscripcionSecundarias'));
    
    super.onResultGetSubscripcionSecundarias();    

  }    
  
  onResultGetSubscripcionPrincipalYSecundarias() {
    log(...values('funcionComponente','componente.onResultGetSubscripcionPrincipalYSecundarias'));

    super.onResultGetSubscripcionPrincipalYSecundarias();    

  }    
  
  abrirFormulario(documento) {
    log(...values('funcionComponente','abrirFormulario Componente'));
    log(...values('valores','documento:',documento));
    
    super.abrirFormulario(documento);
    
    this.form.get('ubicacion').valueChanges.subscribe((ubicacion:any) => {
        this.nombresUnidadesMedida=ubicacion.areaNegocio.nombresUnidadesMedida;
    });
    
    if( this.fn.getDocField(documento, 'ubicacion.areaNegocio.nombresUnidadesMedida')!=null ) {
        this.nombresUnidadesMedida=documento.ubicacion.areaNegocio.nombresUnidadesMedida;
    }
    
    if(this.accionForm=='consultar') {
      this.ubicacion_direccion=this.fn.getDireccionTextArea( documento.ubicacion.direccion, 'direccion+ciudad');  
    }

    
    this.form.get('ubicacion').valueChanges.subscribe(ubicacion => {
          
        this.ubicacion_direccion=this.fn.getDireccionTextArea( ubicacion.direccion, 'direccion+ciudad');

        if(this.accionForm=='agregar' && this.listadoPrincipal.length>0) {
        
            let latitud1    = this.listadoPrincipal[ this.listadoPrincipal.length-1 ].ubicacion.direccion.geoPoint.latitud;
            let longitud1   = this.listadoPrincipal[ this.listadoPrincipal.length-1 ].ubicacion.direccion.geoPoint.longitud;
            let fechaHoraFinalizacionPlaneada1 = this.listadoPrincipal[ this.listadoPrincipal.length-1 ].fechaHoraFinalizacionPlaneada;
            console.log("fechaHoraFinalizacionPlaneada1",fechaHoraFinalizacionPlaneada1);
            
            let latitud2    = ubicacion.direccion.geoPoint.latitud;
            let longitud2   = ubicacion.direccion.geoPoint.longitud;
            let fechaHoraInicioPlaneada2 = this.form.get('fechaHoraInicioPlaneada').value;

            if(fechaHoraInicioPlaneada2!='') {
                let kmDistancia                = this.fn.distancia_geopoints( latitud1, longitud1, latitud2, longitud2, "km");  
                console.log("kmDistancia",kmDistancia);
                let minutosEntreGeoPoint:number;
                if(kmDistancia>10) {
                    minutosEntreGeoPoint = kmDistancia * 1;  
                } else if(kmDistancia>2) {
                    minutosEntreGeoPoint = kmDistancia * 2;  
                } else {
                    minutosEntreGeoPoint = kmDistancia * 5;  
                }
                
                console.log("minutosEntreGeoPoint",minutosEntreGeoPoint);
                fechaHoraInicioPlaneada2 = this.fn.addMinutosToDatetime(fechaHoraFinalizacionPlaneada1,minutosEntreGeoPoint);
                console.log("fechaHoraInicioPlaneada2",fechaHoraInicioPlaneada2);
                this.form.get('fechaHoraInicioPlaneada').setValue(fechaHoraInicioPlaneada2);                  
            }
        }
            
    });            

    this.form.get('fechaHoraInicioPlaneada').valueChanges.subscribe(fechaHoraInicioPlaneada => {
        let ubicacion = this.form.get('ubicacion').value;
        if(ubicacion && fechaHoraInicioPlaneada && this.form.get('fechaHoraFinalizacionPlaneada').value==null) {
            let tiempoServicio  = ubicacion.tiempoServicio;
            console.log("tiempoServicio",tiempoServicio);            
            if(tiempoServicio.hour!==undefined && tiempoServicio.minute!==undefined && tiempoServicio.second!==undefined) {
                let minutosServicio = tiempoServicio.hour*60 + tiempoServicio.minute + tiempoServicio.second/60;
                console.log("minutosServicio",minutosServicio);
                let fechaHoraFinalizacionPlaneada = this.fn.addMinutosToDatetime(fechaHoraInicioPlaneada,minutosServicio);
                this.form.get('fechaHoraFinalizacionPlaneada').setValue(fechaHoraFinalizacionPlaneada);                  
            }              
        }
    });            
    
  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Componente Primas', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form
    if(this.accionForm=='agregar') {

        this.form.get('estadoParadaKN').setValue(ESTADOS_PARADAS['ParadaPendiente']);            
    }

    
  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Componente.onSubmit'));

    // Agregar acá, modificaciones adicionales al this.form
    documento.keyRuta=this.ruta.key;
    
    if(this.accionForm=='agregar') {
        documento.estadoParadaKN=ESTADOS_PARADAS['ParadaPendiente'];
        documento.orden = this.listadoPrincipal.length+1;
    }
    
    super.onSubmit(documento);
  }  
  
  postGrabarColeccion(documento:any)  {
    
      console.log("postGrabarColeccion Componente",documento);
      
      this.af.collection<any>('RutasParadas',
          ref =>{
              let query : Query = ref;
              query = query.where( 'keyRuta', '==', this.ruta.key);                   
              query = query.orderBy('fechaHoraInicioPlaneada',  'asc');                  
              log(...values("valoresDebug","query:",query));                  
              return query;
              
      }).valueChanges().pipe(first()).toPromise().then((data:any)=>{
        
            log(...values("valores","cantResultados:",data.length));
            log(...values("valores","data:",data));
  
            documento=this.ruta;
            documento.distanciaPlanificada=0;
            
            documento.ubicacionOrigenKN=null;
            documento.fechaHoraInicioPlaneada=null;
            documento.fechaHoraSalidaPlaneada=null;
            
            documento.ubicacionDestinoKN=null;
            if(documento.origenEsDestino==false) {
                documento.fechaHoraArriboPlaneada=null;
                documento.fechaHoraFinalizacionPlaneada=null;                
            }

            documento['estadosParadas']=[];
            
            let totalSizeOf=0;
            let cantDocumentos=data.length;
            for(let i=0; i<data.length; i++) {      
                let documentoParada=this.fn.corrigeTimestampDocumento(data[i]);
                
                documento['estadosParadas'].push(data[i].estadoParadaKN?.key);
                
                console.log("zzz documentoParada",i, documentoParada, documentoParada.ubicacion.nombre);
              
                if(i==0) {
                    documento.ubicacionOrigenKN               = this.fn.setearKN(documentoParada.ubicacion);
                    documento.fechaHoraInicioPlaneada         = documentoParada.fechaHoraInicioPlaneada;
                    documento.fechaHoraSalidaPlaneada         = documentoParada.fechaHoraFinalizacionPlaneada;
                    
                    console.log("zzz ubicacionOrigenKN",documento.ubicacionOrigenKN);
                }         
                if(i>0) {
                    let documentoParadaAnterior = this.fn.corrigeTimestampDocumento(data[i-1]);
                    console.log("zzz documentoParadaAnterior",documentoParadaAnterior);
                    
                    let latitud1    = documentoParadaAnterior.ubicacion.direccion.geoPoint.latitud;
                    let longitud1   = documentoParadaAnterior.ubicacion.direccion.geoPoint.longitud;
                    let latitud2    = documentoParada.ubicacion.direccion.geoPoint.latitud;
                    let longitud2   = documentoParada.ubicacion.direccion.geoPoint.longitud;
                    let kmDistancia = this.fn.distancia_geopoints( latitud1, longitud1, latitud2, longitud2, "km");      
                    documento.distanciaPlanificada += kmDistancia;
                    
                    let minutosEntreParadas;
                    if(kmDistancia>10) {
                        minutosEntreParadas = kmDistancia * 1;  
                    } else if(kmDistancia>2) {
                        minutosEntreParadas = kmDistancia * 2;  
                    } else {
                        minutosEntreParadas = kmDistancia * 5;  
                    }   
                    
                    if(documento.formaCarga=='calculaHorarios') {
                        documentoParada.fechaHoraInicioPlaneada       = this.fn.addMinutosToDatetime( documentoParadaAnterior.fechaHoraFinalizacionPlaneada ,minutosEntreParadas);  
                        let minutosServicio = this.fn.getMinutosServicio(documentoParada.ubicacion.tiempoServicio);  
                        documentoParada.fechaHoraFinalizacionPlaneada = this.fn.addMinutosToDatetime( documentoParada.fechaHoraInicioPlaneada,minutosServicio);  
                        data[i]=documentoParada;

                        console.log("zzz fechaHoraInicioPlaneada calculada",documentoParada.fechaHoraInicioPlaneada);
                        this.bdService.updateColeccion({
                              operacion        : 'modificar',
                              nombreColeccion  : 'RutasParadas',
                              documento        : documentoParada,
                              distribuidorKN   : this.distribuidorKN,
                              organizacionKNAI : documento.organizacionKNAI,                           
                              usuarioKANE      : this.usuarioKANE
                          }).then(dato=>{
                                let keyForm = dato.replace('|mensajes.grabacionOk', '');
                                let mensajeServicio = dato.replace(keyForm+'|', '');

                          }).catch(error=>{
                                log(...values("error","Error Promesa Update Rutas:",error));
                          });
                    }      
                    
                }    
                if(i==data.length-1 && documento.origenEsDestino==false) {
                    documento.ubicacionDestinoKN              = this.fn.setearKN(documentoParada.ubicacion);
                    documento.fechaHoraArriboPlaneada         = documentoParada.fechaHoraInicioPlaneada;
                    documento.fechaHoraFinalizacionPlaneada   = documentoParada.fechaHoraFinalizacionPlaneada;
                    
                    console.log("zzz ubicacionDestinoKN",i,data.length-1);
                    console.log("zzz ubicacionDestinoKN",i,documento.ubicacionDestinoKN);
                    console.log("zzz ubicacionDestinoKN",i,documentoParada.ubicacion);
                    
                }  
                
                totalSizeOf += data[i].settings.sizeOfDocumento;    
                
            } 
            
            // Acumulo para Totales Apis valores del Documento
            totalSizeOf += documento.settings.sizeOfDocumento;    
            cantDocumentos++;
            
            this.apis.LogApiFuncion({
                 eventoQueDisparo : 'rutas-paradas-Grabacion',
                 apiFuncionKey    : 'FirestoreDocumentRead', 
                 organizacionKNAI : this.organizacionKNAI,
                 usuarioKANE      : this.usuarioKANE,
                 nombreColeccion  : 'RutasParadas',
                 cloudFunction    : null,
                 cantidad         : cantDocumentos, 
            });

            this.apis.LogApiFuncion({
              eventoQueDisparo : 'rutas-paradas-Grabacion',
                 apiFuncionKey    : 'FirestoreTransferencia', 
                 organizacionKNAI : this.organizacionKNAI,
                 usuarioKANE      : this.usuarioKANE,
                 nombreColeccion  : 'RutasParadas',
                 cloudFunction    : null,
                 cantidad         : totalSizeOf, 
            });
            
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

                    this.spinner.hide();
                    
                    this.actualizarRutaconComponente.emit(documento);

              }).catch(error=>{
                    log(...values("error","Error Promesa Update Rutas:",error));

                    this.spinner.hide();
                    this.toastrService.error('', this.translate.instant('mensajes.errorGrabar'),{
                               timeOut: 2000, positionClass:'toast-top-center'});
              });

        }).catch((error:any)=>{
            this.spinner.hide();
            console.error("error", "Error al actualizar los datos del vehículo en la Ruta", error);
        });
  }
  
  // Funciones Específicas del Módulo
  kmDistanciaDireccionAnterior(index:number):number {
        if(index>0) {
            let latitud1    = this.listadoPrincipal[ index-1 ].ubicacion.direccion.geoPoint.latitud;
            let longitud1   = this.listadoPrincipal[ index-1 ].ubicacion.direccion.geoPoint.longitud;
            let latitud2    = this.listadoPrincipal[ index ].ubicacion.direccion.geoPoint.latitud;
            let longitud2   = this.listadoPrincipal[ index ].ubicacion.direccion.geoPoint.longitud;

            let kmDistancia = this.fn.distancia_geopoints( latitud1, longitud1, latitud2, longitud2, "km");  
            return kmDistancia;
        }    
        return 0;

  }
  
  getColorParada(tipoParada) {
    let tipoParadaKey = this.fn.mostrarKN(tipoParada,'key');
    if(tipoParadaKey=='Parada') {
        return {};
    } else if(tipoParadaKey=='Deposito') {
        return { 'color':' blue' };
    } else {
        return { 'color':' red' };        
    }    
  }
  
  

}