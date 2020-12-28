import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { SoapGenerica }       from '@maq-modules/soap-generica/soap-generica.page';
import { ConfigComponente }   from './empleados.config';

import { SearchFiltroPipe }   from '@maq-shared/pipes/search/search-filtro.pipe';
import { AngularHereService } from '@maq-servicios/here/angularHere.service';

import { ExcelService }       from '@maq-servicios/excel/excel.service';

@Component({
  selector: 'soap-empleados',
  templateUrl: './empleados.page.html',
  styleUrls: [
    '../../../../maqueta/modules/soap-generica/soap-generica.page.scss',
    './empleados.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class SoapEmpleadosComponent extends SoapGenerica implements OnInit, OnDestroy {

  constructor (private excel : ExcelService,
                public angularHere:AngularHereService,
               protected changeDetectorRef: ChangeDetectorRef) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'distribuidores'));
  
  public listadoSoapTiposEmpleados:any[]=[];
  public emailFaltante:string[]=[];  
  
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
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
        
        argumentos['whereSucursales']=[{
          key        : 'organizacionKNAI.key',
          operador   : '==',
          value      : this.fn.mostrarKN(this.organizacionKNAI,"key")
        }];
        
        argumentos['wherePerfiles']=[{
          key        : 'key',
          operador   : '==',
          value      : 'Organización-Chofer'
        }];
      
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
      this.cantSeleccionados=0;
      this.cantSeleccionadosOk=0; 

  }  
  
  setAccionForm(accion) {
    log(...values('funcionComponente','setAccionForm Distribuidores', accion));

    super.setAccionForm(accion);

    // Agregar acá, modificaciones adicionales al this.form

  }  
  
  onExportarExcelACompletar() {
      let jsonExportar = [];
      for(let i=0; i<this.listadoPrincipal.length;i++) {
          jsonExportar.push({
              regionId : this.sucursalCodigo,       
              idEmpleado : this.listadoPrincipal[i].codigo,
              apellidoNombre : this.listadoPrincipal[i].datosPersonales.apellidoNombre,
              email : this.listadoPrincipal[i].email ? this.listadoPrincipal[i].email : ''
          });
      }
      
      let hojaExcel = {
        'hoja1':jsonExportar
      }
      
      this.excel.exportJsonAsExcelFile(hojaExcel, 'empleados');
    
  } 
  
  onProcesarExcelMailsEmpleados(evt:any) {
    this.excel.convertExcelToJson(evt)
    .then(
        (data:any)=>{ 
          console.log("onProcesarExcelMailsEmpleados Excel",data);
          
          let listado = data.hoja1;
          
          for(let i=0; i<listado.length; i++) {
              //console.log(listado[i].regionId, sucursalCodigo, listado[i].email);
              if(listado[i].regionId==this.sucursalCodigo && listado[i].email!='') {
                
                  let posIndex = this.listadoPrincipal.findIndex(documento=>documento.codigo==listado[i].idEmpleado);
                  //console.log("posIndex",posIndex, listado[i].email);
                  if(posIndex != -1) {
                    this.listadoPrincipal[posIndex].email = listado[i].email;
                  }
              }
          }
    
    }).catch((error:any)=> {
          console.log("onProcesarExcelMailsEmpleados error",error)
    });
    
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
        this.keyImportacion = this.fn.setearOrganizacionAI(this.organizacionSoap) + '-empleados-'+this.sucursalCodigo;  

        // Cargo Documentos Ya Importados
        this.finalizoDownloadFiles['empleados']=false;            
        this.soapService.getImportados(this.usuarioKANE, this.organizacionSoap, this.keyImportacion)
        .subscribe((resultado:any)=>{
            console.log("getImportados resultado",resultado);
            
            this.finalizoDownloadFiles['empleados']=true;
            this.ActualizarListadoPrincipalconArchivoImportado('empleados');                      
            
        }, error=>{
            console.log("getImportados error",error);
        });  

        // Proceso Soap
        this.generadorImportadores.getSoap([
          'RetrieveEmployeesByCriteriaEx',
          'RetrieveEmployeesTypesByCriteriaEx'
        ])
        .then((vecResponse:any[])=>{
          
            console.log("this.sucursalCodigo",this.sucursalCodigo);
          
            console.log("generadorImportadores.getSoap - vecResponse",vecResponse);                  
            
            this.vecEjecucionesSoap=[];
            for(let i=0; i<vecResponse.length; i++) {
                let response = vecResponse[i];
                console.log("response.xml",response.xml);
                
                response.xml = response.xml.replace("((SUCURSAL))",this.sucursalCodigo);
                
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
        let jsonValues1 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveEmployeesByCriteriaExResponse','ns1:employees') );
        let jsonValues2 = this.verifyJsonIsArray( this.parseJsonSoap(jsonResult,'SOAP-ENV:Envelope','SOAP-ENV:Body','ns1:RetrieveEmployeeTypesByCriteriaExResponse','ns1:employeeTypes') );
        
        console.log("jsonValues1",jsonValues1);
        console.log("jsonValues2",jsonValues2);
        
        if(jsonValues1) { // Empleados (RetrieveEquipmentByCriteriaResponse)
          
            let idioma = (this.organizacionSoap && this.organizacionSoap.idioma!==undefined) ? this.organizacionSoap.idioma : null;
          
            for(let j=0; j<jsonValues1.length; j++) {
                let json=jsonValues1[j];  
                
                let codigo:string = this.parseJsonSoap(json,'ns1:employeeIdentity','ns1:employeeID','_text');
                
                let auxNombre   = this.parseJsonSoap(json,'ns1:firstName','_text');
                let auxApellido = this.parseJsonSoap(json,'ns1:lastName','_text');
                let apellidoNombre;
                if(auxApellido!='' && auxNombre!='' && auxApellido!=null && auxNombre!=null) {                  
                  apellidoNombre = auxApellido+', '+auxNombre;
                } else if(auxApellido!='' && auxApellido!=null) {  
                  apellidoNombre = auxApellido;
                } else if(auxNombre!='' && auxNombre!=null) {  
                  auxApellido = auxNombre;
                  auxNombre   = null;
                  apellidoNombre = auxApellido;
                } else {  
                  auxApellido    = codigo;
                  apellidoNombre = codigo;
                }  
                //console.log("auxApellido,auxNombre,apellidoNombre",auxApellido,auxNombre,apellidoNombre);
                
                let documento = {
                    key                       : this.parseJsonSoap(json,'ns1:employeeIdentity','ns1:employeeID','_text'),
                    email                     : null,
                    emailRecuperacion         : null,
                    
                    codigo                    : codigo,
                    
                    datosPersonales   : {
                        apellido              : auxApellido ? auxApellido : null,
                        nombre                : auxNombre ? auxNombre : null,
                        apellidoNombre        : apellidoNombre,
                        fechaNacimiento       : null,
                        genero                : null,
                        fotoIMG               : null,
                        idioma                : idioma
                    },
                    
                    direccion                 : null,
                    telefono                  : null,
                    perfilUsuario             : null,

                    distribuidor              : null,
                    organizacion              : null,
                    sucursalesAreasNegocio    : [],
                    menuesFavoritos           : [],
            
                    tipoEmpleadoId            : this.parseJsonSoap(json,'ns1:employeeType','_text'),
                    tipoEmpleadoNombre        : null,
                    isDriver                  : this.fn.textToBoolean( this.parseJsonSoap(json,'ns1:isDriver','_text') ),
                    status                    : this.parseJsonSoap(json,'ns1:employeeStatus','_text'),                    
                    
                    yaImportado               : false,
                    importar                  : false,
                    editarEmail               : false,
                    aptoImportar              : false,
                    errorValidacion           : null,
                    errorEmailAImportar       : null,
                    responseCheckcodigo : null,
                }
                this.listadoPrincipal.push(documento);
                
            } // fin for
            console.log("this.listadoPrincipal",this.listadoPrincipal);

            this.finalizoSoapComponente=true;
            
            this.ActualizarListadoPrincipalconArchivoImportado('empleados');
            
        }
        
        if(jsonValues2) { // Tipos de Empleados (RetrieveEquipmentTypesByCriteriaResponse)
          this.listadoSoapTiposEmpleados = [];

          for(let j=0; j<jsonValues2.length; j++) {
            let json=jsonValues2[j];  
            let documento = {
                tipoEmpleadoId : this.parseJsonSoap(json,'ns1:employeeTypeIdentity','ns1:employeeTypeId','_text'),
                nombre         : this.parseJsonSoap(json,'ns1:description','_text'),
            }
            this.listadoSoapTiposEmpleados.push(documento);
        }
        
        this.listadoSoapTiposEmpleados.sort(this.fn.ordenarXAtributo('nombre', 'asc',false));
        
        console.log("this.listadoSoapTiposEmpleados",this.listadoSoapTiposEmpleados);
      
      }
      
    } // fin for resultadosSoap
    
    for(let i=0; i<this.listadoPrincipal.length; i++) {
        let tipoEmpleadoId = this.listadoPrincipal[i].tipoEmpleadoId;
        let tipoEmpleadoNombre  = this.fn.getAtributoFromListado( this.listadoSoapTiposEmpleados, tipoEmpleadoId, 'tipoEmpleadoId', 'nombre');
        this.listadoPrincipal[i].tipoEmpleadoNombre = tipoEmpleadoNombre;
    }  
    console.log("this.listadoPrincipal",this.listadoPrincipal);
    
  }

  aptoImportacion(documento) {
    let rta=true;
    documento.errorValidacion='';
    
    if(documento.errorEmailAImportar) {
        documento.errorValidacion += documento.errorEmailAImportar+' \n';
        rta=false;
    }    
    
    if(!documento.email) {
        documento.errorValidacion += this.translate.instant('mensajeSoap.indiqueEmailEmpleado')+' \n';
        rta=false;
    }    
    
    if(!documento.datosPersonales.apellidoNombre || documento.datosPersonales.apellidoNombre=='') {
        documento.errorValidacion += this.translate.instant('mensajeSoap.empleadoSinApellidoNombre')+' \n';
        
        rta=false;
    }    
  
    documento.aptoImportar=rta;
    
    return rta;
  }

  onPostSeleccionarItem(documento:any, posInListado:number) {
    
      // Ir a Obtener Email (si ya existe)
      this.buscarDatoEnBD(
        "Usuarios",
        [{key:'codigo',operador:'==',value:documento.codigo}],
        posInListado,
        "email",
        "verificaExisteEnBDconcodigo"
      );
      
      super.onPostSeleccionarItem(documento, posInListado);
  }  
  
  seleccionarTodosImportar() {
    console.log("seleccionarTodosImportar",this.importarTodos);
    
    this.importarTodos = !this.importarTodos;
    
    let listadoParcial0 = new SearchFiltroPipe().transform(this.listadoPrincipal, 'local', 'key',                               this.grilla.filtros['key'], 'string');
    let listadoParcial1 = new SearchFiltroPipe().transform(listadoParcial0,       'local', 'codigo',                      this.grilla.filtros['codigo'], 'string');
    let listadoParcial2 = new SearchFiltroPipe().transform(listadoParcial1,       'local', 'datosPersonales.apellidoNombre',    this.grilla.filtros['datosPersonales.apellidoNombre'], 'string');
    let listadoParcial3 = new SearchFiltroPipe().transform(listadoParcial2,       'local', 'tipoEmpleadoId',                    this.grilla.filtros['tipoEmpleadoId'], 'string');
    let listadoParcial4 = new SearchFiltroPipe().transform(listadoParcial3,       'local', 'isDriver',                          this.grilla.filtros['isDriver'], 'boolean');
    let listadoParcial5 = new SearchFiltroPipe().transform(listadoParcial4,       'local', 'status',                            this.grilla.filtros['status'], 'string');
    let listadoParcial6 = new SearchFiltroPipe().transform(listadoParcial5,       'local', 'email',                             this.grilla.filtros['email'], 'string');
    let listadoParcialn = new SearchFiltroPipe().transform(listadoParcial6,       'local', 'yaImportado',                       this.grilla.filtros['yaImportado'], 'boolean');
    
    console.log("listadoParcialn", listadoParcialn);
  
    for(let i=0; i<this.listadoPrincipal.length; i++) {
        let keySearch = this.listadoPrincipal[i].key;
        if( listadoParcialn.find((el => el.key == keySearch)) ) {
          
            this.listadoPrincipal[i].importar = this.importarTodos;    
            
            if(this.importarTodos && this.listadoPrincipal[i].yaImportado==false) {
                  
                // Ir a Obtener Email (si ya existe)
                this.buscarDatoEnBD(
                  "Usuarios",
                  [{key:'codigo',operador:'==',value:this.listadoPrincipal[i].codigo}],
                  i,
                  "email",
                  "verificaExisteEnBDconcodigo"
                );              
            }
        } else {
            this.listadoPrincipal[i].importar = false;  
        }
    }
    console.log("listadoPrincipal", this.listadoPrincipal);
  }
  
  colorColumnaEmail(documento) {
      if(documento.yaImportado) {  // tonos apagados de verde y rojo
            if(documento.errorEmailAImportar) {
                return { 'color':'#dd7f7f' };
            } else {
                return { 'color':'#9dd3a2'};
            }            
          
      } else {
            if(documento.errorEmailAImportar) {
                return { 'color':'red' };
            } else {
                return { 'color':'green'};
            }            
      }
  }
  
  
  closeEditarEmail(documento:any, documentoKey:string) {
      console.log("closeEditarEmail", this.emailFaltante[documentoKey]);
      documento.editarEmail=false;
  }  
  
  editarEmail(documento, value) {    
    
    let documentoKey = documento.key
    console.log("editarEmail",documento, documentoKey, value);
    
    if(value==false) { // Acaba de hacer Enter sobre el email tipeado
        var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
        if( !emailRegexp.test( this.emailFaltante[documentoKey] )) {
          
            documento.editarEmail=true;
            alert( this.translate.instant('mensajeSoap.ingreseEmailValido') );            
            
            return;
        }
    }  
    
    for(let i=0; i<this.listadoPrincipal.length; i++) {
      if(this.listadoPrincipal[i].key == documentoKey) {
          this.listadoPrincipal[i].editarEmail = value;  
          
          this.listadoPrincipal[i].importar = true;          
          
          if(value==false) {  // Hice enter en el Email
              this.listadoPrincipal[i].email = this.emailFaltante[documentoKey];
              
              // Verifico que el Email no esté utilizado con otro usuario
              this.buscarDatoEnBD(
                "Usuarios",
                [{key:'email',operador:'==',value:this.listadoPrincipal[i].email}],
                i,
                "email",
                "existeUsuarioConEmailverificaExisteEnBD"
              );
              
          } else {  // Clickee para comenzar a escribir el email
              this.onPostSeleccionarItem(this.listadoPrincipal[i],i);
              this.emailFaltante[documentoKey] = this.listadoPrincipal[i].email;
          }
      } else {
          this.listadoPrincipal[i].editarEmail = false;  
      }   
    }
  }
  
  buscarDatoEnBD(coleccion:string, whereArray:any[], indexListadoPrincipal:number, fieldDestino:string, operacion:string) {    
    
    let argumentos:any={
      nombreColeccion  : coleccion,
      where            : whereArray,
      orderBy          : [],
      limit            : null,
      paginado         : null,
      offset           : null,
      organizacionKNAI : this.organizacionSoap,
      usuarioKANE      : this.usuarioKANE
    };
    
    this.bdService.getBDPromesa(argumentos) 
      .then((resultado:any[])=>{
        console.log('bdService.getBDPromesa ok',indexListadoPrincipal, resultado, operacion);
        
        if(operacion=='verificaExisteEnBDconcodigo') {
            this.listadoPrincipal[ indexListadoPrincipal ]['responseCheckcodigo'] = resultado;
        }    
        
        if(resultado.length==1) {
            if(operacion=='verificaExisteEnBDconcodigo') {
                this.listadoPrincipal[ indexListadoPrincipal ][fieldDestino] = resultado[0][fieldDestino];  
                this.listadoPrincipal[ indexListadoPrincipal ].errorEmailAImportar = null;   
                this.emailFaltante[ this.listadoPrincipal[ indexListadoPrincipal ].key ] = resultado[0]['email'];           
                
            } else if(operacion=='existeUsuarioConEmailverificaExisteEnBD') {
                if(this.listadoPrincipal[ indexListadoPrincipal ]['codigo'] == resultado[0]['codigo']) {
                    this.listadoPrincipal[ indexListadoPrincipal ].importar = true;                    
                    this.listadoPrincipal[ indexListadoPrincipal ].errorEmailAImportar = null;
                } else {
                    this.listadoPrincipal[ indexListadoPrincipal ].importar = true;
                    this.listadoPrincipal[ indexListadoPrincipal ].errorEmailAImportar = this.translate.instant('mensajeSoap.rutaYaIniciadaNoSePuedeImportar',{ idEmpleado : resultado[0]['codigo'], nombreEmpleado : resultado[0]['datosPersonales']['apellidoNombre']});
                }
            }   
            
        } else if(resultado.length>1) {
            console.log('bdService.getBDPromesa error se encontrar muchos resultados');
            this.listadoPrincipal[ indexListadoPrincipal ].importar = true;     
            this.listadoPrincipal[ indexListadoPrincipal ].errorEmailAImportar = this.translate.instant('mensajeSoap.multiplesResultadosConflictoDatosAviseSupervisor');
  
        } else {   // lenght==0
            console.log('bdService.getBDPromesa no se encontrar resultados');
            
            if(operacion=='existeUsuarioConEmailverificaExisteEnBD') {
                console.log(this.listadoPrincipal[ indexListadoPrincipal ]['responseCheckcodigo']);
                
                if(this.listadoPrincipal[ indexListadoPrincipal ]['responseCheckcodigo'] &&
                   this.listadoPrincipal[ indexListadoPrincipal ]['responseCheckcodigo'].length==0 ) {
                     
                      this.listadoPrincipal[ indexListadoPrincipal ].importar = true;     
                      this.listadoPrincipal[ indexListadoPrincipal ].errorEmailAImportar = null;
                } else {
                    this.listadoPrincipal[ indexListadoPrincipal ].importar = true;                    
                    this.listadoPrincipal[ indexListadoPrincipal ].errorEmailAImportar = 'Este empleado ya fue asignado al email '+resultado[0]['email'];
                }
            }  
        }
        
        this.contarCantSeleccionados();

      }).catch((error:any)=>{
        console.log('bdService.getBDPromesa error',indexListadoPrincipal, error);
      });  
    
  }
  
  comenzarImportacion() {
    
        if(this.cantSeleccionadosOk==0) {
            alert( this.translate.instant('mensajeSoap.noHayRegistrosSeleccionadossValidosParaImportar') );                        
            return;
        }
        
        // Verifico Emails Repetidos
        let emailsAsignados=[];
        for(let i=0; i<this.listadoPrincipal.length;i++) {
            let documento = this.listadoPrincipal[i];
            if(documento.importar && documento.aptoImportar) {
                if(emailsAsignados.indexOf(documento.email)!=-1) {
                    alert( this.translate.instant('mensajeSoap.elEmailxxfueAsignadosaMasDe1Empleado',{ email: documento.email}) );
                    
                    this.listadoPrincipal[ i ].errorEmailAImportar = this.translate.instant('mensajeSoap.emailRepetido');
                    this.listadoPrincipal[ i ].aptoImportar = false;
                    this.contarCantSeleccionados();
                                        
                    return;
                } else {
                    emailsAsignados.push(documento.email)
                }
            }
        }

        this.confirmService.confirm({ 
          title:   this.translate.instant('soap.importacionSoap'), 
          message: this.translate.instant('mensajeSoap.comenzarImportacionDatosObtenidosDelConector') })
        .then((resultadoOK) => {       
        
            this.cualSpinner = 'grabando';
            this.spinner.show();
        
            // Actualizo Tabla AuxTiposEmpleados
            let userKeys = {
              distribuidorKN   : this.distribuidorKN,
              organizacionKNAI : this.fn.setearKNAI(this.organizacionSoap),
              usuarioKANE      : this.usuarioKANE
            }
         
            let datos:any = [];
            
            // Actualizo Tabla Usuarios (Empleados Choferes)
            for(let i=0; i<this.listadoPrincipal.length; i++) {

                if(this.listadoPrincipal[i].importar && this.listadoPrincipal[i].aptoImportar) {
                  
                    let documento={...this.listadoPrincipal[i]};
                    
                    // Borro campos que no se usan
                    delete documento.tipoEmpleadoId;
                    delete documento.tipoEmpleadoNombre;
                    delete documento.isDriver;
                    delete documento.status;
                    
                    delete documento.yaImportado;
                    delete documento.importar;
                    delete documento.aptoImportar;
                    delete documento.errorValidacion;
                    
                    delete documento.editarEmail;
                    delete documento.errorEmailAImportar;
                    delete documento.responseCheckcodigo;
                    
                    // Reemplazo el key (provisoriamente tiene la codigo)
                    documento.key = documento.email;
                    
                    // Asigno valor a campos con null
                    documento.organizacion  = this.organizacionSoap;
                    documento.distribuidor  = this.organizacionSoap.distribuidor;
                    documento.perfilUsuario = this.msg.cacheColecciones['PerfilChofer'][0];

                    // Asigno las Sucursales/Areas de Negocio (de la Organizacion) a las que el Usuario tiene acceso
                    let sucursalesAreasNegocio=[];
                    for(let j=0; j<this.listadoSucursales.length; j++) {
                        let sucursalKey = this.listadoSucursales[j].key;
                        for(let z=0; z<this.listadoAreasNegocio.length; z++) {
                           
                           let areaNegocioKey = this.listadoAreasNegocio[z].key;
                           
                           sucursalesAreasNegocio.push(sucursalKey+'@@@'+areaNegocioKey);   
                        }   
                    }
                    documento.sucursalesAreasNegocio=sucursalesAreasNegocio;
                    
                    /* ----- Seteo Keywords ------------------------- */      
                    let stringKeywords = documento.datosPersonales.apellido+' '+documento.datosPersonales.nombre;
                    documento['keywords'] = this.fn.generateKeywords( stringKeywords );
                    //log(...values('valores',"documento['keywords']:", documento['keywords']));                    
                    
                    console.log("documento",documento);
                    
                    datos.push({
                      operacion        : 'importar',
                      nombreColeccion  : 'Usuarios',
                      documento        : documento,
                      incluyeSettings  : true     
                    });
                }    
                
              }
              
              console.log("datos",datos);
              
              this.bdService.updateColeccionBatch(userKeys, datos)
              .then((resultado:any)=>{
                  console.log("updateColeccionBatch resultado",resultado);

                  // Marco en listadoPrincipal ya importados y agrego los importados al vecYaImportados, y hago upload del archivo
                  this.onPostImportacion('empleados',null);
                      
                  this.desSeleccionarTodos();
                                     
                  this.spinner.hide();
                 
              }).catch((error:any)=>{
                  console.log("updateColeccionBatch error",error);
                  this.spinner.hide();
                  alert( this.translate.instant('mensajeSoap.seProdujoUnErrorEnlaImportacion') );
              });  
          
      }).catch(error=>{      // catch Confirm  
      });
            
    
  } // fin funcion comenzarImportacion

}