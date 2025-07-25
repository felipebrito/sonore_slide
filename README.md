# Photo Mosaic - Slides Automático

Uma aplicação web simples para exibir fotos em formato de slides automático.

## 🚀 Como Usar

### Windows (Recomendado)

#### Opção 1: Iniciador Simples (Universal)
```
start.bat
```

#### Opção 2: Iniciador Completo (Universal)
```
iniciar_simples.bat
```

#### Opção 3: Manual
```
python app\server_crossplatform.py
```

### Mac/Linux
```
python3 app/server_crossplatform.py
```

### Passos:
1. **Execute um dos arquivos acima**
2. **O navegador abrirá automaticamente em:** `http://localhost:5000`
3. **Para parar o servidor:** Pressione `Ctrl+C` no terminal

## 📁 Estrutura de Arquivos

```
Slide/
├── app/
│   ├── server_crossplatform.py     # ✅ Servidor universal (Windows/Mac)
│   ├── index_corrigido.html        # ✅ Interface principal
│   ├── script_corrigido.js         # ✅ JavaScript
│   └── styles.css                  # ✅ Estilos CSS
├── Fotos/                          # ✅ Suas fotos aqui
├── start.bat                       # ✅ Iniciador simples universal
├── iniciar_simples.bat             # ✅ Iniciador completo universal
├── iniciar_windows_final.bat       # (legado)
├── limpar_cache.bat                # ✅ Limpeza de cache
└── README.md                       # ✅ Este arquivo
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
- Windows 10/11 ou Mac/Linux

## 🛠️ Troubleshooting

### Se aparecer erro de comando não reconhecido:
1. **Use:** `start.bat` (versão universal)
2. **Ou:** `iniciar_simples.bat` (completo)

### Se o servidor não parar com Ctrl+C:
```cmd
taskkill /f /im python.exe
```

### Se a porta 5000 estiver em uso:
```cmd
limpar_cache.bat
```

### Se o navegador não carregar:
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Execute `limpar_cache.bat`
3. Execute `start.bat`

### Se Python não for encontrado:
1. Instale Python de: https://python.org
2. Marque "Add Python to PATH" durante a instalação
3. Reinicie o prompt de comando

## 🔄 Versões

- **v3.0** - Servidor universal multiplataforma
- **v2.2** - Múltiplas opções de iniciador para compatibilidade
- **v2.1** - Correção de encoding e limpeza de cache
- **v2.0** - Servidor melhorado com Ctrl+C funcional

---

**Versão:** 3.0 - Universal  
**Status:** ✅ Funcional no Windows e Mac 