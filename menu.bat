: Este programa, muestra un menú con todos los batchs disponibles
REM https://todohacker.com/tutoriales/lenguaje-batch
REM acentos definición acentos.txt

@echo off
cls

setlocal EnableDelayedExpansion
rem Get TAB character
set TAB=%%b

color 0A 
@echo.
@echo   MENé BATCHs disponibles
@echo.
@echo   NRO NOMBRE                                 DESCRIPCIàN
@echo   ---------------------------------------------------------------------------------------------------------------------
@echo    1  sql                                    Ejecuta Querys en Firestore con FireSQL
@echo    2  listadoColeccionesDefinidasEnModeles   Lista todas las Colecciones definidas en la carpeta Models
@echo    3  copyColeccion                          Copia una Colecci¢n y sus documentos a una nueva con otro Nombre
@echo    4  renameColeccion                        Renomabra una Colecci¢n
@echo    5  renameFieldColeccion                   Renomabra el campo de una Colecci¢n
@echo    6  verificaEstructuraColeccion            Verifica el Modelo definido de una Colecci¢n vs Documentos Grabados
@echo    7  actualizaEstructuraColeccion           Egrega o Quita Campos a una Colecci¢n Existente en base a su Modelo
@echo    8  recalculaCantDocumentos                Recalcula la cantidad de documentos por Colecci¢n (tabla Colecciones)
@echo    9  recalculaSizeOfDocumentos              Recalcula la cantidad de bytes de cada documento(settings.sizeOfDocumento)
@echo   10  actualizaSettings                      Actualiza los campos de settings, en todas las colecciones 
@echo   13  borrarColeccion                        Borra una Colecci¢n

rem @echo   11  replicaDocumentoEnBaseAForeingKeys     Replica Documento en Colecciones Referencianciadas (definidas en Colecciones)
rem @echo   12  insertaColeccion                       Inserta el Contenido de un Mock en una Colecci¢n (customizar antes de usar)

@echo.
@echo   51  sintaxisConsoleLog                     Muestra ejemplos de uso de todas las funciones definidas de uso de Consola
@echo   52  sintaxisPromesa                        Muestra un ejemplo de una promesa
@echo   53  sintaxisPromesaAwait                   Muestra un ejemplo de una promesa con Await
@echo.

REM echo   Indique el Nro de BATCH a Ejecutar
set /p opcion= "  Indique el Nro de BATCH a Ejecutar: "

cls
color 0F 

if "%opcion%" == "1"   batch sql 
if "%opcion%" == "2"   batch listadoColeccionesDefinidasEnModels 
if "%opcion%" == "3"   batch copyColeccion 
if "%opcion%" == "4"   batch renameColeccion 
if "%opcion%" == "5"   batch renameFieldColeccion 
if "%opcion%" == "6"   batch verificaEstructuraColeccion 
if "%opcion%" == "7"   batch actualizaEstructuraColeccion 
if "%opcion%" == "8"   batch recalculaCantDocumentos 
if "%opcion%" == "9"   batch recalculaSizeOfDocumentos 
if "%opcion%" == "10"  batch actualizaSettings 
if "%opcion%" == "11"  batch replicaColeccionEnBaseAForeingKeys 
if "%opcion%" == "12"  batch insertaColeccion 
if "%opcion%" == "13"  batch borrarColeccion 

if "%opcion%" == "51"  batch sintaxisConsoleLog 
if "%opcion%" == "52"  batch sintaxisPromesa 
if "%opcion%" == "53"  batch sintaxisPromesaAwait 

