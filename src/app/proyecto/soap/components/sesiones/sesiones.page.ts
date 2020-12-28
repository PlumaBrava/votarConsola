import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { SoapGenerica }     from '@maq-modules/soap-generica/soap-generica.page';
import { ConfigComponente } from './sesiones.config';

import { SearchFiltroPipe } from '@maq-shared/pipes/search/search-filtro.pipe';

@Component({
  selector: 'soap-sesiones',
  templateUrl: './sesiones.page.html',
  styleUrls: [
    '../../../../maqueta/modules/soap-generica/soap-generica.page.scss',
    './sesiones.page.scss'
  ],
  encapsulation: ViewEncapsulation.None 
})

export class SoapSesionesComponent extends SoapGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'sesiones RoadNet'));
  
  public listadoSoapTiposUbicaciones:any[]=[];  
  public navigationSubscription:any=null;
  public subComponente:string=null;  
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit sesiones RoadNet'));
     
     // Destruyo ejecución anterior del mismo componente, para otra opción del menú     
     this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // console.log(e);
         if (e instanceof NavigationEnd) {
         this.ngOnDestroy();
         this.ngOnInit();       
     }});    
     
     if(this.router.url.includes("/conectorRoadNet/soapSesiones/ubicaciones")) {
       this.subComponente = "Ubicaciones";
     } else {
      this.subComponente = "Rutas";
     }
     console.log("this.subComponente",this.subComponente);

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     super.ngOnInit()
     
  }

  ngOnDestroy() {
    super.ngOnDestroy()

    // log(...values('funcionComponente','ngOnDestroy Ubicaciones'));
  }  
  
  configuracionComponente() {
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
        
        argumentos['whereSucursales']=[{
          key        : 'organizacionKNAI.key',
          operador   : '==',
          value      : this.fn.mostrarKN(this.organizacionKNAI,"key")
        }],
      
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
  
  onResultGetSubscripcionSecundarias() {
    log(...values('funcionComponente','pageGenerica.nResultGetSubscripcionSecundarias'));
    
    super.onResultGetSubscripcionSecundarias();    
    
  }    
  
  filtrarGrilla(nameFiltro?:string) { 
    
      super.filtrarGrilla(nameFiltro);
      
      for(let i=0; i<this.listadoPrincipal.length; i++) {
        this.listadoPrincipal[i].importar = false;        
      }
      this.importarTodos=false;

  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Ubicaciones', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form

  }  
  
  seleccionarSesion(documento) {
      this.idSesionSeleccionada     = documento.idSesion;
      this.nombreSesionSeleccionada = documento.nombre;      
  }
  
  ejecutarSoap() {
        console.log('ejecutarSoap');            
        
        if(this.filtroSoapConector==null) {
          alert( this.translate.instant('mensajeSoap.indiqueConector') );            
          return;            
        }
        
        if(this.filtroSoapSucursalKey==null) {
            alert( this.translate.instant('mensajeSoap.indiqueRegionAImportar') );
            return;            
        }

        console.log("this.grilla.filtros['fechaHora']",this.grilla.filtros['fechaHora']);
        if(this.grilla.filtros['fechaHora']==null || 
          (this.grilla.filtros['fechaHora'].desde!==undefined && this.grilla.filtros['fechaHora'].desde=='')) {
            
            alert( this.translate.instant('mensajeSoap.indiquePeriodoDesdeHastaAImportar') );
            return;            
        }
      
        if(this.soap.hostRoadNet==null || this.soap.hostRoadNet===undefined) {
            alert( this.translate.instant('mensajeSoap.hostRoadNetsinDefinir') );
            return;
        }
        
        this.cualSpinner = 'buscando';
        this.spinner.show();
        
        this.idSesionSeleccionada=null;
        this.nombreSesionSeleccionada=null;
        
        let sucursalCodigo = this.fn.getAtributoFromListado( this.listadoSucursales, this.filtroSoapSucursalKey, 'key', 'codigo');
        //console.log("sucursalCodigo",sucursalCodigo);

        this.generadorImportadores.getSoap([
          'RetrieveRoutingSessionsByCriteria',
        ])
        .then((vecResponse:any[])=>{
          
            console.log("generadorImportadores.getSoap - vecResponse",vecResponse);                  
            
            this.vecEjecucionesSoap=[];
            for(let i=0; i<vecResponse.length; i++) {
                let response = vecResponse[i];
                response.xml = response.xml.replace("((SUCURSAL))",sucursalCodigo);
                
                let fecha_desde = this.grilla.filtros['fechaHora'].desde;
                let fecha_hasta = this.grilla.filtros['fechaHora'].hasta;
                
                let fecha_desde_ok = fecha_desde.substr(6,4)+'-'+fecha_desde.substr(3,2)+'-'+fecha_desde.substr(0,2);
                let fecha_hasta_ok = fecha_hasta.substr(6,4)+'-'+fecha_hasta.substr(3,2)+'-'+fecha_hasta.substr(0,2);
                
                response.xml = response.xml.replace("((FECHA_DESDE))", fecha_desde_ok);
                response.xml = response.xml.replace("((FECHA_HASTA))", fecha_hasta_ok);
                
                let parameters = {
                    xml    : response.xml,
                    action : response.action,
                    host   : this.getHostConector()
                }
                console.log(response.method + " - parameters:",parameters);
                
                this.vecEjecucionesSoap.push( 
                    this.httpPOSTSoap(response.method, parameters) 
                );
            } // fin for
            
            Promise.all( this.vecEjecucionesSoap).then(vecJsonResult=>{
                log(...values('funcionEnd','promise.All'));
                log(...values('valores','vecJsonResult:',vecJsonResult));

                this.spinner.hide();
                
                this.setListadosSoap(vecJsonResult);

            }).catch(error=>{
                log(...values("valores","Error de Conexión al Cloud Funcion soapRoadNet:",error));
                
                this.spinner.hide();
                
                alert( this.translate.instant('mensajeSoap.laConsultaSaturoServidorAchiqueRangoFechas') );
                
            });            
            
        });   
 
  }  
  
  setListadosSoap(vecJsonResult:any[]) {
    
    if(vecJsonResult.length > 0 && vecJsonResult[0].error) {
        //alert('error de Conexión');
        console.log("error soap", vecJsonResult[0].error);
        alert( this.translate.instant('mensajeSoap.seProdujoUnErrorAlObtenerDatosDelContector') );
        return;
    }

    this.listadoPrincipal = [];    
    for(let i=0; i<vecJsonResult.length; i++) {
        let jsonResult = vecJsonResult[i];
        let jsonValues1 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveRoutingSessionsByCriteriaResponse','ns1:sessions') );
        
        if(jsonValues1) { // Vehículos (RetrieveEquipmentByCriteriaResponse)
            for(let j=0; j<jsonValues1.length; j++) {
                let json=jsonValues1[j];  
                let documento = { 
                    key             : this.parseJsonSoap(json,'ns1:sessionIdentity','ns1:internalSessionID','_text'),
                    idSesion        : this.parseJsonSoap(json,'ns1:sessionIdentity','ns1:internalSessionID','_text'),
                    nombre          : this.parseJsonSoap(json,'ns1:description','_text'),
                    escenario       : this.parseJsonSoap(json,'ns1:scenario','_text'),
                    fechaSesion     : this.parseJsonSoap(json,'ns1:sessionDate','_text'),
                    
                    yaImportado     : false,
                    importar        : false,
                    aptoImportar    : false,
                    errorValidacion : null
                }
                
                documento.fechaSesion = new Date( documento.fechaSesion.substr(0,10)+' 00:00:00');
                
                //documento.fechaSesion = this.fn.newDateOfTimeZone('es', 'America/Argentina/Buenos_Aires', new Date(documento.fechaSesion) );
                // newDateOfTimeZone(formato:string, idiomaPais:string, timeZone:string, fechaInput:Date):string {
                
                
                this.listadoPrincipal.push(documento);
            }
            console.log("this.listadoPrincipal",this.listadoPrincipal);            
        }
        
    } // fin for
      
  }

  aptoImportacion(documento) {
    //console.log("aptoImportacion");
    documento.errorValidacion='';
    documento.aptoImportar=true;
    
    return true;
  }
  
  onPostSeleccionarItem(documento:any, posInListado:number) {
    
      this.contarCantSeleccionados(); // Cuando no realizo validaciones (llamar a buscarDatoEnBD, debo contar aquí, sino no va este línea)
      
      // this.buscarDatoEnBD(
      //   "Usuarios",
      //   [{key:'codigo',operador:'==',value:documento.codigo}],
      //   posInListado,
      //   "email",
      //   "verificaExisteEnBDconcodigo"
      // );
      
    
      super.onPostSeleccionarItem(documento, posInListado);
  }  
  
  seleccionarTodosImportar() {
    console.log("importarTodos",this.importarTodos);
    
    let listadoParcial0 = new SearchFiltroPipe().transform(this.listadoPrincipal, 'local', 'key',               this.grilla.filtros['key'], 'string');
    let listadoParcial1 = new SearchFiltroPipe().transform(listadoParcial0,       'local', 'idSesion',          this.grilla.filtros['idSesion'], 'string');
    let listadoParcial2 = new SearchFiltroPipe().transform(listadoParcial1,       'local', 'nombre',            this.grilla.filtros['nombre'], 'string');
    let listadoParcialn = new SearchFiltroPipe().transform(listadoParcial2,       'local', 'escenario',         this.grilla.filtros['escenario'], 'string');
    console.log("listadoParcialn", listadoParcialn);
  
    for(let i=0; i<this.listadoPrincipal.length; i++) {
        let keySearch = this.listadoPrincipal[i].key;
        if( listadoParcialn.find((el => el.key == keySearch)) ) {
          
            this.listadoPrincipal[i].importar = !this.importarTodos;    
            
        } else {
            this.listadoPrincipal[i].importar = false;  
        }
    }
    console.log("listadoPrincipal", this.listadoPrincipal);
  }
  
  importarListadoPrincipal() {
    
        if(this.cantSeleccionadosOk==0) {
            alert( this.translate.instant('mensajeSoap.noHayRegistrosSeleccionadossValidosParaImportar') );
            return;
        }
        
        this.confirmService.confirm({ 
          title:   this.translate.instant('soap.importacionSoap'), 
          message: this.translate.instant('mensajeSoap.comenzarImportacionDatosObtenidosDelConector') })
        .then((resultadoOK) => {       
          
            this.cualSpinner = 'grabando';
            this.spinner.show();
        
            // Actualizo Tabla AuxTiposUbicaciones
            let userKeys = {
              distribuidorKN   : this.distribuidorKN,
              organizacionKNAI : this.organizacionSoap,
              usuarioKANE      : this.usuarioKANE
            }
         
            let datos:any = [];
            for(let i=0; i<this.listadoSoapTiposUbicaciones.length; i++) {

                datos.push({
                  operacion        : 'agregar',
                  nombreColeccion  : 'AuxTiposUbicaciones',
                  documento        : this.listadoSoapTiposUbicaciones[i],
                  incluyeSettings  : true     
                });
              
            }
            
            // Actualizo Tabla Ubicaciones
            for(let i=0; i<this.listadoPrincipal.length; i++) {

                if(this.listadoPrincipal[i].importar && this.listadoPrincipal[i].aptoImportar) {
                  
                    let documento={...this.listadoPrincipal[i]};
                    
                    delete documento.yaImportado;
                    delete documento.importar;
                    delete documento.aptoImportar;
                    delete documento.errorValidacion;
                    
                    datos.push({
                      operacion        : 'importar',
                      nombreColeccion  : 'Ubicaciones',
                      documento        : documento,
                      incluyeSettings  : true     
                    });
                }    
                
              }
              
              console.log("datos",datos);
              
              this.bdService.updateColeccionBatch(userKeys, datos)
              .then((resultado:any)=>{
                  console.log("resultado",resultado);
                  
                  this.desSeleccionarTodos();
                  
                  this.spinner.hide();
                 
              }).catch((error:any)=>{
                  console.log("resultado",error);
                  this.spinner.hide();
                  alert( this.translate.instant('mensajeSoap.seProdujoUnErrorEnlaImportacion') );                  
              });  

      }).catch(error=>{      // catch Confirm  
      });
              
  } // fin funcion importarListadoPrincipal
      
  
}