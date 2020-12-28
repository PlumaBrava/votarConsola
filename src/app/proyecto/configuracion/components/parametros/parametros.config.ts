import { log, logIf, logTable, values } from '@maq-console';

import { FormGroup, FormControl, FormBuilder, Validators, FormsModule } from '@angular/forms';


export class ConfigComponente {

   public grilla                       : any;
   public nombreColeccion              : string;
   public columnasAdicionalesLogTable  : any[];
   public configListadosCache          : any[];
   public arrayFiles                   : any[]; 
   public form                         : any;
   
   constructor(public argumentos:any,
               public fb:any,
               public fn:any) {

      // Colección Principal
      this.nombreColeccion ='Distribuidores';
      this.columnasAdicionalesLogTable = ['direccion.calle','telefono.numeroTelefono1'];
        
      // Seteo Grilla
      this.grilla = {
            paginadoTipo          : 'servidor',    // local / servidor
            orderField            : 'nombre',
            orderReverse          : false,
            orderServer           : ['key', 'nombre'],
            whereArray            : [],
            campoKeywords         : true,
            filtroNombre          : 'nombre',
            filtrosServer         : ['key', 'nombre','direccion.pais','settings.isActivo'],
            paginadoCantidad      : 50,
            paginadoAutoHide      : false,
            verColumnaKey         : false,
      }
      
      // Colecciones Auxiliares
      this.configListadosCache=[];

      this.configListadosCache.push({ 
         nombreListado        : 'listadoAuxIdiomas',
         nombreColeccion      : 'AuxIdiomas',
         where                : argumentos['whereAuxIdiomas'],
         orderBy              : [{ key:'nombre', ascDesc:'asc'}]
      });                
      
      // Configuro FILES gestionados por el formulario   
      this.arrayFiles=[{
         nameField: 'logoIMG',
         type: 'IMG'
      }]; 

      // Formulario
      this.form = this.fb.group({

         key                      : null,
         nombre                   : [null, Validators.compose([Validators.required, Validators.minLength(6)])],
         keywords                 : 'Array',
         email                    : [null, Validators.compose([Validators.required, Validators.email])],
         web                      : [null, Validators.compose([Validators.required])],
         idioma                   : [null, Validators.compose([Validators.required])],
         personaDeContacto        : [null, Validators.compose([Validators.required])],

         logoIMG: this.fb.group({
            link                  : null,
            linkThumb             : null,
            bytes                 : 0,
            bytesThumb            : 0,
         }),

         // croppIMG: this.fb.group({
         //    link: null,
         //    linkThumb: null,
         //    bytes: 0,
         //    bytesThumb: 0,
         // }),

         // manualFILE: this.fb.group({
         //    link: null,
         //    linkThumb: null,
         //    bytes: 0,
         //    bytesThumb: 0,
         // }),

         direccion: this.fb.group({
           calle                  : [null, Validators.compose([Validators.required])],
           numero                 : null,
           bloque                 : null,
           piso                   : null,
           departamento           : null,
           codigoPostal           : null,
           ciudad                 : [null, Validators.compose([Validators.required])],
           partido                : null,
           provinciaKN            : null,
           paisKN                 : [null, Validators.compose([Validators.required])],
           geoPoint:  this.fb.group({
               latitud            : null,
               longitud           : null,
           }),              
           timeZone               : [null, Validators.compose([Validators.required])],
           idiomaPais             : null,
         }),

         telefono: this.fb.group({
           tipoTelefono1          : [null, Validators.compose([Validators.required])],
           numeroTelefono1        : [null, Validators.compose([Validators.required])],
           tipoTelefono2          : null,
           numeroTelefono2        : null,
           tipoTelefono3          : null,
           numeroTelefono3        : null,
           tipoTelefono4          : null,
           numeroTelefono4        : null,
         }),
         
         redSocial: this.fb.group({
           facebook               : null,
           twitter                : null,
           google                 : null,
           instagram              : null,
           linkedin               : null
         }),
         
         settings                 : this.fb.group( this.fn.getSettings() ),

      });
         
   }

}
