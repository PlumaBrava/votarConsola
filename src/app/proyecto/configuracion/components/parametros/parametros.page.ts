import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './parametros.config';
import { Usuario, Distribuidor, Organizacion }          from '@maq-models/usuarios/usuarios.model';
@Component({
  selector: 'app-parametros',
  templateUrl: './parametros.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './parametros.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ParametrosComponent extends PageGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'distribuidores'));
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Distribuidores'));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     let url='http://192.168.1.118:8080/api/getPanel';
     this.http.get(url).subscribe(resp=>console.log('resp',resp));

  

     super.ngOnInit()
          
  }

  crearRegistro<T>(datos:T){

    console.log('resp datos',datos);
    console.log('resp datos type', typeof datos);
    console.log('resp datos clase', datos.constructor.name);

  }

  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy Distribuidores'));
  }  
  
  configuracionComponente() {
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
        
        argumentos['whereAuxIdiomas']=[{
          key        : 'key',
          operador   : 'in',
          value      : this.settings2.app.idiomasHabilitados
        }],
      
        this.configComponente = new ConfigComponente(argumentos, this.fb, this.fn);
        let u:Usuario=new Usuario();
        // u=this.usuario;
        // this.crearRegistro<Usuario>( u);
        this.crearRegistro( u);
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

    // Agregar acá, modificaciones adicionales al this.form
  
  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Distribuidores', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form

  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Distribuidores.onSubmit'));

    // Agregar acá, modificaciones adicionales al this.form

    super.onSubmit(documento);
  }  

}