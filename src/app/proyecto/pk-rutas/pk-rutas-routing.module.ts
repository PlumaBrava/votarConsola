import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RutasComponent }         from './components/rutas/rutas.page';
import { MapatestingComponent }   from './components/mapas/mapatesting/mapatesting.component';
import { MonitorRutasComponent }  from './components/monitor-rutas/monitor-rutas.page';
import { ResumenRutaComponent }   from './components/resumen-ruta/resumen-ruta.page';

const routes: Routes = [
  
  { path: '', redirectTo: 'listado', pathMatch: 'full'},
  { path: 'listado',  component: RutasComponent, data: { breadcrumb: 'moduloRutas.rutas' } },
  { path: 'monitor',  component: MonitorRutasComponent, data: { breadcrumb: 'moduloRutas.monitorRutas' } },
  { path: 'resumen/:nombreRuta/:rutaKey',  component: ResumenRutaComponent, data: { breadcrumb: 'moduloRutas.resumenRuta' } },
  { path: 'mapatesting', component: MapatestingComponent, data: { breadcrumb: 'breadcrumb.mapatesting' } },
  
  { path: '',  component: MapatestingComponent, data: { breadcrumb: 'breadcrumb.tickets' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RutasRoutingModule { }
