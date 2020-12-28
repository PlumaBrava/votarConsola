import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { SoapGenerica }     from '@maq-modules/soap-generica/soap-generica.page';
import { ConfigComponente } from './ubicaciones.config';

import { SearchFiltroPipe } from '@maq-shared/pipes/search/search-filtro.pipe';

@Component({
  selector: 'soap-ubicaciones',
  templateUrl: './ubicaciones.page.html',
  styleUrls: [
    '../../../../maqueta/modules/soap-generica/soap-generica.page.scss',
    './ubicaciones.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class SoapUbicacionesComponent extends SoapGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'ubicaciones'));
  
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
        this.keyImportacion = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-ubicaciones-'+this.sucursalCodigo;  
        
        // Cargo Documentos Ya Importados        
        this.finalizoDownloadFiles['ubicaciones']=false;
        this.soapService.getImportados(this.usuarioKANE, this.organizacionSoap, this.keyImportacion)
        .subscribe((resultado:any)=>{
            console.log("getImportados resultado",resultado);
            
            this.finalizoDownloadFiles['ubicaciones']=true;
            this.ActualizarListadoPrincipalconArchivoImportado('ubicaciones');                      
            
        }, error=>{
            console.log("getImportados error",error);
        });  
        
        // 'RetrieveAccountTypesByCriteriaEx' --> AuxTiposUbicacion - Supermercado, Almacen, Kiosco
        // 'RetrieveAccountTypesByCriteriaEx' --> AuxTiposCuenta    - DPT (Depósito), SIT (Sitio), LD (Cargar)

        // Proceso Soap
        this.generadorImportadores.getSoap([
          'RetrieveLocationsByCriteriaEx',
          'RetrieveLocationTypesByCriteriaEx',
          'RetrieveAccountTypesByCriteriaEx'
        ])
        .then((vecResponse:any[])=>{
          
            console.log("generadorImportadores.getSoap - vecResponse",vecResponse);                  
            
            this.vecEjecucionesSoap=[];
            
            if(vecResponse)
            
            for(let i=0; i<vecResponse.length; i++) {
                let response = vecResponse[i];
                response.xml = response.xml.replace("((SUCURSAL))",this.sucursalCodigo);

                if(this.grilla.filtros['fechaHora'] && this.grilla.filtros['fechaHora'].desde!==undefined && this.grilla.filtros['fechaHora'].hasta!==undefined) {
                    let fecha_desde = this.grilla.filtros['fechaHora'].desde;
                    let fecha_hasta = this.grilla.filtros['fechaHora'].hasta;
                    
                    let fecha_desde_ok = fecha_desde.substr(6,4)+'-'+fecha_desde.substr(3,2)+'-'+fecha_desde.substr(0,2);
                    let fecha_hasta_ok = fecha_hasta.substr(6,4)+'-'+fecha_hasta.substr(3,2)+'-'+fecha_hasta.substr(0,2);
                    
                    response.xml = response.xml.replace("((FECHA_DESDE))", fecha_desde_ok);
                    response.xml = response.xml.replace("((FECHA_HASTA))", fecha_hasta_ok);                    
                } else {
                  response.xml = response.xml.replace("((FECHA_DESDE))", '');
                  response.xml = response.xml.replace("((FECHA_HASTA))", '');                                    
                }

                if(this.filtroSoapCodigo) {
                   response.xml = response.xml.replace("((LOCATIONID))",this.filtroSoapCodigo);
                } else {
                   response.xml = response.xml.replace("((LOCATIONID))",'');
                }   
                
                console.log("this.filtroSoapDescripcion",this.filtroSoapDescripcion);
                if(this.filtroSoapDescripcion) {
                   response.xml = response.xml.replace("((DESCRIPCION))", this.filtroSoapDescripcion );
                } else {
                   response.xml = response.xml.replace("((DESCRIPCION))",'');
                }   
                
                let parameters = {
                    xml    : response.xml,
                    action : response.action,
                    host   : this.getHostConector()
                }
                console.log(response.method + " - parameters:",parameters);
                
                if(response.action == 'http://www.roadnet.com/RTS/TransportationSuite/TransportationWebService/TransportationWebService/RetrieveLocationsByCriteriaExRequest') {                
                    this.vecEjecucionesSoap.push( 
                      this.httpPOSTSoapUbicaciones(response.method, parameters) 
                    );
                } else {
                    this.vecEjecucionesSoap.push( 
                      this.httpPOSTSoap(response.method, parameters) 
                    );
                } 
                   
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
    
    let jsonValues1                   = null;
    let jsonValues1Encontrado         = null;
    this.listadoPrincipal             = [];
    this.listadoSoapTiposUbicacion    = [];
    this.listadoSoapTiposCuenta       = [];
    
    for(let i=0; i<vecJsonResult.length; i++) {
        let jsonResult = vecJsonResult[i];
        jsonValues1     = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveLocationsByCriteriaExResponse','ns1:locations') );
        let jsonValues2 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveLocationTypesByCriteriaExResponse','ns1:locationTypes') );
        let jsonValues3 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveAccountTypesByCriteriaExResponse','ns1:accountTypes') );
        
        if(jsonValues1) {
            jsonValues1Encontrado=jsonValues1;          
        }
        
        if(jsonValues2) { // Tipos de Ubicación (RetrieveLocationTypesByCriteriaExResponse)
          //console.log("jsonValues2",jsonValues2);
          
          for(let j=0; j<jsonValues2.length; j++) {
              let json=jsonValues2[j];  
              
              let codigo:string    = this.parseJsonSoap(json,'ns1:locationTypeIdentity','ns1:locationTypeId','_text');
              let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
              let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
              
              let documento = {                
                  key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + codigo,
                  codigo            : codigo,
                  nombre            : nombre,
                  organizacionKNAI  : this.organizacionSoap
              }
              this.listadoSoapTiposUbicacion.push(documento);
          }

          this.listadoSoapTiposUbicacion.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
          
          console.log("this.listadoSoapTiposUbicacion",this.listadoSoapTiposUbicacion);
        }  

        if(jsonValues3) { // Tipos de Cuenta (RetrieveAccountTypesByCriteriaEx)

          // Agrego el tipo de Cuenta DTP dado que no viene de RoadNet (Soap Paradas), y se lo tengo que asignar a las Ubicacion es de Tipo de Cuenta Depósito (DPT)
          let documentoDeposito = {
              key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-DPT',
              codigo            : 'DPT',
              nombre            : 'Depósito',
              organizacionKNAI  : this.organizacionSoap
          }
          this.listadoSoapTiposCuenta.push(documentoDeposito);

          // Agrego el tipo de Cuenta NOIndicada dado que no viene de RoadNet (Soap Paradas), y se lo tengo que asignar a las Ubicacion es de Tipo de Cuenta Depósito (SIT)
          let documentoNoIndicada = {
            key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-NoIndicada',
            codigo            : 'NoIndicada',
            nombre            : 'No Indicada',
            organizacionKNAI  : this.organizacionSoap
        }
        this.listadoSoapTiposCuenta.push(documentoNoIndicada);
        
          for(let j=0; j<jsonValues3.length; j++) {
              let json=jsonValues3[j];  
              
              let codigo:string    = this.parseJsonSoap(json,'ns1:accountTypeIdentity','ns1:code','_text');
              let auxNombre:string = this.parseJsonSoap(json,'ns1:description','_text');
              let nombre:string    = (auxNombre==null || auxNombre=='') ? codigo : auxNombre;
              
              let documento = {
                  key               : this.fn.setearOrganizacionAI(this.organizacionSoap) + '-' + codigo,
                  codigo            : codigo,
                  nombre            : nombre,
                  organizacionKNAI  : this.organizacionSoap
              }
              this.listadoSoapTiposCuenta.push(documento);
          }

          this.listadoSoapTiposCuenta.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
          
          console.log("this.listadoSoapTiposCuenta",this.listadoSoapTiposCuenta);
          
        }
      
    } // fin for resultadosSoap    
        
    if(jsonValues1Encontrado) { // Ubicaciones (RetrieveLocationsByCriteriaExResponse)
        console.log("jsonValues1",jsonValues1Encontrado);
        for(let j=0; j<jsonValues1Encontrado.length; j++) {
            let json=jsonValues1Encontrado[j];  
                                                       
            let documento:any = this.setDocumentoUbicacion(json, null);
            
            documento.yaImportado     = false;
            documento.importar        = false;
            documento.aptoImportar    = false;
            documento.errorValidacion = null;
            
            this.listadoPrincipal.push(documento);
        }
        console.log("this.listadoPrincipal",this.listadoPrincipal);
        
        this.finalizoSoapComponente=true;
        
        this.ActualizarListadoPrincipalconArchivoImportado('ubicaciones');                                  
    }
    
  }

  aptoImportacion(documento) {
    // console.log("aptoImportacion");
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
        
            let userKeys = {
              distribuidorKN   : this.distribuidorKN,
              organizacionKNAI : this.fn.setearKNAI(this.organizacionSoap),
              usuarioKANE      : this.usuarioKANE
            }
         
            let datos:any = [];
            
            // Actualizo Tabla AuxTiposUbicacion            
            for(let i=0; i<this.listadoSoapTiposUbicacion.length; i++) {

                datos.push({
                  operacion        : 'agregar',
                  nombreColeccion  : 'AuxTiposUbicacion',
                  documento        : this.listadoSoapTiposUbicacion[i],
                  incluyeSettings  : true     
                });              
            }

            // Actualizo Tabla AuxTiposCuenta
            for(let i=0; i<this.listadoSoapTiposCuenta.length; i++) {

                datos.push({
                  operacion        : 'agregar',
                  nombreColeccion  : 'AuxTiposCuenta',
                  documento        : this.listadoSoapTiposCuenta[i],
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
                  
                  // Marco en listadoPrincipal ya importados y agrego los importados al vecYaImportados, y hago upload del archivo
                  this.onPostImportacion('ubicaciones',null);                  
                  
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