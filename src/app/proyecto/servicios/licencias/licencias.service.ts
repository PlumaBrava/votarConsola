import { log, logIf, logTable, values } from '@maq-console';

import { Injectable } from '@angular/core';
import { Usuario}          from '@maq-models/usuarios/usuarios.model';

import { FuncionesService }  from '@maq-funciones';
import { ApisService }       from '@maq-apis';

import { AngularFirestore,  Query } from '@angular/fire/firestore';
import { BDService }         from '@maq-bd/bd.service';

import { MensajesService }   from '@maq-servicios/mensajes/mensajes.service';
import { KN, KANE, KNAI }    from '@maq-models/typesKN/typesKN.model';

@Injectable({
  providedIn: 'root'
})

export class LicenciasService {

   // Licencias
   public subscRutasActivasDiarias = null;
   public subsDiaExcesoLicencias = null;
   public seSuperoLimiteLicenciaPermitidas:boolean=false;
   public bloqueadoPorLicencias:boolean=false;
   
   public usuario              : Usuario;
   public usuarioKANE          : KANE=null;
   public organizacionKNAI     : KNAI=null;
   public distribuidorKN       : KN=null;



   public OrganizacionKey      : string;
   public fecha_AAAAMMDD       : string;
   public cantidadExcesosMes   : number=0;
   
  constructor(public fn:FuncionesService,
              public apis:ApisService,
              public msg:MensajesService,
              public bdService  :BDService,
              private af: AngularFirestore) { 

                this.msg.getPerfil().subscribe(usuario=>{
                  
                  console.log('licenciasService, usuario',usuario);
          

                  this.usuario=usuario;
                  this.usuarioKANE              = this.fn.setearKANE(this.usuario);
                  this.organizacionKNAI         = this.fn.setearOrganizacionKNAI(this.usuario.organizacion);
                  this.distribuidorKN           = this.fn.setearKN(this.usuario.distribuidor);


                  if(this.usuario && this.usuario.organizacion){
                    this.OrganizacionKey=this.usuario.organizacion.key;
                    this.fecha_AAAAMMDD=this.fn.getFechaActual('AAAAMMDD');
                  }
                });

                this.geRutasActivasDiarias();
                this.getExcesosMensuales();
      
  }
  
 
  geRutasActivasDiarias(){

      this.subscRutasActivasDiarias=this.af.collection<any>('RutasActivasDiarias',
      ref => ref.where('key', '==', this.OrganizacionKey+this.fecha_AAAAMMDD)).valueChanges({ idField: 'id' })
      .subscribe((data:any)=>{
          console.log('licenciasService subscRutasActivasDiarias',data);
          let cantidadRutasActivas=data.length>0 ? data[0].cantidadRutasActivas:0;
          console.log(' licenciasService subscRutasActivasDiarias this.usuario',this.usuario);
          if(this.usuario && this.usuario.organizacion && this.usuario.organizacion.esquemaComercial){
              let cantidadLicencias=this.usuario.organizacion.esquemaComercial.cantidadLicencias;
          
          
              let porcentajeExcesoPermitido=this.usuario.organizacion.esquemaComercial.porcentajeExcesoPermitido;
              console.log('licenciasService cantidad licencias excedidas',cantidadLicencias*(1+porcentajeExcesoPermitido/100));
              console.log('licenciasService cantidad licencias cantidadRutasActivas',cantidadRutasActivas);
              this.seSuperoLimiteLicenciaPermitidas=false;
              if(cantidadLicencias*(1+porcentajeExcesoPermitido/100)<cantidadRutasActivas){
                  console.log('licenciasService cantidad licencias excedidas',data);
                  this.seSuperoLimiteLicenciaPermitidas=true;
                  let mes=this.fn.getFechaActual('AAAAMM');
                  let doc= {
                      key:this.OrganizacionKey+this.fecha_AAAAMMDD,
                      cantidadRutasActivas:cantidadRutasActivas,
                      mes: mes,
                      orgMes: this.OrganizacionKey+mes
                  };
                  this.bdService.updateColeccion({
                      operacion        : 'modificar',
                      nombreColeccion  : 'DiaExcesoLicencias',
                      documento        : doc,
                      distribuidorKN   : this.distribuidorKN,
                      organizacionKNAI : this.organizacionKNAI,                           
                      usuarioKANE      : this.usuarioKANE
                  })

                  
              }
          }
          
      });

  }

  getExcesosMensuales(){
      let orgMes= this.OrganizacionKey+this.fn.getFechaActual('AAAAMM');
      this.subsDiaExcesoLicencias=this.af.collection<any>('DiaExcesoLicencias',
      ref => ref.where('orgMes', '==', orgMes)).valueChanges({ idField: 'id' })
      .subscribe((data:any)=>{
          console.log('licenciasService subsDiaExcesoLicencias',data);
          if(this.usuario && this.usuario.organizacion && this.usuario.organizacion.esquemaComercial){
            this.cantidadExcesosMes=data.length;
            let cantidadVecesExcesoPermitido=this.usuario.organizacion.esquemaComercial.cantidadVecesExcesoPermitido;
            let licenciasConBloqueo=this.usuario.organizacion.esquemaComercial.licenciasConBloqueo;
            this.bloqueadoPorLicencias=false;
            if(licenciasConBloqueo && this.cantidadExcesosMes>cantidadVecesExcesoPermitido){
                this.bloqueadoPorLicencias=true;
            }
          }

        
      });

  }
}
