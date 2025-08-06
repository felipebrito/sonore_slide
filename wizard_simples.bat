@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    PHOTO MOSAIC - WIZARD SIMPLES
echo ========================================
echo.

:: Verificar Python
echo [1/4] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo [INFO] Abrindo site de download...
    start https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python encontrado

:: Verificar arquivos
echo.
echo [2/4] Verificando arquivos...
if not exist "app\server.py" (
    echo [ERRO] app\server.py nao encontrado!
    pause
    exit /b 1
)
if not exist "app\index.html" (
    echo [ERRO] app\index.html nao encontrado!
    pause
    exit /b 1
)
echo [OK] Arquivos encontrados

:: Verificar fotos
echo.
echo [3/4] Verificando fotos...
set "photo_count=0"
for %%f in (Fotos\*.jpg Fotos\*.jpeg Fotos\*.png Fotos\*.gif Fotos\*.webp) do set /a photo_count+=1
echo [OK] !photo_count! fotos encontradas

:: Liberar porta
echo.
echo [4/4] Liberando porta 5000...
netstat -an | find "5000" >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Liberando porta 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "5000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)
echo [OK] Porta 5000 disponivel

echo.
echo ========================================
echo    INICIANDO PHOTO MOSAIC
echo ========================================
echo.
echo [INFO] URL: http://localhost:5000
echo [INFO] Para parar: Ctrl+C
echo.
echo [INFO] Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

:: Abrir navegador e iniciar servidor
start http://localhost:5000
python app\server.py

echo.
echo [INFO] Photo Mosaic finalizado.
pause 