import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef, ViewChild ,ElementRef} from '@angular/core';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { PageGenerica2 }        from '@maq-modules/page-generica/page-generica2.page';
import { ConfigComponente }     from './panelSesion.config';
import * as votarWebConfig      from './../../../../../votarWebConfig.json';



import { Novedades, NovedadesInterface }  from '@proyecto/models/novedades/novedades.model';
import { Parametros }                         from '@proyecto/models/parametros/parametros.model';
import { Panel, PanelInterface }              from '@proyecto/models/panel/panel.model';
import { SesionesConsola, SesionesInterface } from '@proyecto/models/sesionesConsola/sesionesConsola.model';
import { MOCK_ESTADOS }                       from '@proyecto/mocks/votos/votos.mocks';


import { MOCK_INFOAPROBACION,MOCK_INFOAGRUPACION,MOCK_INFOVOTO }          from '@proyecto/mocks/votos/votos.mocks';
import { MOCK_INFOAPROBACION_ID,MOCK_INFOAGRUPACION_ID,MOCK_INFOVOTO_ID } from '@proyecto/mocks/votos/votos.mocks';
import { getInfoVoto,getInfoAprobacion,getInfoAgrupacion} from '@proyecto/mocks/votos/votos.mocks';
import { MOCK_INFOAPROBACION_Interfase,MOCK_INFOAGRUPACION_Interfase,MOCK_INFOVOTO_Interfase }      from '@proyecto/mocks/votos/votos.mocks';

// import { environment } from '../../../../environments/environment';
import { environment } from '@environments/environment';
import { Concejales } from '@settings/proyecto/models/concejales/concejales.model';
 
declare let $: any;
declare let jQuery: any;

declare var H: any;  

@Component({
  selector: 'app-panel-sesion',
  templateUrl: './panelSesion.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './panelSesion.page.scss',
    './styles/bancas.scss',
    './styles/encabezado.scss',
    './styles/envotacion.scss',
    './styles/main.scss',
    './styles/resultados.scss',
    './styles/sesiones.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class PanelSesionComponent extends PageGenerica2<Novedades<NovedadesInterface>> implements OnInit, OnDestroy {

  public CONCEJO                      = '';

  public ESTADO=MOCK_ESTADOS


  public NUMERO_PANEL                 =null;

  // public estadoPanel                       = this.ESTADO.ESPERANDO_NOVEDADES;
  public estadoPanel                  = this.ESTADO.ESPERANDO_NOVEDADES;

  public sesion                       = "primer Sesion";
  public titulo                       = '';//Titulo que se expone en TV se usa en sesion HTML
  public texto                        = '';//Texto que se expone en TV se usa en sesion HTML
  public nroPresetes                  = 0;
  public nroAusentes                  = 0;
  public dia                          : Date = new Date();
  

  public showBanca                    = true;
  public lista                        = null;

  public sesionTituloPanel            = 'Titulo de Sesion Panel';//'Titulo de Sesion Panel';
  public tipoVotacion                 = 'Nominal';//'General/Nominal';
  public tipoAprobacion               = 'Mayoria';//'Unanimidad/Mayoria';
  public tratamentoTema               = 'Individual';//Agrupada/Individual/Particular';

  public selected                     = null;

  public recSesionActiva              = {};
  public recParametros                = {};
  public bancas:Bancas[][]            = [];
  public panel:PanelInterface         = null;

  public nroExcusados:number          =0;

  // Parámteros
  public Parametros                       : Parametros=null;
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

  public Sesiones_FinalizaTiempoVotacion  : boolean =null;  // Fianliza la votacion cuando votan todos
  public Sesiones_MuestraQuorumPanel      : boolean =null;  // 0: hay quoum con la mitad mas uno, 1: todos(igual a seiones_Quorum)
  public Sesiones_SensorSillaQuorum       : boolean =null;  // Hay sensores instalados o no
  public tiempoVotacion                   : number  =null;  // Tiempo asignado para votar
  public Sesiones_PDFFinalSesion="reporte.pdf?#zoom=100&scrollbar=0&toolbar=0&navpanes=0";//Link del Archivo PdF

  public textoQuorum                      :string='Texto Quorum';
  public textoQuorumClase                 :string='';
  public MuestraPDFFInal                  :boolean =false;
  public estaLimpiando                    :boolean =false;
  public resolverEmpate                   :boolean =false;

  public soloUnaLectura     : boolean=false;// Uso este parámetro para no telener una lectura continua de la tabla de sesiones y hacer testing
  public nombreConcejalUsandoLaPalabra:string=null;
  constructor ( protected changeDetectorRef    : ChangeDetectorRef,
                private route: ActivatedRoute ) {    
                   super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'PanelSesionComponent'));
  @ViewChild('textosSecion' , {static: true}) private textosSecionRef:ElementRef;
 


  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit' ));
     this.NUMERO_PANEL = this.route.snapshot.paramMap.get('numeroPanel');
     console.log('this.NUMERO_PANEL',this.NUMERO_PANEL);
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

    if(this.CONCEJO==="hcdZarate"){
      this.bancas=[[
                      {nombreBanca:'Banca00',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca01',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca02',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca03',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca04',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca05',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca06',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca07',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca08',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca09',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                  ],
                  [
                      {nombreBanca:'Banca10',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca11',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca12',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca13',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca14',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca15',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca16',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca17',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca18',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                      {nombreBanca:'Banca19',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
          
                  ],
                  [
                      {nombreBanca:'Banca21',clase:'bancaOcupada',partido:'p3', PidePalabra : 0, PidePalabraIndice:0},
                  ]
                ];
      console.log('bancas zarate', this.bancas);
    } else {  // default concejo de 18 consejales como   CONCEJO: 'hcdTrenqueLauquen'
      this.bancas=[ [
                    {nombreBanca:'Banca00',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca01',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca02',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca03',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca04',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca05',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca06',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca07',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca08',clase:'bancaOcupada',partido:'p1', PidePalabra : 0, PidePalabraIndice:0}
                  ],
                  [
                    {nombreBanca:'Banca10',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca11',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca12',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca13',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca14',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca16',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca17',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0},
                    {nombreBanca:'Banca18',clase:'bancaOcupada',partido:'p2', PidePalabra : 0, PidePalabraIndice:0}
                  ],
                  [
                    {nombreBanca:'Banca21',clase:'bancaOcupada',partido:'p3', PidePalabra : 0, PidePalabraIndice:0}
                  ]
                ];
      console.log("bancas TRENQUE", this.bancas);
  }


  let urlParametros:string='';
  urlParametros=environment.serviciosExternos.sql.apiURL+'api/parametros/1';   
  this.http.get(urlParametros).subscribe((parametros:Parametros)=>{
    console.log('parametros',parametros)
    
    this.Parametros=parametros;
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

    this.Sesiones_PDFFinalSesion="reporte.pdf?#zoom=100&scrollbar=0&toolbar=0&navpanes=0";//Link del Archivo PdF


    console.log('http(recParametros)',  this.Parametros[0]);
    console.log('http(recParametros)',  this.nroQuorum);
  
  })

  // Cheque la tabla de sesiones cada un segunto para acutalizar los datos
  if(!this.soloUnaLectura) {
    setInterval(() => {
          this.checkSesiones();      
      }, 1000);

    }else {
          this.checkSesiones();      
  }                       
  
    // this.checkSesiones();      
     super.ngOnInit()
  
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }  

  configuracionComponente() {
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
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
    url=environment.serviciosExternos.sql.apiURL+'api/panel/'+this.NUMERO_PANEL;   
    let s=this.http.get(url).subscribe((panel:PanelInterface[])=>{
      console.log('sesiones',s);
      console.log('sesiones panel',panel);
      s.unsubscribe();
      console.log('sesiones panel.IniciaTexto',panel[0].IniciaTexto);

      if(panel.length>0){

        this.panel=panel[0];
        
              // Muestra PDF Final.
              this.MuestraPDFFInal=this.panel.MuestraPDFFInal;
              console.log('checkSesiones', "MuestraPDFFInal"+this.MuestraPDFFInal);
              
              // Título del panel (TipoSesion + Nro Sesion)
              this.sesionTituloPanel=this.panel.TipoSesion+' Nro: '+this.panel.NumTipoSesion;

              //Tipo de votacion 
              //    InfoVoto:1 General
              //    InfoVoto:2 Nominal

              this.tipoVotacion=getInfoVoto(this.panel.InfoVoto);

            
            //Aprobacion 
              // InfoAprobacion:1 Unanimidad
              // InfoAprobacion:2 Mayoria (mitad +1)
              // InfoAprobacion:3 Aprobación Mayoria absoluta (2/3 Total)
          

            this.tipoAprobacion=getInfoAprobacion(this.panel.InfoAprovacion);

            // Que se vota
              // InfoVotacion:1 -> Agrupada
              // InfoVotacion:2 -> Individual
              // InfoVotacion:3 -> Particular

              this.tratamentoTema=getInfoAgrupacion(this.panel.InfoVotacion);

        // Asignación de Bancas

        if(this.panel.InfoVoto===2 ){ //Votacion Nominal
           this.asignarBancasVotacionNominal();
           this.estadoPanel=this.ESTADO.RESULTADOS;
         } else {
            this.asignarBancas();
         }

        // Asignación Textos Título y Texto CUANDO EL ESTADO ES:
        //      ESPERANDO_NOVEDADES   = 0,
        //      SINQUORUM             = 1,
        //      CONCUORUM             = 2

        if(this.panel.IniciaTexto && (this.estadoPanel <=  this.ESTADO.TEXTOS)){
            this.titulo=this.panel.Titulo;
            this.texto=this.panel.Texto;
            this.estadoPanel=this.ESTADO.TEXTOS;
            console.log('checkSesiones estado dentro if', this.estadoPanel);
        }
         console.log('checkSesiones $scope.estado FUERA if', this.estadoPanel);


        // VOTACIÓN 
        // se inicia el timer cuando se pone en verdadero Inicia Voto y el estado es TEXTO.
        // Se agrega la condicion < ESTADO.VOTANDO, para que no se inicie nuevamente mietras se vota (InicioVoto=true)
        // el estado cambiara cuando termine el timer
      
        if((this.panel.InicioVoto && this.estadoPanel<this.ESTADO.VOTANDO && this.estadoPanel>=this.ESTADO.TEXTOS)||
           (this.panel.InicioVoto &&  this.estadoPanel===this.ESTADO.EMPATE) ){
            this.estadoPanel=this.ESTADO.VOTANDO;
            this.startTimerVotacion(this.panel.TiempoVotacion*1000);

        }


        // LIMPIAR
        if(this.panel.Limpiar){
          this.limpiar();
        }

        // USO DE LA PALABRA
        if(this.panel.InfoReloj && !this.inicioUsoDeLaPalabra){
          this.estadoPanel=this.ESTADO.USO_DE_PALABRA;
          this.startTimerUsoDeLaPalabra();
        } else if(!this.panel.InfoReloj && this.inicioUsoDeLaPalabra){
          this.nombreConcejalUsandoLaPalabra=null;
          this.stopTimerUsoDeLaPalabra();
        }


        

        // lectura de textos y confirmación de lectura.
        if(this.panel.IniciaTexto){
          this.estadoPanel=this.ESTADO.TEXTOS;
          this.texto=this.panel.Texto;
          this.titulo=this.panel.Titulo;
          console.log('ElementRef',this.textosSecionRef);
          this.confirmaIniciaTexto();
        }

       

        // Confirma Inicio Voto.
        if(this.panel.InicioVoto){
          this.estadoPanel=this.ESTADO.VOTANDO;
          // this.texto=this.panel.Texto;
          // this.titulo=this.panel.Titulo;
          this.confirmaInicioVoto();
        }

        // Confirma Inicio Voto.
        if(this.panel.VotacionEstado==this.ESTADO.RESULTADOS){
          this.estadoPanel=this.ESTADO.RESULTADOS;

          this.datosResultadoVotacion=[
            { name: 'Positivos', value: this.panel.votosPositivos  },
            { name: 'Negativos', value: this.panel.votosNegativos  },
            { name: 'Abstenciones', value: this.panel.votosAbstencion   },
          ];
          this.mostrarGrafico=true;  // Se pone en verdadero cuando está listo el resultado
          this.resultadoVotacion =this.panel.resultadoVotacion; // tiene el resultado de la votación
        
        }


      }  
      
    });
  }


// ********************************************************************************************
// ********************************************************************************************
// ***********************    Asignar Bancas   ************************************************
// ********************************************************************************************
// ********************************************************************************************

asignarBancas(){


  var excusados       : number=0;
  var presentes       : number=0;
  var ausentes        : number=0;
  var emitiendoVoto   : number=0;

          
         
  let url:string='';
  
  url=environment.serviciosExternos.sql.apiURL+'api/sesiones/';   
  let doc={Limpiar:false };

  let s=this.http.get(url).subscribe((resp:SesionesInterface[])=>{

    s.unsubscribe();
    console.log(resp);
 
    console.log(' asignarBancas parametroTratamientoAbstencion',this.parametroTratamientoAbstencion);
        
   
    
    for( var i = 0; i< resp.length; i++){
      console.log(" asignarBancas "+i);
      let concejal:SesionesInterface=resp[i];
      // let fila    = parseInt(concejal.BancaFila,10);
      // let columna = parseInt(concejal.BancaColumna,10);
      let fila    = concejal.BancaFila;
      let columna = concejal.BancaColumna;
      console.log("asignarBancas "+ "-"+fila+"-"+columna+":"+(fila+columna));
  
      console.log("asignarBancas banca - fila: "+fila+ "col: "+columna, this.bancas[fila][columna]);
      this.bancas[fila][columna].nombreBanca=concejal.Abreviacion;
      this.bancas[fila][columna].partido=concejal.PartidoAbreviado;

      if(concejal.PidePalabra==2){
        this.nombreConcejalUsandoLaPalabra=concejal.Concejal;
      }
      
      //El presidente, no pide la palabra.
      if(!concejal.Funcion){ 
        this.bancas[fila][columna].PidePalabra=concejal.PidePalabra;
        this.bancas[fila][columna].PidePalabraIndice=concejal.PidePalabraIndice;
      }
   
      //Si está logueado (Estado=1) y no es presidente (Funcion=0)
      if(concejal.Estado && !concejal.Funcion){
        this.bancas[fila][columna].clase='bancaOcupada';
        console.log("asignarBancas clase presidente "+i + ' - '+concejal.Funcion+' - '+concejal.Concejal + "-"+fila+"-"+columna+":"+this.bancas[fila][columna].clase);
        presentes++;
        console.log("asignarBancas clase InicioVoto "+concejal.InicioVoto);

        // Si esta votando  (InicioVoto=1)
        if(concejal.InicioVoto){
              emitiendoVoto++;
              this.bancas[fila][columna].clase='bancaVotando';
              console.log("asignarBancas clase  "+concejal.Concejal + "-"+fila+"-"+columna+":"+this.bancas[fila][columna].clase);
        
        }else{ // Ya votó (InicioVoto=0)
  
            // Si el estado es Empate, Resultados o se está votando (con la habilitacion de mostrar los votos en parametro)
            // Se muestra votando el resultado del voto si

            if(this.estadoPanel===this.ESTADO.EMPATE||this.estadoPanel===this.ESTADO.RESULTADOS|| (this.muestroVotosAlVotar&& this.estadoPanel===this.ESTADO.VOTANDO)){
              if(concejal.ResultadoVoto===0 ||(concejal.ResultadoVoto===2  && this.parametroTratamientoAbstencion===0) ){
                  this.bancas[fila][columna].clase='bancaVotoNegativo';
                  console.log("asignarBancas clase  "+concejal.Concejal + "-"+fila+"-"+columna+":"+this.bancas[fila][columna].clase);
              }else if(concejal.ResultadoVoto===1 || (concejal.ResultadoVoto===2  && this.parametroTratamientoAbstencion===1) ){
                  this.bancas[fila][columna].clase='bancaVotoPositivo';
                  console.log("asignarBancas clase  "+concejal.Concejal + "-"+fila+"-"+columna+":"+this.bancas[fila][columna].clase);
              }
            }
        }
      }  else {
  
          if((concejal.Funcion)){ // es el presidente
                  this.bancasPresidente(concejal);
          } else {
  
              if(concejal.Excusado){
                  excusados++;
                  this.bancas[fila][columna].clase='bancaExcusada';
              } else {
  
               this.bancas[fila][columna].clase='bancaAusente';
               console.log("asignarBancas clase  "+concejal.Concejal + "-"+fila+"-"+columna+":"+this.bancas[fila][columna].clase);
               ausentes++;
               }
           }
        }
      }
  
  
    this.nroExcusados=excusados;
    this.nroPresetes=presentes;
    this.nroAusentes=ausentes;
    console.log("emitiendoVoto",emitiendoVoto);
    console.log("emitiendoVoto",this.estadoPanel);
    console.log("emitiendoVoto",this.Sesiones_FinalizaTiempoVotacion);

  
       // si Sesiones_MusetraQuorumPanel se calcula si hay quorum o no
      // de lo contrario se muestra el titulo
      console.log("quorum Sesiones_MuestraQuorumPanel ", this.Sesiones_MuestraQuorumPanel);
      console.log("quorum $scope.$scope.nroQuorum ", this.nroQuorum);
    if( this.Sesiones_MuestraQuorumPanel){
  
      if(this.nroPresetes<this.nroQuorum){
        this.textoQuorum='Sin Quorum';
        this.textoQuorumClase='tituloQuorum_SinQuorum';
      }else {
        this.textoQuorum='con Quorum';
        this.textoQuorumClase='tituloQuorum_ConQuorum';
      }
    
    } else {
      this.textoQuorum='Quorum';
      this.textoQuorumClase='';
    }
  
     if(this.estadoPanel==this.ESTADO.VOTANDO ) {
       let concejalesVotando=resp.filter((concejal:SesionesInterface)=>concejal.InicioVoto==true);
       if(concejalesVotando.length==0){
         
         this.estadoPanel=this.ESTADO.TEXTOS;
  
       }
     }
    
   
  });

};



// ********************************************************************************************
// ********************************************************************************************
// *************    bancasPresidente  *****************************************
// ********************************************************************************************
// ********************************************************************************************


bancasPresidente( concejalPresidente:SesionesInterface){
         // recorro la tabla de sesiones para buscar la mac del presidente y copiar el estado
         var filaPresidente=2;
         var columnaPresidente=0;


       console.log("bancasPresidente ", concejalPresidente);

         this.bancas[filaPresidente][columnaPresidente].nombreBanca=concejalPresidente.Abreviacion;
         this.bancas[filaPresidente][columnaPresidente].partido=concejalPresidente.PartidoAbreviado;


     if(concejalPresidente.Estado){
       this.bancas[filaPresidente][columnaPresidente].clase='bancaOcupada';

         if(concejalPresidente.InicioVoto && concejalPresidente.Habilitado){

          this.bancas[filaPresidente][columnaPresidente].clase='bancaVotando';
         
         }else{

           // Si el estado es Empate, Resultados o se está votando (con la habilitacion de mostrar los votos en parametro)
           // Se muestra votando el resultado del voto si

           if((this.estadoPanel===this.ESTADO.EMPATE||this.estadoPanel===this.ESTADO.RESULTADOS)&& concejalPresidente.Habilitado){

               if(concejalPresidente.ResultadoVoto===0 ||(concejalPresidente.ResultadoVoto===2  && this.parametroTratamientoAbstencion===0) ){
                   this.bancas[filaPresidente][columnaPresidente].clase='bancaVotoNegativo';
                   
               }else if(concejalPresidente.ResultadoVoto===1 ||(concejalPresidente.ResultadoVoto===2  && this.parametroTratamientoAbstencion===1)){
                   this.bancas[filaPresidente][columnaPresidente].clase='bancaVotoPositivo';
               }

           }
         }
     } else {
          this.bancas[filaPresidente][columnaPresidente].clase='bancaAusente';
     }

}

// ********************************************************************************************
// ********************************************************************************************
// *************    Asignar Bancas  Votacion Nominal  *****************************************
// ********************************************************************************************
// ********************************************************************************************

asignarBancasVotacionNominal(){};


// ********************************************************************************************
// ********************************************************************************************
// *************    Limpiar                           *****************************************
// ********************************************************************************************
// ********************************************************************************************

limpiar(){
 
  console.log('limpiar');
  
    if(!this.estaLimpiando){
      this.estaLimpiando=true;

      let url:string='';
  
      url=environment.serviciosExternos.sql.apiURL+'api/panel/'+this.NUMERO_PANEL;   
      let doc={Limpiar:false };
  
      let s=this.http.put(url,doc).subscribe((resp:any)=>{
        console.log('limpiar ok',resp);
        this.estaLimpiando=false;
        if(this.estadoPanel !==  this.ESTADO.TEXTOS ){
          window.location.reload();
        }
        this.estadoPanel=  this.ESTADO.ESPERANDO_NOVEDADES;
        this.texto=this.textoEspera;
        this.titulo=this.tituloEspera;
        this.mostrarGrafico=false;
        this.resolverEmpate=false;
      });   

    };
  
  
   
  
 
};

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
    this.estadoPanel=this.ESTADO.VOTANDO;

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

  // pone en false InicioVoto del panel 

  let url:string='';
  
  url=environment.serviciosExternos.sql.apiURL+'api/panel/'+this.NUMERO_PANEL;   
  let doc={InicioVoto:false };

  let s=this.http.put(url,doc).subscribe((resp:any)=>{
      console.log("stopVotarTimer resp: "+resp);
      s.unsubscribe();
    },error=>{
      console.log('error',error)}
   );

         
  
};

displayTimerVotacion(){
 console.log("displayTimerVotacion: ");
    if(this.estadoPanel!==this.ESTADO.VOTANDO){
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
    this.estadoPanel=this.ESTADO.USO_DE_PALABRA;
    console.log("startTimerUsoDeLaPalabra "+this.estadoPanel);
    this.inicioUsoDeLaPalabra=new Date().getTime();
    console.log("startTimerUsoDeLaPalabra "+this.inicioUsoDeLaPalabra);

    if(!this.timerUsoDeLaPalabra){
      this.timerUsoDeLaPalabra=setInterval(() => {
      
        this.displayTimerUsodeLaPalabra();
      }, this.pasoTimerUsoDeLaPalabra);   
    } 
  };


  stopTimerUsoDeLaPalabra(){
    console.log("stopTimerUsoDeLaPalabra "+this.estadoPanel);
    this.estadoPanel=this.ESTADO.ESPERANDO_NOVEDADES;

    // Reset de las variables utilizadas  
    this.inicioUsoDeLaPalabra=null;
    this.updateUsoDeLaPalabra =null;  // Date de actualizado del timer
    this.tiempoUsoDeLaPalabra =null;  // Tiempo transcurrido, Diferencia entre los dos anteriores
    this.displaytiempoUsoDeLaPalabra =null;  // Variable que se muestra en pantalla
    
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
    { name: 'Positivos', value: 0  },
    { name: 'Negativos', value: 0   },
    { name: 'Abstenciones', value: 0  },
    
  ];
  public mostrarGrafico:boolean=false;  // Se pone en verdadero cuando está listo el resultado
  public resultadoVotacion: string =''; // tiene el resultado de la votación




  onSelect(d){
    console.log(d);
  }

  confirmaIniciaTexto(){ 
    
    let url:string='';

    url=environment.serviciosExternos.sql.apiURL+'api/panel/'+this.NUMERO_PANEL;   
    let doc={IniciaTexto:false };

    let s=this.http.put(url,doc).subscribe((resp:any)=>{
      console.log('resp',resp);
    });   

 
  };
  confirmaInicioVoto(){ 
    
    let url:string='';

    url=environment.serviciosExternos.sql.apiURL+'api/panel/'+this.NUMERO_PANEL;   
    let doc={InicioVoto:false };

    let s=this.http.put(url,doc).subscribe((resp:any)=>{
      console.log('resp',resp);
      this.startTimerVotacion(this.panel.TiempoVotacion);
    });   

 
  };
    


}


export interface Bancas{
  nombreBanca         : string,
  clase               : string,
  partido             : string,
  PidePalabra         : number,
  PidePalabraIndice   : number
}

