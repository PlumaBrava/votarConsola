: angular\proyecto\copyServe.bat
: ---------------------------------------------------------------------------
: 1. Ejecuta el bat angular\public\copyPublic.bat 
: 2. A continuación dispara: angular\proyecto\ng serve
: ---------------------------------------------------------------------------
: copyPublic copia todo el contenido de angular\public\ en todos los proyectos
: ----------------------------------------------------------------------------
: angular\proyecto\copyPublic

@echo off

set rutaProyecto=%~dp0
cls
  
@echo inicio  ejeución copyPublic

cd ../public
call copyPublic

cd %rutaProyecto%

@echo inicio el servidor
call ng serve