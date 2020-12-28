import { log, logIf, logTable, values } from '@maq-console';

import { Component, OnInit, OnDestroy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';

import { PageGenerica }     from '@maq-modules/page-generica/page-generica.page';
import { ConfigComponente } from './resumen-ruta.config';

import { HereService }          from '@maq-servicios/here/here.service';
import { ResumenRutaService }   from './resumen-ruta.service';

import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { formatNumber } from '@angular/common'

import { GeoPoint }     from '@maq-models/geopoint/geopoint.model';
import { Direccion }    from '@maq-models/direccion/direccion.model';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { environment } from '@environments/environment';

declare let $: any;
declare let jQuery: any;

declare var H: any;  

@Component({
  selector: 'app-rutas',
  templateUrl: './resumen-ruta.page.html',
  styleUrls: [
    '../../../../maqueta/modules/page-generica/page-generica.page.scss',
    './resumen-ruta.page.scss'
  ],
  encapsulation: ViewEncapsulation.None
})

export class ResumenRutaComponent extends PageGenerica implements OnInit, OnDestroy {

  constructor (protected changeDetectorRef: ChangeDetectorRef,
               public hereService: HereService,
               public router : Router,
               private activatedRoute : ActivatedRoute,
               public resumenRutaService: ResumenRutaService) {    
    super(changeDetectorRef);    
  }  

  public logComponente = log(...values('componente', 'ResumenRuta'));
  
  // Variables Here
  public map                        : any=null;
  public viewBounds                 : any;
  public geocoderRequest            : any;
  public zoom                       : number = 15;
  public ubicacion                  : Direccion;
  public dif                        : string = Math.floor((99999) * Math.random()).toString();
  
  public ruta:any=null;
  public keyRuta:string=null;
  public listadoRutaParadas:any[]=[];
  
  ngOnInit() {

     log(...values('funcionComponente', 'ngOnInit Rutas'));

     // Listener de Cambio de Idioma
     this.inicializarVariablesTraducibles();
     this.translate.onLangChange.subscribe(() => {
          this.inicializarVariablesTraducibles();
     });
     
     this.keyRuta = this.activatedRoute.snapshot.paramMap.get('keyRuta');         
     
     super.ngOnInit()
     
  }

  ngOnDestroy() {
    super.ngOnDestroy()
    
  }  

  configuracionComponente() {
      
        this.ruta               = this.resumenRutaService.getRuta(this.keyRuta);
        this.listadoRutaParadas = this.resumenRutaService.getParadas(this.keyRuta, this.usuarioKANE, this.organizacionKNAI);
        
        setTimeout (() => {
        
            this.hereService.drawRuta('mapRuta'+this.dif, this.listadoRutaParadas, [],
                                    'ubicacion.direccion.geoPoint', this.organizacionKNAI, this.usuarioKANE, 'ResuemnRuta');
              
        }, 1000);
    
        // --------------------------------------------------------------
        // Configuración del Componente
        // --------------------------------------------------------------          
        let argumentos={};
        
        if(this.tipoPerfilUsuario=='Organizacion' && this.organizacionKNAI) {
          argumentos['grillaWhereArray']=[{ 
              key:      'organizacionKNAI.key', 
              operador: '==', 
              value:    this.organizacionKNAI.key
          }];                    
        }  
        if(this.tipoPerfilUsuario=='Distribuidor' && this.distribuidorKN) {
            argumentos['grillaWhereArray']=[{ 
                key:      'distribuidorKN.key', 
                operador: '==', 
                value:    this.distribuidorKN.key
            }];                    
        }  
      
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
  
}