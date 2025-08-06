@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    LIMPEZA DE CACHE - PHOTO MOSAIC
echo ========================================
echo.

echo [INFO] Parando processos Python...
taskkill /f /im python.exe >nul 2>&1

echo [INFO] Aguardando 2 segundos...
timeout /t 2 /nobreak >nul

echo [INFO] Verificando porta 5000...
netstat -an | find "5000" >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Liberando porta 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "5000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo [INFO] Cache limpo! Agora execute:
echo     start.bat
echo.
pause 