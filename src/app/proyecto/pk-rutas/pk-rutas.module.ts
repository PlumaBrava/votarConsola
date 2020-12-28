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

import { RutasRoutingModule } from './pk-rutas-routing.module';

import { MonitorRutasComponent }     from './components/monitor-rutas/monitor-rutas.page';
import { ResumenRutaComponent }      from './components/resumen-ruta/resumen-ruta.page';
import { RutasComponent }            from './components/rutas/rutas.page';
import { RutasVehiculosComponent }   from './components/rutas-vehiculos/rutas-vehiculos.page';
import { RutasIntegrantesComponent } from './components/rutas-integrantes/rutas-integrantes.page';
import { RutasParadasComponent }     from './components/rutas-paradas/rutas-paradas.page';
import { MapatestingComponent }      from './components/mapas/mapatesting/mapatesting.component';

import {Injectable, Renderer2} from '@angular/core';

import { DragulaModule }             from 'ng2-dragula';

@NgModule({
  declarations: [
    MonitorRutasComponent,
    ResumenRutaComponent,
    RutasComponent,
    RutasVehiculosComponent,
    RutasIntegrantesComponent,
    RutasParadasComponent,
    MapatestingComponent
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
    RutasRoutingModule,
    DragulaModule.forRoot(),
  ],
  
})
export class PkRutasModule { }
