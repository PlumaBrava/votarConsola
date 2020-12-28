// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production            : false,
  enConstruccion        : false,
  consoleLog            : { header:true, funciones: true, variables:true },  
  cliente               : 'votar',
  tipoServidor: {  
      hosting           : 'firebase',       // firebase  o externo
      login             : 'firebase',       // firebase  o sql
      baseDatos         : 'mssql',      // firestore o sql mssql
      storage           : 'firebase',       // firebase  o externo
  },  
  firebase:  {
    apiKey              : "AIzaSyAkXFqrScONZ7AASG2hEhsPcHufIMv-R9w",
    authDomain          : "pktest-ad982.firebaseapp.com",
    databaseURL         : "https://pktest-ad982.firebaseio.com",
    projectId           : "pktest-ad982",
    storageBucket       : "pktest-ad982.appspot.com",
    messagingSenderId   : "337905291103",
    appId               : "1:337905291103:web:d9b903a336a8d2016070ea",
    measurementId       : "G-PVT1D62P8G"
  },
  cloudFunction: {
    url: 'https://us-central1-testcpsistemas.cloudfunctions.net/'
  },  
  serviciosExternos: {
    hosting: {
        documentoRoot   : 'planifi-k/www',
    },
    sql: {
        apiURL          : 'http://localhost:3000/',           //Desarrollo
    },
    storage: {
        serverURL       : 'https://www.lincolnonline.com.ar/archivos/',        //Desarrollo
        user            : '',
        password        : '',
    },  
  },
  apis: {
    reCAPTCHA: {
      version       : 'v2',            
      claveSitioWeb : null,
      claveSecreta  : null
    },        
    googleMaps: { 
       key              : 'AIzaSyC3kGKOR7hsNhR6JjZFMbZnj8tmYcX5klI'
    },
    hereMaps: {
      apiKey      : 'mZeC5JXRMPDpsq7EbaM4ZZEgluoM-I4W8bPrET2LY9Q',  // Santiago
      app_id      : '4nYLZClXQgWpOEMKScrE',  // Javier
      app_code    : 'H-zbneNbZ5LfWj8CAjGjHw' // Javier
    },
    facebook: {
       app_id     : '',   // APP ID de la Fun Page de Facebook
    }
  }  
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
