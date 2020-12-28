import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParametrosComponent }             from './components/parametros/parametros.page';

const routes: Routes = [
  { path: '', redirectTo: 'listadoOrganizaciones', pathMatch: 'full'},

  { path: 'listadoOrganizaciones', component: ParametrosComponent, data: { breadcrumb: 'breadcrumb.listadoDistribuidores' } },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigruacionRoutingModule { }
