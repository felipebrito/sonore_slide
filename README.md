# 📸 Photo Mosaic - Aplicação de Slides Automático

Uma aplicação web moderna que exibe um mosaico de 4 fotos verticais com transições suaves e detecção automática de novas imagens.

## ✨ Características

- **Layout Vertical**: 4 fotos lado a lado com proporção 1:2 (672x1344px)
- **Detecção Automática**: Monitora a pasta `/Fotos` e detecta novas imagens automaticamente
- **Transições Suaves**: Animações fade out/in imperceptíveis
- **Rotação Automática**: Troca uma foto por vez a cada 15 segundos
- **Controles por Teclado**: Navegação completa via teclado
- **Interface Limpa**: Design minimalista com fundo preto

## 🚀 Como Usar

### 1. Preparação
```bash
# Clone o repositório
git clone [URL_DO_REPOSITORIO]
cd Slide

# Adicione suas fotos na pasta Fotos/
# Formatos suportados: .jpg, .jpeg, .png, .gif, .webp
```

### 2. Executar
```bash
# Inicie o servidor Python
python simple-server.py

# Acesse no navegador
http://localhost:8000
```

## 🎮 Controles

| Tecla | Função |
|-------|--------|
| `C` | Abrir configurações |
| `R` | Adicionar foto aleatória |
| `S` | Embaralhar fotos |
| `ESC` | Fechar modais |
| `Clique` | Visualizar foto em tela cheia |

## 📁 Estrutura do Projeto

```
Slide/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── script.js           # Lógica principal
├── detect-photos.js    # Detecção de fotos
├── simple-server.py    # Servidor Python
├── Fotos/              # Pasta com suas imagens
└── README.md           # Este arquivo
```

## ⚙️ Configurações

Acesse o modal de configurações (tecla `C`) para ajustar:
- **Intervalo de Rotação**: Tempo entre trocas de fotos
- **Intervalo de Verificação**: Frequência de detecção de novas fotos

## 🎨 Layout

- **Grid**: 4 colunas lado a lado
- **Proporção**: 1:2 (vertical)
- **Gap**: 2px entre fotos
- **Background**: Preto (#000000)
- **Bordas**: Cinza escuro (#333)

## 🔧 Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Backend**: Python HTTP Server
- **Animações**: CSS Transitions + JavaScript
- **Detecção**: API REST + File System

## 📝 Requisitos

- Python 3.6+
- Navegador moderno
- Pasta `Fotos/` com imagens

## 🎯 Funcionalidades

- ✅ Detecção automática de 22+ fotos
- ✅ Layout 4 verticais responsivo
- ✅ Transições suaves imperceptíveis
- ✅ Rotação automática inteligente
- ✅ Controles por teclado
- ✅ Visualização em tela cheia
- ✅ Configurações personalizáveis
- ✅ Interface minimalista

## 🚀 Status Atual

**✅ Funcionando perfeitamente com:**
- 22 fotos detectadas automaticamente
- Layout 4 imagens verticais
- Todas as funcionalidades ativas
- Interface limpa e moderna

---

**Desenvolvido com ❤️ para exibição automática de fotos** 