import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, ViewChild, ElementRef  } from '@angular/core';
import { Input } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { MensajesService }   from '@maq-servicios/mensajes/mensajes.service';

import { PageGenerica }               from '@maq-modules/page-generica/page-generica.page';
import { Importador, ConfigExcel }    from '@maq-models/importador/importador.model';

import { KN, KANE, KNAI }   from '@maq-models/typesKN/typesKN.model';
import { ConfigComponente } from './organizaciones-ubicaciones.config';

import * as Inputmask from "inputmask"

@Component({
  selector: 'app-organizaciones-ubicaciones',
  templateUrl: './organizaciones-ubicaciones.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './organizaciones-ubicaciones.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrganizacionesUbicacionesComponent extends PageGenerica implements OnInit, OnDestroy, Importador {
  @Input() public organizacionInputKNAI: KNAI; 
  @Input() public permisosInput: any; 

  // Transferencia de Archivos
  @ViewChild('fileInput1')        fileInput1: ElementRef;  


  constructor (protected changeDetectorRef: ChangeDetectorRef, public msg: MensajesService) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'Ubicaciones'));
  
  public accionAreasNegocio:string = 'listado';
  
  public horarioCopiado:any=null;
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Ubicaciones'));

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
        if(this.router.url=='/organizacion/listadoUbicaciones') {
            this.organizacionInputKNAI = this.organizacionKNAI;
            
        } else  {  // Llegó a la opción a través de una pestaña
          
            if(this.organizacionKNAI) {  // Perfil Organización
                for(let i=0; i< this.usuario.perfilUsuario.permisosMenu.length; i++) {
                    let permisosMenu = this.usuario.perfilUsuario.permisosMenu[i];
                    if(permisosMenu.routerLink=='/organizacion/listadoUbicaciones') {
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
        log(...values("valores","Ubicaciones - permisos:",this.permisos));        
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={
            organizacionKNAI : this.organizacionInputKNAI,
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
      
      // Filtro Ubicaciones que no correspondan a las Sucursales/Areas de Negocio habilitadas para el Usuario
      if(this.usuario.organizacion) {
          // console.log("xxx this.organizacionKNAI",this.organizacionKNAI);
          // console.log("xxx this.usuario.sucursalesAreasNegocio",this.usuario.sucursalesAreasNegocio);
          // console.log("xxx this.listadoPrincipal",this.listadoPrincipal);
          let listadoFiltrado=[];
          for(let i=0; i<this.listadoPrincipal.length; i++) {
              let documento=this.listadoPrincipal[i];          
              let auxSucursalAreaNegocio = documento.sucursalKN.key + '@@@' + documento.areaNegocio.key;          
              // console.log("xxx auxSucursalAreaNegocio",auxSucursalAreaNegocio);
              if(this.usuario.sucursalesAreasNegocio.indexOf(auxSucursalAreaNegocio)!=-1) {
                  listadoFiltrado.push(documento);
              }
          }
          this.listadoPrincipal=listadoFiltrado;
          // console.log("xxx this.listadoPrincipal",this.listadoPrincipal);
      }    

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

    // Defino Máscaras
    setTimeout(()=>{
      let integerMask = new Inputmask({ alias: "integer"});
      let integerLeftMask = new Inputmask({ alias: "integer", rightAlign: false});
      integerLeftMask.mask( document.getElementById('radioEntrega') );
      
    }, 500); 
  
  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Distribuidores', accion));

    super.setAccionForm(accion);
    
    // Agregar acá, modificaciones adicionales al this.form
    if(this.form.controls['ventanaAtencion'] &&
       this.form.controls['ventanaAtencion']['value']['key']!=null) {
         
       this.form.get('ventanaAtencion.horarioAtencion').disable();  
    }
    
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

  checkHora(valor:any) {
    //console.log("checkHora",valor);
    if(valor==null) {
      // console.log("checkHora false");
      return false;
    } else {
      // console.log("checkHora true");
      return true;
    }
  }
  
  getListadoAreasNegocioAsociadasASucursal():any[] {
      let sucursalKN = this.form.get('sucursalKN').value;
      for(let i=0; i<this.msg.cacheColecciones['Sucursales'].length;i++) {
          if(this.msg.cacheColecciones['Sucursales'][i].key==this.fn.mostrarKN(sucursalKN,'key')) {
            return this.msg.cacheColecciones['Sucursales'][i].areasNegocio;
          }
      }  
      return [];
  }  
  
  onChangeVentanaAtencion(keyVentanaAtencion:string) {

        if(this.accionForm=='consultar') {  // Parche, se dispara al deshabilitar el formulario y rompe
          return;
        }
        console.log("Change ventanaAtencion",keyVentanaAtencion);

        let nombre;
        let codigo;  
        let tipoCuentaKN;
        let horarioAtencion;

        let ventana=null;
        if(keyVentanaAtencion==null) {  // CUSTOM (Personalizada)
            this.form.get('ventanaAtencion.nombre').setValue('Personalizada');
            this.form.get('ventanaAtencion.codigo').setValue('Personalizada');           
            this.form.get('ventanaAtencion.tipoCuentaKN').setValue(null);
            
            // No Piso valores del Horario de Atención
            this.form.get('ventanaAtencion').get('horarioAtencion').enable();
            
        } else {
            for(let i=0; i<this.msg.cacheColecciones['AuxVentanasAtencion'].length;i++) {
              if(this.msg.cacheColecciones['AuxVentanasAtencion'][i].key==keyVentanaAtencion) {
                console.log("this.listadoVentanasAtencion[i]",this.msg.cacheColecciones['AuxVentanasAtencion'][i]);
                nombre         = this.msg.cacheColecciones['AuxVentanasAtencion'][i].nombre;
                codigo         = this.msg.cacheColecciones['AuxVentanasAtencion'][i].codigo;
                tipoCuentaKN   = this.msg.cacheColecciones['AuxVentanasAtencion'][i].tipoCuentaKN;
                horarioAtencion= this.msg.cacheColecciones['AuxVentanasAtencion'][i].horarioAtencion;
                console.log("this.form suscribe pisó con",horarioAtencion);
                this.form.get('ventanaAtencion.horarioAtencion').setValue(horarioAtencion);
                break;
              }
            }
            
            this.form.get('ventanaAtencion.nombre').setValue(nombre);
            this.form.get('ventanaAtencion.codigo').setValue(codigo);
            this.form.get('ventanaAtencion.tipoCuentaKN').setValue(tipoCuentaKN);

            // Piso valores del Horario de Atención            
            this.form.get('ventanaAtencion.horarioAtencion').setValue(horarioAtencion);

            this.form.get('ventanaAtencion').get('horarioAtencion').disable();
            
          }      
 }
 
 copyHorario(cual) {
  console.log("copyHorario", cual);
   
  if(this.form.controls['ventanaAtencion'] &&
     this.form.controls['ventanaAtencion']['value']['horarioAtencion']===undefined) {

     return ''; 
  
   } else {
      let horarioAtencion = this.form.controls['ventanaAtencion']['value']['horarioAtencion'];
      
      let horaDesde1 = this.fn.getDocField(horarioAtencion,cual+'.horaDesde1');
      let horaHasta1 = this.fn.getDocField(horarioAtencion,cual+'.horaHasta1');
      let horaDesde2 = this.fn.getDocField(horarioAtencion,cual+'.horaDesde2');
      let horaHasta2 = this.fn.getDocField(horarioAtencion,cual+'.horaHasta2');
      let horaDesde3 = this.fn.getDocField(horarioAtencion,cual+'.horaDesde3');
      let horaHasta3 = this.fn.getDocField(horarioAtencion,cual+'.horaHasta3');
      
      this.horarioCopiado = {
        'horaDesde1' : horaDesde1,
        'horaHasta1' : horaHasta1,
        'horaDesde2' : horaDesde2,
        'horaHasta2' : horaHasta2,
        'horaDesde3' : horaDesde3,
        'horaHasta3' : horaHasta3,
      }
      
   }   
   
 }
 
 pasteHorario(cual) {
    console.log("pasteHorario",cual,this.horarioCopiado);
    this.form.get('ventanaAtencion.horarioAtencion.'+cual).setValue(this.horarioCopiado);
  
 }

 
 changeTimePicker(cual) {
   
  if(this.form.controls['ventanaAtencion'] &&
     this.form.controls['ventanaAtencion']['value']['horarioAtencion']===undefined) {

     return ''; 
  
   } else {
      let horarioAtencion = this.form.controls['ventanaAtencion']['value']['horarioAtencion'];
      let value = this.fn.getDocField(horarioAtencion,cual);
      
      console.log("changeTimePicker", cual, value);
   }   
   
 }
 
 getClassHorarioAtencion(cual) {
  
  if(this.form.controls['ventanaAtencion'] &&
     this.form.controls['ventanaAtencion']['value']['horarioAtencion']===undefined) {

     return ''; 
  
   } else {
      let horarioAtencion = this.form.controls['ventanaAtencion']['value']['horarioAtencion'];
      let value = this.fn.getDocField(horarioAtencion,cual);
      if(value) {
        return 'ngb-timepicker-complete';
      } else  {
        return 'ngb-timepicker-empty';
      }    
   }
  
 }

}

