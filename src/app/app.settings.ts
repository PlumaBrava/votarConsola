import { Injectable }    from '@angular/core';
import { AppSettings2 }  from '@maq-models/appSettings/appSettings.model';
import { SETTINGS_DATA } from './app.settingsJSON'; 

@Injectable()
export class AppSettingsService {

   public settings2 = new  AppSettings2(SETTINGS_DATA);   

}