@echo off
chcp 65001 >nul
title Photo Mosaic - Instalador

echo.
echo ========================================
echo    📸 Photo Mosaic - Instalador
echo ========================================
echo.

:: Obter o diretório onde o script está localizado
set "SCRIPT_DIR=%~dp0"
set "APP_DIR=%SCRIPT_DIR%app"

:: Verificar se a pasta app existe
if not exist "%APP_DIR%" (
    echo ❌ Erro: Pasta 'app' não encontrada!
    echo.
    echo Certifique-se de que todos os arquivos estão presentes
    echo Diretório atual: %SCRIPT_DIR%
    echo Pasta app esperada: %APP_DIR%
    pause
    exit /b 1
)

:: Mudar para pasta app
cd /d "%APP_DIR%"

:: Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python não encontrado!
    echo.
    echo Por favor, instale o Python 3.6+ em:
    echo https://www.python.org/downloads/
    echo.
    echo Certifique-se de marcar "Add Python to PATH" durante a instalação.
    echo.
    pause
    exit /b 1
)

echo ✅ Python encontrado!
python --version

echo.
echo 🚀 Iniciando Photo Mosaic...
echo.
echo 📍 Aplicação será aberta em: http://localhost:3000
echo.
echo 💡 Dicas:
echo    - Pressione C para configurações
echo    - Pressione R para adicionar foto
echo    - Pressione S para embaralhar
echo    - Pressione ESC para fechar modais
echo.
echo ⚠️  Para parar o servidor, pressione Ctrl+C
echo.

:: Iniciar servidor Python
python simple-server.py

echo.
echo 👋 Photo Mosaic encerrado.
pause 