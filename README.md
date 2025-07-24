# Photo Mosaic - Slides Automático

Uma aplicação web simples para exibir fotos em formato de slides automático.

## 🚀 Como Usar

### Windows
1. **Execute o arquivo:**
   ```
   iniciar_windows_final.bat
   ```

2. **O navegador abrirá automaticamente em:**
   ```
   http://localhost:5000
   ```

3. **Para parar o servidor:**
   - Pressione `Ctrl+C` no terminal

## 📁 Estrutura de Arquivos

```
Slide/
├── app/
│   ├── server_windows_fixed.py    # ✅ Servidor corrigido
│   ├── index_corrigido.html       # ✅ Interface principal
│   ├── script_corrigido.js        # ✅ JavaScript
│   └── styles.css                 # ✅ Estilos CSS
├── Fotos/                         # ✅ Suas fotos aqui
├── iniciar_windows_final.bat      # ✅ Iniciador final
├── limpar_cache.bat               # ✅ Limpeza de cache
└── README.md                      # ✅ Este arquivo
```

## 📸 Adicionar Fotos

1. Coloque suas fotos na pasta `Fotos/`
2. Formatos suportados: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`
3. Reinicie o servidor para carregar novas fotos

## ⌨️ Atalhos

- **C** = Abrir configurações
- **R** = Adicionar foto aleatória
- **S** = Embaralhar fotos
- **ESC** = Fechar modais

## 🔧 Requisitos

- Python 3.6+
- Windows 10/11

## 🛠️ Troubleshooting

### Se o servidor não parar com Ctrl+C:
```cmd
taskkill /f /im python.exe
```

### Se a porta 5000 estiver em uso:
```cmd
limpar_cache.bat
```

### Se aparecer erro de caracteres estranhos:
1. Execute `limpar_cache.bat`
2. Execute `iniciar_windows_final.bat`

### Se o navegador não carregar:
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Execute `limpar_cache.bat`
3. Execute `iniciar_windows_final.bat`

## 🔄 Versões

- **v2.0** - Servidor melhorado com Ctrl+C funcional
- **v2.1** - Correção de encoding e limpeza de cache

---

**Versão:** 2.1 - Servidor Corrigido  
**Status:** ✅ Funcional 