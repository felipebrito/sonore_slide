@echo off
chcp 65001 >nul
title Photo Mosaic - Instalador

echo.
echo ========================================
echo    📸 Photo Mosaic - Instalador
echo ========================================
echo.

:: Mudar para pasta app
cd app

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
echo 📍 Aplicação será aberta em: http://localhost:8000
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