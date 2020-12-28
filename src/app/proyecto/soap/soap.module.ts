import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule ,ReactiveFormsModule} from '@angular/forms';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { NgxPaginationModule } from 'ngx-pagination';

import { NgxMaskModule, IConfig } from 'ngx-mask' // mascaras para inputs  https://www.npmjs.com/package/ngx-mask
export const options: Partial<IConfig> | (() => Partial<IConfig>)={};
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Routes, RouterModule, PreloadAllModules  } from '@angular/router';
// import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from '@maq-shared/shared.module';

// import {HttpClient, HttpClientModule}                       from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { SoapRoutingModule }              from './soap-routing.module';

import { SoapVehiculosComponent }    from './components/vehiculos/vehiculos.page';
import { SoapEmpleadosComponent }    from './components/empleados/empleados.page';
import { SoapSesionesComponent }     from './components/sesiones/sesiones.page';
import { SoapUbicacionesComponent }  from './components/ubicaciones/ubicaciones.page';
import { SoapRutasComponent }        from './components/rutas/rutas.page';

import { SoapService }               from './soap.service';
import { AngularHereService } from '@maq-servicios/here/angularHere.service';
@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
        SoapService,
        // AngularHereService
  ],
  declarations: [
        SoapVehiculosComponent,
        SoapEmpleadosComponent,
        SoapSesionesComponent,
        SoapUbicacionesComponent,
        SoapRutasComponent
  	],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MultiselectDropdownModule,
    NgbModule,
    PerfectScrollbarModule,
    SharedModule,
  
    NgxMaskModule.forRoot(options), //mascaras
       
    NgxPaginationModule,

    SoapRoutingModule,

  ],
})
export class SoapModule { }

