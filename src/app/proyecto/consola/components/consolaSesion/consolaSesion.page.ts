import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef,ViewChild } from '@angular/core';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { PageGenerica2 }        from '@maq-modules/page-generica/page-generica2.page';
import { ConfigComponente }     from './consolaSesion.config';
import * as votarWebConfig      from './../../../../../votarWebConfig.json';



import { Novedades, NovedadesInterface }      from '@proyecto/models/novedades/novedades.model';
import { OrdenDelDia,OrdenDelDiaInterface }   from '@proyecto/models/ordenDelDia/ordenDelDia.model';
import { Parametros }                         from '@proyecto/models/parametros/parametros.model';
import { SesionesConsola, SesionesInterface } from '@proyecto/models/sesionesConsola/sesionesConsola.model';
import { Concejales,ConcejalesDispositivosInterface, ConcejalesInterface }   from '@proyecto/models/concejales/concejales.model';
import {Dispositivos, DispositivosInterface}   from '@proyecto/models/dispositivos/dispositivos.model';

import { MOCK_INFOAPROBACION,MOCK_INFOAGRUPACION,MOCK_INFOVOTO, MOCK_RESULTADO_VOTO_ID }      from '@proyecto/mocks/votos/votos.mocks';
import { MOCK_INFOAPROBACION_Interfase,MOCK_INFOAGRUPACION_Interfase,MOCK_INFOVOTO_Interfase }      from '@proyecto/mocks/votos/votos.mocks';
import { MOCK_INFOAPROBACION_ID,MOCK_INFOAGRUPACION_ID,MOCK_INFOVOTO_ID } from '@proyecto/mocks/votos/votos.mocks';
import { getInfoVoto,getInfoAprobacion,getInfoAgrupacion, MOCK_TIPO_ORDEN_DIA_ID, MOCK_QUORUM } from '@proyecto/mocks/votos/votos.mocks';


import { MOCK_ESTADOS }       from '@proyecto/mocks/votos/votos.mocks';
import { ExcelService }       from '@maq-servicios/excel/excel.service';


import { environment }        from '@environments/environment';
import { throwIfEmpty } from 'rxjs/operators';




@Component({
  selector: 'app-consola-sesion',
  templateUrl: './consolaSesion.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './consolaSesion.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ConsolaSesionComponent extends PageGenerica2<Novedades<NovedadesInterface>> implements OnInit, OnDestroy {
  @ViewChild("modalConfirmacionResultados") modalConfirmacionResultados: any;
  
  public CONCEJO                      = '';
  public ESTADO=MOCK_ESTADOS
  public estadoConsola                = this.ESTADO.ESPERANDO_NOVEDADES;
  

  public sesion                       = "primer Sesion";
  public titulo                       = '';//Titulo que se expone en TV se usa en sesion HTML
  public texto                        = '';//Texto que se expone en TV se usa en sesion HTML
  public nroPresetes                  = 0;
  public nroAusentes                  = 0;
  public dia                          : Date = new Date();

  public sesionTituloPanel            = 'Titulo de Sesion Panel';//'Titulo de Sesion Panel';

  public selected                     = null;

  public recSesionActiva              = {};
  public recParametros                = {};
  


  // Parámteros
  public Parametros                       : Parametros[]=[];
  public nroQuorum                        : number = null;
  public nroVotosMayoriaAbsoluta          : number = null;;
 
  public parametroTratamientoAbstencion   : number = null;
  public textoEspera                      : string = null;
  public tituloEspera                     : string = null;
  public tituloReloj                      : string = null;
  public texto                            : string = null;
  public titulo                           : string = null;
  public muestroVotosAlVotar              : boolean =null;  // muestro los votos al votar o espero a terminar el tiempo
  public Sesiones_Reloj_Orden             : boolean =null;  // orden en el reloj de uso de la palabra
  public Sesiones_Reloj_Tiempo            : number  =null;  // Tiempo Maximo en el reloj de uso de la palabra
  public tiempoVotacion                   : number  =null;  // Tiempo asignado para votar

  public Sesiones_FinalizaTiempoVotacion  : boolean =null;  // Fianliza la votacion cuando votan todos
  public Sesiones_MuestraQuorumPanel      : boolean =null;  // 0: hay quoum con la mitad mas uno, 1: todos(igual a seiones_Quorum)
  public Sesiones_SensorSillaQuorum       : boolean =null;  // Hay sensores instalados o no

  public Sesiones_PDFFinalSesion="reporte.pdf?#zoom=100&scrollbar=0&toolbar=0&navpanes=0";//Link del Archivo PdF

  public textoQuorum        : string='Texto Quorum';
  public hayQuorum          : boolean=false;

  public concejalesSesion   : SesionesInterface[]=[];
  public ordeDiaSesion      : OrdenDelDiaInterface[]=[];
  public capitulosOrdeDiaSesion      : OrdenDelDiaInterface[]=[];



  public soloUnaLectura     : boolean=false;// Uso este parámetro para no telener una lectura continua de la tabla de sesiones y hacer testing

  //  Recuento de Concejales
  public  presentes                     : number=0;
  public  ausentes                      : number=0;
  public  excusados                     : number=0;
  public  habilitados                   : number=0;
  public  deshabilitados                : number=0;
  public  totalPidePalabra              : number=0;
  public  totalConfirmacionPresencia    : number=0;

  //  Sección del tipo de votación
  public  mock_infoAprobacion           = MOCK_INFOAPROBACION;
  public  mock_infoAgrupacion           = MOCK_INFOAGRUPACION;
  public  mock_infoVoto                 = MOCK_INFOVOTO ;
  public  infoAprobacionSelected        : number=null ;
  public  infoAgrupacionSelected        : number=null ;
  public  infoVotoSelected              : number=null ;

  public  infoAprobacionSelectedAnterior: number=null ;

  public itemSeleccionado                   : OrdenDelDiaInterface=null;
  public itemsSeleccionados                 : OrdenDelDiaInterface[]=[];
  public itemsDelExpedienteSeleccionado     : OrdenDelDiaInterface[]=[];
  public indicesExpedientesSeleccionados    : number[]=[];
  public indicesCapitulosSeleccionados      : number[]=[];
  
  public  concejalPresidente            : SesionesInterface=null;
  public  TerminadoItemOrdenDelDia      : boolean=null;
  public  EstadoItemOrdenDelDia         : boolean=null;
  public  numAgrupacion                 : number=null;
  public  numeroSesion                  : number=null;
  public  tipoSesion                    : string=null;
  public  tipoSesionId                  : number=null;

  // cambio de presidente
  public cambioPresidenteIniciado                 : boolean=false;
  public cambioPresidenteActivo                   : boolean=false; // ya se eligio el nuevo presidente y se autorizó el cambio
  public cambioPresiteInstrucciones               : String='';
  public concejalSeleccionadoParaPresidente       : SesionesInterface=null;
  public impactoCambiosEnSesiones                 : number=0;
  public impactoCambiosEnConcejalesDispositivos   : number=0;
  public concejalDispositivoPresidenteSaliente    : ConcejalesDispositivosInterface=null;
  public concejalDispositivoNuevoPresidente       : ConcejalesDispositivosInterface=null;

  // Votación Nominal
 
  public sePuedeSolicitarConfimracionDeConcejalVotacionNominal  :boolean=true; // Ya se solicitó la confirmación del próximo concejal


  constructor ( protected changeDetectorRef    : ChangeDetectorRef,
                private excel : ExcelService,
                public modalService: NgbModal,
              ) {    
      
             super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'PanelSesionComponent'));
 


  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit '));
     console.log(MOCK_INFOAPROBACION,MOCK_INFOAGRUPACION,MOCK_INFOVOTO );

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

   

    //  esta manera de usar el config, no necesita compilar para modificar los datos.
    //  basta con cambiar los datos en este archivo

    console.log('http(votarWebConfig)', votarWebConfig);
    console.log('http(votarWebConfig)', votarWebConfig['default']);
      // this.IP_SERVER=votarWebConfig['default'].IP_SERVER_NODE;
      // this.PORT_SERVER=votarWebConfig['default'].PORT_SERVER;
      this.CONCEJO=votarWebConfig['default'].CONCEJO;

     
    console.log('this.CONCEJO',this.CONCEJO);

    


    let urlParametros:string='';
    urlParametros=environment.serviciosExternos.sql.apiURL+'api/parametros/1';   
    this.http.get(urlParametros).subscribe((parametros:Parametros[])=>{
      console.log('parametros',parametros)
      
      this.Parametros=parametros;

      this.numeroSesion= this.Parametros[0].Sesiones_Ordinarias;
      this.tipoSesion  = this.Parametros[0].Sesiones_TipoSesion;
      
      MOCK_TIPO_ORDEN_DIA_ID

      if(this.tipoSesion=="Ordinaria"){
        this.tipoSesionId=MOCK_TIPO_ORDEN_DIA_ID.ORDINARIA;
        this.numeroSesion= this.Parametros[0].Sesiones_Ordinarias;
      } else if(this.tipoSesion=="ExtraOrdinaria"){
        this.tipoSesionId=MOCK_TIPO_ORDEN_DIA_ID.EXTRAORDINARIA;
        this.numeroSesion  = this.Parametros[0].Sesiones_Extraordinaria;
      } else if(this.tipoSesion=="Prorroga"){
        this.tipoSesionId=MOCK_TIPO_ORDEN_DIA_ID.PRORROGA;
        this.numeroSesion  = this.Parametros[0].Sesiones_Prorroga;
      } else if(this.tipoSesion=="Especial"){
        this.tipoSesionId=MOCK_TIPO_ORDEN_DIA_ID.ESPECIAL;
        this.numeroSesion  = this.Parametros[0].Sesiones_Especial;
      }

      this.setPanelTipoSesion_Numero();
      
      this.nroQuorum = Math.round(this.Parametros[0].Sesiones_Quorum/2+1);
      this.nroVotosMayoriaAbsoluta = Math.round(this.Parametros[0].Sesiones_Quorum*2/3);
      this.tiempoVotacion = this.Parametros[0].Sesiones_TiempoVotacion;
      console.log('nroVotosMayoriaAbsoluta:', this.nroVotosMayoriaAbsoluta);
      this.parametroTratamientoAbstencion =this.Parametros[0].Sesiones_SinVoto;
      this.textoEspera =this.Parametros[0].Sesiones_Espera_Texto;
      this.tituloEspera =this.Parametros[0].Sesiones_Espera_Titulo;
      this.tituloReloj =this.Parametros[0].Sesiones_Reloj_Titulo;
      this.texto=this.textoEspera?this.textoEspera:"<p> Texto Default </p>" ;
      this.titulo=this.tituloEspera;
      this.muestroVotosAlVotar =this.Parametros[0].Sesiones_ResultadoVoto;// muestro los votos al votar o espero a terminar el tiempo
      this.Sesiones_Reloj_Orden =this.Parametros[0].Sesiones_Reloj_Orden;// orden en el reloj de uso de la palabra
      this.Sesiones_Reloj_Tiempo =this.Parametros[0].Sesiones_Reloj_Tiempo;// Tiempo Maximo en el reloj de uso de la palabra

      this.Sesiones_FinalizaTiempoVotacion=this.Parametros[0].Sesiones_FinalizaTiempoVotacion;// Fianliza la votacion cuando votan todos
      this.Sesiones_MuestraQuorumPanel =this.Parametros[0].Sesiones_MuestraQuorumPanel;// 0: hay quoum con la mitad mas uno, 1: todos(igual a seiones_Quorum)
      this.Sesiones_SensorSillaQuorum =this.Parametros[0].Sesiones_SensorSillaQuorum;// Hay sensores instalados o no

      // $scope.Sesiones_PDFFinalSesion=
      // $scope.Parametros[0].Sesiones_PDFFinalSesion+"?#zoom=100&scrollbar=0&toolbar=0&navpanes=0"//Link del Archivo PdF

      this.Sesiones_PDFFinalSesion          = "reporte.pdf?#zoom=100&scrollbar=0&toolbar=0&navpanes=0";//Link del Archivo PdF
      this.infoAprobacionSelected           = this.Parametros[0].Sesiones_Inicio_TipoAprobacion;
      this.infoAgrupacionSelected           = this.Parametros[0].Sesiones_Inicio_TipoVotacion;
      this.infoAprobacionSelectedAnterior   = this.Parametros[0].Sesiones_Inicio_TipoVotacion;
      this.infoVotoSelected                 = this.Parametros[0].Sesiones_Inicio_TipoVoto;
      this.numAgrupacion                    = this.Parametros[0].Sesiones_AgrupacionOrdenDia  ;

      console.log('http(recParametros)',  this.Parametros[0]);
      console.log('http(recParametros)',  this.nroQuorum);
      console.log('http(recParametros  this.infoAprobacionSelected)',  this.infoAprobacionSelected);
      console.log('http(recParametros  this.infoAgrupacionSelected)',  this.infoAgrupacionSelected);
      console.log('http(recParametros  this.infoVotoSelected)',  this.infoVotoSelected);

      this.getOrdenDia();
      //
    })

    

    // Cheque la tabla de sesiones cada un segunto para acutalizar los datos
   
    if(!this.soloUnaLectura) {
      setInterval(() => {
            this.checkSesiones();      
        }, 1000);
    } else{
      this.checkSesiones(); 
    } 
    
 

    super.ngOnInit()
  
  }

  setPanelTipoSesion_Numero(){
     
    let urlPanel:string='';
      
    let docPanel= {   
      NumTipoSesion   : this.numeroSesion,
      TipoSesion      : this.tipoSesion
  
    };
    urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
    let susPanel=this.http.put(urlPanel,docPanel).subscribe(data=>{
      console.log(data);
      susPanel.unsubscribe();
    },error=>{
      console.log('error',error);
    });
      
  };

  ngOnDestroy() {
    super.ngOnDestroy()
  }  

  configuracionComponente() {
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
      
        
                
        
        // if(this.tipoPerfilUsuario=='Organizacion' && this.organizacionKNAI) {
        //   argumentos['grillaWhereArray']=[{ 
        //       key:      'organizacionKNAI.key', 
        //       operador: '==', 
        //       value:    this.organizacionKNAI.key
        //   }];                    
        // }  
        // if(this.tipoPerfilUsuario=='Distribuidor' && this.distribuidorKN) {
        //     argumentos['grillaWhereArray']=[{ 
        //         key:      'distribuidorKN.key', 
        //         operador: '==', 
        //         value:    this.distribuidorKN.key
        //     }];                    
        // }  
      
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
    log(...values('funcionComponente','pageGenerica.nResultGetSubscripcionSecundarias'));
    
    super.onResultGetSubscripcionSecundarias();    
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
        
        if(this.organizacionKNAI) {
            // this.form.get('distribuidorKN').setValue( this.distribuidorKN );
            // this.form.get('organizacionKNAI').setValue( this.organizacionKNAI );
        }
        
        // this.form.get('fechaHoraCarga').setValue( new Date() );        
        // this.form.get('formaCarga').setValue('calculaHorarios');
        
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
    log(...values('funcionComponente','Dispositivo.onSubmit'));
    console.log("onSubmit",documento);


    super.onSubmit(documento);

  }  
  




  clickSolapa(solapa) {
      console.log("clickSolapa",solapa);

      
      if(solapa=='#tabRecorrido') {
        
      
          
        setTimeout (() => {
            

        }, 300);
            
      }
  }    
  
 
  

  checkSesiones(){

    this.dia=  new Date();
    let url:string='';
    url=environment.serviciosExternos.sql.apiURL+'api/sesiones';   
    let s=this.http.get(url).subscribe((sesiones:any)=>{
      s.unsubscribe();
      // console.log('sesiones',sesiones)
      this.concejalesSesion=sesiones;
      
    
      
      let presentes         : number=0;
      let ausentes          : number=0;
      let excusados         : number=0;
      let habilitados       : number=0;
      let deshabilitados    : number=0;
      let totalPidePalabra  : number=0;
      let totalConfirmacionPresencia  : number=0;

      // cambio de presidente verifico que los dos estén apagados
      let presidenteApagado: boolean=false;
      let nuevoPresidenteApagado: boolean=false;
      
      // CALCULO PRESENTES/AUSENTES/ECUSADOS
      for( var i = 0; i< sesiones.length; i++){
     
        let concejal:SesionesInterface=sesiones[i];

         // Procesos de cambio de presidente
        if(this.cambioPresidenteActivo){
          //Verifico que el presidente esté apagado
          if(this.concejalPresidente && this.concejalPresidente.NumConcejal==concejal.NumConcejal && !concejal.Habilitado && !concejal.Estado){
            presidenteApagado=true;
          }
          //Verifico que el cocejal Sleccionado esté apagado
          if(this.concejalSeleccionadoParaPresidente && this.concejalSeleccionadoParaPresidente.NumConcejal==concejal.NumConcejal && !concejal.Habilitado && !concejal.Estado){
            nuevoPresidenteApagado=true;
          }
          // Si no se impactaron los cambios en Sesiones y Presidente y concejal seleccionado están apagados
          // activo el cambio de presidente.
          if(presidenteApagado && nuevoPresidenteApagado && this.impactoCambiosEnSesiones==0){
            this.cambiarPresidente();
          }
          
          if(this.impactoCambiosEnConcejalesDispositivos==4){ //dos del delete  y dos del insert
            this.finalizarCambioPresidente();
          }
          if( this.impactoCambiosEnConcejalesDispositivos==0 && this.concejalDispositivoNuevoPresidente && this.concejalDispositivoPresidenteSaliente ){
            console.log('cambioPres1-',this.impactoCambiosEnConcejalesDispositivos,this.concejalDispositivoNuevoPresidente,)
            this.impactarModificacionesEnConcejalesDispositivos();
          }
        }

        // Selecciono el presidente 
        if(concejal.Funcion && !this.cambioPresidenteActivo){
          this.concejalPresidente=concejal;
        }

        // Proceso de votación Nominal
        if(this.estadoConsola==this.ESTADO.VOTANDO && this.infoVotoSelected==MOCK_INFOVOTO_ID.NOMINAL ){

          // Busco si hay algún concejal votando.
          let concejalVotando:SesionesInterface=this.concejalesSesion.find((concejal:SesionesInterface)=>concejal.InicioVoto==true);

          if(this.sePuedeSolicitarConfimracionDeConcejalVotacionNominal && (concejalVotando==undefined || concejalVotando==null) ){
      
            this.sePuedeSolicitarConfimracionDeConcejalVotacionNominal=false;
            this.confirmarInicioVotacionConcejal();
          }

        } 

         // Proceso de votación General
         if(this.estadoConsola==this.ESTADO.VOTANDO && this.infoVotoSelected==MOCK_INFOVOTO_ID.GENERAL ){

          // Busco si hay algún concejal votando.
          let concejalVotando:SesionesInterface=this.concejalesSesion.find((concejal:SesionesInterface)=>concejal.InicioVoto==true);

          if(concejalVotando==undefined || concejalVotando==null){
                  this.estadoConsola=this.ESTADO.CALCULANDO_RESULTADOS;
          }

        } 
 
        if(concejal.PidePalabra){
          if(concejal.PidePalabraIndice==0){
            this.asignarIndicePidePalabra(concejal);
          }
          totalPidePalabra++;
        }

        if(concejal.ConfirmacionPresencia){
          totalConfirmacionPresencia++;
        }

        if(concejal.Habilitado && !concejal.Funcion){
          habilitados++;
        } else{
          deshabilitados++;
        }

        //Si está logueado (Estado=1) y no es presidente (Funcion=0)
        if(concejal.Estado && !concejal.Funcion){
          presentes++;
        }  else  if(concejal.Excusado && !concejal.Funcion){
          excusados++;
        } else if(!concejal.Funcion){
         ausentes++;
        }
    
      }

      this.presentes                    = presentes;
      this.ausentes                     = ausentes;
      this.excusados                    = excusados;
      this.habilitados                  = habilitados;
      this.deshabilitados               = deshabilitados;
      this.totalPidePalabra             = totalPidePalabra;
      this.totalConfirmacionPresencia   = totalConfirmacionPresencia;


      if(this.presentes<this.nroQuorum){
        this.textoQuorum=MOCK_QUORUM.SIN_QUORUM;
        this.hayQuorum=false;
       
      }else {
        this.textoQuorum=MOCK_QUORUM.CON_QUORUM;
        this.hayQuorum=true;
       
      }
    
      // Proceso de recuento de votos. ya se terminó la votación general o nominal
      if(this.estadoConsola==this.ESTADO.CALCULANDO_RESULTADOS ){
        this.calcularResultado(this.concejalesSesion)  
      } 


    });  


    
  }


  getOrdenDia(){
    let urlOrdenesDia:string='';
    this.itemsSeleccionados=[];
    this.itemsDelExpedienteSeleccionado=[];
    this.indicesExpedientesSeleccionados=[];
    this.indicesCapitulosSeleccionados=[];
    this.itemSeleccionado=null;
    urlOrdenesDia=environment.serviciosExternos.sql.apiURL+'api/ordenDelDia/sesion/'+this.tipoSesionId+'/'+this.numeroSesion;   
    console.log('getOrdenDia',urlOrdenesDia);
    let sOrdenDia=this.http.get(urlOrdenesDia).subscribe((odenDiaSesion:OrdenDelDiaInterface[])=>{
      console.log('odenDiaSesion',odenDiaSesion);
      this.ordeDiaSesion=odenDiaSesion;
      sOrdenDia.unsubscribe();
      
      this.capitulosOrdeDiaSesion=this.ordeDiaSesion.filter(item=>item.indiceCapitulo==null);

      for (let index = 0; index < this.ordeDiaSesion.length; index++) {
        const element:OrdenDelDiaInterface = this.ordeDiaSesion[index];
        
        if(parseInt(element.SubOrden)==0){
          this.ordeDiaSesion[index].Orden=element.Orden + '.0';
        }else{
          this.ordeDiaSesion[index].Orden=(+element.Orden + parseInt(element.SubOrden)/10).toString();
        }
      }

      if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.INDIVIDUAL){
          // busco el primero con Estado==true
          this.itemSeleccionado=this.ordeDiaSesion.find((item:OrdenDelDiaInterface)=>{
            return (item.Estado==true && item.Terminado==false)
          });

          if(this.itemSeleccionado){ //sumo un expediente al listado
            this.indicesExpedientesSeleccionados.push( this.itemSeleccionado.indiceExpediente);
          }
      

      } else if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.AGRUPADA){
          // Entrego un array con Estado==true y Terminado==false
          this.itemsSeleccionados=this.ordeDiaSesion.filter((item:OrdenDelDiaInterface)=>{
            return (item.Estado==true && item.Terminado==false)
          });

          // incluyo los indices de Expedientes indicesExpedientesSeleccionados
          if(this.itemsSeleccionados.length>0){ //sumo un expediente al listado
            for (let index = 0; index < this.itemsSeleccionados.length; index++) {
              const element:OrdenDelDiaInterface = this.itemsSeleccionados[index];
              this.indicesExpedientesSeleccionados.push(element.indiceExpediente);
            }
           
          }
          console.log('itemsSeleccionados',this.itemsSeleccionados)
      }else if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.PARTICULAR){
        
          // busco el primero con Estado==true
          this.itemSeleccionado=this.ordeDiaSesion.find((item:OrdenDelDiaInterface)=>{
            return (item.Estado==true && item.Terminado==false && item.indiceCapitulo==null) //BUSCO CON INIDICE NULL (PADRE)
          });

          if(this.itemSeleccionado){ //sumo un expediente al listado
            this.indicesExpedientesSeleccionados.push( this.itemSeleccionado.indiceExpediente);

            // incluyo los indices de CAPITULO que tienen igual capitulo que el padre seleccionado
            
            this.itemsDelExpedienteSeleccionado=this.ordeDiaSesion.filter((item:OrdenDelDiaInterface)=>{
              return (item.Estado==true && item.Terminado==false && item.indiceCapitulo!=null &&  item.indiceExpediente==this.itemSeleccionado.indiceExpediente) //Busco los hijos con igual Nro Expediente
            });

            for (let index = 0; index <this.itemsDelExpedienteSeleccionado.length; index++) {
              const element:OrdenDelDiaInterface = this.itemsDelExpedienteSeleccionado[index];
              this.indicesCapitulosSeleccionados.push(element.indiceCapitulo);
            }
            console.log('this.itemsDelExpedienteSeleccionado',this.itemsDelExpedienteSeleccionado);
            console.log('this.indicesCapitulosSeleccionados',this.indicesCapitulosSeleccionados);
          }
       
      }
    });
  }


// ********************************************************************************************
// ********************************************************************************************
// ***********************    Timer Votación   ************************************************
// ********************************************************************************************
// ********************************************************************************************



  pasoTimer                   : number = 200; //Paso con el que se activa el timer 
  timerVotacion               : any    = null; //Timer. con esta variabel se para y elmina el timer
  duracionVotacion            : number = 0; // Duracion de la votacin
  tiempoTranscurrido          : number = 0; // Tiempo trascorrido desde que arranca el timer
  tiempoVotacion_porcentaje   : number = 0; // % de Avance de la votación (tiempo)
  tiempoDisplay               : number = null; //Numero que se muestra en pantalla
  public viewTimer: any[] = [300, 300]; // Posicionamiento del circulo del timer
  // colores iniciales timer votacion
  public colorSchemeVotacion = { domain: ['transparent', 'transparent', '#378D3B', '#0096A6', '#F47B00', '#606060']};
  // datos iniciales timer votacion
  public datosTimerVotacion: any[] = [ {name: 'tiempoTranscurrido', value: 0 },
                                     {name: 'tiempoRestante'    , value: 100 }
                                    ];


  startTimerVotacion(duracion:number){
                  
    console.log("startTimerVotacion "+duracion);
    this.estadoConsola=this.ESTADO.VOTANDO;

    if(duracion){

      //inicializo las variables del timer de votacion
      this.duracionVotacion             = duracion;
      this.tiempoTranscurrido           = 0;
      this.tiempoVotacion_porcentaje    = 0;
     
      if(!this.timerVotacion){
        this.timerVotacion=setInterval(() => {
          console.log(this.tiempoTranscurrido);
          this.displayTimerVotacion();
        }, this.pasoTimer);   
      } 
    }

  };


stopTimerVotacion(){
  console.log("stopTimerVotacion",this.timerVotacion);

  if (this.timerVotacion ) {
    console.log("stopTimerVotacion-timer existe");
    clearInterval(this.timerVotacion);
    this.timerVotacion=null;
  } else {
    console.log("stopTimerVotacion-timer NO existe");
  }

  
    //TODO: set en false inicioVoto en el panel.
          //   $http(self.recPanelSetTimeOut).then(function (response) {
          //   console.log("stopVotarTimer recPanelSetTimeOut "+response);
          //   $scope.estado=$scope.ESTADO.CALCULANDO_RESULTADOS;
          //   }).catch(function(error){
          //     $scope.error='stopVotarTimer: '+error;
          //   console.log("stopVotarTimer error ",error);
          //   console.log(error);
          // });
  
};

displayTimerVotacion(){
 console.log("displayTimerVotacion: ");
    if(this.estadoConsola!==this.ESTADO.VOTANDO){
        this.stopTimerVotacion();
    }
    else{

      this.tiempoTranscurrido= this.tiempoTranscurrido+this.pasoTimer;
      this.datosTimerVotacion=[
        {
          name: 'tiempoTranscurrido',
          value: this.tiempoTranscurrido
        },
        {
          name: 'tiempoRestante',
          value: this.duracionVotacion-this.tiempoTranscurrido 
        },
        
      ];
      
      this.tiempoDisplay= Math.round((this.duracionVotacion-this.tiempoTranscurrido )/1000);
      this.tiempoVotacion_porcentaje= this.tiempoTranscurrido/ this.duracionVotacion;
      
      let azul    = '#2F3E9E';
      let rojo    = '#D22E2E';
      let naranja = '#F47B00';
      let gris    = '#606060';
      let verde   = "#378D3B";
      let celeste = "#0096A6";

   
      if(this.tiempoVotacion_porcentaje>0.8){
        // Colores Alerta Final
        this.colorSchemeVotacion = {
        domain: [rojo, gris,'#2F3E9E', '#D22E2E',  '#F47B00', '#606060']};
      }else if(this.tiempoVotacion_porcentaje>=0.6 && this.tiempoVotacion_porcentaje<=.8){
        // Colores Alerta Intermedia
        this.colorSchemeVotacion = {
        domain: [naranja, gris,'#2F3E9E', '#D22E2E', '#378D3B', '#0096A6']};
      
      } else  if(this.tiempoVotacion_porcentaje<0.6){
        // Colores inicio
        this.colorSchemeVotacion = {
        domain: [verde, gris, '#378D3B', '#0096A6', '#F47B00', '#606060']};
      }
  
    console.log("displayTimerVotacion: "+  this.tiempoTranscurrido+" - "+this.tiempoVotacion_porcentaje);
    if(this.tiempoTranscurrido>this.duracionVotacion){
      console.log("this.tiempoTranscurrido>this.duracionVotacion: "+  this.tiempoTranscurrido+" - "+this.duracionVotacion+" - "+(this.tiempoTranscurrido>this.duracionVotacion));
      this.tiempoDisplay=0;
      this.stopTimerVotacion();
    }

    }
  };








  // ********************************************************************************************
  // ********************************************************************************************
  // *********************** Uso de la Palabra   ************************************************
  // ********************************************************************************************
  // ********************************************************************************************

  public inicioUsoDeLaPalabra   : number=null;  // Date de inicio del timer
  public updateUsoDeLaPalabra   : number=null;  // Date de actualizado del timer
  public tiempoUsoDeLaPalabra   : number=null;  // Tiempo transcurrido, Diferencia entre los dos anteriores
  public displaytiempoUsoDeLaPalabra   : string=null;  // Variable que se muestra en pantalla
  public timerUsoDeLaPalabra    : any=null;     // Timer de uso de la plabra
  public pasoTimerUsoDeLaPalabra: number=1000;  // Actualiza cada un segundo

  startTimerUsoDeLaPalabra(){
    this.estadoConsola=this.ESTADO.USO_DE_PALABRA;
    console.log("startTimerUsoDeLaPalabra "+this.estadoConsola);
    this.inicioUsoDeLaPalabra=new Date().getTime();
    console.log("startTimerUsoDeLaPalabra "+this.inicioUsoDeLaPalabra);

    if(!this.timerUsoDeLaPalabra){
      this.timerUsoDeLaPalabra=setInterval(() => {
      
        this.displayTimerUsodeLaPalabra();
      }, this.pasoTimerUsoDeLaPalabra);   
    } 
  };


  stopTimerUsoDeLaPalabra(){
    console.log("stopTimerUsoDeLaPalabra "+this.estadoConsola);
    this.estadoConsola=this.ESTADO.ESPERANDO_NOVEDADES;

    if (this.timerUsoDeLaPalabra ) {
      console.log("stopTimerUsoDeLaPalabra-timer existe");
      clearInterval(this.timerUsoDeLaPalabra);
      this.timerUsoDeLaPalabra=null;
    } else {
      console.log("stopTimerUsoDeLaPalabra-timer NO existe");
    }

  };

  displayTimerUsodeLaPalabra(){
  console.log("displayTimerUsodeLaPalabra: ");
  this.updateUsoDeLaPalabra=new Date().getTime();
  if(this.Sesiones_Reloj_Orden){ //ascendente
    this.tiempoUsoDeLaPalabra= this.updateUsoDeLaPalabra-this.inicioUsoDeLaPalabra;
  }else{
    this.tiempoUsoDeLaPalabra=this.Sesiones_Reloj_Tiempo-( this.updateUsoDeLaPalabra-this.inicioUsoDeLaPalabra);
  }

  console.log("updateUsoDeLaPalabra  dif "+this.tiempoUsoDeLaPalabra);

  if(this.Sesiones_Reloj_Tiempo-( this.updateUsoDeLaPalabra-this.inicioUsoDeLaPalabra)<=0){
    this.displaytiempoUsoDeLaPalabra="Tiempo concluido";
    }else {

      var msec = this.tiempoUsoDeLaPalabra;
      var hh = Math.trunc(msec / 1000 / 60 / 60);
      msec -= hh * 1000 * 60 * 60;
      var mm =Math.trunc(msec / 1000 / 60);
      msec -= mm * 1000 * 60;
      var ss = Math.trunc(msec / 1000);
      msec -= ss * 1000;
      this.displaytiempoUsoDeLaPalabra=  (hh<10?'0'+hh :hh)+ 
                                        ' : '+ (mm<10?'0'+mm :mm)+
                                        ' : '+ (ss<10?'0'+ss :ss);
    }

  };


  /* *********************************************************************************** */
  /* *********************************************************************************** */
  /* *****************************Resultados Votacion ********************************** */
  /* *********************************************************************************** */
  /* *********************************************************************************** */
  /* *********************************************************************************** */

  // let azul    = '#2F3E9E';
  // let rojo    = '#D22E2E';
  // let naranja = '#F47B00';
  // let gris    = '#606060';
  // let verde   = "#378D3B";
  // let celeste = "#0096A6";
  public viewResultado: any[] = [900, 400]; // Posicionamiento del Resultado
  public colorSchemeResultadosVotacion = { domain: ['#378D3B', '#D22E2E', '#606060', '#0096A6', '#F47B00', '#606060']};
  public datosResultadoVotacion=[
    { name: 'Positivos', value: 10  },
    { name: 'Negativos', value: 5   },
    { name: 'Abstenciones', value: 3   },
    
  ];
  public mostrarGrafico:boolean=false;   // Se pone en verdadero cuando está listo el resultado
  public resultadoVotacion: string =''; // tiene el resultado de la votación
  public resultadoVotacionId: number =MOCK_RESULTADO_VOTO_ID.INICIAL; // tiene el resultado de la votación
  public ordenConcejales: string ='';    // Se usa en el listado de concejales para ordenar por este campo
  public ordenConcejalesReverse: boolean =true;  // Determina el orden del filtro anterios
  public ordenODD: string ='';            // Se usa en el listado de orden del dia para ordenar por este campo
  public ordenODDReverse: boolean =true;  // Determina el orden del filtro orden del dia


 

  cargaInicial(){

    // "NumConcejal", "NumDispositivo" ,"Funcion" se informan en cero porque se reemplazan con los datos
    // de Concejales dispositivos
    
    let docInicio= {
      "NumConcejal":0,
      "NumDispositivo":0,
      "Funcion":0,
      "Macaddresses":0,
      "Habilitado":1,
      "IniciaTexto":0,
      "Titulo":'titulo Inicial',
      "Texto":'Texto Inicio',
      "InicioVoto":0,
      "ResultadoVoto":3,
      "TiempoVotacion":0,
      "TiempoInicio":0,
      "TiempoFin":0,
      "Limpiar":0,
      "Apagar":0,
      "Estado":0,
      "InfoVoto":0,
      "InfoAprovacion":0,
      "InfoVotacion":0,
      "InfoReloj":0,
      "InfoNominal":0,
      "Excusado":0,
      "PidePalabra":0,
      "PidePalabraIndice":0,
      "LoginForzado":0,
      "ConfirmacionPresencia":0
      }
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/cargaInicial'; 
      let susInici=this.http.post(urlSesiones,docInicio).subscribe(data=>{
        console.log(data);
        susInici.unsubscribe();
      });

      this.limpiar();
      
  }


 

  habilitarConcejal(concejal:SesionesInterface){
    
      let docApagar= {
          "Habilitado":1
        } ;
      let urlSesiones:string='';
      let funcion=concejal.Funcion?'1':'0'
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
      console.log('urlSesiones',urlSesiones);
      let susInici=this.http.put(urlSesiones,docApagar).subscribe(data=>{
        console.log(data);
        susInici.unsubscribe();
      });

  }

  apagarConcejal(concejal:SesionesInterface){
    
    let docApagar= {
        "Apagar":1
      } ;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,docApagar).subscribe(data=>{
      console.log(data);
      susInici.unsubscribe();
    });

}

  confirmaExcusarConcejal(concejal:SesionesInterface){
    this.confirmService.confirm({ 
      title:   this.translate.instant('Excusar Concejal'), 
      message: this.translate.instant('Confirma excusar a: '+concejal.Concejal +' .' ) })
    .then((resultadoOK) => {
      console.log('resultadoOK',resultadoOK);
      this.excusarConcejal(concejal);
    })
    .catch((cancel) => {
      console.log('cancel',cancel);
    })

  }
  excusarConcejal(concejal:SesionesInterface){
    
    let doc= {
        "Excusado":1,
        "Apagar":1
      } ;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{
      console.log(data);
      susInici.unsubscribe();
    });

  }

  confirmaIncorporarConcejal(concejal:SesionesInterface){
    this.confirmService.confirm({ 
      title:   this.translate.instant('Incorporar Concejal'), 
      message: this.translate.instant('Confirma incorporar a: '+concejal.Concejal +' .' ) })
    .then((resultadoOK) => {
      console.log('resultadoOK',resultadoOK);
      this.excusarConcejal(concejal);
    })
    .catch((cancel) => {
      console.log('cancel',cancel);
    })

  }


  incorporarConcejal(concejal:SesionesInterface){
    
    let doc= {
        "Excusado":0,
        "Habilitado":1
      } ;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{
      console.log(data);
      susInici.unsubscribe();
    });

  }

  confirmarDarLaPalabraConcejal(concejal:SesionesInterface){
    if(this.estadoConsola==this.ESTADO.USO_DE_PALABRA){
      this.alertService.confirm({ 
        title:   this.translate.instant('Uso de la Palabra'), 
        message: this.translate.instant('Hay un concejal hablando. Cancele antes de asignar uno nuevo.') })
      .then((resultadoOK) => {
        console.log('resultadoOK',resultadoOK);
 
      })
      .catch((cancel) => {
        console.log('cancel',cancel);
      })
    } else {

      this.confirmService.confirm({ 
        title:   this.translate.instant('Uso de la Palabra'), 
        message: this.translate.instant('Otorgar la palabar a: '+concejal.Concejal +' .' ) })
      .then((resultadoOK) => {
        console.log('resultadoOK',resultadoOK);
        this.darLaPalabraConcejal(concejal);
      })
      .catch((cancel) => {
        console.log('cancel',cancel);
      })

      
    }
  }

  darLaPalabraConcejal(concejal:SesionesInterface){
    let doc= {
        "PidePalabra":2
      } ;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{
      this.estadoConsola=this.ESTADO.USO_DE_PALABRA;
      console.log(data);
      susInici.unsubscribe();
    });
   

    let docSesion= {
         "InfoReloj":1
    };
    let urlPanel:string='';
    urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
    let susPanel=this.http.put(urlPanel,docSesion).subscribe(data=>{
      susInici.unsubscribe();
    });


  }

  confrimarFinUsoPalabraConcejal(concejal:SesionesInterface){
    if(concejal.PidePalabra==2){
      this.confirmService.confirm({ 
        title:   this.translate.instant('Uso de la Palabra'), 
        message: this.translate.instant('Finaliza la intervención de '+ concejal.Concejal+ ' ?') })
      .then((resultadoOK) => {
        console.log('resultadoOK',resultadoOK);
        this.finUsoPalabraConcejal(concejal);
      })
      .catch((cancel) => {
        console.log('cancel',cancel);
      })
    }

  }

  finUsoPalabraConcejal(concejal:SesionesInterface){
    this.estadoConsola==this.ESTADO.ESPERANDO_NOVEDADES;
    let doc= {
        "PidePalabra":0,
        "PidePalabraIndice":0
      } ;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{
      console.log(data);
      this.estadoConsola=this.ESTADO.ESPERANDO_NOVEDADES;
      susInici.unsubscribe();
    });

    
    let docSesion= {
      "InfoReloj":0
    };
    let urlPanel:string='';
    urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
    let susPanel=this.http.put(urlPanel,docSesion).subscribe(data=>{
      susInici.unsubscribe();
    });


  }

  confirmarPresenciaConcejal(concejal:SesionesInterface){
    
    let doc= {
        "ConfirmacionPresencia":1
      } ;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{
      console.log(data);
      susInici.unsubscribe();
    });

    if(concejal.NumConcejal==this.concejalPresidente.NumConcejal && concejal.NumDispositivo==this.concejalPresidente.NumDispositivo ){
      let funcion='1' //Selecciono el otro
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
      let docPresidente= {
        "Estado":0
      } ;
      console.log('urlSesiones',urlSesiones);
      let susInici2=this.http.put(urlSesiones,docPresidente).subscribe(data=>{
        console.log(data);
        susInici2.unsubscribe();
      });
    }

  }
  
  // *************************************************************************************************
  // *************************************************************************************************
  // ********************* Selección de ítems y capítulos   ******************************************
  // *************************************************************************************************
  // *************************************************************************************************

  // Nota: Se graban en la tabla del orden del día la selección (Estado=1) 
  //       Se termina con una relectura del orden del día
  //       Al leer la orden del día recuperar la seleccíon que habíamos realizado.

  seleccionItem(item:OrdenDelDiaInterface){


    // Aviso si ya fue procesado
    if(item.Terminado){
      this.alertService.confirm({ 
        title:   this.translate.instant('Orden del Día'), 
        message: this.translate.instant('El ítem '+item.Orden+' - '+item.SubOrden+' ya fue Procesado.') })
      .then((resultadoOK) => {
        return;
 
      })
    }

    // item No e procesado
    
    if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.INDIVIDUAL){

      
      if(this.itemSeleccionado && this.itemSeleccionado.NumOrdenDia==item.NumOrdenDia){
        this.itemOrdenDelDiaEnTratamiento(item,0);
        // this.itemSeleccionado=null;
      } else if (this.itemSeleccionado){
        // cancelo la seleccion anterio y selecciono uno nuevo
        this.itemOrdenDelDiaEnTratamiento(this.itemSeleccionado,0);
        this.itemOrdenDelDiaEnTratamiento(item,1);
        // this.itemSeleccionado=item;
      } else{
        this.itemOrdenDelDiaEnTratamiento(item,1);
        this.itemSeleccionado=item;
      }
      
      this.grabarTextosSesiones(item.Rotulo,item.Item);
      this.grabarTextosPanelSesion(item.Rotulo,item.Item);

    } else if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.AGRUPADA){

      let titulo        : string='';
      let texto         : string='';
      let indexOfItem   : number=null;
      indexOfItem       =   this.itemsSeleccionados.findIndex((element:OrdenDelDiaInterface)=>element.NumOrdenDia==item.NumOrdenDia);

      console.log('idexOfItem',indexOfItem);

      if(indexOfItem==-1){
        this.itemOrdenDelDiaEnTratamientoAgrupado(item,1);
        // this.itemsSeleccionados.push(item);
      } else {
        // this.itemsSeleccionados.slice(indexOfItem,0);
        this.itemOrdenDelDiaEnTratamientoAgrupado(item,0);
      }
      
      // this.grabarTextosSesiones(item);
      // this.grabarTextosPanelSesion(item);

    } else if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.PARTICULAR){

      console.log('PARTICULAR this.itemSeleccionado',this.itemSeleccionado);
      console.log('PARTICULAR item',item);

      if(this.itemSeleccionado && this.itemSeleccionado.NumOrdenDia==item.NumOrdenDia){
        this.itemOrdenDelDiaEnTratamientoParticular(item,0);
        // this.itemSeleccionado=null;
      } else if (this.itemSeleccionado){
        // cancelo la seleccion anterio y selecciono uno nuevo
        this.itemOrdenDelDiaEnTratamientoParticular(this.itemSeleccionado,0);
        this.itemOrdenDelDiaEnTratamientoParticular(item,1);
        // this.itemSeleccionado=item;
      } else{
        this.itemOrdenDelDiaEnTratamientoParticular(item,1);
        this.itemSeleccionado=item;
      }
      
      // this.grabarTextosSesiones(item.Rotulo,item.Item);
      // this.grabarTextosPanelSesion(item.Rotulo,item.Item);
  


    };
    
  }
  
  seleccionCapitulo(item:OrdenDelDiaInterface){


    // Aviso si ya fue procesado
    if(item.Terminado){
      this.alertService.confirm({ 
        title:   this.translate.instant('Orden del Día'), 
        message: this.translate.instant('El ítem '+item.Orden+' - '+item.SubOrden+' ya fue Procesado.') })
      .then((resultadoOK) => {
        return;
 
      })
    }

    // item No e procesado
    
    if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.INDIVIDUAL || this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.AGRUPADA ){

      this.alertService.confirm({ 
        title:   this.translate.instant('Orden del Día - Artículos'), 
        message: this.translate.instant('Para seleccionar un articulo en forma Particular, modifique el la Agrupacion') })
      .then((resultadoOK) => {
        return;
 
      })

    } else if(this.infoAgrupacionSelected==MOCK_INFOAGRUPACION_ID.PARTICULAR){

      let titulo        : string='';
      let texto         : string='';
      let indexOfItem   : number=null;
      indexOfItem       =   this.itemsDelExpedienteSeleccionado.findIndex((element:OrdenDelDiaInterface)=>element.NumOrdenDia==item.NumOrdenDia);

      console.log('idexOfItem',this.itemsDelExpedienteSeleccionado);
      console.log('idexOfItem',indexOfItem);

      if(indexOfItem==-1){
        this.itemOrdenDelDiaEnTratamientoAgrupado(item,1);
        // this.itemsSeleccionados.push(item);
      } else {
        // this.itemsSeleccionados.splice(indexOfItem,0);
        this.itemOrdenDelDiaEnTratamientoAgrupado(item,0);
      }
      
      // this.grabarTextosSesiones(item);
      // this.grabarTextosPanelSesion(item);

    } 
    
  }



  itemOrdenDelDiaEnTratamiento(item:OrdenDelDiaInterface,estado:number){

    console.log('itemOrdenDelDiaEnTratamiento',item,estado);
    console.log('itemOrdenDelDiaEnTratamiento indicesExpedientesSeleccionados',this.indicesExpedientesSeleccionados);

    this.errorMensaje=null;

    console.log(item);
    let doc= {
        "Estado"         : estado
    };
    let urlSesiones:string='';
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/ordenDelDia/'+item.NumOrdenDia; 
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{ 
      console.log(data);
      susInici.unsubscribe();
    
      this.getOrdenDia();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='itemOrdenDelDiaEnTratamiento:  '+error.message;
    });

  }  
 
  itemOrdenDelDiaEnTratamientoAgrupado(item:OrdenDelDiaInterface,estado:number){

    console.log('itemOrdenDelDiaEnTratamientoAgrupado',item,estado);

    this.errorMensaje=null;

    
    console.log(item);
    let doc= {
        "Estado"         : estado,
        "Agrupa"         : estado,
        "NumAgrupacion"  : estado? this.numAgrupacion : -1
    };
    let urlSesiones:string='';
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/ordenDelDia/'+item.NumOrdenDia; 
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{ 
      console.log(data);
      susInici.unsubscribe();
    
      this.getOrdenDia();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='itemOrdenDelDiaEnTratamientoAgrupado:  '+error.message;
    });

  }    
    
  itemOrdenDelDiaEnTratamientoParticular(item:OrdenDelDiaInterface,estado:number){

    console.log('itemOrdenDelDiaEnTratamientoParticular',item,estado);

    this.errorMensaje=null;

    let itemsDelCapitulo=this.ordeDiaSesion.filter((element:OrdenDelDiaInterface)=>{
      return (element.Estado==!estado && element.Terminado==false && element.indiceExpediente==item.indiceExpediente )
    });

    let doc= {
        "Estado"         : estado,
        "Agrupa"         : estado,
        "NumAgrupacion"  : estado? this.numAgrupacion : -1
    };
    let controlDeEscrituras=itemsDelCapitulo.length;
    let susInici:any[]=[];
    for (let index = 0; index < itemsDelCapitulo.length; index++) {
      const element = itemsDelCapitulo[index];
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/ordenDelDia/'+element.NumOrdenDia; 
      susInici[index]=this.http.put(urlSesiones,doc).subscribe(data=>{ 
        console.log(data);
        susInici[index].unsubscribe();
        controlDeEscrituras--;
        console.log('resupuesta controlDeEscrituras',controlDeEscrituras);
        if(controlDeEscrituras==0){
          this.getOrdenDia();    
        }

      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='itemOrdenDelDiaEnTratamientoParticular:  '+error.message;
      });
      
    }
    

  }    

  grabarTextosSesiones(titulo:string,texto:string){


    let doc= {
      "IniciaTexto"   : 1,
      "Titulo"        : titulo,
      "Texto"         : texto
    };
    let urlSesiones:string='';
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{ 
      console.log(data);
      susInici.unsubscribe();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='grabarTextosSesiones:  '+error.message;
    });

  }

  grabarTextosPanelSesion(titulo:string,texto:string){
    let doc= {
      IniciaTexto   : 1,
      Titulo        : titulo,
      Texto         : texto
    }
    let url:string='';
    url=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
    let susInici=this.http.put(url,doc).subscribe(data=>{ 
      console.log(data);
      susInici.unsubscribe();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='grabarTextosPanelSesion:  '+error.message;
    });
  }

  
  apagar(){
  
      let docApagar= {
              
        "Apagar":1
        } ;
        let urlSesiones:string='';
        urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
        let susInici=this.http.put(urlSesiones,docApagar).subscribe(data=>{
          console.log(data);
          susInici.unsubscribe();
        },error=>{
          console.log('error',error);
          console.log('error',error.message);
          this.errorMensaje='apagar sesions:  '+error.message;
        });

        let urlPanel:string='';
        urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
        let susPanel=this.http.put(urlPanel,docApagar).subscribe(data=>{
          console.log(data);
          susInici.unsubscribe();
        },error=>{
          console.log('error',error);
          console.log('error',error.message);
          this.errorMensaje='apagar panel:  '+error.message;
        });
       
  }



  limpiar(){

    // Verificar que no esté con los estulados de una votacion
    this.estadoConsola==this.ESTADO.ESPERANDO_NOVEDADES;
    let docLimpiar= {
          
      "Limpiar"           : 1,
      "Titulo"            : this.tituloEspera,
      "Texto"             : this.textoEspera,
      "InicioVoto"        : 0,
      "ResultadoVoto"     : 3,
      "TiempoVotacion"    : 0,
      "TiempoInicio"      : 0,
      "TiempoFin"         : 0,
      "InfoNominal"       : 0
    
    }
    let urlSesiones:string='';
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
    let susInici=this.http.put(urlSesiones,docLimpiar).subscribe(data=>{          console.log(data);
      susInici.unsubscribe();
    },error=>{
      console.log('error',error);
    });
    let docLimpiarPanel= {
         
      "Limpiar"       : 1,
      
      // "Titulo":this.tituloEspera,
      // "Texto":this.textoEspera,

      "VotacionEstado"   : 0,
      "votosPositivos"  : 0,
      "votosNegativos"  : 0,
      "votosAbstencion" : 0
      
      }
    let urlPanel:string='';
    urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
    let susPanel=this.http.put(urlPanel,docLimpiarPanel).subscribe(data=>{
      console.log(data);
      susInici.unsubscribe();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='limpiar:  '+error.message;
    });
       
    // Finalizo cambio de presidente para limpiar las variables ese proceso.
    this.finalizarCambioPresidente();
}

  limpiarTablet(){
    let docLimpiar= {
          
      "Limpiar"           : 1,
      
    }
    let urlSesiones:string='';
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
    let susInici=this.http.put(urlSesiones,docLimpiar).subscribe(data=>{          console.log(data);
      susInici.unsubscribe();
    },error=>{
      console.log('error',error);
    });
  }

  asignarIndicePidePalabra(concejal:SesionesInterface){

    let concejalIndiceMax:SesionesInterface=this.concejalesSesion.reduce( (p:SesionesInterface, v:SesionesInterface)=> {
      return ( p.PidePalabraIndice > v.PidePalabraIndice ? p : v )
    });

    console.log('indicePalabraMaximo',concejalIndiceMax.PidePalabraIndice);

    let doc= {
              
      "PidePalabraIndice":concejalIndiceMax.PidePalabraIndice+1
      } ;

    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
    console.log('urlSesiones',urlSesiones);
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{
      console.log(data);
      susInici.unsubscribe();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='asignarIndicePidePalabra:  '+error.message;
    });


  }

  // Selecciona el campo y el orden con el que se ordena la tabla de concejales.
  setConcejalesOrden(campo:string){
    this.ordenConcejales=campo;
    this.ordenConcejalesReverse=!this.ordenConcejalesReverse;
  }
  // Selecciona el campo y el orden con el que se ordena la tabla de ordenDelDia.
  setOrdenDelDiaOrden(campo:string){
    this.ordenODD=campo;
    this.ordenODDReverse=!this.ordenODDReverse;
  }

  onInfoAprobacionChange(infoAprobacion:MOCK_INFOAPROBACION_Interfase){
    console.log('infoAprobacion',infoAprobacion);
    console.log('infoAprobacionSelected',this.infoAprobacionSelected);
    let doc= {
             
      "InfoAprovacion":this.infoAprobacionSelected
      
      }
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
      let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{ 
        console.log(data);
        susInici.unsubscribe();
      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='onInfoAprobacionChange sesiones:  '+error.message;
      });

      let urlPanel:string='';
      urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
      let susPanel=this.http.put(urlPanel,doc).subscribe(data=>{
        console.log(data);
        susInici.unsubscribe();
      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='onInfoAprobacionChange: panel  '+error.message;
      });
    
    

  }

  onInfoAgrupacionChange(infoAgrupacion:MOCK_INFOAGRUPACION_Interfase,event){
    console.log('infoAgrupacion event',event);
    console.log('infoAgrupacion',infoAgrupacion);
    console.log('infoAprobacionSelected',this.infoAgrupacionSelected);
    
 
    if(this.itemsSeleccionados.length>0 || this.itemSeleccionado || this.itemsDelExpedienteSeleccionado.length>0){
      // pongo este delay para que no se de el un error de ExpressionChangedAfterItHasBeenCheckedError
      // setTimeout(() => //lo comenté porque no funciona.
      // {
        this.confirmService.confirm({ 
          title:  'Cambio de Agrupación', 
          message: 'Cancelará la selección realizada.' })
        .then((resultadoOK) => {
          console.log('resultadoOK',resultadoOK);
          this.infoAprobacionSelectedAnterior=infoAgrupacion.infoVotacion;
          this.informarAgrupacion()
          this.cancelarSeleccion();
        })
        .catch((cancel) => {
          console.log('cancel',cancel);
          // Reasigno el valor anterior para no perder la seleccion
          this.infoAgrupacionSelected=  this.infoAprobacionSelectedAnterior;
        })
      // },5000);  
    } else{
      this.informarAgrupacion();
    }
     
    
  }

  informarAgrupacion(){
    let doc= {
             
      "InfoVotacion":this.infoAgrupacionSelected
      
      }
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
      let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{          console.log(data);
        susInici.unsubscribe();
      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='informarAgrupacion sesion:  '+error.message;
      });

      let urlPanel:string='';
      urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
      let susPanel=this.http.put(urlPanel,doc).subscribe(data=>{
        console.log(data);
        susPanel.unsubscribe();
      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='informarAgrupacion panel:  '+error.message;
      });

      let urlParametos:string='';
      let docParametros={
          "Sesiones_Inicio_TipoVotacion":this.infoAgrupacionSelected
      };
      urlParametos=environment.serviciosExternos.sql.apiURL+'api/parametros/1'; 
      let susParametros=this.http.put(urlParametos,docParametros).subscribe(data=>{
        console.log(data);
        susParametros.unsubscribe();
      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='informarAgrupacion parametros:  '+error.message;
      });
    

  }

  cancelarSeleccion(){
    if(this.itemsSeleccionados.length>0 ){
      let arr= this.itemsSeleccionados;
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        this.itemOrdenDelDiaEnTratamientoAgrupado(element,0);        
      }
    }
    if(this.itemsDelExpedienteSeleccionado.length>0 ){
      let arr1= this.itemsDelExpedienteSeleccionado;
      for (let index = 0; index < arr1.length; index++) {
        const element = arr1[index];
        this.itemOrdenDelDiaEnTratamientoAgrupado(element,0);        
      }
    }
    if(this.itemSeleccionado){
      this.itemOrdenDelDiaEnTratamiento(this.itemSeleccionado,0);
    }
  }

  onInfoVotoChange(infoVoto:MOCK_INFOVOTO_Interfase){
    console.log('infoVoto',infoVoto);
    console.log('infoVotoSelected',this.infoVotoSelected);
    let doc= {
             
      "InfoVoto":this.infoVotoSelected
      
      }
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
      let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{          console.log(data);
        susInici.unsubscribe();
      });

      let urlPanel:string='';
      urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
      let susPanel=this.http.put(urlPanel,doc).subscribe(data=>{
        console.log(data);
        susInici.unsubscribe();
      });
    

  }

  onChageFiltoEstadoItemOrdenDelDia(data){
    console.log('onChageFiltoEstadoItemOrdenDelDia',data);
    // tanto para los pendientes como para los seleccionados, 
    // Solo muestro los que no se han tratado 
    this.TerminadoItemOrdenDelDia=false;//
  }
  
  onChageFiltoTerminadotemOrdenDelDia(data){
    console.log('onChageFiltoTerminadotemOrdenDelDlia',data);
    if(data==true){
      this.EstadoItemOrdenDelDia=true;
      
    }else{ // en este caso llega un nulo o false, no se selecció ningún filtro 
      // No hago nada puedo tener cualquie filro
    } 
  }

  incrementarAgrupador(){
    let urlParametos:string='';
      let docParametros={
          "Sesiones_AgrupacionOrdenDia":this.numAgrupacion+1
      };
      urlParametos=environment.serviciosExternos.sql.apiURL+'api/parametros/1'; 
      let susParametros=this.http.put(urlParametos,docParametros).subscribe(data=>{
        console.log(data);
        susParametros.unsubscribe();
      },error=>{
        console.log('error',error);
        console.log('error',error.message);
        this.errorMensaje='incrementarAgrupador parametros:  '+error.message;
      });
  }


  // ********************************************************************************************
  // ********************************************************************************************
  // *************    Guardar resultados de la Votación    **************************************
  // ********************************************************************************************
  // ********************************************************************************************


  // Nota: se grabanarán todos los ítems Seleccionados del orden del día
  //       Estado=true Seleccionado y Terminado=false

  
  grabarResultados(){

    let itemsSeleccionados=this.ordeDiaSesion.filter(ordenDia=>ordenDia.Estado==true && ordenDia.Terminado==false);
    
    for (let index = 0; index < itemsSeleccionados.length; index++) {
      const ordenDelDiaSeleccionada:OrdenDelDiaInterface = itemsSeleccionados[index];
      this.grabaItemOrdenDelDiaResultado(this.itemSeleccionado);
      this.grabaItemOrdenDelDiaResultadoPorConcejal(this.itemSeleccionado);
    }
  }


  grabaItemOrdenDelDiaResultado(item:OrdenDelDiaInterface){

    console.log('grabaItemOrdenDelDiaResultado',item);

    this.errorMensaje=null;

    console.log(item);
    let doc= {
      "ResultadoVoto"   : this.resultadoVotacionId,
      "InfoVoto"        : this.infoVotoSelected,
      "InfoAprovacion"  : this.infoAprobacionSelected,
      "InfoVotacion"    : this.infoAgrupacionSelected,
      "Terminado"       : true
      
    };
    let urlSesiones:string='';
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/ordenDelDia/'+item.NumOrdenDia; 
    let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{ 
      console.log(data);
      susInici.unsubscribe();
    
      this.getOrdenDia();
    },error=>{
      console.log('error',error);
      console.log('error',error.message);
      this.errorMensaje='grabaItemOrdenDelDiaResultado:  '+error.message;
    });

  }  
  

  grabaItemOrdenDelDiaResultadoPorConcejal(item:OrdenDelDiaInterface){

    console.log('grabaItemOrdenDelDiaResultado',item);

    this.errorMensaje=null;
    // NumOrdenDia
    // NumConcejal
    // NumDispositivo
    // Funcion
    // Voto
    // VotoTime
    // NumAgrupacion
    // Excusado
    // Informacion
    
    if(this.concejalesSesion.length>0 ){
      let arr= this.concejalesSesion;
      for (let index = 0; index < arr.length; index++) {
        const concejal:SesionesInterface = arr[index];
        let doc= {
          "NumOrdenDia"     : item.NumOrdenDia,
          "NumConcejal"     : concejal.NumConcejal,
          "NumDispositivo"  : concejal.NumDispositivo,
          "Funcion"         : concejal.Funcion,
          "Voto"            : concejal.ResultadoVoto,
          "VotoTime"        : concejal.TiempoVotacion,
          "NumAgrupacion"   : item.NumAgrupacion,
          "Excusado"        : concejal.Excusado,
          "Informacion"     : this.resultadoVotacion  
          
        };
        let urlSesiones:string='';
        urlSesiones=environment.serviciosExternos.sql.apiURL+'api/ordenDelDiaResultados/'; 
        let susInici=this.http.post(urlSesiones,doc).subscribe(data=>{ 
          console.log(data);
          susInici.unsubscribe();
        
          this.getOrdenDia();
        },error=>{
          console.log('error',error);
          console.log('error',error.message);
          this.errorMensaje='grabaItemOrdenDelDiaResultado:  '+error.message;
        });     
      }
    }
    
  

  }  

  // ********************************************************************************************
  // ********************************************************************************************
  // *************    Inicia Votacion (General / Nominal)  **************************************
  // ********************************************************************************************
  // ********************************************************************************************


  confirmoInicioVoto(){

    if(!this.hayQuorum){
      this.alertService.confirm({ 
        title:   this.translate.instant('Votación'), 
        message: this.translate.instant('No hay Quorum para votar!') })
      .then((resultadoOK) => {
        return;
 
      }).catch(error=>{
        console.log('error',error);
      })

    } else if(!(this.itemsSeleccionados.length>0 || this.itemSeleccionado || this.itemsDelExpedienteSeleccionado.length>0)){
      this.alertService.confirm({ 
        title:   this.translate.instant('Votación'), 
        message: this.translate.instant('Debe Seleccionar algún ítem del orden del día.') })
      .then((resultadoOK) => {
        return;
 
      }).catch(error=>{
        console.log('error',error);
      })
    } else {

      let tipoVotacion    = getInfoVoto(this.infoVotoSelected);
      let InfoAprobacion  = getInfoAprobacion(this.infoAprobacionSelected);
      this.confirmService.confirm({ 
          title:   this.translate.instant(tipoVotacion), 
          message: 'Inicio de la votación por '  +InfoAprobacion 
        }).then((resultadoOK) => {
          console.log('resultadoOK',resultadoOK);
          this.inicioVoto();
        });
    }    
  } 
  


  inicioVoto(){

    if(this.infoVotoSelected==MOCK_INFOVOTO_ID.GENERAL){

      console.log('InicioVotacionGeneral');

      // Busco los concejales que participan de la votación Nominal
      let concejalesQueVotan:SesionesInterface[]=this.concejalesSesion.filter((concejal:SesionesInterface)=>
        concejal.Funcion==false  && concejal.Estado==true && concejal.Excusado==false 
      );

      for (let index = 0; index < concejalesQueVotan.length; index++) {
        const concejalQueVota = concejalesQueVotan[index];
        this.activarVotacionDeConcejal(concejalQueVota);
      }
      
     
      // Informo al panel el inicio de la votacion
      let urlPanel:string='';
      let docPanel= {   
        "InicioVoto"        : 1,
        "TiempoVotacion"    : this.tiempoVotacion*1000,
        "VotacionEstado"    : 0,
        "VotosPositivos"    : 0,
        "VotosNegativos"      : 0,
        "votosAbstencion"     : 0,
        "resultadoVotacion"   : ''
      };
      urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
      let susPanel=this.http.put(urlPanel,docPanel).subscribe(data=>{
        console.log(data);
        susPanel.unsubscribe();
      });

      this.startTimerVotacion(this.tiempoVotacion*1000);

    } else if(this.infoVotoSelected==MOCK_INFOVOTO_ID.NOMINAL){

      console.log('InicioVotacionNomial')
      let docSesion= {   

        "InfoNominal":1 ,
        "TiempoInicio"      : 0,
        "TiempoFin"         : 0,
        
      }
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
      let susInici=this.http.put(urlSesiones,docSesion).subscribe(data=>{
        console.log(data);
        susInici.unsubscribe();
        this.estadoConsola=this.ESTADO.VOTANDO;
        this.sePuedeSolicitarConfimracionDeConcejalVotacionNominal=true;

      });
  
    }
    this.marcarOrdenDiaEnVotacion();
}

activarVotacionDeConcejal(concejal:SesionesInterface){
   // pongo a votar a los concejales
   let docSesion= {   
    "InicioVoto":1,
    "ResultadoVoto":3,
    "TiempoVotacion":this.tiempoVotacion,
    "TiempoInicio"      : 0,
    "TiempoFin"         : 0,
    "InfoNominal"       : 0
  }
  let urlSesiones:string='';
  let funcion=concejal.Funcion?'1':'0'
  urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
  let susInici=this.http.put(urlSesiones,docSesion).subscribe(data=>{
    console.log(data);
    susInici.unsubscribe();
  });

}

confirmarInicioVotacionConcejal(){

  // Busco los concejales que participan de la votación Nominal
  let concejal:SesionesInterface=this.concejalesSesion.find((concejal:SesionesInterface)=>
    concejal.InfoNominal==true && concejal.Funcion==false  && concejal.Estado==true && concejal.Excusado==false 
  );

  // ya procesé todos los votos (no queda ninguín concejal con InfoNominal==1)
  if(concejal==undefined || concejal==null){ 
    this.estadoConsola=this.ESTADO.CALCULANDO_RESULTADOS;
    return;

  }
  this.confirmService.confirm({ 
    title:   this.translate.instant('Votación Nominal'), 
    message: this.translate.instant('Votación : '+concejal.Concejal +' .' ) })
  .then((resultadoOK) => {
    console.log('resultadoOK',resultadoOK); let docSesion= {   
      "InicioVoto":1,
      "ResultadoVoto":3,
      "TiempoVotacion":this.tiempoVotacion,
      "InfoNominal":0
    }
        let urlSesiones:string='';
        let funcion=concejal.Funcion?'1':'0'
        urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
        let susInici=this.http.put(urlSesiones,docSesion).subscribe(data=>{
          console.log(data);
          susInici.unsubscribe();
          // cambio el estado luego del que primer concejal está votando.
        
          this.sePuedeSolicitarConfimracionDeConcejalVotacionNominal=true;
        });

        // Informo al panel el inicio de la votacion
        let urlPanel:string='';
        let docPanel= {   
          "InicioVoto":1,
          "TiempoVotacion":this.tiempoVotacion*1000,
          // "VotacionEstado":this.ESTADO.VOTANDO
        };
        urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
        let susPanel=this.http.put(urlPanel,docPanel).subscribe(data=>{
          console.log(data);
          susPanel.unsubscribe();
        });
  
  }).catch(resultadoNoOK=> {
  
      console.log('resultadoNoOK',resultadoNoOK);
      
    })

}

marcarOrdenDiaEnVotacion(){
  let itemsSeleccionados=this.ordeDiaSesion.filter(ordenDia=>ordenDia.Estado==true && ordenDia.Terminado==false);
    
    for (let index = 0; index < itemsSeleccionados.length; index++) {
      const ordenDelDiaSeleccionada:OrdenDelDiaInterface = itemsSeleccionados[index];
      this.grabaItemOrdenDelDiaVotando(ordenDelDiaSeleccionada,'Activo');
      
    }
 
}

cancelarOrdenDiaEnVotacion(){
  let itemsSeleccionados=this.ordeDiaSesion.filter(ordenDia=>ordenDia.Estado==true && ordenDia.Terminado==false);
    
    for (let index = 0; index < itemsSeleccionados.length; index++) {
      const ordenDelDiaSeleccionada:OrdenDelDiaInterface = itemsSeleccionados[index];
      this.grabaItemOrdenDelDiaVotando(ordenDelDiaSeleccionada,'Cancelar');
      
    }
 
}

grabaItemOrdenDelDiaVotando(item:OrdenDelDiaInterface,activoCancelo:string){

  let activo:boolean=true;
  if(activoCancelo=='Activo'){
    activo=true;
  }else{
    activo=false;
  }
  console.log('grabaItemOrdenDelDiaVotando',item);

  this.errorMensaje=null;

  console.log(item);
  let doc= {
    "ResultadoVoto"   : activo?MOCK_RESULTADO_VOTO_ID.INICIAL:MOCK_RESULTADO_VOTO_ID.SIN_PROCESAR,
  };
  let urlSesiones:string='';
  urlSesiones=environment.serviciosExternos.sql.apiURL+'api/ordenDelDia/'+item.NumOrdenDia; 
  let susInici=this.http.put(urlSesiones,doc).subscribe(data=>{ 
    console.log(data);
    susInici.unsubscribe();
  
    this.getOrdenDia();
  },error=>{
    console.log('error',error);
    console.log('error',error.message);
    this.errorMensaje='grabaItemOrdenDelDiaVotando:  '+error.message;
  });

}  


  // ********************************************************************************************
  // ********************************************************************************************
  // *************    Calcular Resultados  de la Votación  **************************************
  // ********************************************************************************************
  // ********************************************************************************************

  private votosPositivos          : number=0;
  private votosNegativos          : number=0;
  private votosEmitidos           : number=0;
  private votosAbstencionIndividual : number=0;
  private votosPositivosIndividual  : number=0;
  private votosNegativosIndividual  : number=0;
  private cuentaVotos             : number=0;

  private votosNominalesEmitidos  : number=0;

 

  private resolverEmpate          : boolean=false;


  calcularResultado(data){


    console.log("calcularResultado ");
    console.log( data);
    this.votosPositivos=0;
    this.votosNegativos=0;
    this.votosAbstencionIndividual=0;
    this.votosPositivosIndividual=0;
    this.votosNegativosIndividual=0;
    this.votosEmitidos=0;
    this.cuentaVotos=0;

 
    this.votosNominalesEmitidos=0;

  

    console.log("calcularResultado data.length: "+this.concejalesSesion.length);
    for( var i = 0; i< this.concejalesSesion.length; i++){
      let concejal:SesionesInterface=this.concejalesSesion[i];
      console.log("calcularResultado i: "+i);


      if(!concejal.InfoNominal ) {
        this.votosNominalesEmitidos++;
      }

      // cuando termino del votar InicioVoto se pone en false
      if((!concejal.InicioVoto && concejal.Habilitado && concejal.Estado) || this.resolverEmpate  ){ 
        
        var voto= concejal.ResultadoVoto;

      

        if(voto===2){
          this.votosAbstencionIndividual++;
        } else if(voto===0){
          this.votosNegativosIndividual++;
        } else if(voto===1){
          this.votosPositivosIndividual++;
        }
        // Cuento el total de votos.
        if(voto===0||(voto===2 && this.parametroTratamientoAbstencion===0) ){
          this.votosNegativos++;
          this.cuentaVotos=this.cuentaVotos+1;
        }
        if(voto===1 || (voto===2 && this.parametroTratamientoAbstencion===1)){
          this.votosPositivos++;
          this.cuentaVotos=this.cuentaVotos+1;
        }
      }  else {// no estan todos los resultados.
          this.votosEmitidos=this.cuentaVotos;
      }
    }

    console.log("calcularResultado paso for");
    this.votosEmitidos=this.cuentaVotos;
    console.log("calcularResultado cuentaVotos "+this.cuentaVotos);
    console.log("calcularResultado  emitidos "+this.votosEmitidos);
    console.log("calcularResultado  votosNominalesEmitido "+this.votosNominalesEmitidos);
    console.log("calcularResultado  length"+data.length);
    console.log("calcularResultado  habilitados"+this.habilitados );

    this.resultadoVotacion="JJ";

    // incluir que es nominal para mostrar el resultado
    
    //verifico que todos los votos esten emitidos
    if(this.votosEmitidos===this.presentes  || this.resolverEmpate ){

      // suspender el timer de votación e informar al panel

      //  $http(self.recPanelSetTimeOut).then(function (response) {
      //       console.log("calcularResultado recPanelSetTimeOutt "+response);
      //       // this.estado=this.ESTADO_CALCULANDO_RESULTADOS;
      //       }).catch(function(error){
      //         this.error='calcularResultado recPanelSetTimeOut: '+error;
      //       // console.log("stopVotarTimer error ",error);
      //       console.log(error);
      //     });

        switch ( this.infoAprobacionSelected){

        case MOCK_INFOAPROBACION_ID.UNANIMIDAD: 

                if(this.votosPositivos===this.votosEmitidos){
                    this.resultadoVotacion="Aprobado por Unanimidad";
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.POSITIVO;
                } else   if(this.votosNegativos===this.votosEmitidos) {
                    this.resultadoVotacion="Rechazado por Unanimidad";
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.NEGATIVO;
                } else {
                  this.resultadoVotacion="Rechazado por Unanimidad";
                  this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.NEGATIVO;
                }
                this.estadoConsola=this.ESTADO.RESULTADOS;
                // this.data = [this.votosPositivos, this.votosNegativos];
                // this.mostrarGrafico=true;
                // this.setResultados() ;
            break;

        case  MOCK_INFOAPROBACION_ID.MAYORIA_SIMPLE:  // por mayoria simple

            if(this.votosPositivos===this.votosEmitidos){
                    this.resultadoVotacion="Aprobado por Unanimidad";
                    this.estadoConsola=this.ESTADO.RESULTADOS;
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.POSITIVO;
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;
            } else if(this.votosNegativos===this.votosEmitidos) {
                    this.resultadoVotacion="Rechazado por Unanimidad";
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.NEGATIVO;
                    this.estadoConsola=this.ESTADO.RESULTADOS;
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;

            } else if(this.votosPositivos>this.votosNegativos){
                    this.resultadoVotacion="Aprobado por Mayoria";
                    this.estadoConsola=this.ESTADO.RESULTADOS;
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.POSITIVO;
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;
            }else if(this.votosPositivos<this.votosNegativos) {
                    this.resultadoVotacion="Rechazado por Mayoria";
                    this.estadoConsola=this.ESTADO.RESULTADOS;
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.NEGATIVO;
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;
            } else{
                    this.resultadoVotacion="Empate";
                    // this.estado=this.ESTADO_EMPATE;
                    this.resolverEmpate=true;
     
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;
            }
            break;

        case MOCK_INFOAPROBACION_ID.MAYORIA_ABSOLUTA:   // por mayoria Absoluta
           
            if(this.votosPositivos>=this.nroVotosMayoriaAbsoluta){
                    this.resultadoVotacion="Aprobado por Mayoría Absoluta";
                    this.estadoConsola=this.ESTADO.RESULTADOS;
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.POSITIVO;
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;

            } else {

                    this.resultadoVotacion="Rechazado por Mayoría Absoluta";
                    this.estadoConsola=this.ESTADO.RESULTADOS;
                    this.resultadoVotacionId=MOCK_RESULTADO_VOTO_ID.NEGATIVO;
                    // this.data = [this.votosPositivos, this.votosNegativos];
                    // this.mostrarGrafico=true;
                    // this.setResultados() ;

            }
        break;

        default:
        this.resultadoVotacion="Sin metodo de evaluacion";
        }


        console.log("calcularResultado this.estado: "+this.estadoConsola);

      this.confirmarResultadoVotacion();
      this.grabarResultadoVotoEnPanel();

    } else {
      //  "No se emitieron todos los votos";
      this.resultadoVotacion="Votos emitidos ("+this.votosEmitidos+")";
      // this.data = [this.votosPositivos, this.votosNegativos];
      // this.mostrarGrafico=true;
      // this.setResultados() ;
      this.errorMensaje="no se emitieron todos los votos.  Votos emitidos ("+this.votosEmitidos+")";
               
    }
    
  };


  grabarResultadoVotoEnPanel(){
    let urlPanel:string='';
      
    let docPanel= {   
      VotacionEstado    : this.estadoConsola,
      VotosPositivos    : this.votosPositivosIndividual,
      VotosNegativos    : this.votosNegativosIndividual,
      votosAbstencion   : this.votosAbstencionIndividual,
      resultadoVotacion : this.resultadoVotacion
  
    };
    urlPanel=environment.serviciosExternos.sql.apiURL+'api/panel/'; 
    let susPanel=this.http.put(urlPanel,docPanel).subscribe(data=>{
      console.log(data);
      susPanel.unsubscribe();
    },error=>{
      console.log('error',error);
      
    });
  }
  
  /*********************************************************************************************** */
  /*********************************************************************************************** */
  /*********************************   Cambio de presidente    *********************************** */
  /*********************************************************************************************** */
  /*********************************************************************************************** */
  iniciarCambioPresidente(){
    console.log('cambioPres-iniciarCambioPresidente');
    this.cambioPresidenteIniciado                 = true;
    this.cambioPresidenteActivo                   = false;
    this.cambioPresiteInstrucciones               = 'Seleccione el quien asume la presidencia.';
    this.impactoCambiosEnSesiones                 = 0;
    this.impactoCambiosEnConcejalesDispositivos   = 0;
    this.concejalDispositivoNuevoPresidente       = null;
    this.concejalDispositivoPresidenteSaliente    = null;
    


  }
  finalizarCambioPresidente(){
    console.log('cambioPres-finalizarCambioPresidente');
    this.cambioPresidenteIniciado                 = false;
    this.cambioPresidenteActivo                   = false;
    this.cambioPresiteInstrucciones               = null;
    this.impactoCambiosEnSesiones                 = 0;
    this.impactoCambiosEnConcejalesDispositivos   = 0;
    this.concejalDispositivoNuevoPresidente       = null;
    this.concejalDispositivoPresidenteSaliente    = null;
    this.concejalSeleccionadoParaPresidente       = null;


  }

  seleccionNuevoPresidente(concejal:SesionesInterface){
    

    if(concejal.NumConcejal==this.concejalPresidente.NumConcejal){
      this.alertService.confirm({ 
        title:   this.translate.instant('Cambio de Presidente'), 
        message: this.translate.instant('Elija un concejal que no sea presidente') })
      .then((resultadoOK) => {
        return;
 
      })

    } else {
      this.concejalSeleccionadoParaPresidente=concejal;
      this.confirmService.confirm({ 
        title:   this.translate.instant('Cambio de Presidente'), 
        message: this.translate.instant('Confirma como presidente a: '+concejal.Concejal +' .' ) })
      .then((resultadoOK) => {
        console.log('resultadoOK',resultadoOK);
        this.activarCambioPresidente();
      })
      .catch((cancel) => {
        console.log('cancel',cancel);
        this.cancelarSeleccionNuevoPresidente();
      })
    }

    
  }
  cancelarSeleccionNuevoPresidente(){
    this.concejalSeleccionadoParaPresidente=null;

  }

  activarCambioPresidente(){
    //envio apagar paro porner que la tablet ponga en false Habilitado	Estado	LoginForzado	Apagar	confirmacionPresencia	Limpiar
    // cuando se de esta situación en check sesiones hago el cambio en la tabla de sesiones
    this.apagarConcejal(this.concejalSeleccionadoParaPresidente);
    let concejalPresidente:SesionesInterface=this.concejalPresidente;
    concejalPresidente.Funcion=!concejalPresidente.Funcion;
    this.apagarConcejal(concejalPresidente);
    this.apagarConcejal(this.concejalPresidente);
    this.cambioPresidenteActivo=true;
  }

  cambiarPresidente(){
        this.impactoCambiosEnSesiones=1;
        
    // Borrar el presidente Actual de Sesiones
        this.deleteConcejalIndividual(this.concejalPresidente);
        let concejalPresidente:SesionesInterface=this.concejalPresidente;
        concejalPresidente.Funcion=!concejalPresidente.Funcion;
        this.deleteConcejalIndividual(concejalPresidente);

    // Borrar el concejal Actual de Sesiones
        this.deleteConcejalIndividual(this.concejalSeleccionadoParaPresidente)
    
    // crear Presidente Nuevo en la mac del anterior en sesiones
   
      this.cargaConcejalIndividual( this.concejalSeleccionadoParaPresidente.NumConcejal,
                                    this.concejalPresidente.NumDispositivo,
                                    false,
                                    this.concejalPresidente.Macaddresses);

      this.cargaConcejalIndividual( this.concejalSeleccionadoParaPresidente.NumConcejal,
                                    this.concejalPresidente.NumDispositivo,
                                    true,
                                    this.concejalPresidente.Macaddresses);                                    
                                  


    // crear concejal Nuevo en la mac del Presidente Seleccionado en sesiones

      this.cargaConcejalIndividual( this.concejalPresidente.NumConcejal,
                                    this.concejalSeleccionadoParaPresidente.NumDispositivo,
                                    false,
                                    this.concejalSeleccionadoParaPresidente.Macaddresses);

      // leo los datos de concejales Dispositivos del presidente y concejalSeleccionado para modificarlos
      this.leerConcejalDispositivoNuevoPresidente(this.concejalSeleccionadoParaPresidente);                              
      this.leerConcejalDispositivoPresidenteSaliente(this.concejalPresidente);                              
  }

  cargaConcejalIndividual(NumConcejal:number,NumDispositivo:number,Funcion:boolean,mac:string ){

    

    // "NumConcejal", "NumDispositivo" ,"Funcion" se informan en cero porque se reemplazan con los datos
    // de Concejales dispositivos

  console.log('cambioPres-cargaConcejalIndividual',NumConcejal,NumDispositivo,Funcion,mac);
    
    let docInicio= {
      "NumConcejal":NumConcejal,
      "NumDispositivo":NumDispositivo,
      "Funcion":Funcion?1:0,
      "Macaddresses":mac,
      "Habilitado":Funcion?0:1, // el presidente ingresa deshabilitado
      "IniciaTexto":0,
      "Titulo":'titulo Inicial',
      "Texto":'Texto Inicio',
      "InicioVoto":0,
      "ResultadoVoto":3,
      "TiempoVotacion":0,
      "TiempoInicio":0,
      "TiempoFin":0,
      "Limpiar":0,
      "Apagar":0,
      "Estado":0,
      "InfoVoto":0,
      "InfoAprovacion":0,
      "InfoVotacion":0,
      "InfoReloj":0,
      "InfoNominal":0,
      "Excusado":0,
      "PidePalabra":0,
      "PidePalabraIndice":0,
      "LoginForzado":0,
      "ConfirmacionPresencia":0
      }
      let urlSesiones:string='';
      urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'; 
      let susInici=this.http.post(urlSesiones,docInicio).subscribe(data=>{
        console.log(data);
        console.log('cambioPres-cargaConcejalIndividual ok',NumConcejal,NumDispositivo,Funcion,mac);
        susInici.unsubscribe();
      },error=>{
        console.log('cambioPres-cargaConcejalIndividual error',error,NumConcejal,NumDispositivo,Funcion,mac);
      });
      
  }

  deleteConcejalIndividual(concejal:SesionesInterface ){ 
    console.log('cambioPres-deleteConcejalIndividual',concejal);

    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/sesiones/'+concejal.NumConcejal+'/'+concejal.NumDispositivo+'/'+funcion; 
   
      let susInici=this.http.delete(urlSesiones).subscribe(data=>{
        console.log(data);
        console.log('cambioPres-deleteConcejalIndividual ok',concejal);
        susInici.unsubscribe();
      },error=>{
        console.log('cambioPres-deleteConcejalIndividual error',error, concejal);
      });
      
  }



  impactarModificacionesEnConcejalesDispositivos(){
    console.log('cambioPres-impactarModificacionesEnConcejalesDispositivos');                  
    // this.asignarConcejalDispositivoPresidenteSaliente(this.concejalPresidente); 
    this.insertConcejalDispositivo( this.concejalDispositivoPresidenteSaliente);
    this.deleteConcejalDispositivo(this.concejalPresidente);

    // this.asignarConcejalDispositivoNuevoPresidente(this.concejalSeleccionadoParaPresidente); 
    this.insertConcejalDispositivo( this.concejalDispositivoNuevoPresidente);
    this.deleteConcejalDispositivo(this.concejalSeleccionadoParaPresidente);

  };

  
  leerConcejalDispositivoNuevoPresidente(concejal:SesionesInterface){
    console.log('cambioPres-leerConcejalDispositivoNuevoPresidente ',concejal);
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/concejalesDispositivosQry/'+concejal.NumConcejal+'_'+concejal.NumDispositivo+'_'+funcion; 
   
      let susInici=this.http.get(urlSesiones).subscribe((data:ConcejalesDispositivosInterface[])=>{
        console.log(data);
        susInici.unsubscribe();
        let cd:ConcejalesDispositivosInterface=data[0];
        cd.Funcion        = true; 
        cd.Macaddresses   = this.concejalPresidente.Macaddresses;
        cd.NumDispositivo = this.concejalPresidente.NumDispositivo; 
        console.log(cd);
        this.concejalDispositivoNuevoPresidente=cd;
        console.log('cambioPres-leerConcejalDispositivoNuevoPresidente ok',concejal);
        console.log('cambioPres-leerConcejalDispositivoNuevoPresidente this.concejalDispositivoNuevoPresidente',this.concejalDispositivoNuevoPresidente);
   
      },error=>{
        console.log('cambioPres-leerConcejalDispositivoNuevoPresidente error',error, concejal);
      });
    
  }

  leerConcejalDispositivoPresidenteSaliente(concejal:SesionesInterface){
    console.log('cambioPres-leerConcejalDispositivoPresidenteSaliente ',concejal);
    console.log('')
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/concejalesDispositivosQry/'+concejal.NumConcejal+'_'+concejal.NumDispositivo+'_'+funcion; 
   
      let susInici=this.http.get(urlSesiones).subscribe((data:ConcejalesDispositivosInterface[])=>{
        console.log(data);
        susInici.unsubscribe();
        let cd:ConcejalesDispositivosInterface=data[0];
        cd.Funcion        = false;
        cd.Macaddresses   = this.concejalSeleccionadoParaPresidente.Macaddresses;
        cd.NumDispositivo = this.concejalSeleccionadoParaPresidente.NumDispositivo; 
        console.log(cd);
        this.concejalDispositivoPresidenteSaliente=cd;
        console.log('cambioPres-leerConcejalDispositivoPresidenteSaliente ok',concejal);
        console.log('cambioPres-leerConcejalDispositivoPresidenteSaliente this.concejalDispositivoNuevoPresidente',this.concejalDispositivoNuevoPresidente);
      },error=>{
        console.log('cambioPres-leerConcejalDispositivoPresidenteSaliente error',error, concejal);
      });
    
  }

  deleteConcejalDispositivo(concejal:SesionesInterface){
    this.impactoCambiosEnConcejalesDispositivos++;
    let urlSesiones:string='';
    let funcion=concejal.Funcion?'1':'0'
    console.log('cambioPres-deleteConcejalDispositivo', concejal);
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/concejalesDispositivosQry/'+concejal.NumConcejal+'_'+concejal.NumDispositivo+'_'+funcion; 
   
      let susInici=this.http.delete(urlSesiones).subscribe((data)=>{
        console.log(data);
        console.log('cambioPres-deleteConcejalDispositivo OK', concejal);
        susInici.unsubscribe();
   
      },error=>{
        console.log('cambioPres-deleteConcejalDispositivo error',error, concejal);
      });
    
  }

  insertConcejalDispositivo(cd:ConcejalesDispositivosInterface){
    this.impactoCambiosEnConcejalesDispositivos++;
    let urlSesiones:string='';
    let funcion=cd.Funcion?'1':'0'
    console.log('cambioPres-insertConcejalDispositivo', cd);
    
    urlSesiones=environment.serviciosExternos.sql.apiURL+'api/concejalesDispositivosQry/'; 
   
      let susInici=this.http.post(urlSesiones,cd).subscribe((data:ConcejalesDispositivosInterface[])=>{
        console.log(data);
        let cd:ConcejalesDispositivosInterface=data[0];
        console.log('cambioPres-insertConcejalDispositivo ok', cd);
        
        susInici.unsubscribe();
      },error=>{
        console.log('cambioPres-insertConcejalDispositivo error',error, cd);
      });
    
  }

  confirmarResultadoVotacion(){
    let modalRef = this.modalService.open(this.modalConfirmacionResultados, { backdrop : 'static', windowClass: 'custom-class', container: '.app' });
      
    modalRef.result.then((result) => {
        // ok
        console.log("modal result", result);

    }, (reason) => {
      console.log("modal reason", reason);
      this.cancelarOrdenDiaEnVotacion();
    });

    this.limpiarTablet();
    let text= '<br>'
    + '<br>'
    + ' <p style="color:green; "><strong >Votos Positivos: '+this.votosPositivosIndividual +'</strong></p>'
    + ' <p style="color:red;   "><strong >Votos Negativos: '+this.votosNegativosIndividual +'</strong></p>'
    + ' <p style="color:yellow;"><strong >Abstenciones   : '+ this.votosAbstencionIndividual +'</strong></p>'
    + ' <br>'
    + ' <p style="text-align: center; color:blue;"><strong><span >'+this.resultadoVotacion+"</span> </strong></p>"
    ;
    this.grabarTextosSesiones('Resultado',text);
  }


}


