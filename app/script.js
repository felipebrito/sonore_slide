class PhotoMosaic {
    constructor() {
        this.mosaic = document.getElementById('mosaic');
        this.status = document.getElementById('status');
        
        // Configurações - Intervalos mais estáveis
        this.config = {
            rotationInterval: 15000, // 15 segundos
            checkInterval: 15000,    // 15 segundos (era 5 segundos)
        };
        
        // Timers
        this.rotationTimer = null;
        this.checkTimer = null;
        
        this.photos = [];
        this.photoQueue = [];
        this.isTransitioning = false;
        this.currentPhotoIndex = 0;
        this.availablePhotos = [];
        
        // Verifica suporte a AVIF
        this.checkAVIFSupport();
        
        this.init();
    }
    
    checkAVIFSupport() {
        const img = new Image();
        img.onload = () => {
            console.log('✅ Navegador suporta formato AVIF');
            this.avifSupported = true;
        };
        img.onerror = () => {
            console.warn('⚠️ Navegador NÃO suporta formato AVIF');
            this.avifSupported = false;
        };
        img.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgq8y8AAAARn42bAQUBQoIGAAmhBQcEAwgs8y8';
    }
    
    init() {
        console.log('🚀 Iniciando PhotoMosaic...');
        this.createMosaicGrid();
        this.bindEvents();
        this.loadLocalPhotos();
        this.startAutoRotation();
        this.setupKeyboardShortcuts();
    }
    
    createMosaicGrid() {
        this.mosaic.innerHTML = '';
        
        // Cria 4 itens do mosaico
        for (let i = 0; i < 4; i++) {
            const item = document.createElement('div');
            item.className = 'mosaic-item';
            item.setAttribute('data-index', i);
            
            // Clique desabilitado - apenas visualização
            // item.addEventListener('click', () => {
            //     const img = item.querySelector('img');
            //     if (img) {
            //         this.showFullscreen(img.src);
            //     }
            // });
            
            this.mosaic.appendChild(item);
        }
        
        console.log('✅ Mosaico criado com 4 itens verticais (clique desabilitado)');
    }
    
    bindEvents() {
        this.startFolderMonitoring();
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Evita atalhos quando o modal está aberto
            if (document.getElementById('configModal').style.display === 'block') {
                if (e.key === 'Escape') {
                    closeConfigModal();
                }
                return;
            }
            
            switch (e.key.toLowerCase()) {
                case 'c':
                    e.preventDefault();
                    toggleConfigModal();
                    break;
                case 'r':
                    e.preventDefault();
                    this.addRandomPhoto();
                    break;
                case 's':
                    e.preventDefault();
                    this.shufflePhotos();
                    break;
                case 'escape':
                    closeConfigModal();
                    break;
            }
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async loadLocalPhotos() {
        try {
            this.updateStatus('Detectando fotos...');
            
            // Tenta usar a API primeiro
            try {
                const response = await fetch('/api/photos');
                if (response.ok) {
                    this.availablePhotos = await response.json();
                    console.log('✅ API funcionando:', this.availablePhotos.length, 'fotos');
                } else {
                    throw new Error('API não respondeu');
                }
            } catch (error) {
                console.log('⚠️ API falhou, usando fallback...');
                // Fallback: lista de fotos conhecidas
                this.availablePhotos = [
                    '/Fotos/foto1.jpg', '/Fotos/foto2.jpg', '/Fotos/foto3.jpg', '/Fotos/foto4.jpg',
                    '/Fotos/foto5.jpg', '/Fotos/foto6.jpg', '/Fotos/foto7.jpg', '/Fotos/foto8.jpg',
                    '/Fotos/foto9.jpg', '/Fotos/foto10.jpg', '/Fotos/foto11.jpg', '/Fotos/foto12.jpg',
                    '/Fotos/foto14.jpg', '/Fotos/foto16.jpg', '/Fotos/foto18.jpg', '/Fotos/foto20.jpg',
                    '/Fotos/foto22.jpg', '/Fotos/360_0001.jpg'
                ];
            }
            
            // Filtra fotos baseado no suporte do navegador
            this.filterPhotosByBrowserSupport();
            
            if (this.availablePhotos.length === 0) {
                this.updateStatus('Nenhuma foto encontrada');
                return;
            }
            
            // Embaralha as fotos disponíveis
            this.shuffleArray(this.availablePhotos);
            
            // Seleciona as primeiras 4 fotos para o mosaico inicial
            this.photos = this.availablePhotos.slice(0, 4);
            
            // Carrega as fotos no mosaico
            this.photos.forEach((photo, index) => {
                this.loadImageInMosaicItem(this.mosaic.children[index], photo);
            });
            
            console.log('✅ Mosaico inicializado com', this.photos.length, 'fotos');
            this.updateStatus(`Mosaico carregado com ${this.photos.length} fotos`);
            
        } catch (error) {
            console.error('❌ Erro ao carregar fotos:', error);
            this.updateStatus('Erro ao carregar fotos');
        }
    }
    
    filterPhotosByBrowserSupport() {
        const originalCount = this.availablePhotos.length;
        
        if (this.avifSupported === false) {
            // Remove arquivos AVIF se o navegador não suportar
            this.availablePhotos = this.availablePhotos.filter(photo => 
                !photo.toLowerCase().endsWith('.avif')
            );
            
            const removedCount = originalCount - this.availablePhotos.length;
            if (removedCount > 0) {
                console.warn(`⚠️ Removidos ${removedCount} arquivos AVIF (navegador não suporta)`);
            }
        }
        
        console.log(`📸 Fotos disponíveis após filtro: ${this.availablePhotos.length}/${originalCount}`);
    }
    
    filterPhotosBySupport(photos) {
        if (this.avifSupported === false) {
            // Remove arquivos AVIF se o navegador não suportar
            const filtered = photos.filter(photo => 
                !photo.toLowerCase().endsWith('.avif')
            );
            
            const removedCount = photos.length - filtered.length;
            if (removedCount > 0) {
                console.warn(`⚠️ Filtrados ${removedCount} arquivos AVIF (navegador não suporta)`);
            }
            
            return filtered;
        }
        
        return photos;
    }
    
    addRandomPhoto() {
        if (this.availablePhotos.length <= 4) {
            console.log('Não há fotos suficientes para adicionar');
            this.updateStatus('Não há fotos suficientes para adicionar');
            return;
        }
        
        // Encontra fotos que não estão no mosaico atual
        const availableNewPhotos = this.availablePhotos.filter(photo => 
            !this.photos.includes(photo)
        );
        
        if (availableNewPhotos.length === 0) {
            console.log('Todas as fotos já estão no mosaico');
            this.updateStatus('Todas as fotos já estão no mosaico');
            return;
        }
        
        // Escolhe uma foto aleatória
        const newPhoto = availableNewPhotos[Math.floor(Math.random() * availableNewPhotos.length)];
        
        // Escolhe uma posição aleatória (0-3)
        const randomIndex = Math.floor(Math.random() * 4);
        
        console.log(`Adicionando foto na posição ${randomIndex}: ${newPhoto.split('/').pop()}`);
        
        // Substitui a foto na posição escolhida
        this.replaceSinglePhoto(randomIndex, newPhoto);
        
        // Atualiza o array de fotos
        this.photos[randomIndex] = newPhoto;
        
        this.updateStatus(`Foto adicionada: ${newPhoto.split('/').pop()}`);
    }
    
    animatePhotoChange(index, oldPhoto, newPhoto) {
        const mosaicItem = this.mosaic.children[index];
        const img = mosaicItem.querySelector('img');
        
        if (img) {
            img.classList.add('fade-out');
            
            setTimeout(() => {
                img.src = newPhoto;
                img.classList.remove('fade-out');
                img.classList.add('fade-in');
                
                setTimeout(() => {
                    img.classList.remove('fade-in');
                }, 400);
            }, 400);
        }
    }
    
    shufflePhotos() {
        if (this.availablePhotos.length < 4) {
            console.log('Não há fotos suficientes para embaralhar');
            this.updateStatus('Não há fotos suficientes para embaralhar');
            return;
        }
        
        // Embaralha as fotos disponíveis
        this.shuffleArray(this.availablePhotos);
        
        // Seleciona 4 fotos aleatórias
        this.photos = this.availablePhotos.slice(0, 4);
        
        // Atualiza o mosaico
        this.updateMosaicWithAnimation();
        
        console.log('Fotos embaralhadas');
        this.updateStatus('Fotos embaralhadas');
    }
    
    updateMosaic() {
        this.photos.forEach((photo, index) => {
            this.loadImageInMosaicItem(this.mosaic.children[index], photo);
        });
    }
    
    updateMosaicWithAnimation() {
        this.photos.forEach((photo, index) => {
            const mosaicItem = this.mosaic.children[index];
            const currentImg = mosaicItem.querySelector('img');
            
            if (currentImg && currentImg.src !== photo) {
                this.animatePhotoChange(index, currentImg.src, photo);
            } else {
                this.loadImageInMosaicItem(mosaicItem, photo);
            }
        });
    }
    
    startAutoRotation() {
        this.stopAutoRotation();
        
        this.rotationTimer = setInterval(() => {
            this.rotateSinglePhoto();
        }, this.config.rotationInterval);
        
        console.log(`🔄 Rotação automática iniciada: ${this.config.rotationInterval}ms`);
    }
    
    stopAutoRotation() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.rotationTimer = null;
        }
    }
    
    rotateSinglePhoto() {
        if (this.availablePhotos.length <= 4) {
            return;
        }
        
        // Escolhe uma posição aleatória
        const randomIndex = Math.floor(Math.random() * 4);
        
        // Encontra uma foto que não está no mosaico atual
        const availableNewPhotos = this.availablePhotos.filter(photo => 
            !this.photos.includes(photo)
        );
        
        if (availableNewPhotos.length > 0) {
            const newPhoto = availableNewPhotos[Math.floor(Math.random() * availableNewPhotos.length)];
            this.replaceSinglePhoto(randomIndex, newPhoto);
            this.photos[randomIndex] = newPhoto;
        }
    }
    
    loadImageInMosaicItem(mosaicItem, photoUrl) {
        // Remove imagem existente
        const existingImg = mosaicItem.querySelector('img');
        if (existingImg) {
            existingImg.remove();
        }
        
        // Cria nova imagem
        const img = document.createElement('img');
        img.alt = 'Foto do mosaico';
        
        // Adiciona timestamp para evitar cache
        const timestamp = Date.now();
        const finalUrl = photoUrl.includes('?') ? `${photoUrl}&t=${timestamp}` : `${photoUrl}?t=${timestamp}`;
        
        const fileName = photoUrl.split('/').pop();
        console.log(`🔄 Tentando carregar: ${fileName}`);
        
        img.onload = () => {
            console.log(`✅ Imagem carregada com sucesso: ${fileName}`);
        };
        
        img.onerror = (event) => {
            console.error(`❌ Erro ao carregar: ${photoUrl}`);
            console.error(`📁 Arquivo: ${fileName}`);
            console.error(`🔗 URL completa: ${finalUrl}`);
            
            // Se é um arquivo AVIF e o navegador não suporta, tenta converter
            if (fileName.toLowerCase().endsWith('.avif') && this.avifSupported === false) {
                console.warn(`⚠️ Navegador não suporta AVIF, tentando formato alternativo...`);
                
                // Tenta carregar uma versão convertida (se disponível)
                const alternativeUrl = photoUrl.replace('.avif', '.jpg');
                console.log(`🔄 Tentando formato alternativo: ${alternativeUrl}`);
                
                img.onerror = () => {
                    this.showErrorImage(img, fileName, finalUrl);
                };
                
                img.src = alternativeUrl;
                return;
            }
            
            // Tenta verificar se o arquivo existe fazendo uma requisição HEAD
            fetch(photoUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        console.log(`✅ Arquivo existe no servidor (${response.status})`);
                        console.log(`📊 Tamanho: ${response.headers.get('content-length') || 'desconhecido'} bytes`);
                    } else {
                        console.error(`❌ Arquivo não encontrado no servidor (${response.status})`);
                    }
                })
                .catch(error => {
                    console.error(`❌ Erro ao verificar arquivo: ${error.message}`);
                });
            
            this.showErrorImage(img, fileName, finalUrl);
        };
        
        img.src = finalUrl;
        mosaicItem.appendChild(img);
    }
    
    showErrorImage(img, fileName, retryUrl) {
        // Mostra imagem de erro mais informativa
        img.src = `data:image/svg+xml;base64,${btoa(`
            <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg">
                <rect width="100%" height="100%" fill="#2c3e50"/>
                <text x="50%" y="40%" font-family="Arial" font-size="16" fill="#ecf0f1" text-anchor="middle">Erro ao carregar</text>
                <text x="50%" y="55%" font-family="Arial" font-size="12" fill="#bdc3c7" text-anchor="middle">${fileName}</text>
                <text x="50%" y="70%" font-family="Arial" font-size="10" fill="#95a5a6" text-anchor="middle">Clique para tentar novamente</text>
            </svg>
        `)}`;
        
        // Adiciona evento de clique para tentar recarregar
        img.onclick = () => {
            console.log(`🔄 Tentando recarregar: ${fileName}`);
            img.src = retryUrl;
        };
    }
    
    replaceSinglePhoto(mosaicIndex, newPhotoUrl) {
        const mosaicItem = this.mosaic.children[mosaicIndex];
        
        if (!mosaicItem) {
            console.error('Item do mosaico não encontrado:', mosaicIndex);
            return;
        }
        
        const currentImg = mosaicItem.querySelector('img');
        
        if (currentImg) {
            // Transição mais suave
            currentImg.style.transition = 'opacity 0.6s ease-in-out';
            currentImg.style.opacity = '0.3';
            
            setTimeout(() => {
                currentImg.src = newPhotoUrl;
                currentImg.style.opacity = '1';
                
                setTimeout(() => {
                    currentImg.style.transition = '';
                }, 600);
            }, 300);
        } else {
            // Carrega diretamente se não há imagem
            this.loadImageInMosaicItem(mosaicItem, newPhotoUrl);
        }
    }
    
    startFolderMonitoring() {
        this.stopFolderMonitoring();
        
        // Primeira verificação imediata
        this.checkForNewPhotos();
        
        // Monitoramento regular mais estável
        this.checkTimer = setInterval(() => {
            this.checkForNewPhotos();
        }, this.config.checkInterval);
        
        console.log(`📁 Monitoramento de pasta iniciado: ${this.config.checkInterval}ms`);
    }
    
    stopFolderMonitoring() {
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
    }
    
    async checkForNewPhotos() {
        const startTime = performance.now();
        const timestamp = new Date().toLocaleTimeString('pt-BR', { 
            hour12: false, 
            fractionalSecondDigits: 3 
        });
        
        try {
            console.log(`[${timestamp}] 🔍 Iniciando verificação de novas fotos...`);
            
            // Timeout para evitar travamentos
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout
            
            const response = await fetch('/api/photos', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                const newPhotos = await response.json();
                
                // Aplica filtro de suporte do navegador nas novas fotos
                const filteredNewPhotos = this.filterPhotosBySupport(newPhotos);
                
                // Verifica se há mudanças (novas fotos ou mudança no total)
                const hasChanges = filteredNewPhotos.length !== this.availablePhotos.length;
                const currentPhotoNames = this.availablePhotos.map(p => p.split('/').pop());
                const newPhotoNames = filteredNewPhotos.map(p => p.split('/').pop());
                const addedPhotos = newPhotoNames.filter(name => !currentPhotoNames.includes(name));
                
                const endTime = performance.now();
                const detectionTime = endTime - startTime;
                
                if (addedPhotos.length > 0 || hasChanges) {
                    console.log(`[${timestamp}] 🆕 Novas fotos detectadas em ${detectionTime.toFixed(1)}ms:`, addedPhotos);
                    console.log(`[${timestamp}] 📊 Total de fotos: ${this.availablePhotos.length} → ${filteredNewPhotos.length}`);
                    
                    // Força atualização imediata se há mudanças
                    this.addNewPhotosToMosaic(filteredNewPhotos, addedPhotos);
                } else {
                    console.log(`[${timestamp}] 📁 Verificação concluída em ${detectionTime.toFixed(1)}ms: nenhuma nova foto`);
                }
            } else {
                console.error(`[${timestamp}] ❌ Erro na resposta da API:`, response.status);
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`[${timestamp}] ⏰ Timeout na verificação de fotos`);
            } else {
                console.error(`[${timestamp}] ❌ Erro ao verificar novas fotos:`, error);
            }
        }
    }
    
    addNewPhotosToMosaic(newPhotos, addedPhotos = []) {
        const startTime = performance.now();
        const timestamp = new Date().toLocaleTimeString('pt-BR', { 
            hour12: false, 
            fractionalSecondDigits: 3 
        });
        
        console.log(`[${timestamp}] 🔄 Iniciando atualização de fotos...`);
        this.availablePhotos = newPhotos;
        
        // Se não há fotos novas específicas, usa todas as fotos disponíveis
        const photosToProcess = addedPhotos.length > 0 ? addedPhotos : newPhotos;
        
        console.log(`[${timestamp}] 📸 ${photosToProcess.length} fotos disponíveis para adicionar`);
        
        if (photosToProcess.length > 0) {
            // Adiciona até 4 novas fotos ao mosaico IMEDIATAMENTE
            const photosToAdd = Math.min(photosToProcess.length, 4);
            
            const displayStartTime = performance.now();
            
            // Substitui posições aleatórias com novas fotos IMEDIATAMENTE
            for (let i = 0; i < photosToAdd; i++) {
                const newPhoto = photosToProcess[i];
                const randomIndex = Math.floor(Math.random() * 4);
                
                console.log(`[${timestamp}] ➕ Adicionando nova foto: ${newPhoto.split('/').pop()} na posição ${randomIndex}`);
                this.replaceSinglePhoto(randomIndex, newPhoto);
                this.photos[randomIndex] = newPhoto;
            }
            
            const displayEndTime = performance.now();
            const displayTime = displayEndTime - displayStartTime;
            const totalTime = displayEndTime - startTime;
            
            this.updateStatus(`${photosToAdd} novas fotos adicionadas!`);
            console.log(`[${timestamp}] ✅ ${photosToAdd} novas fotos exibidas em ${displayTime.toFixed(1)}ms (total: ${totalTime.toFixed(1)}ms)`);
        }
    }
    
    updateStatus(message = null) {
        if (this.status) {
            if (message) {
                this.status.textContent = message;
            } else {
                this.status.textContent = `Fotos: ${this.photos.length}/${this.availablePhotos.length}`;
            }
        }
    }
    
    // showFullscreen e closeFullscreen removidos - clique desabilitado
    
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.startAutoRotation();
        this.startFolderMonitoring();
        console.log('Configurações atualizadas:', this.config);
    }
    
    getConfig() {
        return this.config;
    }
}

// Funções do modal
function toggleConfigModal() {
    console.log('🔧 Tentando abrir/fechar modal de configurações...');
    const modal = document.getElementById('configModal');
    if (!modal) {
        console.error('❌ Modal de configurações não encontrado');
        return;
    }
    
    if (modal.style.display === 'block') {
        closeConfigModal();
    } else {
        openConfigModal();
    }
}

function openConfigModal() {
    console.log('🔧 Abrindo modal de configurações...');
    const modal = document.getElementById('configModal');
    const rotationInput = document.getElementById('rotationInterval');
    const checkInput = document.getElementById('checkInterval');
    
    if (!modal) {
        console.error('❌ Modal não encontrado');
        return;
    }
    
    if (!rotationInput || !checkInput) {
        console.error('❌ Campos de configuração não encontrados');
        return;
    }
    
    // Carrega as configurações atuais
    if (window.photoMosaic) {
        const config = window.photoMosaic.getConfig();
        rotationInput.value = config.rotationInterval / 1000;
        checkInput.value = config.checkInterval / 1000;
        console.log('✅ Configurações carregadas:', config);
    } else {
        console.error('❌ PhotoMosaic não inicializado');
        // Define valores padrão
        rotationInput.value = 15;
        checkInput.value = 30;
    }
    
    modal.style.display = 'block';
    console.log('✅ Modal aberto');
}

function closeConfigModal() {
    const modal = document.getElementById('configModal');
    modal.style.display = 'none';
}

function saveConfig() {
    const rotationInput = document.getElementById('rotationInterval');
    const checkInput = document.getElementById('checkInterval');
    
    if (!rotationInput || !checkInput) {
        console.error('Elementos de configuração não encontrados');
        return;
    }
    
    const newConfig = {
        rotationInterval: parseInt(rotationInput.value) * 1000,
        checkInterval: parseInt(checkInput.value) * 1000
    };
    
    if (window.photoMosaic) {
        window.photoMosaic.updateConfig(newConfig);
        console.log('✅ Configurações salvas:', newConfig);
    } else {
        console.error('❌ PhotoMosaic não inicializado');
    }
    
    closeConfigModal();
}

function shufflePhotos() {
    if (window.photoMosaic) {
        window.photoMosaic.shufflePhotos();
        console.log('🔄 Fotos embaralhadas');
    } else {
        console.error('❌ PhotoMosaic não inicializado');
    }
}

function addRandomPhoto() {
    if (window.photoMosaic) {
        window.photoMosaic.addRandomPhoto();
        console.log('➕ Foto aleatória adicionada');
    } else {
        console.error('❌ PhotoMosaic não inicializado');
    }
}

// closeFullscreen removido - clique desabilitado

// Inicializa a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando PhotoMosaic...');
    try {
        window.photoMosaic = new PhotoMosaic();
        console.log('✅ PhotoMosaic inicializado com sucesso');
    } catch (error) {
        console.error('❌ Erro ao inicializar PhotoMosaic:', error);
    }
}); 