

/* Dispositivos, esta tabla contiene las tables disponibles */
import { Settings }         from '@maq-models/settings/settings.model';

export class Dispositivos<DispositivosInterface> {
  NumDispositivo    : number;
  Dispositivo       : string;
  Serie             : string;
  Imei              : string;
  Macaddresses      : string;
  Estado            : boolean;
  settings          : Settings;

  constructor() {
    this.NumDispositivo   = null;
    this.Dispositivo      = null;
    this.Serie            = null;
    this.Imei             = null;
    this.Macaddresses     = null;
    this.Estado           = null;
    this.settings         = new Settings();
  }
 
}

export interface DispositivosInterface {
  NumDispositivo    : number;
  Dispositivo       : string;
  Serie             : string;
  Imei              : string;
  Macaddresses      : string;
  Estado            : boolean;
}  

