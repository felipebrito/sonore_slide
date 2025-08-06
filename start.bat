@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    PHOTO MOSAIC - INICIADOR UNIVERSAL
echo ========================================
echo.

echo [1/6] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo [INFO] Abrindo site de download...
    start https://www.python.org/downloads/
    pause
    exit /b 1
)
echo [OK] Python encontrado

echo.
echo [2/6] Verificando arquivos...
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

echo.
echo [3/6] Verificando fotos...
set "photo_count=0"
for %%f in (Fotos\*.jpg Fotos\*.jpeg Fotos\*.png Fotos\*.gif Fotos\*.webp) do set /a photo_count+=1
echo [OK] !photo_count! fotos encontradas

echo.
echo [4/6] Limpando cache e processos...
echo [INFO] Parando processos Python...
taskkill /f /im python.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [5/6] Liberando porta 5000...
netstat -an | find "5000" >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Liberando porta 5000...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "5000"') do (
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 3 /nobreak >nul
)
echo [OK] Porta 5000 disponivel

echo.
echo [6/6] Iniciando servidor...
echo [INFO] Aguardando servidor inicializar...
start /min python app\server.py
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    INICIANDO PHOTO MOSAIC
echo ========================================
echo.
echo [INFO] URL: http://localhost:5000
echo [INFO] Para parar: Ctrl+C
echo.
echo [INFO] Aguardando 3 segundos antes de abrir o navegador...
timeout /t 3 /nobreak >nul

:: Abrir navegador em modo anônimo para evitar cache
echo [INFO] Abrindo navegador em modo privado...
start chrome --incognito http://localhost:5000
if errorlevel 1 (
    start msedge --inprivate http://localhost:5000
    if errorlevel 1 (
        start firefox --private-window http://localhost:5000
        if errorlevel 1 (
            start http://localhost:5000
        )
    )
)

echo [INFO] Navegador aberto em modo privado para evitar cache.
echo [INFO] Se a pagina nao carregar, tente:
echo [INFO] 1. Recarregar a pagina (F5)
echo [INFO] 2. Acessar manualmente: http://localhost:5000
echo [INFO] 3. Usar modo anonimo/privado
echo.

:: Aguardar o usuário parar o servidor
echo [INFO] Servidor rodando. Pressione Ctrl+C para parar.
echo.
pause 