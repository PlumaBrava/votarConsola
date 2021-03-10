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
      baseDatos         : 'mssql',          // firestore o sql mssql
      storage           : 'firebase',       // firebase  o externo
  },  
  firebase:  {
    
      apiKey: "AIzaSyDhfYMODqKHZKniFh32d2xVNEw4kqfD2fs",
      authDomain: "monitoreo-lotes.firebaseapp.com",
      projectId: "monitoreo-lotes",
      storageBucket: "monitoreo-lotes.appspot.com",
      messagingSenderId: "74020957610",
      appId: "1:74020957610:web:f1aea8e5ed056dabd40fd3",
      measurementId: "G-8SBNDDMG9E"
  
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
