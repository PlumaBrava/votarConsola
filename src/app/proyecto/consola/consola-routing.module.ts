import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConcejalesComponent }               from './components/concejales/concejales.page';
import { DispositivosComponent }             from './components/dispositvos/dispositivos.page';
import { ConcejalesDispositivosComponent }   from './components/concejales-dispositivos/concejales-dispositivos.page';

const routes: Routes = [
  
  { path: '', redirectTo: 'concejales', pathMatch: 'full'},
  { path: 'concejales',               component: ConcejalesComponent, data: { breadcrumb: 'Concejales' } },
  { path: 'dispositivos',             component: DispositivosComponent, data: { breadcrumb: 'Dispositivos' } },
  { path: 'concejales-dispositivos',  component: ConcejalesDispositivosComponent, data: { breadcrumb: 'Concejales-Dispositivos' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolaRoutingModule { }
