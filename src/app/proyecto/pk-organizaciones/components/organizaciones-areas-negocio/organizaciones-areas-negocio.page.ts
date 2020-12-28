import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './organizaciones-areas-negocio.config';
import { KN, KNAI, KANE }   from '@maq-models/typesKN/typesKN.model';

import { Router } from "@angular/router";

@Component({
  selector: 'app-organizaciones-areas-negocio',
  templateUrl: './organizaciones-areas-negocio.page.html',
  styleUrls: [   
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './organizaciones-areas-negocio.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizacionesAreasNegocioComponent extends PageGenerica implements OnInit, OnDestroy {
  @Input() public organizacionInputKNAI: KNAI; 
  @Input() public permisosInput: any; 

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'organizaciones-areas-negocio'));
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit organizaciones-areas-negocio'));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });
     
     super.ngOnInit()
          
  }

  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy Distribuidores'));
  }  
  
  configuracionComponente() {
    
        // console.log("xx this.usuario.organizacion",this.usuario.organizacion);

        // Determino si entró a la opción desde menú
        if(this.router.url=='/organizacion/listadoAreasNegocio') {
           this.organizacionInputKNAI = this.organizacionKNAI;
           
        } else  {  // Llegó a la opción a través de una pestaña
          
            if(this.organizacionKNAI) {  // Perfil Organización
                for(let i=0; i< this.usuario.perfilUsuario.permisosMenu.length; i++) {
                    let permisosMenu = this.usuario.perfilUsuario.permisosMenu[i];
                    if(permisosMenu.routerLink=='/organizacion/listadoAreasNegocio') {
                        this.permisos.altasAutorizadas                    = permisosMenu.alta;
                        this.permisos.bajasAutorizadas                    = permisosMenu.baja;
                        this.permisos.modificacionesAutorizadas           = permisosMenu.modificacion;
                        this.permisos.modificacionesBasicasAutorizadas    = permisosMenu.modificacionesBasica;                            
                        break;
                    }
                }
            } else {  // Perfil Desarrollador, Supervisor, Distribuidor (Asigno los mismos que para Organización)
                this.permisos.altasAutorizadas                    = this.permisosInput.altasAutorizadas;
                this.permisos.bajasAutorizadas                    = this.permisosInput.bajasAutorizadas;
                this.permisos.modificacionesAutorizadas           = this.permisosInput.modificacionesAutorizadas;
                this.permisos.modificacionesBasicasAutorizadas    = this.permisosInput.modificacionesBasicasAutorizadas;
            }
        } 
        log(...values("valores","AreasNegocio - permisos:",this.permisos));        

        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={
            organizacionInputKNAI:this.organizacionInputKNAI
        };
        this.configComponente = new ConfigComponente(argumentos, this.fb, this.fn);
    
        super.configuracionComponente();                  
    
        // Piso Variable Global por la recibida por Input
        this.organizacionKNAI = this.organizacionInputKNAI;
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
    documento.organizacionKNAI = this.organizacionInputKNAI;

    super.onSubmit(documento);
  }  

}

