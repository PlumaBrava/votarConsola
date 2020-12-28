export const SETTINGS_DATA = {      
   
       equipo: {
            versionSO             : null,              // Versión del SO
            plataforma            : null,             // web-ios-android
            isEmulador            : null,             // es un emulador o un caso real
            screenWidth           : null,            // ancho disponible
            screenHeigth          : null,           // alto disponible
            fabricante            : null,             // fabricante
            modelo                : null,                 // fabricante
            batteryLevel          : null,           // Nivel de bateria
            estado                : null,                 // Activo-Background-Kill
            isOnLine              : false,
            tieneServicioDatos    : null,
            lenguaje              : null
       },

       app: {
          name                    : 'PKMOVIL',
          title                   : 'PKMOVIL',
          descripcion             : 'Sistema de Trackeo de Rutas',
          keywords                : 'planifi-k, trackeo, logistica, rutas',
          author                  : 'CP SISTEMAS',                       
          manejaDistribuidores    : true,
          manejaOrganizaciones    : true,
          tipoMapa                : 'hereMaps',   // googleMaps, hereMaps
          idiomasHabilitados      : ['es','en','pt'],
          idiomaDefault           : 'es',
          regionDefault           : 'America/Argentina/BsAs',
          modulos: {
            autorizacion: {
               habilitado         : true,            // true / false. (false no utiliza Login)
               loginOffLine       : false,           // false / true. (En true verifica login anterior en localStorage)
               tipoRegistracion   : 'invitacion',    // 'invitacion', 'formulario'
               logDisponibles:{
                  google          : true,
                  facebook        : false,
                  twitter         : false
               },
            }   
          },
          smtp: {
              host       : 'smtp.gmail.com',
              port       : '465',
              email      : 'nutralmix.logistica@gmail.com',
              password   : 'xkbnvbfjeajlodmb',   // Obtenido en https://security.google.com/settings/security/apppasswords
              tls        : false,
              tlsCifrado : null,
              debug      : false,
              logger     : false
          }     
       },
       
       panel: {
            aplicacionKey         : 'pkMobilityPanel',   // Key definido en Aux Aplicaciones
            headerTitle           : 'PKMOVIL', //'NutralMix',
            footerTitle           : null,
            
            menu                  : 'vertical', //horizontal , vertical
            menuType              : 'default', //default, compact, mini
            showMenu              : true,
            navbarIsFixed         : true,
            footerIsFixed         : false,
            sidebarIsFixed        : true,
            showSideChat          : false,
            sideChatIsHoverable   : true,
            showSkin              : true,  // Permite o no cambiar el skin x default definido abajo
            skin                  : 'kipbip',  // kipbip, light , dark, blue, green, combined, purple, orange, brown, grey, pink
            funcionalidadesDisponibles: {
               traductions        : true,
               fullscreen         : true,
               applications       : true,
               sideChat           : true,
               messages           : true,
               userMenu           : true,
               cotizaciones       : false,
               mostrarOnLine      : true
            },
       },
       
       cotizaciones: {
         dolarOficial: {
            api: null,             // DolarSi, null
            cual: null,            // Compra, Promedio, Venta, Venta-$
            pesosRestados: null,
         }, 
         dolarDivisa: {
            api: null,             // DolarSi, null
            cual: null,            // Compra, Promedio, Venta, Venta-$
            pesosRestados: null,
          }, 
          dolarBlue: {
            api: null,             // DolarSi, null
            cual: null,            // Compra, Promedio, Venta, Venta-$
            pesosRestados: null,
          }, 
       },
       
       appCelular: {
         aplicacionKey    : 'pkMobilityApp',   // Key definido en Aux Aplicaciones
      },
       
       webSite: {
         aplicacionKey    : null,   // Key definido en Aux Aplicaciones
         fontFamily       : 'Roboto'   // Roboto, Heebo, ...  (hay que incluirla en el batch generaIndexHTML.js)
       },
       
       cliente: {
         nombre                   : 'Planifi-K SRL',// 'NutralMix SRL',
         web                      : 'https://pktest-ad982.web.app', //http://www.lanacion.com.ar',
         email                    : 'perez.juan.jose@gmail.com',
         email2                   : null,
         copyrightYear            : '2020',
         favicon                  : '../assets/favicon/favicon.png',  
         logo                     : '../assets/imagenes/cliente/KipBip_logo_header_ver2_blanco.png',          // Logo Cliente. Se muestra en la cabecera del menu
         logoMetatags             : 'https://pktest-ad982.web.app/assets/imagenes/cliente/KipBip_logo_header_ver2_blanco.png',  
         logos: {
            landing       : '../assets/imagenes/cliente/kipbip_landing.gif',
            panelHeader   : '../assets/imagenes/cliente/KipBip_logo_header_ver3_transparente.png',
            celularHeader : '../assets/imagenes/cliente/KipBip_logo_header_ver2_blanco.png',
            login         : '../assets/imagenes/cliente/KipBip_logo_login.png',
            loading       : '../assets/imagenes/cliente/kipbip_loading.gif',
            metatags      : 'https://pktest-ad982.web.app/assets/imagenes/cliente/KipBip_logo_header_ver2_blanco.png'  // tiene que ser la ruta completa con http
         },         
            
         direccion:        {
            calle                 : 'Santa Fe',
            numero                : '3233',
            bloque                : null,
            piso                  : '1',
            departamento          : 'C',
            codigoPostal          : '1425',
            ciudad                : 'Ciudad Autónoma de Buenos Aires',
            partido               : 'Comuna 2',
            provinciaKN:   {
               key                : 'AR-B',
               nombre             : 'Buenos Aires'
            },   
            paisKN: {
               key                : 'AR',
               nombre             : 'Argentina'
            },   
            geoPoint: {
               latitud            : null,
               longitud           : null
            },   
            timeZone              : 'Argentina/BsAs',
            idiomaPais            : 'es-AR'
         },
         
         telefono: {
            tipoTelefono1         : '011 4323 4323',
            numeroTelefono1       : 'laboral',
            tipoTelefono2         : null,
            numeroTelefono2       : null,
            tipoTelefono3         : null,
            numeroTelefono3       : null,
            tipoTelefono4         : null,
            numeroTelefono4       : null,
         },
         
         redSocial: {
            facebook              : 'https://www.facebook.com/planifi-k',
            twitter               : null,
            google                : null,
            instagram             : null,
            pinterest             : null,
            linkedin              : null,
         }       
       }
 }
 