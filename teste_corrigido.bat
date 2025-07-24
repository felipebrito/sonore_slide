@echo off
echo ========================================
echo    TESTE CORRIGIDO - PHOTO MOSAIC
echo ========================================
echo.

echo Iniciando servidor corrigido...
echo.
echo Acesse: http://localhost:5000
echo.
echo Pressione Ctrl+C para parar
echo.

cd /d "%~dp0app"
start http://localhost:5000
python server_windows.py

pause 