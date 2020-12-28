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

import { PkOrganizacionesRoutingModule }              from './pk-organizaciones-routing.module';

import { DistribuidoresComponent }             from './components/distribuidores/distribuidores.page';
import { OrganizacionesComponent }             from './components/organizaciones/organizaciones.page';
import { OrganizacionesSucursalesComponent }   from './components/organizaciones-sucursales/organizaciones-sucursales.page';
import { OrganizacionesAreasNegocioComponent } from './components/organizaciones-areas-negocio/organizaciones-areas-negocio.page';
import { OrganizacionesUbicacionesComponent }  from './components/organizaciones-ubicaciones/organizaciones-ubicaciones.page';

import {Injectable, Renderer2} from '@angular/core';

@NgModule({
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  declarations: [
        DistribuidoresComponent, 
        OrganizacionesComponent, 
        OrganizacionesSucursalesComponent, 
        OrganizacionesAreasNegocioComponent, 
        OrganizacionesUbicacionesComponent,
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

    PkOrganizacionesRoutingModule,

  ],
})
export class PkOrganizacionesModule { }

