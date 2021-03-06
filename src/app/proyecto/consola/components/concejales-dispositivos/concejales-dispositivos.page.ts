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

  concejalSeleccionado    : ConcejalesInterface=null;
  dispositivoSeleccionado : DispositivosInterface=null;
  listadoDispositivos     : DispositivosInterface[]=[];
  listadoConcejales       : ConcejalesInterface[]=[];
  esPresidente            : boolean=false;
  yaExisteUnPresidente    : boolean=false;
  public CLAVE_DEFAULT    : string='123abc';


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
    log(...values('funcionComponente','pageGenerica.onResultGetSubscripcionSecundarias'));
    super.onResultGetSubscripcionSecundarias();    
  }    
  
  onResultGetSubscripcionPrincipalYSecundarias(){
    log(...values('funcionComponente','pageGenerica.onResultGetSubscripcionPrincipalYSecundarias'));

    this.listadoDispositivos    = this.msg.cacheColecciones['Dispositivos'];
    this.listadoConcejales      = this.msg.cacheColecciones['Concejales'];
    this.yaExisteUnPresidente   = false;
    this.esPresidente           = false;
    
    for (let index = 0; index < this.listadoPrincipal.length; index++) {
      const concDisp:ConcejalesDispositivosInterface = this.listadoPrincipal[index];
      if(concDisp.Funcion){
        this.yaExisteUnPresidente=true;
      }
      let posDisp=this.listadoDispositivos.findIndex((disp:DispositivosInterface)=>disp.NumDispositivo==concDisp.NumDispositivo);
      let posConcejal=this.listadoConcejales.findIndex((disp:ConcejalesInterface)=>disp.NumConcejal==concDisp.NumConcejal);
      if(posDisp==-1){
      // no hago nada
      }else{
        this.listadoDispositivos.splice(posDisp, 1)//elimina a partir de la posicion (pos) 1 elemento
      }
      if(posConcejal==-1){
        continue; // puedo hacer el continue porque ya procesé al dispositivo
      }else{
        this.listadoConcejales.splice(posConcejal, 1)//elimina a partir de la posicion (pos) 1 elemento
      }
    }  

    console.log('this.listadoConcejales',this.listadoConcejales);
    console.log('this.listadoDispositivos',this.listadoDispositivos);
    console.log('this.listadoDispositivos cache',this.msg.cacheColecciones['Dispositivos']);

    if (!this.changeDetectorRef['destroyed']) {
      this.changeDetectorRef.detectChanges();
    }   

    super.onResultGetSubscripcionPrincipalYSecundarias();
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
    log(...values('funcionComponente','ConcejalesDispositivos.onSubmit'));
    console.log("onSubmit",documento);

        // Agregar acá, modificaciones adicionales al this.form
    

      

    super.onSubmit(document);

  }  
  





  clickSolapa(solapa) {
      console.log("clickSolapa",solapa);

      
      if(solapa=='#tabRecorrido') {
        
      
          
        setTimeout (() => {
            

        }, 300);
            
      }
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


  // seleccionarConcejal(documento:ConcejalesInterface){

  //   if(this.concejalSeleccionado==null || this.concejalSeleccionado.NumConcejal!=documento.NumConcejal){
  //     this.concejalSeleccionado=documento;
  //   }else {
  //     this.concejalSeleccionado=null;
  //   }
    
   
   
  //   console.log('concejalSeleccionado',this.concejalSeleccionado);
  // }
  
  selccionarDispositivo(documento:DispositivosInterface){

    if(this.dispositivoSeleccionado==null || this.dispositivoSeleccionado.NumDispositivo!=documento.NumDispositivo){
      this.dispositivoSeleccionado=documento;
    }else {
      this.dispositivoSeleccionado=null;
    }
    
  
    console.log('dispositivoSeleccionado',this.dispositivoSeleccionado);
  }
  
  enlazar(){
    console.log('esPresidente',this.esPresidente);
    console.log('dispositivoSeleccionado',this.dispositivoSeleccionado);
    console.log('concejalSeleccionado',this.concejalSeleccionado);
    console.log('concejalSeleccionado',this.concejalSeleccionado);
  
    
    if(this.dispositivoSeleccionado === null || this.concejalSeleccionado === null){
      this.alertService.confirm({ 
        title:   this.translate.instant('Enlazar Concejal y Dispositivo'), 
        message: 'Seleccione un Concejal y un dispositivo'
     
      }).then(data=>{});
      

    } else{
      
      console.log('dispositivoSeleccionado',this.dispositivoSeleccionado);
      console.log('concejalSeleccionado',this.concejalSeleccionado);
      
      this.form.get('NumConcejal').setValue(this.concejalSeleccionado.NumConcejal)
      this.form.get('NumDispositivo').setValue(this.dispositivoSeleccionado.NumDispositivo)
      this.form.get('Funcion').setValue(false);
      this.form.get('Clave').setValue(this.CLAVE_DEFAULT);
      this.form.get('Macaddresses').setValue(this.dispositivoSeleccionado.Macaddresses)
      this.form.get('Presente').setValue(false);

      let d:ConcejalesDispositivosInterface={ 
        NumConcejal:this.concejalSeleccionado.NumConcejal,
        NumDispositivo:this.dispositivoSeleccionado.NumDispositivo,
        Funcion:this.esPresidente,
        Clave:this.CLAVE_DEFAULT,
        Macaddresses: this.dispositivoSeleccionado.Macaddresses,
        Presente:false,
      };
      this.grabarDatos(d)

      // if(this.esPresidente){
      //   let docPresidente:ConcejalesDispositivosInterface={ 
      //   NumConcejal:this.concejalSeleccionado.NumConcejal,
      //   NumDispositivo:this.dispositivoSeleccionado.NumDispositivo,
      //   Funcion:true,
      //   Clave:this.CLAVE_DEFAULT,
      //   Macaddresses: this.dispositivoSeleccionado.Macaddresses,
      //   Presente:false
      //   };
      //   this.grabarDatos(docPresidente);
      // }
      
    
    }
  }

  grabarDatos(documento:any){
    // no pongo el campo clave porque al ser un autoincrement se borra.
    // Si lo pongo se borra del documento y necesito el campo en el documento.
    this.bdService.updateColeccion2({
        operacion        : 'agregar',
        campoClave       : 'seBorraPorqueUsaAutoincrement',
        nombreColeccion  : this.nombreColeccion,
        documento        : documento,
        distribuidorKN   : null,
        organizacionKNAI : null,                           
        usuarioKANE      : this.usuarioKANE,
        usaSettings      : this.usaSettings
    }).then(respuesta=>{
      console.log('respuesta',respuesta);
      this.concejalSeleccionado=null;
      this.dispositivoSeleccionado=null;
      this.getSubscripcionPrincipal();
      this.getSubscripcionSecundarias();
    }).catch(error=>{
      console.log('error',error);
    });
  }

  resetClave(documento:ConcejalesDispositivosInterface){
    let doc={}
    doc['Clave']=this.CLAVE_DEFAULT;
    let funcion=documento['Funcion']==true?'1':'0'; 
    doc['camposConcatenados']=documento['NumConcejal']+'_'+documento['NumDispositivo']+'_'+ funcion;

    this.bdService.updateColeccion2({
      operacion        : 'modificar',
      campoClave       : 'camposConcatenados',
      nombreColeccion  : this.nombreColeccion,
      documento        : doc,
      distribuidorKN   : null,
      organizacionKNAI : null,                           
      usuarioKANE      : this.usuarioKANE,
      usaSettings      : this.usaSettings
    }).then(respuesta=>{
      console.log('respuesta',respuesta);
      this.concejalSeleccionado=null;
      this.dispositivoSeleccionado=null;
      this.getSubscripcionPrincipal();
      this.getSubscripcionSecundarias();
    }).catch(error=>{
      console.log('error',error);
    });
  }

  BorradoDatos(documento:any){
    let doc:any={};
    let funcion=documento['Funcion']==true?'1':'0'; 
    doc['camposConcatenados']=documento['NumConcejal']+'_'+documento['NumDispositivo']+'_'+ funcion;
    this.bdService.updateColeccion2({
        operacion        : 'borradoFisico',
        campoClave       : 'camposConcatenados',
        nombreColeccion  : this.nombreColeccion,
        documento        : doc,
        distribuidorKN   : null,
        organizacionKNAI : null,                           
        usuarioKANE      : this.usuarioKANE,
        usaSettings      : this.usaSettings 
    }).then(respuesta=>{
      console.log('respuesta',respuesta);
      this.getSubscripcionPrincipal();
      this.getSubscripcionSecundarias();
    }).catch(error=>{
      console.log('error',error);
    });
  }

  compareConcejales(c1: ConcejalesInterface, c2:ConcejalesInterface): boolean {     
    // console.log("compareFn c1", c1);
    // console.log("compareFn c2", c2);
      return c1 && c2 ? c1.NumConcejal === c2.NumConcejal : c1 === c2; 
  }
}