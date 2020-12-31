import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';



import { ConcejalesComponent }   from './components/concejales/concejales.page';

const routes: Routes = [
  
  { path: '', redirectTo: 'concejales', pathMatch: 'full'},
  { path: 'concejales',  component: ConcejalesComponent, data: { breadcrumb: 'Concejales' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConsolaRoutingModule { }
