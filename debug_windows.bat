@echo off
echo ========================================
echo    DEBUG WINDOWS - PHOTO MOSAIC
echo ========================================
echo.

echo [INFO] Verificando Python...
python --version
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo.
    echo [INFO] Tentando python3...
    python3 --version
    if errorlevel 1 (
        echo [ERRO] Python3 tambem nao encontrado!
        echo.
        echo [SOLUCAO] Instale o Python em: https://www.python.org/downloads/
        echo [IMPORTANTE] Marque "Add Python to PATH" durante a instalacao
        pause
        exit /b 1
    ) else (
        echo [OK] Python3 encontrado
        set PYTHON_CMD=python3
    )
) else (
    echo [OK] Python encontrado
    set PYTHON_CMD=python
)

echo.
echo [INFO] Verificando estrutura de arquivos...
if exist "app\server.py" (
    echo [OK] app\server.py encontrado
) else (
    echo [ERRO] app\server.py nao encontrado!
    pause
    exit /b 1
)

if exist "app\index.html" (
    echo [OK] app\index.html encontrado
) else (
    echo [ERRO] app\index.html nao encontrado!
    pause
    exit /b 1
)

if exist "app\script.js" (
    echo [OK] app\script.js encontrado
) else (
    echo [ERRO] app\script.js nao encontrado!
    pause
    exit /b 1
)

if exist "app\styles.css" (
    echo [OK] app\styles.css encontrado
) else (
    echo [ERRO] app\styles.css nao encontrado!
    pause
    exit /b 1
)

echo.
echo [INFO] Verificando porta 5000...
netstat -an | find "5000"
if not errorlevel 1 (
    echo [AVISO] Porta 5000 ja esta em uso!
    echo [INFO] Tentando liberar porta...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "5000"') do (
        echo [INFO] Matando processo PID: %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo.
echo [INFO] Testando servidor...
echo [INFO] Iniciando servidor em modo debug...
echo [INFO] URL: http://localhost:5000
echo [INFO] Para parar: Ctrl+C
echo.
echo [INFO] Pressione qualquer tecla para iniciar o servidor...
pause >nul

%PYTHON_CMD% app\server.py

echo.
echo [INFO] Servidor parado.
pause 