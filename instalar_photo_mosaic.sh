#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "========================================"
echo "    📸 Photo Mosaic - Instalador"
echo "========================================"
echo -e "${NC}"

# Obter o diretório onde o script está localizado
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$SCRIPT_DIR/app"

# Verificar se a pasta app existe
if [ ! -d "$APP_DIR" ]; then
    echo -e "${RED}❌ Erro: Pasta 'app' não encontrada!${NC}"
    echo "   Certifique-se de que todos os arquivos estão presentes"
    echo "   Diretório atual: $SCRIPT_DIR"
    echo "   Pasta app esperada: $APP_DIR"
    exit 1
fi

# Mudar para pasta app
cd "$APP_DIR"

# Verificar se Python está instalado
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 não encontrado!${NC}"
    echo ""
    echo "Por favor, instale o Python 3.6+ em:"
    echo "https://www.python.org/downloads/"
    echo ""
    echo "No macOS, você também pode usar:"
    echo "brew install python3"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Python encontrado!${NC}"
python3 --version

echo ""
echo -e "${YELLOW}🚀 Iniciando Photo Mosaic...${NC}"
echo ""
echo -e "${BLUE}📍 Aplicação será aberta em: http://localhost:5000${NC}"
echo ""
echo -e "${GREEN}💡 Dicas:${NC}"
echo "   - Pressione C para configurações"
echo "   - Pressione R para adicionar foto"
echo "   - Pressione S para embaralhar"
echo "   - Pressione ESC para fechar modais"
echo ""
echo -e "${YELLOW}⚠️  Para parar o servidor, pressione Ctrl+C${NC}"
echo ""

# Tentar abrir navegador automaticamente
if command -v open &> /dev/null; then
    # macOS
    (sleep 2 && open http://localhost:5000) &
elif command -v xdg-open &> /dev/null; then
    # Linux
    (sleep 2 && xdg-open http://localhost:5000) &
fi

# Iniciar servidor Python
python3 simple-server.py

echo ""
echo -e "${GREEN}👋 Photo Mosaic encerrado.${NC}" 