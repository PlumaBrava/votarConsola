: Ejecuta npm install y corre parche posterior
@echo off
set rutaProyecto=%~dp0

cls

@echo Inicio ejecucion de npmInstall

call npm install

rem  /D copia si hay modificaciones entre los archivos de origen y destino
rem  /E crea los directorios
rem  /I  force xcopy to assume that destination is a directory. If you don't use this option, and you're copying from source that is a directory or group of files and copying to destination that doesn't exist, the xcopy command will prompt you enter whether destination is a file or directory.
rem  /C This option forces xcopy to continue even if it encounters an error.
rem  /h The xcopy command does not copy hidden files or system files by default but will when using this option.
rem  /y Use this option to stop the xcopy command from prompting you about overwriting files from source that already exist in destination

xcopy  /H /Y /E /I /C %rutaProyecto%\archivosAPisar\exif-js %rutaProyecto%\node_modules\exif-js 

@echo Finalizo ejecucion de npmInstall