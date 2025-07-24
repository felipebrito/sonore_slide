@echo off
cd /d "%~dp0app"
echo Photo Mosaic - Iniciando...
echo URL: http://localhost:5000
echo Para parar: Ctrl+C
echo.
start http://localhost:5000
python server_windows_fixed.py
pause 