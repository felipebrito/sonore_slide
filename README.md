# Photo Mosaic - Slides Automático

Uma aplicação web simples para exibir fotos em formato de slides automático.

## 🚀 Como Usar

### Windows (Recomendado)

#### Iniciador Universal
```
start.bat
```
- O script verifica se o Python está instalado.
- Se não estiver, abre o site de download e mostra instruções.
- Depois de instalar, execute novamente o `start.bat`.

#### Opção Manual
```
python app\server_crossplatform.py
```

### Mac/Linux
```
python3 app/server_crossplatform.py
```

### Passos:
1. **Execute o arquivo acima**
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
├── start.bat                       # ✅ Iniciador universal
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
1. O próprio `start.bat` abrirá o site de download
2. Instale Python e marque "Add Python to PATH"
3. Reinicie o prompt de comando

## 🔄 Versões

- **v3.1** - Iniciador universal com verificação de Python
- **v3.0** - Servidor universal multiplataforma
- **v2.2** - Múltiplas opções de iniciador para compatibilidade
- **v2.1** - Correção de encoding e limpeza de cache
- **v2.0** - Servidor melhorado com Ctrl+C funcional

---

**Versão:** 3.1 - Universal com verificação de Python  
**Status:** ✅ Funcional no Windows e Mac 