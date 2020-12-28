import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, DoCheck, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { formatNumber }                                                              from '@angular/common'
import { FormGroup, FormControl, FormBuilder, Validators, FormsModule }              from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './rutas-vehiculos.config';

// Firebase
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Query } from '@angular/fire/firestore';
import { take, first } from 'rxjs/operators';

// Cosas Extras a page-generica
import { getApisFunciones }   from '@maq-mocks/apis/apis';

// Otras Librerías
import { formatCurrency, getCurrencySymbol } from '@angular/common'
import * as Inputmask from "inputmask"

import { KN, KANE, KNAI }       from '@maq-models/typesKN/typesKN.model';
import { Ruta }                 from '../../../models/rutas/rutas.model';

@Component({
  selector: 'app-rutas-vehiculos',
  templateUrl: './rutas-vehiculos.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './rutas-vehiculos.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class RutasVehiculosComponent extends PageGenerica implements OnInit, OnDestroy, DoCheck {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  
  
  @Input() public ruta             : Ruta;
  @Input() public permisos         : any;
  @Input() public accionInicial    : any;
  @Input() public documentoInicial : any;
  
  @Output() actualizarRutaconComponente= new EventEmitter<any>();

  public logComponente = log(...values('componente', 'rutasVehiculos'));  
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit rutasVehiculos'));

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
  }

  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy Distribuidores'));
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
    log(...values('funcionComponente','abrirFormulario Componente', documento));
    
    super.abrirFormulario(documento);

  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Componente Primas', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form

  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Componente.onSubmit'));

    // Agregar acá, modificaciones adicionales al this.form
    documento.keyRuta=this.ruta.key;
    
    super.onSubmit(documento);
  }  
  
  postGrabarColeccion(documento:any)  {
    
      console.log("postGrabarColeccion Componente",documento);
      
      this.af.collection<any>('RutasVehiculos',
          ref =>{
              let query : Query = ref;
              query = query.where( 'keyRuta', '==', this.ruta.key);                   
              // query = query.orderBy('principal',  'asc');                  
              log(...values("valoresDebug","query:",query));                  
              return query;
              
      }).valueChanges().pipe(first()).toPromise().then((data:any)=>{
        
            log(...values("valores","cantResultados:",data.length));
            log(...values("valores","data:",data));
  
            documento=this.ruta;
            documento.vehiculoPrincipalKN = false;
            let totalSizeOf=0;
            let cantDocumentos=data.length;
            for(let i=0; i<data.length; i++) {      
                if(data[i].principal) {
                  documento.vehiculoPrincipalKN = this.fn.setearKN(data[i].vehiculo);
                }                
                totalSizeOf += data[i].settings.sizeOfDocumento;    
            } 
            
            this.apis.LogApiFuncion({
                 eventoQueDisparo : 'rutas-vehiculos-Grabacion Vehiculos en Ruta',
                 apiFuncionKey    : 'FirestoreDocumentRead', 
                 organizacionKNAI : this.organizacionKNAI,
                 usuarioKANE      : this.usuarioKANE,
                 nombreColeccion  : 'RutasVehiculos',
                 cloudFunction    : null,
                 cantidad         : cantDocumentos, 
            });

            this.apis.LogApiFuncion({
                 eventoQueDisparo : 'rutas-vehiculos-Grabacion Vehiculos en Ruta',
                 apiFuncionKey    : 'FirestoreTransferencia', 
                 organizacionKNAI : this.organizacionKNAI,
                 usuarioKANE      : this.usuarioKANE,
                 nombreColeccion  : 'RutasVehiculos',
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

                    log(...values('success','resupuesta Promesa ok',mensajeServicio,keyForm));
                    this.spinner.hide();
                    
                    console.log("actualizarRutaconComponente.emit",documento);
                    this.actualizarRutaconComponente.emit(documento);

              })
              .catch(error=>{
                    log(...values("error","Error Promesa Update Coleccion:",error));

                    this.spinner.hide();
                    this.toastrService.error('', this.translate.instant('mensajes.errorGrabar'),{
                               timeOut: 2000, positionClass:'toast-top-center'});
              });

        }).catch((error:any)=>{
            this.spinner.hide();
            console.error("error", "Error al actualizar los datos del vehículo en la Ruta", error);
        });
      
    
  }
  

}