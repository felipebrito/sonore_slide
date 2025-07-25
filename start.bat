@echo off
cd /d "%~dp0"
echo Photo Mosaic - Iniciando (Universal)...
echo URL: http://localhost:5000
echo Para parar: Ctrl+C
echo.
start http://localhost:5000
python app\server_crossplatform.py
pause 