import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';



import { PageGenerica2 }        from '@maq-modules/page-generica/page-generica2.page';
import { ConfigComponente }     from './novedades.config';


import { Novedades, NovedadesInterface }   from '@proyecto/models/novedades/novedades.model';


import { ExcelService }       from '@maq-servicios/excel/excel.service';


import { environment } from '@environments/environment';

declare let $: any;
declare let jQuery: any;

declare var H: any;  

@Component({
  selector: 'app-novedades',
  templateUrl: './novedades.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './novedades.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class NovedadesComponent extends PageGenerica2<Novedades<NovedadesInterface> > implements OnInit, OnDestroy {



  constructor ( protected changeDetectorRef    : ChangeDetectorRef,
                private excel : ExcelService
              ) {    
      
             super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'NovedadesComponent'));
 


  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit '+this));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });

     // Escondo Menú Izquierdo
    //  let self=this;
    //  setTimeout(function () {
    //     self.appSettings.settings2.panel.showMenu = false;      
    //  }, 500);                   
     
     // Calculo Ancho de Mapa y Listado


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

  
  onProcesarArchivo(evt: any, fileInput1: any) {
    console.log("onProcesarArchivo", evt, fileInput1);


    this.excel.procesarArchivo(evt, fileInput1)
      .then((respuesta: any) => {
        this.fileInput1.nativeElement.value = "";
        console.log("onProcesarArchivo novedades", respuesta);
        var str2=respuesta.replace("json_response:", "");
        var novedades = JSON.parse(str2);
        
        console.log("Archivo leido");
        // console.log(str1);
        // console.log(str2);
        console.log(novedades);
        // console.log(novedades);

        // res.json( novedades['tipos_sesiones']);
        // res.json( novedades['expedientes']);
        // res.json( novedades['apartados_orden_del_dia']);
        // res.json( novedades['orden_del_dia']);
        // console.log(novedades['expedientes'][0].titulo);
        console.log(novedades['orden_del_dia']);

        var mensajeErrorOrdenDelDia = '';

        var news = [];  
        var index = 0;

        var caratula = 0; 
        var subcaratula = 0;

        
        
        for (const orden of novedades['orden_del_dia']) {
            
          

          console.log("Traduciendo Expediente: " + orden.id_expediente);
          novedades['apartados_orden_del_dia'].forEach(function (apartado) {

            var subcaratula = 0;

            if (orden.id_apartado == apartado.id_apartado) {
              switch (orden.id_apartado) {
                case "1":    //"Asuntos Entrados - Comunicaciones Oficiales"
                  caratula = 4;
                  subcaratula = 4;
                  break;
                case "2":    //"Despacho Comisi&oacute;n"
                  caratula = 5;
                  subcaratula = 5;
                  break;

                case "3":    //"Proyectos Entrados"
                  caratula = 6;
                  subcaratula = 6;
                  break;
                case "4":    //"Fuera del Orden del D&iacute;a"
                  caratula = 7;
                  subcaratula = 7;
                  break;
                case "5":    //"Peticiones o Asuntos Particulares"
                  caratula = 8;
                  subcaratula = 8;
                  break;
                case "6":    //Expedientes solicitados por Art 23"
                  return;     //Este caso no se traduce porque no se vota
                // caratula=12;
                // subcaratula=12;
                // break;
                case "7":    //Despacho a comisiones (d)
                  caratula = 9;
                  subcaratula = 9;
                  break;
                case "99":    //"Actas de Sesi&oacute;n"
                  caratula = 10;
                  subcaratula = 10;
                  break;

                default:
                  mensajeErrorOrdenDelDia = mensajeErrorOrdenDelDia + "No se puede traducir apartado : " + orden.id_apartado + "-" + apartado.nombre + "expediente: " + orden.id_expediente + "----------";
                // code block
              }



              novedades['expedientes'].forEach(function (expediente) {
                var nombreBloque = "";
                var siglaBloque = "";
                novedades['bloques'].forEach(function (bloque) {

                  // console.log("bloque",bloque);

                  if (bloque.id_bloque == expediente.id_bloque) {

                    //         "bloques": [
                    //   {
                    //       "id_bloque": "32",
                    //       "nombre": "NUEVO Z&Aacute;RATE",
                    //       "sigla": "N.Z."
                    //   },
                    nombreBloque = bloque.nombre;
                    siglaBloque = bloque.sigla;
                  }
                })



                if (orden.id_expediente == expediente.id_expediente) {
                  // console.log(expediente.titulo);

                  news[index] = {
                    'caratula': caratula, 'subcaratula': subcaratula, 'apartado': apartado.nombre, 'rotulo': "General - " + expediente.nro_expediente
                      + " - " + siglaBloque + " - " + expediente.titulo, 'novedad': expediente.texto
                  };
                  index++;

                  if (expediente.capitulos.length > 0) {
                    expediente.capitulos.forEach(function (capitulo, i) {



                      if (i == 0) {
                        news[index] = {
                          'caratula': caratula, 'subcaratula': subcaratula, 'apartado': apartado.nombre,
                          'rotulo': expediente.nro_expediente + " - Art: " + capitulo.nro_capitulo
                            + " - " + siglaBloque + " - " + expediente.titulo + " :" + capitulo.texto, 'novedad': expediente.titulo + " - " + capitulo.texto
                        };


                      } else {
                        news[index] = {
                          'caratula': caratula, 'subcaratula': subcaratula, 'apartado': apartado.nombre,
                          'rotulo': expediente.nro_expediente + " - Art: " + capitulo.nro_capitulo
                            + " - " + siglaBloque + " :" + capitulo.texto, 'novedad': expediente.titulo + " - " + capitulo.texto
                        };
                      }


                      index++;
                    });
                  } else {

                    // si el expediente no tiene artidulos no se desglosa.

                    // news[index]={'caratula':caratula,'subcaratula':subcaratula,'apartado':apartado.nombre,'rotulo':"-"+ expediente.nro_expediente
                    //   +"-"+  siglaBloque   +"-"+ expediente.titulo,'novedad':expediente.titulo};

                    // console.log({'caratula':caratula,'subcaratula':subcaratula,'apartado':apartado.nombre,'rotulo':"-"+ expediente.nro_expediente
                    // +"-"+ expediente.titulo,'novedad':expediente.titulo});



                  }
                }

              });

              if (orden.id_expediente == "" && orden.id_apartado == "99") {
                console.log("Actas expediente /apartado:" + orden.id_expediente + " - " + orden.id_apartado);
                news[index] = {
                  'caratula': caratula, 'subcaratula': subcaratula, 'apartado': apartado.nombre,
                  'rotulo': "Consideración del acta de sesión Nro: " + orden.nro_sesion
                  , 'novedad': "Consideración del acta de sesión Nro: " + orden.nro_sesion
                };



                index++;

              }
            }
          })
          index++;
        };




        if (!mensajeErrorOrdenDelDia) {
          console.log("Sin errores");

          this.bdService.deleteColeccion2(this.nombreColeccion)
          .then(data=>{

            console.log('data',data);
            console.log('news',news);
            
            let NumOrdenDiaNovedad=1;
            for (const novedad of news) {

              console.log('novedad',novedad);
              if(!novedad){
                continue;
              }
                
              NumOrdenDiaNovedad++;
              console.log('novedad.caratula',novedad.caratula);
              console.log('novedad.subcaratula',novedad.subcaratula);
              console.log('novedad.rotulo',novedad.rotulo);
              let Rotulo:String=novedad.rotulo.length<100?novedad.rotulo:novedad.rotulo.substring(0, 99);
              console.log('novedad.Rotulo .lenght',Rotulo.length);
              console.log('novedad.rotulo .lenght',novedad.rotulo.length);
             
              let Novedad:String=novedad.novedad.length<4000? novedad.novedad:novedad.novedad.substring(0, 3999);
              console.log('novedad.novedad lenght',novedad.novedad.lenght);
              console.log('novedad.Novedad .lenght',Novedad.length);

              // setNovedadOrdenDelDia(index+1,novedad.caratula, novedad.subcaratula,novedad.rotulo,novedad.novedad).then(function(datos){
              let documento:NovedadesInterface={
                NumOrdenDiaNovedad    : NumOrdenDiaNovedad,
                NumOrdenDiaCaratula   : novedad.caratula,
                NumOrdenDiaSubCaratula:novedad.subcaratula,
                Fecha                 : new Date(),   
                Rotulo                : Rotulo.toString(),
                Novedad               : Novedad.toString(),
                Estado                : false 

              }

              this.bdService.updateColeccion2({
                operacion        : 'agregar',
                campoClave       : this.campoClave,
                nombreColeccion  : this.nombreColeccion,
                documento        : documento,
                distribuidorKN   : this.distribuidorKN,
                organizacionKNAI : null,                           
                usuarioKANE      : this.usuarioKANE,
                usaSettings      : this.usaSettings
              })
              .then(respuesta=>{     
                console.log('resupuesta Agregar',respuesta);
              })
              .catch(error=>{
                console.log('error error',error);
              });  
              
            };  
              
         

          })
          .catch(error=>{
            this.fileInput1.nativeElement.value = "";
            console.log('error',error)})

      


          // // Copia los datos almacenados en news en la tabla OrdenesDia_Novedades
          // // Utilizando la función setNovedadOrdenDelDía
          // news.forEach(function (novedad, index) {
          //   setNovedadOrdenDelDia(index + 1, novedad.caratula, novedad.subcaratula, novedad.rotulo, novedad.novedad).then(function (datos) {
          //     // console.log("se copio novedad "+novedad.rotulo);
          //     console.log("se copio novedad " + (index + 1));

          //   }, function (error) {
          //     console.log("error al copiar novedad");
          //     console.log(error);
          //     mensajeErrorOrdenDelDia = "Error al incertar Novedades " + error;
          //   });

          //         });

          // }, function (error) {
          //   console.log("error al borrar novedades");
          //   console.log(error);
          //   mensajeErrorOrdenDelDia = "Error al borrar la tabla de Novedades: " + error;
          // });


        }


        if (mensajeErrorOrdenDelDia) {
          // res.json(mensajeErrorOrdenDelDia);
          console.log('mensajeErrorOrdenDelDia', mensajeErrorOrdenDelDia);
        } else {
          // res.json("Se han copiado  " + news.length + " novedades.");
          console.log("Se han copiado  " + news.length + " novedades.");
        }
      });
  }


}