: Hace varias cosas
: 1 - > batch generaIndex.HTML (actualizo el index.html con los valores del setting)
: 2 - > ng builder (compila la aplicación.)
: 3 - > firebase deploy --only hosting (subo la compilación al hosting de firebase)
: 4 - > copia proyecto/dist/index.html --> proyecto/functions/ssr/index.html  (al index.html generado por la compilación lo copio a functions)
: 5 - > copia src/app/app.settings.json.ts --> functions/settings
: 6 - > firebase deploy --only functions:ssr (subo la última versión de la funcion ssr, con lo cual sube también el archivo functions/ssr/index.html)

@echo off
cls

@echo 1) batch generaIndexHTML (pisa en proyecto/src/index.html) 
@echo --------------------------------------------------------------
call batch generaIndexHTML 

@echo 2) ng builder (al src/index.html le agrega cosas y lo coloca en dist/index.html)
@echo ---------------------------------------------------------------
: call ng build --prod
call ng build 

@echo 3) firebase deploy --only hosting 
@echo --------------------------------------------------------------
call firebase deploy --only hosting

@echo 4) xcopy index.html (build) --> functions\files\ssr 
@echo --------------------------------------------------------------
xcopy /I /Y .\dist\index.html functions\files\ssr\ 

@echo 5) xcopy index.html (build) --> functions\files\environments
@echo --------------------------------------------------------------
xcopy /I /Y .\src\environments\environment.prod.ts functions\files\environments\

@echo 6) xcopy src\app\app.settingsJSON.ts --> functions\files\settings
@echo --------------------------------------------------------------
xcopy /I /Y .\src\app\app.settingsJSON.ts functions\files\settings\

@echo 7) firebase deploy --only functions:ssr (para que actualice el files/ssr/index.html y files/settings/settingsJSON ) 
@echo --------------------------------------------------------------
call firebase deploy --only functions:ssr

