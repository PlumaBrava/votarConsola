

/* Dispositivos, esta tabla contiene las tables disponibles */

export class Dispositivos<DispositivosInterface> {
  NumDispositivo:	number;
  Dispositivo:	string;
  Serie:	string;
  Imei:	string;
  Macaddresses:	string;
  Estado:	boolean;

  constructor(init?:Partial<DispositivosInterface>) {
    Object.assign(this, init);
  }
 
}

export interface DispositivosInterface {
  NumDispositivo:	number;
  Dispositivo:	string;
  Serie:	string;
  Imei:	string;
  Macaddresses:	string;
  Estado:	boolean; 
}  

