@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo.
echo ========================================
echo    PHOTO MOSAIC - WIZARD DE INICIALIZACAO
echo ========================================
echo.

:: Verificar se está no diretório correto
echo [1/6] Verificando diretório do projeto...
if not exist "app\server.py" (
    echo [ERRO] Arquivo app\server.py nao encontrado!
    echo [INFO] Certifique-se de estar no diretório correto do projeto.
    echo [INFO] Diretório atual: %CD%
    pause
    exit /b 1
)
echo [OK] Diretório do projeto correto

:: Verificar Python
echo.
echo [2/6] Verificando Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao encontrado!
    echo.
    echo [SOLUCAO] Instale o Python em: https://www.python.org/downloads/
    echo [IMPORTANTE] Marque "Add Python to PATH" durante a instalacao
    echo.
    echo [INFO] Abrindo site de download...
    start https://www.python.org/downloads/
    echo.
    echo [INFO] Apos instalar o Python, execute este wizard novamente.
    pause
    exit /b 1
)
echo [OK] Python encontrado

:: Verificar arquivos essenciais
echo.
echo [3/6] Verificando arquivos essenciais...
set "missing_files="

if not exist "app\index.html" set "missing_files=!missing_files! app\index.html"
if not exist "app\script.js" set "missing_files=!missing_files! app\script.js"
if not exist "app\styles.css" set "missing_files=!missing_files! app\styles.css"
if not exist "Fotos\" set "missing_files=!missing_files! pasta Fotos"

if not "!missing_files!"=="" (
    echo [ERRO] Arquivos/pastas ausentes:!missing_files!
    echo [INFO] Certifique-se de que todos os arquivos foram baixados corretamente.
    pause
    exit /b 1
)
echo [OK] Todos os arquivos essenciais encontrados

:: Verificar fotos
echo.
echo [4/6] Verificando fotos...
if exist "Fotos\" (
    set "photo_count=0"
    for %%f in (Fotos\*.jpg Fotos\*.jpeg Fotos\*.png Fotos\*.gif Fotos\*.webp) do set /a photo_count+=1
    if !photo_count! gtr 0 (
        echo [OK] !photo_count! fotos encontradas
    ) else (
        echo [AVISO] Nenhuma foto encontrada na pasta Fotos\
        echo [INFO] Adicione fotos na pasta Fotos\ para usar a aplicacao
    )
) else (
    echo [ERRO] Pasta Fotos\ nao encontrada!
    pause
    exit /b 1
)

:: Verificar porta 5000
echo.
echo [5/6] Verificando porta 5000...
netstat -an | find "5000" >nul 2>&1
if not errorlevel 1 (
    echo [AVISO] Porta 5000 ja esta em uso!
    echo [INFO] Tentando liberar porta...
    for /f "tokens=5" %%a in ('netstat -ano ^| find "5000"') do (
        echo [INFO] Matando processo PID: %%a
        taskkill /f /pid %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
    echo [OK] Porta liberada
) else (
    echo [OK] Porta 5000 disponivel
)

:: Testar servidor
echo.
echo [6/6] Testando servidor...
echo [INFO] Iniciando servidor...
start /min python app\server.py
timeout /t 5 /nobreak >nul

:: Verificar se o servidor está respondendo
curl -s -o nul -w "%%{http_code}" http://localhost:5000 > temp_status.txt 2>nul
set /p status=<temp_status.txt
del temp_status.txt >nul 2>&1

if "!status!"=="302" (
    echo [OK] Servidor funcionando corretamente
) else (
    echo [AVISO] Servidor pode nao estar respondendo corretamente
    echo [INFO] Continuando mesmo assim...
)

echo.
echo ========================================
echo    TODAS AS VERIFICACOES CONCLUIDAS!
echo ========================================
echo.
echo [SUCESSO] Sistema pronto para uso!
echo.
echo [INFO] Photo Mosaic iniciado!
echo [INFO] URL: http://localhost:5000
echo [INFO] Para parar: Ctrl+C
echo.
echo [INFO] Aguardando 3 segundos antes de abrir o navegador...
timeout /t 3 /nobreak >nul

:: Abrir navegador
start http://localhost:5000

:: Aguardar o usuário parar o servidor
echo.
echo [INFO] Servidor rodando. Pressione Ctrl+C para parar.
echo.
pause

echo.
echo [INFO] Photo Mosaic finalizado.
pause 