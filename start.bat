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

echo 2. Iniciando servidor Windows otimizado...
echo URL: http://localhost:5000
echo Para parar: Ctrl+C (agora funciona!)
echo.
echo [INFO] Aguardando 3 segundos antes de abrir o navegador...
timeout /t 3 /nobreak >nul
start http://localhost:5000
echo [INFO] Navegador aberto. Se a pagina nao carregar:
echo [INFO] 1. Aguarde alguns segundos
echo [INFO] 2. Recarregue a pagina (F5)
echo [INFO] 3. Tente acessar manualmente: http://localhost:5000
echo.
python app\server_windows_final.py

echo.
echo OK: Servidor parado com sucesso!
echo FIM: Photo Mosaic finalizado.
pause 