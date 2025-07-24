@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    PHOTO MOSAIC - WINDOWS MELHORADO
echo ========================================
echo.

:: Verificar se Python está instalado
echo 1. Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRO: Python não encontrado!
    echo    Instale Python de: https://python.org
    pause
    exit /b 1
)
echo ✅ Python encontrado
echo.

:: Verificar estrutura de arquivos
echo 2. Verificando arquivos...
if not exist "app" (
    echo ❌ ERRO: Pasta 'app' não encontrada!
    pause
    exit /b 1
)
if not exist "Fotos" (
    echo ❌ ERRO: Pasta 'Fotos' não encontrada!
    pause
    exit /b 1
)
if not exist "app\server_windows_improved.py" (
    echo ❌ ERRO: server_windows_improved.py não encontrado!
    pause
    exit /b 1
)
echo ✅ Estrutura de arquivos OK
echo.

:: Contar fotos
echo 3. Verificando fotos...
cd /d "%~dp0Fotos"
set count=0
for %%f in (*.jpg *.jpeg *.png *.gif *.webp) do set /a count+=1
echo ✅ Encontradas %count% fotos
if %count%==0 (
    echo ⚠️  AVISO: Nenhuma foto encontrada!
)
echo.

:: Verificar se porta está em uso
echo 4. Verificando porta 5000...
netstat -an | find "5000" >nul
if not errorlevel 1 (
    echo ⚠️  AVISO: Porta 5000 já está em uso!
    echo    Tentando parar processos existentes...
    taskkill /f /im python.exe >nul 2>&1
    timeout /t 2 /nobreak >nul
)

:: Iniciar servidor
echo 5. Iniciando servidor...
cd /d "%~dp0app"

echo.
echo 🚀 Iniciando Photo Mosaic...
echo 📍 URL: http://localhost:5000
echo 🛑 Para parar: Pressione Ctrl+C
echo.

:: Abrir navegador após 2 segundos
timeout /t 2 /nobreak >nul
start http://localhost:5000

:: Executar servidor com melhor tratamento de erros
python server_windows_improved.py

:: Se chegou aqui, servidor foi parado
echo.
echo ✅ Servidor parado com sucesso!
echo 👋 Photo Mosaic finalizado.
pause 