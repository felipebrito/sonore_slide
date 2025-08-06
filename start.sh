#!/bin/bash

echo "========================================"
echo "   PHOTO MOSAIC - INICIADOR UNIVERSAL"
echo "========================================"
echo

echo "1. Verificando Python..."
if command -v python3 &> /dev/null; then
    echo "OK: Python3 encontrado"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    echo "OK: Python encontrado"
    PYTHON_CMD="python"
else
    echo "ERRO: Python não encontrado!"
    echo
    echo "Por favor, instale o Python e tente novamente."
    echo "No macOS: brew install python3"
    echo "No Linux: sudo apt-get install python3"
    exit 1
fi
echo

echo "2. Iniciando servidor universal..."
echo "URL: http://localhost:5000"
echo "Para parar: Ctrl+C"
echo

# Abrir navegador (funciona no macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:5000 &
elif command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:5000 &
fi

$PYTHON_CMD app/server.py

echo
echo "OK: Servidor parado com sucesso!"
echo "FIM: Photo Mosaic finalizado." 