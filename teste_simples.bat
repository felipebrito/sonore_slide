@echo off
echo ========================================
echo    TESTE SIMPLES - PHOTO MOSAIC
echo ========================================
echo.

echo Iniciando servidor de teste...
echo.
echo Acesse: http://localhost:5000/teste_simples.html
echo.
echo Pressione Ctrl+C para parar
echo.

cd /d "%~dp0app"
start http://localhost:5000/teste_simples.html
python server_windows.py

pause 