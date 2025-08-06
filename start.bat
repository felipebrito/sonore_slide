@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    PHOTO MOSAIC - INICIADOR UNIVERSAL

echo ========================================
echo.

echo 1. Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo.
    echo Abrindo site para download do Python...
    start https://www.python.org/downloads/
    echo.
    echo Por favor, instale o Python e marque a opcao "Add Python to PATH".
    echo Depois feche esta janela e execute novamente este arquivo.
    pause
    exit /b 1
)
echo OK: Python encontrado
echo.

echo 2. Iniciando servidor universal...
echo URL: http://localhost:5000
echo Para parar: Ctrl+C
echo.
start http://localhost:5000
python app\server.py

echo.
echo OK: Servidor parado com sucesso!
echo FIM: Photo Mosaic finalizado.
pause 