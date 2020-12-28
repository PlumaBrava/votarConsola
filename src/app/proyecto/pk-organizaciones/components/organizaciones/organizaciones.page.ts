import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './organizaciones.config';

import { LISTA_RUBROS_DE_ORGANIZACIONES, getRubroEmpresa } from '@maq-mocks/usuarios/usuarios';

@Component({
  selector: 'app-organizaciones',
  templateUrl: './organizaciones.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './organizaciones.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class OrganizacionesComponent extends PageGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'Organizaciones'));

  public LISTA_RUBROS_DE_ORGANIZACIONES = LISTA_RUBROS_DE_ORGANIZACIONES;
  public getRubroEmpresa = getRubroEmpresa;
  
  public listadoOpcionesHojaRuta = ['NoMostrar', 'FichaBasica','FichaConCantidades']
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Organizaciones'));
     
      // Acción específica del componente
      // console.log("this.router.url",this.router.url); 
      this.modalidadOpcion = (this.router.url=='/organizacion/listadoOrganizaciones') ? 'listado' : 'profile';
      // console.log("modalidadOpcion",this.modalidadOpcion);

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     super.ngOnInit()
          
  }

  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy Organizaciones'));
  }  
  
  configuracionComponente() {
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
  
        // ListadoPrincipal
        argumentos['grillaWhereArray']=[];        
        if(this.tipoPerfilUsuario=='Distribuidor' && this.distribuidorKN) {
              argumentos['grillaWhereArray']=[{ 
                key:      'distribuidor.key', 
                operador: '==', 
                value:    this.distribuidorKN.key
              }];           
              // console.log("grillaWhereArray",argumentos['grillaWhereArray']);
               
        } else if(this.tipoPerfilUsuario=='Organizacion' && this.organizacionKNAI) {
            argumentos['grillaWhereArray']=[{ 
              key:      'key', 
              operador: '==', 
              value:    this.organizacionKNAI.key
            }];                    
        }  

        argumentos['whereAuxIdiomas']=[{
          key        : 'key',
          operador   : 'in',
          value      : this.settings2.app.idiomasHabilitados
        }],

        argumentos['listadosCacheWhereDistribuidores']=[];
        if(this.tipoPerfilUsuario=='Distribuidor' && this.distribuidorKN) {
            argumentos['listadosCacheWhereDistribuidores']=[{
              key:'key',
              operador:'==',
              value:this.usuario.distribuidor.key
            }];
        }              
        argumentos['listadosCacheOrderByDistribuidores']=[{
          key:'nombre',
          ascDesc:'asc'}
        ];
        
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
     
      super.onResultGetSubscripcionPrincipal();
      
      // Acciones Específicas del Módulo
      if(this.modalidadOpcion=='profile') {
        this.abrirFormulario(this.usuario.organizacion);
      }  
      
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
    log(...values('funcionComponente','setAccionForm Organizaciones', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form
    if(['Desarrollador','Supervisor'].indexOf(this.tipoPerfilUsuario)==-1) {
        this.form.get('distribuidor').disable();
    }
    
    if(this.permisos.modificacionesBasicasAutorizadas==true && this.permisos.modificacionesAutorizadas==false) {
        this.form.get('nombre').disable();
        this.form.get('distribuidor').disable();

        this.form.get('idioma').disable();
        this.form.get('rubro').disable();
        
        this.form.get('esquemaComercial.cantidadLicencias').disable();
        this.form.get('esquemaComercial.porcentajeExcesoPermitido').disable();
        this.form.get('esquemaComercial.cantidadVecesExcesoPermitido').disable();
        this.form.get('esquemaComercial.licenciasConBloqueo').disable();
        
        this.form.get('esquemaComercial.logAuditoria').disable();       
        this.form.get('esquemaComercial.hojaRutaFicha').disable();       
        this.form.get('esquemaComercial.logEstadosCelular').disable();       
        this.form.get('esquemaComercial.trackeaRutas').disable();       
        this.form.get('esquemaComercial.relevamientoParadas').disable();       
        this.form.get('esquemaComercial.gestionaParadas').disable();       
        this.form.get('esquemaComercial.hojaDeRutas').disable();       
        this.form.get('esquemaComercial.trackeaInBackgroundAppClose').disable();  
        
      
        
    
    }

  }  
  
  onSubmit(documento:any):void {
    log(...values('funcionComponente','Organizaciones.onSubmit'));

    // Agregar acá, modificaciones adicionales al this.form

    super.onSubmit(documento);
  }  

}

