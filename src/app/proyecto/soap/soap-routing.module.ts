import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SoapVehiculosComponent }    from './components/vehiculos/vehiculos.page';
import { SoapEmpleadosComponent }    from './components/empleados/empleados.page';
import { SoapUbicacionesComponent }  from './components/ubicaciones/ubicaciones.page';
import { SoapSesionesComponent }     from './components/sesiones/sesiones.page';

const routes: Routes = [
  { path: '', redirectTo: 'soapVehiculos', pathMatch: 'full'},

  { path: 'soapVehiculos',               component: SoapVehiculosComponent,   data: { breadcrumb: 'soap.conectorVehiculos' } },
  { path: 'soapEmpleados',               component: SoapEmpleadosComponent,   data: { breadcrumb: 'soap.conectorEmpleados' } },
  { path: 'soapUbicaciones',             component: SoapUbicacionesComponent, data: { breadcrumb: 'soap.conectorUbicaciones' } },
  { path: 'soapSesiones/:subComponente', component: SoapSesionesComponent,    data: { breadcrumb: 'soap.conectorUbicaciones' } }
  
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SoapRoutingModule { }
