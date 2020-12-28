: Ejecuta links de la libreria
rem para ejecutar este batch realizar publicar +  nombre de la libreria
rem ejemplo publicar lib-shared

rem Eso se mueve al directorio de la librería, desconecta con un unlink
rem hace el link para que descargue las librerías y luego la publica y retorna al directorio dist

@echo off

set rutaProyecto=%~dp0
set nombreLibreria=%1%
cls

IF "%nombreLibreria%"=="ALL" (
   @echo inicio  Publicacion Librerias y compilacion 
   
   call npm link lib-console
   @echo Finalizo lib-console
   @echo -----------------------------------
   call npm link lib-models
   @echo Finalizo lib-modeles
   @echo -----------------------------------
   call npm link lib-funciones
   @echo Finalizo lib-funciones
   @echo -----------------------------------
   call npm link lib-apis
   @echo Finalizo lib-apis
   @echo -----------------------------------
   call npm link lib-bd
   @echo Finalizo lib-bd
   @echo -----------------------------------
   call npm link lib-shared
   @echo Finalizo lib-shared
   @echo -----------------------------------

   call npm link mod-autorizacion
   @echo Finalizo mod-autorizacion
   @echo -----------------------------------

   call npm link mod-maqueta
   @echo Finalizo mod-maqueta
   @echo -----------------------------------

   call npm link mod-panel
   @echo Finalizo mod-panel
   @echo -----------------------------------
   
) ELSE (   
   
   @echo inicio  Publicacion Libreria %nombreLibreria% y compilacion 
   
   cd ../repositorio
   call instaladorLibrerias %nombreLibreria%

   cd %rutaProyecto%
   call npm link %nombreLibreria%   
)   

@echo inicio el servidor
call ng serve