import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DistribuidoresComponent }             from './components/distribuidores/distribuidores.page';
import { OrganizacionesComponent }             from './components/organizaciones/organizaciones.page';
import { OrganizacionesAreasNegocioComponent } from './components/organizaciones-areas-negocio/organizaciones-areas-negocio.page';
import { OrganizacionesSucursalesComponent }   from './components/organizaciones-sucursales/organizaciones-sucursales.page';
import { OrganizacionesUbicacionesComponent }  from './components/organizaciones-ubicaciones/organizaciones-ubicaciones.page';

const routes: Routes = [
  { path: '', redirectTo: 'listadoOrganizaciones', pathMatch: 'full'},

  { path: 'listadoDistribuidores', component: DistribuidoresComponent, data: { breadcrumb: 'breadcrumb.listadoDistribuidores' } },
  { path: 'listadoOrganizaciones', component: OrganizacionesComponent, data: { breadcrumb: 'breadcrumb.listadoOrganizaciones' } },
  { path: 'fichaOrganizacion',     component: OrganizacionesComponent, data: { breadcrumb: 'breadcrumb.fichaOrganizacion' } },
  { path: 'listadoAreasNegocio',   component: OrganizacionesAreasNegocioComponent, data: { breadcrumb: 'breadcrumb.listadoAreasNegocio' } },
  { path: 'listadoSucursales',     component: OrganizacionesSucursalesComponent, data: { breadcrumb: 'breadcrumb.listadoSucursales' } },
  { path: 'listadoUbicaciones',    component: OrganizacionesUbicacionesComponent, data: { breadcrumb: 'breadcrumb.listadoUbicaciones' } },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PkOrganizacionesRoutingModule { }
