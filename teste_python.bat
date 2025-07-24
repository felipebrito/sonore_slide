@echo off
echo Testando Python no Windows...
echo.

echo Verificando versao do Python:
python --version
if errorlevel 1 (
    echo ERRO: Python nao encontrado!
    echo.
    echo Instrucoes:
    echo 1. Baixe Python em: https://www.python.org/downloads/
    echo 2. Durante a instalacao, marque "Add Python to PATH"
    echo 3. Reinicie o computador
    echo 4. Tente novamente
    pause
    exit /b 1
)

echo.
echo Python encontrado! Testando servidor...
echo.

cd /d "%~dp0app"

echo Diretorio atual:
cd
echo.

echo Testando servidor na porta 5000...
python server_windows.py

pause 