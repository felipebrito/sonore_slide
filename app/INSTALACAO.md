# 📸 Photo Mosaic - Guia de Instalação

## 🚀 Instalação Rápida (Duplo Clique)

### **Windows:**
1. **Duplo clique** em `instalar_photo_mosaic.bat`
2. A aplicação abrirá automaticamente no navegador
3. **Pronto!** 🎉

### **macOS/Linux:**
1. **Duplo clique** em `instalar_photo_mosaic.sh`
2. Ou execute no terminal: `./instalar_photo_mosaic.sh`
3. A aplicação abrirá automaticamente no navegador
4. **Pronto!** 🎉

### **Python Standalone:**
1. **Duplo clique** em `photo_mosaic_standalone.py`
2. Ou execute: `python photo_mosaic_standalone.py`
3. A aplicação abrirá automaticamente
4. **Pronto!** 🎉

## 📋 Requisitos

### **Mínimos:**
- ✅ **Python 3.6+** (já incluído no macOS/Linux)
- ✅ **Navegador moderno** (Chrome, Firefox, Safari, Edge)
- ✅ **Pasta Fotos/** com suas imagens

### **Opcional:**
- 📱 **PWA**: Para instalar como app no celular/computador
- 🎨 **PIL**: Para criação automática de ícones (`pip install Pillow`)

## 🎮 Como Usar

### **Controles por Teclado:**
| Tecla | Função |
|-------|--------|
| `C` | ⚙️ Abrir configurações |
| `R` | ➕ Adicionar foto aleatória |
| `S` | 🔄 Embaralhar fotos |
| `ESC` | ❌ Fechar modais |
| `Clique` | 🔍 Visualizar em tela cheia |

### **Funcionalidades:**
- **Layout 4 verticais** (proporção 1:2)
- **Rotação automática** a cada 15 segundos
- **Detecção automática** de novas fotos
- **Transições suaves** imperceptíveis
- **Interface minimalista** com fundo preto

## 📁 Estrutura de Arquivos

```
Photo Mosaic/
├── 📄 index.html                    # Página principal
├── 🎨 styles.css                    # Estilos CSS
├── ⚙️ script.js                     # Lógica principal
├── 🔍 detect-photos.js              # Detecção de fotos
├── 🐍 simple-server.py              # Servidor Python
├── 🚀 photo_mosaic_standalone.py    # Versão standalone
├── 📱 manifest.json                 # Configuração PWA
├── 🔧 sw.js                         # Service Worker
├── 📁 Fotos/                        # Suas imagens aqui
├── 📁 icons/                        # Ícones do app
├── 🪟 instalar_photo_mosaic.bat     # Instalador Windows
├── 🐧 instalar_photo_mosaic.sh      # Instalador macOS/Linux
└── 📖 INSTALACAO.md                 # Este arquivo
```

## 🔧 Configurações

### **Acesse as configurações (tecla C):**
- **Intervalo de Rotação**: Tempo entre trocas de fotos
- **Intervalo de Verificação**: Frequência de detecção de novas fotos
- **Embaralhar**: Reorganizar fotos aleatoriamente
- **Adicionar Foto**: Incluir nova foto do acervo

## 📱 PWA (Progressive Web App)

### **Instalar como App:**
1. Abra a aplicação no navegador
2. Clique em "📱 Instalar App" (se aparecer)
3. Ou use o menu do navegador: "Adicionar à tela inicial"

### **Funcionalidades PWA:**
- ✅ **Funciona offline** (cache automático)
- ✅ **Instala como app** no desktop/celular
- ✅ **Notificações** (opcional)
- ✅ **Atualizações automáticas**

## 🛠️ Solução de Problemas

### **Python não encontrado:**
```
❌ Python não encontrado!
```
**Solução:** Instale Python em https://www.python.org/downloads/

### **Porta em uso:**
```
❌ Erro: Porta 8000 já está em uso!
```
**Solução:** Feche outras instâncias ou use porta diferente

### **Fotos não aparecem:**
```
❌ Nenhuma foto encontrada na pasta Fotos
```
**Solução:** Adicione imagens (.jpg, .png, .gif) na pasta `Fotos/`

### **Navegador não abre:**
**Solução:** Acesse manualmente: http://localhost:8000

## 🎯 Formatos Suportados

### **Imagens:**
- ✅ **JPG/JPEG** (.jpg, .jpeg)
- ✅ **PNG** (.png)
- ✅ **GIF** (.gif)
- ✅ **WebP** (.webp)

### **Sistemas Operacionais:**
- ✅ **Windows** (10, 11)
- ✅ **macOS** (10.14+)
- ✅ **Linux** (Ubuntu, Debian, etc.)

## 🚀 Atualizações

### **Automáticas:**
- O app verifica atualizações automaticamente
- Notifica quando nova versão está disponível
- Atualiza com um clique

### **Manuais:**
- Baixe nova versão do repositório
- Substitua arquivos antigos
- Reinicie a aplicação

## 📞 Suporte

### **Problemas Comuns:**
1. **Verifique se Python está instalado**
2. **Confirme que há fotos na pasta Fotos/**
3. **Teste em navegador diferente**
4. **Reinicie a aplicação**

### **Logs:**
- Abra o console do navegador (F12)
- Verifique mensagens de erro
- Consulte logs do servidor no terminal

---

## 🎉 **Pronto para Usar!**

**Agora você tem uma aplicação profissional de slides que:**
- ✅ **Instala com duplo clique**
- ✅ **Funciona offline**
- ✅ **Instala como app**
- ✅ **Detecta fotos automaticamente**
- ✅ **Interface moderna e limpa**

**Divirta-se com suas fotos!** 📸✨ 