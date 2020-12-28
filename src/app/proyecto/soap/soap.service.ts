import { log, logIf, logTable, values } from '@maq-console';

import { Injectable } from '@angular/core';
import { Observable, throwError, of, Subject } from 'rxjs';

import { FuncionesService }  from '@maq-funciones';
import { ApisService }       from '@maq-apis';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Query, QueryFn } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class SoapService {

  public cacheImportados:any[] = [];
  public cacheImportadosObs :Subject<any>[]=[];      

  constructor(public fn:FuncionesService,
              public apis:ApisService,
              private af: AngularFirestore) { 
  }
  
  saveImportados(usuarioKANE, organizacion, keyImportacion, jsonImportados) {
    
    let documento = {
        key             : keyImportacion,
        organizacionKey : this.fn.mostrarKN(organizacion,'key'),
        jsonImportados  : jsonImportados,   
    }
      
    return new Promise((resolve, reject) => {
        
        if(navigator.onLine) {
          this.af.doc('SoapRoadNet/'+keyImportacion).set(documento,{merge:true})
              .then((respuesta) => {
                  // console.log("respuesta",respuesta);

                  this.apis.LogApiFuncion({
                       eventoQueDisparo : 'soap.service:'+keyImportacion,
                       apiFuncionKey    : 'FirestoreDocumentWrite',
                       organizacionKNAI : this.fn.setearKNAI(organizacion),
                       usuarioKANE      : usuarioKANE,
                       nombreColeccion  : 'SoapRoadNet',
                       cloudFunction    : null,
                       cantidad         : 1,
                  });

                  resolve(documento.key+'|mensajes.grabacionOk');
              })
              .catch((error)=>{
                 log(...values("error","error",error));
                 reject(error);
               });
        } else {
            this.af.doc('SoapRoadNet/'+keyImportacion).set(documento);
            resolve('mensajes.operacionOffLine');
        }
    });  
    
  }

  clearImportados(keyImportacion:any) {
    console.log("clearImportados keyImportacion",keyImportacion);

    if(this.cacheImportadosObs[keyImportacion]) {
       this.cacheImportadosObs[keyImportacion].unsubscribe();
    }
    if(this.cacheImportados[keyImportacion]) {
       this.cacheImportados[keyImportacion]=[];    
    }
    
  }  
  
  getImportados(usuarioKANE:any, organizacion:any, keyImportacion:any):Observable<any>{
    console.log("getImportados keyImportacion",keyImportacion);
    let nombreColeccion = 'SoapRoadNet';

    let listado = this.cacheImportados[keyImportacion]; 

    // console.log("xx argumentos.ignoraValoresMemoria",argumentos.ignoraValoresMemoria, nombreListado);
    if(this.cacheImportados[keyImportacion] && 
       Array.isArray(this.cacheImportados[keyImportacion]) && this.cacheImportados[keyImportacion].length>0){
           
        log(...values("valores",nombreColeccion, listado));
        //return of (listado);
        return of (true);

    } else {
        if(!this.cacheImportadosObs[keyImportacion]) {
            this.cacheImportadosObs[keyImportacion]=new Subject<any>();
        }
        
        this.obtenerImportadosBD(usuarioKANE, organizacion, keyImportacion);
        return this.cacheImportadosObs[keyImportacion].asObservable();             
    }
    
  }
  
  obtenerImportadosBD(usuarioKANE:any, organizacion:any, keyImportacion:string) {
    log(...values("funcionGoPromesa","obtenerImportadosBD: obtenerImportadosBD"));
    
    this.af.collection<any>('SoapRoadNet').doc(keyImportacion)
    .valueChanges().subscribe((data:any)=>{

        log(...values("valores","xx getBDActualizacionesSubscripcion OK!!! data:",data));
        log(...values("valores","xx getBDActualizacionesSubscripcion OK!!! keyImportacion:",keyImportacion));
        

        if(data===undefined || data==null) {
            console.log("zzz puso [] keyImportacion",keyImportacion);
            this.cacheImportados[keyImportacion]=[];  
        } else {
            this.cacheImportados[keyImportacion]=data.jsonImportados;  
        }
        
        this.cacheImportadosObs[keyImportacion].next( true );  
        
        let cantDocumentos=(data===undefined) ? 0 : data.length;
        let totalSize=0;
        if(data!==undefined) {
            for(let i=0; i<data.length; i++) {
                let documento = data[i];
                totalSize += this.fn.sizeOfFirestoreDocument('SoapRoadNet',documento);    
            }                
        }
        
        //  log(...values("warning","Disparó FirestoreDocumentRead desde mensaje: "+nombreColeccion));
         this.apis.LogApiFuncion({
              eventoQueDisparo : 'soap.service: obtenerImportadosBD',
              apiFuncionKey    : 'FirestoreDocumentRead', 
              organizacionKNAI : this.fn.setearKNAI(organizacion),
              usuarioKANE      : usuarioKANE,
              nombreColeccion  : 'SoapRoadNet',
              cloudFunction    : null,
              cantidad         : cantDocumentos, 
         });

        //  log(...values("warning","Disparó FirestoreTransferencia desde mensaje: "+nombreColeccion));
         this.apis.LogApiFuncion({
              eventoQueDisparo : 'soap.service: obtenerImportadosBD',
              apiFuncionKey    : 'FirestoreTransferencia', 
              organizacionKNAI : this.fn.setearKNAI(organizacion),
              usuarioKANE      : usuarioKANE,
              nombreColeccion  : 'SoapRoadNet',
              cloudFunction    : null,
              cantidad         : totalSize, 
         });
        
        
    },(error:any)=>{
        log(...values("error","getBDActualizacionesSubscripcion - error:",error));
        this.cacheImportados[keyImportacion]=[];
        
    }) 
  }  
  
}
