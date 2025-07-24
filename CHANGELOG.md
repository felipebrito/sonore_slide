# Changelog - Photo Mosaic

## [2.0.0] - 2024-12-19

### ✨ Melhorias
- **Novo servidor com Ctrl+C funcional** (`server_windows_improved.py`)
- **Batch file melhorado** (`iniciar_windows_melhorado.bat`)
- **Limpeza completa de arquivos** - removidos duplicados e desnecessários
- **README.md simplificado** e mais direto
- **Estrutura de projeto limpa** com apenas arquivos essenciais

### 🐛 Correções
- **Corrigido problema de servidor travado** no Windows
- **Ctrl+C agora funciona** corretamente para parar o servidor
- **Tratamento de erros melhorado** com signal handling
- **Logging com timestamps** para melhor debug

### 🗑️ Removido
- Arquivos duplicados de servidor (`server_windows.py`, `simple-server.py`)
- Arquivos HTML duplicados (`index.html`, `index_simple.html`, `teste_simples.html`)
- Scripts JavaScript antigos (`script.js`, `detect-photos.py`)
- Arquivos de teste desnecessários (vários `.bat` files)
- Documentação duplicada (`COMO_USAR.md`, `INSTALACAO.md`)
- Arquivos PWA não utilizados (`sw.js`, `manifest.json`)

### 📁 Estrutura Final
```
Slide/
├── app/
│   ├── server_windows_improved.py  # ✅ Servidor melhorado
│   ├── index_corrigido.html        # ✅ Interface principal
│   ├── script_corrigido.js         # ✅ JavaScript funcional
│   └── styles.css                  # ✅ Estilos CSS
├── Fotos/                          # ✅ Suas fotos
├── iniciar_windows_melhorado.bat   # ✅ Iniciador Windows
└── README.md                       # ✅ Documentação
```

## [1.0.0] - Versão Original

### Funcionalidades
- Slides automático de fotos
- Interface web responsiva
- Configurações personalizáveis
- Suporte a múltiplos formatos de imagem

---

**GitHub:** https://github.com/felipebrito/sonore_slide.git 