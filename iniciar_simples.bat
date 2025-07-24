@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    PHOTO MOSAIC - VERSÃO SIMPLES
echo ========================================
echo.

echo 1. Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo    Instale Python de: https://python.org
    pause
    exit /b 1
)
echo OK: Python encontrado
echo.

echo 2. Verificando arquivos...
if not exist "app" (
    echo ERRO: Pasta 'app' nao encontrada!
    pause
    exit /b 1
)
if not exist "Fotos" (
    echo ERRO: Pasta 'Fotos' nao encontrada!
    pause
    exit /b 1
)
if not exist "app\server_windows_fixed.py" (
    echo ERRO: server_windows_fixed.py nao encontrado!
    pause
    exit /b 1
)
echo OK: Estrutura de arquivos OK
echo.

echo 3. Verificando fotos...
cd /d "%~dp0Fotos"
set count=0
for %%f in (*.jpg *.jpeg *.png *.gif *.webp) do set /a count+=1
echo OK: Encontradas %count% fotos
if %count%==0 (
    echo AVISO: Nenhuma foto encontrada!
)
echo.

echo 4. Verificando porta 5000...
netstat -an | find "5000" >nul
if not errorlevel 1 (
    echo AVISO: Porta 5000 ja esta em uso!
    echo    Tentando parar processos existentes...
    taskkill /f /im python.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
)

echo 5. Iniciando servidor...
cd /d "%~dp0app"

echo.
echo INICIANDO: Photo Mosaic...
echo URL: http://localhost:5000
echo STOP: Para parar: Pressione Ctrl+C
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5000

python server_windows_fixed.py

echo.
echo OK: Servidor parado com sucesso!
echo FIM: Photo Mosaic finalizado.
pause 