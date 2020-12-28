: Ejemplos
: batch SQL  						 --> EJECUTA node -r esm batchs/SQL.js
: batch actualizaEstructuraColeccion --> EJECUTA node batchs batchs/actualizaEstructuraColeccion.js

@echo off

set jsName=%1%.js
set parameter1=%2%
set parameter2=%3%

IF "%jsName%"=="sql" (goto NODE_ESM) else goto NODE

:NODE_ESM

	rem @echo --------------------------------------------------------------------------
	rem @echo node -r esm %jsName% %parameter1% %parameter2%
	rem @echo --------------------------------------------------------------------------
	node -r esm batchs/%jsName% %parameter1% %parameter2%

	GOTO FIN

:NODE

	rem @echo --------------------------------------------------------------------------
	rem @echo node %jsName% %parameter1% %parameter2%
	rem @echo --------------------------------------------------------------------------
	rem node batchs/%jsName% %parameter1% %parameter2%
	node -r esm batchs/%jsName% %parameter1% %parameter2%

	GOTO FIN

:FIN

	@echo.
	@echo FIN %jsName% %parameter1% %parameter2%
	@echo.


