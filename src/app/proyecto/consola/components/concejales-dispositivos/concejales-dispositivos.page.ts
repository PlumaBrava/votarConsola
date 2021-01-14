import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';



import { PageGenerica2 }        from '@maq-modules/page-generica/page-generica2.page';
import { ConfigComponente }     from './concejales-dispositivos.config';


import {ConcejalesDispositivos, ConcejalesDispositivosInterface,
        Concejales, ConcejalesInterface}       from '@proyecto/models/concejales/concejales.model';
import {Dispositivos, DispositivosInterface}   from '@proyecto/models/dispositivos/dispositivos.model';



import firebase from 'firebase/app';
import 'firebase/firestore';

import { environment } from '@environments/environment';

declare let $: any;
declare let jQuery: any;

declare var H: any;  

@Component({
  selector: 'app-concejales-dispostivos',
  templateUrl: './concejales-dispositivos.page.html', 
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './concejales-dispositivos.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ConcejalesDispositivosComponent extends PageGenerica2<ConcejalesDispositivos<ConcejalesDispositivosInterface> > implements OnInit, OnDestroy {

  concejalSeleccionado:ConcejalesInterface=null;
  dispositivoSeleccionado:DispositivosInterface=null;


  constructor (protected changeDetectorRef    : ChangeDetectorRef)  {    
      super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'Concejales-Dispositivos'));
 


  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit '+this));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     // Escondo Menú Izquierdo
    //  let self=this;
    //  setTimeout(function () {
    //     self.appSettings.settings2.panel.showMenu = false;      
    //  }, 500);                   
     
     // Calculo Ancho de Mapa y Listado


     super.ngOnInit()
  
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }  

  configuracionComponente() {
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
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
  
  
  
  abrirFormulario(documento) {
    log(...values('funcionComponente','abrirFormulario Componente', documento));

    super.abrirFormulario(documento);

    
    if(this.accionForm=='agregar') {      
        
    } else {    
      
           
          
    } 

  
  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm '+this.nombreColeccion, accion));

    super.setAccionForm(accion);
    
    // Agregar acá, modificaciones adicionales al this.form
    if(this.accionForm=='agregar') {
        
        if(this.organizacionKNAI) {
            // this.form.get('distribuidorKN').setValue( this.distribuidorKN );
            // this.form.get('organizacionKNAI').setValue( this.organizacionKNAI );
        }
        
        // this.form.get('fechaHoraCarga').setValue( new Date() );        
        // this.form.get('formaCarga').setValue('calculaHorarios');
        
    }  
    
    if(this.accionForm=='agregar' || this.accionForm=='modificar') {
               
        
        // if(this.form.get('ubicacionOrigenKN').value) {
        //     this.form.get('organizacionKNAI').disable();      
        //     this.form.get('sucursalKN').disable();      
        //     this.form.get('areaNegocioKN').disable();                        
        // }
        
        
    }
    
    if(this.accionForm=='modificar' ) {
        // this.form.get('organizacionKNAI').disable();      
    }  
        

  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Rutas.onSubmit'));
    console.log("onSubmit",documento);

        // Agregar acá, modificaciones adicionales al this.form
    

        this.form.get('NumConcejal').setValue(this.concejalSeleccionado.NumConcejal)
        this.form.get('NumDispositivo').setValue()
        this.form.get('Funcion').setValue()
        this.form.get('Clave').setValue()
        this.form.get('Macaddresses').setValue()
        this.form.get('Presente').setValue()
    super.onSubmit(documento);

  }  
  





  clickSolapa(solapa) {
      console.log("clickSolapa",solapa);

      
      if(solapa=='#tabRecorrido') {
        
      
          
        setTimeout (() => {
            

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
            
            // this.componenteIntegrantesAccionInicial    = 'consultar';
            // this.componenteIntegrantesDocumentoInicial = documento;            
        }
        if(solapa=="Vehiculos") {
            $("#tabVehiculos").addClass('active');  
            $("#panelVehiculos").addClass('active');  
            
            // this.componenteVehiculosAccionInicial    = 'consultar';
            // this.componenteVehiculosDocumentoInicial = documento;                      
        }  
        if(solapa=="Paradas") {
            console.log("Activó Solapa Paradas");
            $("#tabParadas").addClass('active');  
            $("#panelParadas").addClass('active');  
            
            // this.componenteParadasAccionInicial    = 'consultar';
            // this.componenteParadasDocumentoInicial = documento;
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

  seleccionarConcejal(documento:ConcejalesInterface){
    this.concejalSeleccionado=documento;
    console.log('concejalSeleccionado',this.concejalSeleccionado);
  }
  
  selccionarDispositivo(documneto:DispositivosInterface){
    this.dispositivoSeleccionado=documneto;
    console.log('dispositivoSeleccionado',this.dispositivoSeleccionado);
  }
  
  enlazar(){
    if(this.selccionarDispositivo==null || this.seleccionarConcejal ==null){
      console.log('dispositivoSeleccionado',this.dispositivoSeleccionado);
      console.log('concejalSeleccionado',this.concejalSeleccionado);

    } else{
      
      this.alertService.confirm({ 
        title:   this.translate.instant('Enlazar Concejal y Dispositivo'), 
        message: 'Seleccione un Concejal y un dispositivo'
     
      }).then(data=>{});
    }
  }

}