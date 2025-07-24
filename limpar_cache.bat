@echo off
echo ========================================
echo    LIMPEZA DE CACHE - PHOTO MOSAIC
echo ========================================
echo.

echo [INFO] Parando processos Python...
taskkill /f /im python.exe >nul 2>&1

echo [INFO] Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo [INFO] Verificando porta 5000...
netstat -an | find "5000" >nul
if not errorlevel 1 (
    echo [AVISO] Porta ainda em uso! Forcando limpeza...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "5000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
)

echo [OK] Cache limpo! Agora execute:
echo     iniciar_windows_final.bat
echo.
pause 