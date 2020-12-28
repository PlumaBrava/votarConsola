import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { MensajesService }   from '@maq-servicios/mensajes/mensajes.service';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './organizaciones-sucursales.config';
import { KN, KANE, KNAI }   from '@maq-models/typesKN/typesKN.model';

@Component({
  selector: 'app-organizaciones-sucursales',
  templateUrl: './organizaciones-sucursales.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './organizaciones-sucursales.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizacionesSucursalesComponent extends PageGenerica implements OnInit, OnDestroy {
  @Input() public organizacionInputKNAI: KNAI; 
  @Input() public permisosInput: any; 

  constructor (protected changeDetectorRef: ChangeDetectorRef, public msg: MensajesService) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'distribuidores'));
  
  public accionAreasNegocio:string = 'listado';
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Distribuidores'));

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
    
        // Determino si entró a la opción desde menú
        if(this.router.url=='/organizacion/listadoSucursales') {
            this.organizacionInputKNAI = this.organizacionKNAI;            
    
        } else  {  // Llegó a la opción a través de una pestaña
          
            if(this.organizacionKNAI) {  // Perfil Organización
                for(let i=0; i< this.usuario.perfilUsuario.permisosMenu.length; i++) {
                    let permisosMenu = this.usuario.perfilUsuario.permisosMenu[i];
                    if(permisosMenu.routerLink=='/organizacion/listadoSucursales') {
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
        log(...values("valores","Sucursales - permisos:",this.permisos));
   
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
  
  
  // Funciones Adicionales del Módulo
  
  showAreasNegocio(areasNegocio:any) {
     let rta='';
     if(areasNegocio==null || areasNegocio==undefined) return '';
     for(let i=0;i<areasNegocio.length;i++) {
         rta+=', '+areasNegocio[i].nombre;
     }
     if(rta!='') rta=rta.substr(2,1000);
     return rta;
  }  

  areaNoIncluida(keyAreaNegocio:string) {
       let vecAreas =  this.form.get('areasNegocio').value;
       for(let i=0;i<vecAreas.length;i++) {
          if(vecAreas[i].key==keyAreaNegocio) {
            return false;
          }
       }
       return true;   

  }
  
  areaReady() {
      let areasNegocioForm = this.form.get('areasNegocio').value;
      // console.log("areasReady areasNegocioForm",areasNegocioForm, Array.isArray(areasNegocioForm));
      // console.log("areasReady this.msg.cacheColecciones['AreasNegocio'",Array.isArray(this.msg.cacheColecciones['AreasNegocio']));
      return Array.isArray(areasNegocioForm) && Array.isArray(this.msg.cacheColecciones['AreasNegocio']);
  }

  agregarArea() {
        let keyAreaNegocio=(<HTMLSelectElement>document.getElementById("keyAreaNegocio")).value;
        // console.log("AgregarArea keyAreaNegocio",keyAreaNegocio);

        for(let i=0;i<this.msg.cacheColecciones['AreasNegocio'].length;i++) {
           if(this.msg.cacheColecciones['AreasNegocio'][i].key==keyAreaNegocio) {
              let areaNegocio = this.msg.cacheColecciones['AreasNegocio'][i];

              let vecAreas =  this.form.get('areasNegocio').value;
              if(vecAreas==null) vecAreas=[];
              if(vecAreas.indexOf(areaNegocio)==-1) {
                vecAreas.push(areaNegocio);
              }
              this.form.get("areasNegocio").setValue(vecAreas);
              // console.log("agregarArea form.get(areasNegocio).value",this.form.get('areasNegocio').value);
              this.accionAreasNegocio='listado';

              break;
           }
        }
  }

  deleteArea(keyAreaNegocio:string) {
        let auxAreas = this.form.get('areasNegocio').value;
        // console.log("auxAreas",auxAreas);
        let auxAreas2 = [];
        // console.log("auxAreas",auxAreas);
        for(let i=0;i<auxAreas.length;i++) {
          if(auxAreas[i]!=keyAreaNegocio) {
            auxAreas2.push(auxAreas[i]);
            // console.log(i,"auxAreas2",auxAreas2);
          }
        }
        this.form.get("areasNegocio").setValue(auxAreas2);
        // console.log("deleteArea",this.form.get('areasNegocio').value);
  }
  

}
