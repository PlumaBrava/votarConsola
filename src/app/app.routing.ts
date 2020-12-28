import { Routes, RouterModule, PreloadAllModules, RouterState  } from '@angular/router';
import { ModuleWithProviders }          from '@angular/core';

import { environment }          from './../environments/environment';

/* Panel */
import { PrincipalComponent }           from './maqueta/panel/componentes/principal/principal.component';
import { NotFoundComponent }            from './maqueta/panel/componentes/errors/not-found/not-found.component';
import { EnConstruccionComponent }      from './maqueta/panel/componentes/errors/en-construccion/en-construccion.component';
import { UsuarioNoAutorizadoComponent } from './maqueta/panel/componentes/usuario-no-autorizado/usuario-no-autorizado.page';
import { childrenPublicAdmin }          from './app.routing.public';

//import { PanelWebPage } from './maqueta/panelWeb/panel-web-page/panel-web.page';

/* Guards */
import { CanActivateViaAuthGuard } from '@maq-autorizacion/guards/can-activate-via-auth-guard';
import { CanActivateViaNoAuthGuard } from '@maq-autorizacion/guards/can-activate-via-no-auth-guard';
import { CanActivateChildViaAuthGuard } from '@maq-autorizacion/guards/can-activate-child-via-auth-guard';
import { CanActivateChildViaNoAuthGuard } from '@maq-autorizacion/guards/can-activate-child-via-no-auth-guard';


export const routes: Routes = [
  {
    path: '', component: PrincipalComponent,
    
    children:[       
        { path: '', redirectTo: 'usuarios', pathMatch: 'full'},      
        
        /* Modulos de del proyecto */
        { path: 'rutas'                   ,loadChildren: () => import('@proyecto/pk-rutas/pk-rutas.module').then(m => m.PkRutasModule), data: { breadcrumb: 'breadcrumb.rutas' },  canActivate: [CanActivateViaAuthGuard]  },        
        // { path: 'organizacion'            ,loadChildren: () => import('@proyecto/pk-organizaciones/pk-organizaciones.module').then(m => m.PkOrganizacionesModule), data: { breadcrumb: 'breadcrumb.usuarios' },  canActivate: [CanActivateViaAuthGuard]  },                
        { path: 'organizacion'            ,loadChildren: () => import('@proyecto/configuracion/configuracion.module').then(m => m.ConfiguracionModule), data: { breadcrumb: 'breadcrumb.usuarios' }, canActivate: [CanActivateViaAuthGuard]  },                
        
        { path: 'conectorRoadNet'         ,loadChildren: () => import('@proyecto/soap/soap.module').then(m => m.SoapModule), data: { breadcrumb: 'soap.conectoresRoadNet' },  canActivate: [CanActivateViaAuthGuard]  },                
    ]
  },
  
  //Hace: cambiar login por autorización y mover a este modulo, usuarioNoAutorizado
  { path: 'login', loadChildren: () => import('@maq-autorizacion/autorizacion.module').then(m => m.AutorizacionModule) } ,
  { path: '**', component: NotFoundComponent }
  
];



export const concatPublic = function(routes) {
  if (!environment.enConstruccion){
    routes[0].children = routes[0].children.concat(childrenPublicAdmin)
    //console.log("newRoutes",routes);
    return routes;
    
  } else {
      return [{ path: '**', component: EnConstruccionComponent } ];
  }
};

export const routing: ModuleWithProviders = RouterModule.forRoot( concatPublic(routes), {
  // preloadingStrategy: PreloadAllModules,  // <- uncomment this line for disable lazy load
  // useHash: true
   // enableTracing: true  // <-- debugging purposes only
});

