# Photo Mosaic - Slides Automático

Uma aplicação web simples para exibir fotos em formato de slides automático.

## 🚀 Como Usar

### Windows
```
start.bat
```
- O script verifica se o Python está instalado
- Se não estiver, abre o site de download automaticamente
- Depois de instalar, execute novamente o `start.bat`
- **Ctrl+C agora funciona corretamente para parar o servidor**

### Mac/Linux
```
./start.sh
```
ou
```
python3 app/server.py
```

### Passos:
1. **Execute o arquivo acima**
2. **O navegador abrirá automaticamente em:** `http://localhost:5000`
3. **Para parar o servidor:** Pressione `Ctrl+C` no terminal

## 📁 Estrutura de Arquivos

```
Slide/
├── app/
│   ├── server.py                   # ✅ Servidor universal (Mac/Linux)
│   ├── server_windows_fixed.py     # ✅ Servidor Windows otimizado
│   ├── index.html                  # ✅ Interface principal
│   ├── script.js                   # ✅ JavaScript
│   └── styles.css                  # ✅ Estilos CSS
├── Fotos/                          # ✅ Suas fotos aqui
├── start.bat                       # ✅ Iniciador Windows
├── start.sh                        # ✅ Iniciador Mac/Linux
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

### Windows - Se aparecer erro de comando não reconhecido:
1. **Use:** `start.bat` (versão universal)

### Windows - Se o servidor não parar com Ctrl+C:
```cmd
taskkill /f /im python.exe
```

### Windows - Se a porta 5000 estiver em uso:
```cmd
netstat -ano | findstr :5000
taskkill /PID [PID_NUMBER] /F
```

### Mac/Linux - Se Python não for encontrado:
```bash
# macOS
brew install python3

# Ubuntu/Debian
sudo apt-get install python3

# CentOS/RHEL
sudo yum install python3
```

### Se o navegador não carregar:
1. Limpe o cache do navegador (Ctrl+Shift+Del)
2. Acesse manualmente: `http://localhost:5000`

## 🔄 Versões

- **v4.2** - Ctrl+C funcionando no Windows
- **v4.1** - Scripts de debug para Windows
- **v4.0** - Estrutura limpa e universal
- **v3.1** - Iniciador universal com verificação de Python
- **v3.0** - Servidor universal multiplataforma
- **v2.2** - Múltiplas opções de iniciador para compatibilidade
- **v2.1** - Correção de encoding e limpeza de cache
- **v2.0** - Servidor melhorado com Ctrl+C funcional

---

**Versão:** 4.2 - Ctrl+C funcionando no Windows  
**Status:** ✅ Funcional no Windows e Mac 