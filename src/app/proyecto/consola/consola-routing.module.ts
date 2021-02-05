import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConcejalesComponent }               from './components/concejales/concejales.page';
import { DispositivosComponent }             from './components/dispositivos/dispositivos.page';
import { ConcejalesDispositivosComponent }   from './components/concejales-dispositivos/concejales-dispositivos.page';
import { NovedadesComponent }                from './components/novedades/novedades.page';
import { PanelSesionComponent }              from './components/panelSesion/panelSesion.page';
import { ConsolaSesionComponent }            from './components/consolaSesion/consolaSesion.page';
import { OrdenDelDiaComponent }              from './components/ordenDelDia/ordenDelDia.page';
import { PartidosComponent }                 from './components/partidos/partidos.page';

const routes: Routes = [
  
  { path: '', redirectTo: 'concejales', pathMatch: 'full'},
  { path: 'concejales',               component: ConcejalesComponent,   data: { breadcrumb: 'Concejales' } },
  { path: 'dispositivos',             component: DispositivosComponent, data: { breadcrumb: 'Dispositivos' } },
  { path: 'concejales-dispositivos',  component: ConcejalesDispositivosComponent, data: { breadcrumb: 'Concejales-Dispositivos' } },
  { path: 'novedades',                component: NovedadesComponent,    data: { breadcrumb: 'Novedades' } },
  { path: 'panelSesion',              component: PanelSesionComponent,  data: { breadcrumb: 'PanelSesion' } },
  { path: 'consolaSesion',            component: ConsolaSesionComponent,data: { breadcrumb: 'Consola de Sesion' } },
  { path: 'ordenDelDia',              component: OrdenDelDiaComponent,  data: { breadcrumb: 'Orden del día' } },
  { path: 'partidos',                 component: PartidosComponent,     data: { breadcrumb: 'Partidos' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolaRoutingModule { }
