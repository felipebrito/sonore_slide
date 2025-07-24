@echo off
echo ========================================
echo    DIAGNOSTICO PHOTO MOSAIC - WINDOWS
echo ========================================
echo.

echo 1. Verificando Python:
python --version
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    goto :end
)
echo OK: Python encontrado
echo.

echo 2. Verificando estrutura de arquivos:
if not exist "app" (
    echo ERRO: Pasta 'app' nao encontrada!
    goto :end
)
echo OK: Pasta 'app' encontrada

if not exist "Fotos" (
    echo ERRO: Pasta 'Fotos' nao encontrada!
    goto :end
)
echo OK: Pasta 'Fotos' encontrada

if not exist "app\index.html" (
    echo ERRO: index.html nao encontrado!
    goto :end
)
echo OK: index.html encontrado

if not exist "app\server_windows.py" (
    echo ERRO: server_windows.py nao encontrado!
    goto :end
)
echo OK: server_windows.py encontrado

if not exist "app\script.js" (
    echo ERRO: script.js nao encontrado!
    goto :end
)
echo OK: script.js encontrado

if not exist "app\styles.css" (
    echo ERRO: styles.css nao encontrado!
    goto :end
)
echo OK: styles.css encontrado
echo.

echo 3. Verificando fotos:
cd /d "%~dp0Fotos"
set count=0
for %%f in (*.jpg *.jpeg *.png *.gif *.webp) do set /a count+=1
echo Encontradas %count% fotos na pasta Fotos
if %count%==0 (
    echo AVISO: Nenhuma foto encontrada!
)
echo.

echo 4. Testando servidor:
cd /d "%~dp0app"
echo Iniciando servidor de teste...
echo.
echo Pressione Ctrl+C para parar o teste
echo.
echo Abrindo navegador em 3 segundos...
timeout /t 3 /nobreak >nul
start http://localhost:5000
python server_windows.py

:end
echo.
echo Diagnostico concluido.
pause 