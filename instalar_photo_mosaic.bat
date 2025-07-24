@echo off
chcp 65001 >nul
title Photo Mosaic - Instalador

echo.
echo ========================================
echo    Photo Mosaic - Instalador
echo ========================================
echo.

:: Obter o diretorio onde o script esta localizado
set "SCRIPT_DIR=%~dp0"
set "APP_DIR=%SCRIPT_DIR%app"

:: Verificar se a pasta app existe
if not exist "%APP_DIR%" (
    echo Erro: Pasta 'app' nao encontrada!
    echo.
    echo Certifique-se de que todos os arquivos estao presentes
    echo Diretorio atual: %SCRIPT_DIR%
    echo Pasta app esperada: %APP_DIR%
    pause
    exit /b 1
)

:: Mudar para pasta app
cd /d "%APP_DIR%"

:: Verificar se Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo Erro: Python nao encontrado!
    echo.
    echo Por favor, instale o Python 3.6+ em:
    echo https://www.python.org/downloads/
    echo.
    echo Certifique-se de marcar "Add Python to PATH" durante a instalacao.
    echo.
    pause
    exit /b 1
)

echo Python encontrado!
python --version

echo.
echo Iniciando Photo Mosaic...
echo.
echo Aplicacao sera aberta em: http://localhost:5000
echo.
echo Dicas:
echo    - Pressione C para configuracoes
echo    - Pressione R para adicionar foto
echo    - Pressione S para embaralhar
echo    - Pressione ESC para fechar modais
echo.
echo Para parar o servidor, pressione Ctrl+C
echo.

:: Tentar abrir navegador automaticamente
start http://localhost:5000

:: Iniciar servidor Python
python simple-server.py

echo.
echo Photo Mosaic encerrado.
pause 