# Photo Mosaic - Slides Automático

Uma aplicação web simples para exibir fotos em formato de slides automático.

## 🚀 Como Usar

### Windows
1. **Execute o arquivo:**
   ```
   iniciar_windows_melhorado.bat
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
│   ├── server_windows_improved.py  # Servidor Python
│   ├── index_corrigido.html        # Interface principal
│   ├── script_corrigido.js         # JavaScript
│   └── styles.css                  # Estilos CSS
├── Fotos/                          # Suas fotos aqui
├── iniciar_windows_melhorado.bat   # Iniciador Windows
└── README.md                       # Este arquivo
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
netstat -ano | find "5000"
taskkill /f /pid [PID_NUMBER]
```

---

**Versão:** 2.0 - Servidor Melhorado  
**Status:** ✅ Funcional 