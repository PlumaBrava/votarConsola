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

import {HttpClient, HttpClientModule}                       from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { ConsolaRoutingModule }     from './consola-routing.module';


import { ConcejalesComponent }              from './components/concejales/concejales.page';
import { DispositivosComponent }            from './components/dispositvos/dispositivos.page';
import { ConcejalesDispositivosComponent }  from './components/concejales-dispositivos/concejales-dispositivos.page';
import { NovedadesComponent }               from './components/novedades/novedades.page';
import { PanelSesionComponent }              from './components/panelSesion/panelSesion.page';

import { DragulaModule }             from 'ng2-dragula';

@NgModule({
  declarations: [
    ConcejalesComponent,
    DispositivosComponent,
    ConcejalesDispositivosComponent,
    NovedadesComponent,
    PanelSesionComponent

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
    ConsolaRoutingModule,
    DragulaModule.forRoot(),
    // HttpClientModule
  ],
  
})
export class ConsolaModule { }
