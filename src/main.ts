import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// platformBrowserDynamic().bootstrapModule(AppModule)
//   .catch(err => console.error(err));

import {AppInjector} from '@maq-modules/page-generica/page-generica.page';  
import {AppInjectorSoap} from '@maq-modules/soap-generica/soap-generica.page';  
platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef) => {
    AppInjector.setInjector(moduleRef.injector);
    AppInjectorSoap.setInjector(moduleRef.injector);
    // console.log('AppInjector',AppInjector);
    // console.log('AppInjector moduleRef',moduleRef);
}).catch(err => console.error(err));   