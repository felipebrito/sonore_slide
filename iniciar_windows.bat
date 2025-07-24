@echo off
title Photo Mosaic

echo Photo Mosaic - Iniciando...
echo.

cd /d "%~dp0app"

echo Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo Instale Python em: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo Python encontrado!
echo.
echo Iniciando servidor na porta 5000...
echo Acesse: http://localhost:5000
echo.
echo Pressione Ctrl+C para parar
echo.

start http://localhost:5000
python simple-server.py

pause 