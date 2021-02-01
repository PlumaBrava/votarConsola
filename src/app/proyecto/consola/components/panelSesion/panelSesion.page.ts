import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';



import { PageGenerica2 }        from '@maq-modules/page-generica/page-generica2.page';
import { ConfigComponente }     from './panelSesion.config';
import * as votarWebConfig      from './../../../../../votarWebConfig.json';



import { Novedades, NovedadesInterface }   from '@proyecto/models/novedades/novedades.model';
import { Parametros }   from '@proyecto/models/parametros/parametros.model';


import { ExcelService }       from '@maq-servicios/excel/excel.service';

// import { environment } from '../../../../environments/environment';
import { environment } from '@environments/environment';
 
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
  public ESTADO_ESPERANDO_NOVEDADES   = 0;
  public ESTADO_SINQUORUM             = 1;
  public ESTADO_CONCUORUM             = 2;
  public ESTADO_TEXTOS                = 3;
  public ESTADO_VOTANDO               = 4;
  public ESTADO_CALCULANDO_RESULTADOS = 5;
  public ESTADO_EMPATE                = 6;
  public ESTADO_RESULTADOS            = 7;
  public ESTADO_USO_DE_PALABRA        = 8;

  // public estado                       = this.ESTADO_ESPERANDO_NOVEDADES;
  public estado                       = this.ESTADO_VOTANDO;

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

  public Sesiones_PDFFinalSesion="reporte.pdf?#zoom=100&scrollbar=0&toolbar=0&navpanes=0";//Link del Archivo PdF

  public textoQuorum:string='Texto Quorum';


  constructor ( protected changeDetectorRef    : ChangeDetectorRef,
                private excel : ExcelService
              ) {    
      
             super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'PanelSesionComponent'));
 


  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit '+this));

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
                      {nombreBanca:'Banca00',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca01',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca02',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca03',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca04',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca05',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca06',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca07',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca08',clase:'bancaOcupada',partido:'p1'},
                      {nombreBanca:'Banca09',clase:'bancaOcupada',partido:'p1'},
                  ],
                  [
                      {nombreBanca:'Banca10',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca11',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca12',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca13',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca14',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca15',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca16',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca17',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca18',clase:'bancaOcupada',partido:'p2'},
                      {nombreBanca:'Banca19',clase:'bancaOcupada',partido:'p2'},
          
                  ],
                  [
                      {nombreBanca:'Banca21',clase:'bancaOcupada',partido:'p3'},
                  ]
                ];
      console.log('bancas zarate', this.bancas);
    } else {  // default concejo de 18 consejales como   CONCEJO: 'hcdTrenqueLauquen'
      this.bancas=[ [
                    {nombreBanca:'Banca00',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca01',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca02',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca03',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca04',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca05',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca06',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca07',clase:'bancaOcupada',partido:'p1'},
                    {nombreBanca:'Banca08',clase:'bancaOcupada',partido:'p1'},
                  ],
                  [
                    {nombreBanca:'Banca10',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca11',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca12',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca13',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca14',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca15',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca16',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca17',clase:'bancaOcupada',partido:'p2'},
                    {nombreBanca:'Banca18',clase:'bancaOcupada',partido:'p2'},
                  ],
                  [
                    {nombreBanca:'Banca21',clase:'bancaOcupada',partido:'p3'},
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
    //
  })

  // Cheque la tabla de sesiones cada un segunto para acutalizar los datos

   setInterval(() => {
 
      this.checkSesiones();      
    }, 1000);                   
  

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
  
  forzarSolapa(solapa:string, documento:any, accion:string) {
      console.log("abrirSolapa",solapa, documento, accion);
      
      setTimeout (() => {
        
        $("#tabFicha").removeClass('active');  
        $("#tabIntegrantes").removeClass('active');  
        $("#tabVehiculos").removeClass('active');  
        $("#tabParadas").removeClass('active');  

        $("#panelFicha").removeClass('active');  
        $("#panelIntegrantes").removeClass('active');  
        $("#panelVehiculos").removeClass('active');  
        $("#panelParadas").removeClass('active');  

        if(solapa=="Ficha") {
            $("#tabFicha").addClass('active');  
            $("#panelFicha").addClass('active');  
        }        
        if(solapa=="Integrantes") {
            $("#tabIntegrantes").addClass('active');  
            $("#panelIntegrantes").addClass('active');  
            
            // this.componenteIntegrantesAccionInicial    = 'consultar';
            // this.componenteIntegrantesDocumentoInicial = documento;            
        }
        if(solapa=="Vehiculos") {
            $("#tabVehiculos").addClass('active');  
            $("#panelVehiculos").addClass('active');  
            
            // this.componenteVehiculosAccionInicial    = 'consultar';
            // this.componenteVehiculosDocumentoInicial = documento;                      
        }  
        if(solapa=="Paradas") {
            console.log("Activó Solapa Paradas");
            $("#tabParadas").addClass('active');  
            $("#panelParadas").addClass('active');  
            
            // this.componenteParadasAccionInicial    = 'consultar';
            // this.componenteParadasDocumentoInicial = documento;
        }
          
      }, 300);
  }
 
  formatearDocumentoconForm(documento:any, cual):any {
      let controls=this.form.controls;  
      
      let documentoClon={...documento};
  
      // Agrego campos eliminados de value por los disable()
      documentoClon = this.fn.agregarDisabledFields(documentoClon,controls);
      
      let aux=documentoClon.distanciaPlanificada;
      //console.log("documento.distanciaPlanificada1",aux);

      // Formateo campos de tipo decimal
      for(let i=0; i<this.grilla.camposDecimal.length;i++) {
          let fieldName = this.grilla.camposDecimal[i];
          let value = this.fn.getDocField(documento,fieldName);
          //console.log("xx1 fieldName, value1",fieldName, value);
          if(value!=null) {              
              let valueFloat = this.fn.convertMaskDecimalelToFloat( value, 2);    
              documentoClon = this.fn.setDocField(documentoClon, fieldName, valueFloat);
          }          
      }
      
      if( JSON.stringify(this.documentoOriginal) != JSON.stringify(documentoClon) ) {
            //log(...values('valores','formatearDocumentoconForm documento:',documentoClon));
            //log(...values('valores','controls:',controls));      
            this.documentoOriginal = documentoClon;
      }
      //console.log("documento.distanciaPlanificada2",documentoClon.distanciaPlanificada);
      
      return documentoClon;            
      
  }

  
  

  checkSesiones(){

    this.dia=  new Date();
    // console.log('checkSesiones',this.dia);
  }


  pasoTimer                   : number = 1000;
  timerVotacion               : any    = null;
  duracionVotacion            : number = 0;
  tiempoTranscurrido          : number = 0;
  tiempoVotacion_porcentaje   : number = 100;
  tiempoVotacion_circulo      : number = 0;
  tiempoDisplay               : number = 0;

  startTimerVotacion(duracion:number){
                  
    console.log("startTimerVotacion "+duracion);

    if(duracion){

      //inicializo las variables del timer de votacion
      this.duracionVotacion             = duracion;
      this.tiempoTranscurrido           = 0;
      this.tiempoVotacion_porcentaje    = 100;
      this.tiempoVotacion_circulo       = 0;
      
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
          //   $scope.estado=$scope.ESTADO_CALCULANDO_RESULTADOS;
          //   }).catch(function(error){
          //     $scope.error='stopVotarTimer: '+error;
          //   console.log("stopVotarTimer error ",error);
          //   console.log(error);
          // });
  
};

displayTimerVotacion(){
 console.log("displayTimerVotacion: ");
    if(this.estado!==this.ESTADO_VOTANDO){
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
      this.tiempoVotacion_porcentaje= this.tiempoTranscurrido/ this.duracionVotacion*100;
        
      if(this.tiempoTranscurrido/ this.duracionVotacion<0.25){
        this.colorScheme = {
        domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
      }; 
     }
  
     console.log("displayTimerVotacion: "+  this.tiempoTranscurrido+" - "+this.tiempoVotacion_porcentaje);
    if(this.tiempoTranscurrido>this.duracionVotacion){
      console.log("this.tiempoTranscurrido>this.duracionVotacion: "+  this.tiempoTranscurrido+" - "+this.duracionVotacion+" - "+(this.tiempoTranscurrido>this.duracionVotacion));
      this.stopTimerVotacion();
    }

    }
  };


public multi: any[];
public view: any[] = [300, 300];
public showLegend = false;
public gradient = true;
public colorScheme = {
  domain: ['#2F3E9E', '#D22E2E', '#378D3B', '#0096A6', '#F47B00', '#606060']
}; 
public showLabels = false;
public explodeSlices = false;
public doughnut = false;
public datosTimerVotacion: any[] = [
  {
    name: 'tiempoTranscurrido',
    value: 0
  },
  {
    name: 'tiempoRestante',
    value: 100
  },
  
];

  onSelect(d){
    console.log(d);
}

}

export interface Bancas{
  nombreBanca   : string,
  clase         : string,
  partido       : string,
}

