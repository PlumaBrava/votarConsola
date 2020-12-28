// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const settingsWebsite = {
  homeHomeShow          : false,             // Muestra o no la sección Home
  homeRouterLink        : '/seccion/home',  // Link a sección Home
  homeFragment          : 'about',         // Anchor del Link a sección Home

  contactoRouterLink    : '/seccion/home',  // Link a sección contacto
  ContactoFragment      : 'contacto',       // Anchor del Link a sección contacto
  header: {  
      logo:             '../assets/img/logo/lacnog01_transpartente.png',  // Logo que se muestra en el Header
      colorBackground   : '#131562',         // Color de Fondo del Menú
      colorFont         : 'white',          // Color de letra de opciones de Menú e Iconos (#444 / white)
      colorFontActive   : '#FFF',           // Color de letra de opción Activa
      contacto1Fila     : true,             // true,false               - muestra iconos de mail, telefono y redes sociales en 1ra fila
      contactoRedes     : true,             // true,false               - Muestra o no los iconos de Redes Sociales en la 1ra fila de contactos
      contactoTelefono  : 'icono',          // false, 'icono', 'numero' - Muestra o no y de que manera el icono de teléfono en la 1ra fila de contactos
      opcionesMargin    : '10px',           // espacio entre opciones
      opcionesFontSize  : '14px',           // tamaño de letra de las opciones
    
  }  
};
