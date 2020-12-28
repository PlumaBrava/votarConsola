import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { SoapGenerica }     from '@maq-modules/soap-generica/soap-generica.page';
import { ConfigComponente } from './vehiculos.config';

import { SearchFiltroPipe } from '@maq-shared/pipes/search/search-filtro.pipe';

@Component({
  selector: 'soap-vehiculos',
  templateUrl: './vehiculos.page.html',
  styleUrls: [
    '../../../../maqueta/modules/soap-generica/soap-generica.page.scss',
    './vehiculos.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class SoapVehiculosComponent extends SoapGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'distribuidores'));
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Vehiculos'));
     
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
    log(...values('funcionComponente','setAccionForm Distribuidores', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form

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
        
        if(this.soap.hostRoadNet==null || this.soap.hostRoadNet===undefined) {
            alert( this.translate.instant('mensajeSoap.hostRoadNetsinDefinir') );            
            return;
        }
        
        this.cualSpinner = 'buscando';
        this.spinner.show();
        
        this.sucursalCodigo = this.fn.getAtributoFromListado( this.listadoSucursales, this.filtroSoapSucursalKey, 'key', 'codigo');
        this.keyImportacion = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-vehiculos-'+this.sucursalCodigo;  
        
        // Cargo Documentos Ya Importados        
        this.finalizoDownloadFiles['vehiculos']=false;
        this.soapService.getImportados(this.usuarioKANE, this.organizacionSoap, this.keyImportacion)
        .subscribe((resultado:any)=>{
            console.log("getImportados resultado",resultado);
            
            this.finalizoDownloadFiles['vehiculos']=true;
            this.ActualizarListadoPrincipalconArchivoImportado('vehiculos');                      
            
        }, error=>{
            console.log("getImportados error",error);
        });  

        // Proceso Soap
        this.generadorImportadores.getSoap([
          'RetrieveEquipmentByCriteria',
          'RetrieveEquipmentTypesByCriteria'
        ])
        .then((vecResponse:any[])=>{
          
            console.log("generadorImportadores.getSoap - vecResponse",vecResponse);                  
            
            this.vecEjecucionesSoap=[];
            for(let i=0; i<vecResponse.length; i++) {
                let response = vecResponse[i];
                response.xml = response.xml.replace("((SUCURSAL))",this.sucursalCodigo);
                
                response.xml = response.xml.replace("((ID_VEHICULO))",'');                
                
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
                log(...values("error","Error de Conexión al Cloud Funcion soapRoadNet:",error));
                
                this.spinner.hide();
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
        let jsonValues1 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveEquipmentByCriteriaResponse','ns1:equipment') );
        let jsonValues2 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveEquipmentTypesByCriteriaResponse','ns1:equipment') );
        
        if(jsonValues1) { // Vehículos (RetrieveEquipmentByCriteriaResponse)
            for(let j=0; j<jsonValues1.length; j++) {
                let json=jsonValues1[j];  
                
                let codigo:string    = this.parseJsonSoap(json,'ns1:equipmentIdentity','ns1:equipmentID','_text');
                let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
                let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
                      
                let documento = {
                    key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + this.parseJsonSoap(json,'ns1:equipmentIdentity','ns1:equipmentID','_text'),
                    codigo            : codigo,
                    nombre            : nombre,
                    patente           : null,
                    tipoVehiculoKey   : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + this.parseJsonSoap(json,'ns1:equipmentIdentity','ns1:equipmentTypeID','_text'),
                    tipoVehiculoKN    : null,
                    organizacionKNAI  : this.organizacionSoap,
                    
                    yaImportado       : false,
                    importar          : false,
                    aptoImportar      : false,
                    errorValidacion   : null,
                    editarEmail       : false,
                    emailOkImportar   : false
                    
                }
                this.listadoPrincipal.push(documento);
            }
            console.log("this.listadoPrincipal",this.listadoPrincipal);
            
            this.finalizoSoapComponente=true;
            
            this.ActualizarListadoPrincipalconArchivoImportado('vehiculos');                                  
        }
        
        if(jsonValues2) { // Tipos de Vehículos (RetrieveEquipmentTypesByCriteriaResponse)
          this.listadoSoapTiposVehiculos = [];
          
          for(let j=0; j<jsonValues2.length; j++) {
              let json=jsonValues2[j];  
              
              let codigo:string    = this.parseJsonSoap(json,'ns1:equipmentTypeIdentity','ns1:equipmentTypeID','_text');
              let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
              let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
              
              let documento = {
                  key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + this.parseJsonSoap(json,'ns1:equipmentTypeIdentity','ns1:equipmentTypeID','_text'),
                  codigo            : codigo,
                  nombre            : nombre,
                  organizacionKNAI  : this.organizacionSoap
              }
              this.listadoSoapTiposVehiculos.push(documento);
          }

          this.listadoSoapTiposVehiculos.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
          
          console.log("this.listadoSoapTiposVehiculos",this.listadoSoapTiposVehiculos);
      
        }
      
    } // fin for resultadosSoap
    
    for(let i=0; i<this.listadoPrincipal.length; i++) {
        let tipoVehiculoKey = this.listadoPrincipal[i].tipoVehiculoKey;
        this.listadoPrincipal[i].tipoVehiculoKN = this.fn.getAtributoFromListado( this.listadoSoapTiposVehiculos, tipoVehiculoKey, 'key', 'KN');
    }  
    console.log("this.listadoPrincipal",this.listadoPrincipal);
    
  }

  aptoImportacion(documento) {
    console.log("aptoImportacion");
    documento.errorValidacion='';
    
    let rta=true;
    
    // if(!documento.nombre || documento.nombre=='') {
    //     documento.errorValidacion += 'Debe indicar el nombre \n';
    //     rta=false;
    // }  
    
    documento.aptoImportar=rta;
    
    return rta;
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
    
    this.importarTodos = !this.importarTodos;
    
    let listadoParcial0 = new SearchFiltroPipe().transform(this.listadoPrincipal, 'local', 'key',               this.grilla.filtros['key'], 'string');
    let listadoParcial1 = new SearchFiltroPipe().transform(listadoParcial0,       'local', 'codigo',            this.grilla.filtros['codigo'], 'string');
    let listadoParcial2 = new SearchFiltroPipe().transform(listadoParcial1,       'local', 'nombre',            this.grilla.filtros['nombre'], 'string');
    let listadoParcial3 = new SearchFiltroPipe().transform(listadoParcial2,       'local', 'tipoVehiculoKN.key',this.grilla.filtros['tipoVehiculoKN.key'], 'string');
    let listadoParcialn = new SearchFiltroPipe().transform(listadoParcial3,       'local', 'yaImportado',       this.grilla.filtros['yaImportado'], 'boolean');
    console.log("listadoParcialn", listadoParcialn);
  
    for(let i=0; i<this.listadoPrincipal.length; i++) {
        let keySearch = this.listadoPrincipal[i].key;
        if( listadoParcialn.find((el => el.key == keySearch)) ) {
          
            this.listadoPrincipal[i].importar = this.importarTodos;    
            
        } else {
            this.listadoPrincipal[i].importar = false;  
        }
    }
    //console.log("listadoPrincipal", this.listadoPrincipal);
    
    this.contarCantSeleccionados();
  }
  
  comenzarImportacion() {
    
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
        
            // Actualizo Tabla AuxTiposVehiculos
            let userKeys = {
              distribuidorKN   : this.distribuidorKN,
              organizacionKNAI : this.fn.setearKNAI(this.organizacionSoap),
              usuarioKANE      : this.usuarioKANE
            }
         
            let datos:any = [];
            for(let i=0; i<this.listadoSoapTiposVehiculos.length; i++) {

                datos.push({
                  operacion        : 'agregar',
                  nombreColeccion  : 'AuxTiposVehiculos',
                  documento        : this.listadoSoapTiposVehiculos[i],
                  incluyeSettings  : true     
                });
              
            }
            
            // Actualizo Tabla Vehiculos
            for(let i=0; i<this.listadoPrincipal.length; i++) {

                if(this.listadoPrincipal[i].importar && this.listadoPrincipal[i].aptoImportar) {
                  
                    let documento={...this.listadoPrincipal[i]};
                    
                    delete documento.tipoVehiculoKey;

                    delete documento.yaImportado;
                    delete documento.importar;
                    delete documento.aptoImportar;
                    delete documento.errorValidacion;
                    
                    datos.push({
                      operacion        : 'importar',
                      nombreColeccion  : 'Vehiculos',
                      documento        : documento,
                      incluyeSettings  : true     
                    });
                }    
                
              }
              
              console.log("datos",datos);
              
              this.bdService.updateColeccionBatch(userKeys, datos)
              .then((resultado:any)=>{
                  console.log("resultado",resultado);
                  
                  // Marco en listadoPrincipal ya importados y agrego los importados al vecYaImportados, y hago upload del archivo
                  this.onPostImportacion('vehiculos',null);                  
                  
                  this.desSeleccionarTodos();
                  
                  this.spinner.hide();
                 
              }).catch((error:any)=>{
                  console.log("resultado",error);
                  this.spinner.hide();
                  alert( this.translate.instant('mensajeSoap.seProdujoUnErrorEnlaImportacion') );                              
              });  

      }).catch(error=>{      // catch Confirm  
      });
              
  } // fin funcion comenzarImportacion
      
  
}