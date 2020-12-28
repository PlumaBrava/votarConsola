import { log, logIf, logTable, values } from '@maq-console';

import { Injectable } from '@angular/core';
import { Observable, throwError, of, Subject } from 'rxjs';

import { BDService }         from '@maq-bd/bd.service';
import { FuncionesService }  from '@maq-funciones';

declare let jQuery: any;

@Injectable({
  providedIn: 'root'
})

export class ResumenRutaService {

  public listadoRutas:any[]=[]; 
  
  public subscripcionRutaParadas:any[]=[];
  public listadoRutaParadas:any[]=[]; 

  constructor(public fn:FuncionesService,
              public bdService : BDService) { 
     
  }

  setRuta(ruta:any) {
      this.listadoRutas[ruta.key]=ruta;
  }

  getRuta(ruta:any) {
      return this.listadoRutas[ruta];
  }


  setParadas(rutaKey, listadoRutaParadas:any) {
      this.listadoRutaParadas[rutaKey]=listadoRutaParadas;
  }

  getParadas(rutaKey:any, usuarioKANE, organizacionKNAI) {
      if(this.listadoRutaParadas[rutaKey]!==undefined) {
         return this.listadoRutaParadas[rutaKey];   
      } else {
         
          // GET Paradas de la Ruta
          if(this.subscripcionRutaParadas[rutaKey]) this.subscripcionRutaParadas[rutaKey].unsubscribe();
          this.subscripcionRutaParadas[rutaKey]=this.bdService	
              .getBDSubscripcion({
                  nombreColeccion  : 'RutasParadas',
                  where            : [{key:'keyRuta', operador:'==', value: rutaKey},
                                      {key:'settings.isBorrado', operador:'==', value:false}],
                  orderBy          : [{key:'fechaHoraInicioPlaneada',ascDesc:'asc'}],
                  limit            : 1000,
                  paginado         : 'primera',
                  organizacionKNAI : organizacionKNAI,
                  usuarioKANE      : usuarioKANE                
              }).subscribe((data:any)=>{
                  log(...values('funcionEnd','bdService.getBDSubscripcion RutasParadas')); 
                  log(...values('valores','subscripcion RutasParadas data:',data));                 
                  
                  this.listadoRutaParadas[rutaKey]=[];
                  for(let j=0; j<data.length; j++) {
                      let documento=data[j];
                      documento=this.fn.corrigeTimestampDocumento(documento);  
                      this.listadoRutaParadas[rutaKey].push(documento);
                  }             
                  log(...values("valores","listadoRutaParadas",this.listadoRutaParadas[rutaKey]));
                  
                  return this.listadoRutaParadas[rutaKey];   

              },(error:any)=>{
                  log(...values("error al obtener RutasParadas",error));
              });         

         
         
         
      }
  }

}
