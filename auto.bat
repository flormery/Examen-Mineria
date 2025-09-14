@echo off
echo 🔄 Iniciando ejecución de noticias_diarias.py...

REM Activar entorno virtual con ruta completa
call "D:\Trabajos 8 ciclo\IA\IA\envprueba\Scripts\activate.bat"

IF ERRORLEVEL 1 (
    echo ❌ Error al activar el entorno virtual.
    exit /b 1
) ELSE (
    echo ✅ Entorno virtual activado correctamente.
)
"D:\Trabajos 8 ciclo\IA\IA\envprueba\Scripts\python.exe" --version
echo 🟢 Entorno virtual activado: %VIRTUAL_ENV%
echo 🟢 Ejecutando script Python...

REM Ejecutar el script Python desde el entorno virtual
"D:\Trabajos 8 ciclo\IA\IA\envprueba\Scripts\python.exe" "C:\Users\Usuario\scrips\datos.py"

IF ERRORLEVEL 1 (
    echo ❌ Error al ejecutar el script Python.
    exit /b 1
) ELSE (
    echo ✅ Script ejecutado correctamente.
)

echo 🟢 Proceso finalizado.
pause