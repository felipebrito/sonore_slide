class PhotoMosaic {
    constructor() {
        this.mosaic = document.getElementById('mosaic');
        this.status = document.getElementById('status');
        
        // Configurações
        this.config = {
            rotationInterval: 15000, // 15 segundos
            checkInterval: 30000,    // 30 segundos
        };
        
        // Timers
        this.rotationTimer = null;
        this.checkTimer = null;
        
        this.photos = [];
        this.photoQueue = [];
        this.isTransitioning = false;
        this.currentPhotoIndex = 0;
        this.availablePhotos = [];
        
        this.init();
    }
    
    init() {
        this.createMosaicGrid();
        this.bindEvents();
        this.loadLocalPhotos();
        this.startAutoRotation();
        this.setupKeyboardShortcuts();
    }
    
    createMosaicGrid() {
        this.mosaic.innerHTML = '';
        
        // Cria 4 itens do mosaico (em vez de 9)
        for (let i = 0; i < 4; i++) {
            const item = document.createElement('div');
            item.className = 'mosaic-item';
            item.setAttribute('data-index', i);
            
            // Adiciona evento de clique para visualização em tela cheia
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    this.showFullscreen(img.src);
                }
            });
            
            this.mosaic.appendChild(item);
        }
        
        console.log('Mosaico criado com 4 itens verticais');
    }
    
    bindEvents() {
        // Os botões agora usam onclick no HTML
        // Apenas iniciamos o monitoramento da pasta
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
        // Algoritmo Fisher-Yates para embaralhar array
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    async loadLocalPhotos() {
        try {
            this.updateStatus('Detectando fotos...');
            
            // Detecta fotos automaticamente
            this.availablePhotos = await getAvailablePhotos();
            console.log('Fotos detectadas automaticamente:', this.availablePhotos.length);
            
            if (this.availablePhotos.length === 0) {
                this.updateStatus('Nenhuma foto encontrada na pasta Fotos');
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
            
            console.log('Mosaico inicializado com fotos únicas:', this.photos.map(p => p.split('/').pop()));
            this.updateStatus(`Mosaico carregado com ${this.photos.length} fotos verticais`);
            
        } catch (error) {
            console.error('Erro ao carregar fotos:', error);
            this.updateStatus('Erro ao carregar fotos');
        }
    }
    
    async checkPhotoExists(photoPath) {
        try {
            const response = await fetch(photoPath, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
    
    loadSamplePhotos() {
        // URLs de fotos de exemplo como fallback
        this.availablePhotos = [
            'https://picsum.photos/300/300?random=1',
            'https://picsum.photos/300/300?random=2',
            'https://picsum.photos/300/300?random=3',
            'https://picsum.photos/300/300?random=4',
            'https://picsum.photos/300/300?random=5',
            'https://picsum.photos/300/300?random=6',
            'https://picsum.photos/300/300?random=7',
            'https://picsum.photos/300/300?random=8',
            'https://picsum.photos/300/300?random=9',
            'https://picsum.photos/300/300?random=10',
            'https://picsum.photos/300/300?random=11',
            'https://picsum.photos/300/300?random=12'
        ];
        
        this.photos = this.availablePhotos.slice(0, 9);
        this.updateMosaic();
        this.updateStatus();
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
        const photoElement = document.querySelector(`[data-index="${index}"]`);
        if (!photoElement) return;
        
        // Adiciona classe de fade-out
        photoElement.classList.add('fade-out');
        
        setTimeout(() => {
            // Atualiza a imagem
            const imgElement = photoElement.querySelector('img');
            if (imgElement) {
                imgElement.src = newPhoto;
            }
            
            // Remove fade-out e adiciona fade-in
            photoElement.classList.remove('fade-out');
            photoElement.classList.add('fade-in');
            
            setTimeout(() => {
                photoElement.classList.remove('fade-in');
            }, 800);
        }, 400);
    }
    
    shufflePhotos() {
        if (this.availablePhotos.length < 4) {
            console.log('Não há fotos suficientes para embaralhar');
            this.updateStatus('Não há fotos suficientes para embaralhar');
            return;
        }
        
        // Embaralha todas as fotos disponíveis
        this.shuffleArray(this.availablePhotos);
        
        // Seleciona as primeiras 4 fotos embaralhadas
        this.photos = this.availablePhotos.slice(0, 4);
        
        // Atualiza o mosaico com as novas fotos
        this.photos.forEach((photo, index) => {
            this.loadImageInMosaicItem(this.mosaic.children[index], photo);
        });
        
        console.log('Fotos embaralhadas:', this.photos.map(p => p.split('/').pop()));
        this.updateStatus('Fotos embaralhadas com sucesso');
    }
    
    updateMosaic() {
        this.mosaic.innerHTML = '';
        
        for (let i = 0; i < 9; i++) {
            const photoUrl = this.photos[i] || '';
            const item = document.createElement('div');
            item.className = 'mosaic-item';
            item.setAttribute('data-index', i);
            
            if (photoUrl) {
                item.innerHTML = `<img src="${photoUrl}" alt="Foto ${i + 1}" loading="lazy">`;
            } else {
                item.innerHTML = '<div class="placeholder">Sem foto</div>';
            }
            
            item.addEventListener('click', () => this.showFullscreen(photoUrl));
            this.mosaic.appendChild(item);
        }
    }
    
    updateMosaicWithAnimation() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        const items = this.mosaic.querySelectorAll('.mosaic-item');
        const promises = [];
        
        items.forEach((item, index) => {
            const promise = new Promise((resolve) => {
                if (this.availablePhotos[index]) {
                    // Adiciona classe de fade-out
                    item.classList.add('fade-out');
                    
                    setTimeout(() => {
                        // Atualiza a imagem
                        item.innerHTML = `<img src="${this.availablePhotos[index]}" alt="Foto ${index + 1}" loading="lazy">`;
                        item.className = 'mosaic-item';
                        
                        // Atualiza o array de fotos
                        this.photos[index] = this.availablePhotos[index];
                        
                        // Adiciona classe de fade-in
                        item.classList.add('fade-in');
                        
                        setTimeout(() => {
                            item.classList.remove('fade-in');
                            resolve();
                        }, 800);
                    }, 400);
                } else {
                    item.className = 'mosaic-item placeholder';
                    item.innerHTML = `<span>Posição ${index + 1}</span>`;
                    resolve();
                }
            });
            
            promises.push(promise);
        });
        
        Promise.all(promises).then(() => {
            this.isTransitioning = false;
            this.updateStatus();
        });
    }
    
    startAutoRotation() {
        this.stopAutoRotation(); // Para o timer anterior se existir
        this.rotationTimer = setInterval(() => {
            if (!this.isTransitioning && this.availablePhotos.length > 4) {
                this.rotateSinglePhoto();
            }
        }, this.config.rotationInterval);
    }
    
    stopAutoRotation() {
        if (this.rotationTimer) {
            clearInterval(this.rotationTimer);
            this.rotationTimer = null;
        }
    }
    
    rotateSinglePhoto() {
        if (this.isTransitioning || this.availablePhotos.length <= 4) {
            console.log('Não há fotos suficientes para rotação ou já está em transição');
            return;
        }
        
        // Filtra fotos que não estão atualmente no mosaico
        const availableNewPhotos = this.availablePhotos.filter(photo => 
            !this.photos.includes(photo)
        );
        
        if (availableNewPhotos.length === 0) {
            console.log('Não há fotos novas disponíveis para rotação');
            return;
        }
        
        // Escolhe uma foto aleatória das disponíveis
        const newPhoto = availableNewPhotos[Math.floor(Math.random() * availableNewPhotos.length)];
        
        // Escolhe uma posição aleatória no mosaico (0-3)
        const randomMosaicIndex = Math.floor(Math.random() * 4);
        
        console.log(`Rotacionando foto na posição ${randomMosaicIndex}: ${newPhoto.split('/').pop()}`);
        
        // Substitui a foto na posição escolhida
        this.replaceSinglePhoto(randomMosaicIndex, newPhoto);
        
        // Atualiza o array de fotos
        this.photos[randomMosaicIndex] = newPhoto;
        
        this.updateStatus();
    }
    
    loadImageInMosaicItem(mosaicItem, photoUrl) {
        const img = new Image();
        img.src = photoUrl;
        img.alt = 'Foto';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.transition = 'opacity 0.4s ease-in';
        img.style.opacity = '0';
        
        img.onload = () => {
            mosaicItem.innerHTML = '';
            mosaicItem.appendChild(img);
            setTimeout(() => {
                img.style.opacity = '1';
            }, 50);
        };
        
        img.onerror = () => {
            console.error(`Erro ao carregar imagem: ${photoUrl}`);
            mosaicItem.innerHTML = '<div class="placeholder">Erro ao carregar</div>';
        };
    }

    replaceSinglePhoto(mosaicIndex, newPhotoUrl) {
        const mosaicItem = this.mosaic.children[mosaicIndex];
        const currentImg = mosaicItem.querySelector('img');
        
        if (!currentImg) {
            // Se não há imagem atual, apenas carrega a nova
            this.loadImageInMosaicItem(mosaicItem, newPhotoUrl);
            return;
        }
        
        // Cria uma nova imagem para a transição
        const newImg = new Image();
        
        // Configura a nova imagem
        newImg.style.position = 'absolute';
        newImg.style.top = '0';
        newImg.style.left = '0';
        newImg.style.width = '100%';
        newImg.style.height = '100%';
        newImg.style.objectFit = 'cover';
        newImg.style.opacity = '0';
        newImg.style.transition = 'opacity 0.4s ease-in';
        
        // Adiciona a nova imagem ao item
        mosaicItem.appendChild(newImg);
        
        // Quando a nova imagem carregar, faz a transição
        newImg.onload = () => {
            // Fade out da imagem atual
            currentImg.style.transition = 'opacity 0.4s ease-out';
            currentImg.style.opacity = '0';
            
            // Fade in da nova imagem
            setTimeout(() => {
                newImg.style.opacity = '1';
            }, 50);
            
            // Remove a imagem antiga após a transição
            setTimeout(() => {
                if (currentImg.parentNode) {
                    currentImg.parentNode.removeChild(currentImg);
                }
            }, 400);
        };
        
        // Carrega a nova imagem
        newImg.src = newPhotoUrl;
        
        // Fallback se a imagem não carregar
        newImg.onerror = () => {
            console.error(`Erro ao carregar imagem: ${newPhotoUrl}`);
            if (newImg.parentNode) {
                newImg.parentNode.removeChild(newImg);
            }
        };
    }
    
    startFolderMonitoring() {
        this.stopFolderMonitoring(); // Para o timer anterior se existir
        this.checkTimer = setInterval(async () => {
            await this.checkForNewPhotos();
        }, this.config.checkInterval);
    }
    
    stopFolderMonitoring() {
        if (this.checkTimer) {
            clearInterval(this.checkTimer);
            this.checkTimer = null;
        }
    }
    
    async checkForNewPhotos() {
        if (typeof window.getAvailablePhotos === 'function') {
            try {
                const newAvailablePhotos = await window.getAvailablePhotos();
                
                // Se encontrou novas fotos
                if (newAvailablePhotos.length > this.availablePhotos.length) {
                    console.log('Novas fotos detectadas!', newAvailablePhotos.length, 'fotos disponíveis');
                    
                    // Encontra as novas fotos
                    const newPhotos = newAvailablePhotos.filter(photo => 
                        !this.availablePhotos.includes(photo)
                    );
                    
                    console.log('Novas fotos encontradas:', newPhotos.map(p => p.split('/').pop()));
                    
                    // Atualiza a lista de fotos disponíveis
                    this.availablePhotos = newAvailablePhotos;
                    
                    // Adiciona as novas fotos ao mosaico, substituindo fotos antigas
                    this.addNewPhotosToMosaic(newPhotos);
                    
                    this.updateStatus();
                }
            } catch (error) {
                console.error('Erro na detecção automática:', error);
            }
        }
    }
    
    addNewPhotosToMosaic(newPhotos) {
        // Para cada nova foto, substitui uma foto antiga no mosaico
        newPhotos.forEach((newPhoto, index) => {
            if (index < 9) { // Máximo 9 substituições
                // Verifica se a nova foto já está no mosaico
                if (this.photos.includes(newPhoto)) {
                    console.log(`Foto ${newPhoto.split('/').pop()} já está no mosaico, pulando...`);
                    return;
                }
                
                // Escolhe uma posição aleatória no mosaico
                const randomIndex = Math.floor(Math.random() * this.photos.length);
                const oldPhoto = this.photos[randomIndex];
                
                // Verifica se a foto antiga é diferente da nova
                if (oldPhoto === newPhoto) {
                    console.log(`Tentativa de substituir ${oldPhoto.split('/').pop()} por ela mesma, pulando...`);
                    return;
                }
                
                // Substitui a foto
                this.photos[randomIndex] = newPhoto;
                
                // Anima a transição
                this.animatePhotoChange(randomIndex, oldPhoto, newPhoto);
                
                console.log(`Nova foto adicionada: ${oldPhoto.split('/').pop()} → ${newPhoto.split('/').pop()}`);
            }
        });
    }
    
    updateStatus(message = null) {
        if (this.status) {
            if (message) {
                this.status.textContent = message;
            } else {
                const totalPhotos = this.availablePhotos.length;
                const currentPhotos = this.photos.length;
                this.status.textContent = `Mosaico: ${currentPhotos}/4 fotos verticais | Total: ${totalPhotos} fotos disponíveis`;
            }
        }
    }
    
    showFullscreen(photoUrl) {
        if (!photoUrl) return;
        
        // Cria um modal para exibir a foto em tela cheia
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        `;
        
        const img = document.createElement('img');
        img.src = photoUrl;
        img.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            object-fit: contain;
            border: 2px solid #333;
        `;
        
        modal.appendChild(img);
        document.body.appendChild(modal);
        
        // Fecha o modal ao clicar
        modal.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Fecha o modal com a tecla ESC
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }
    
    // Métodos para configuração
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        
        // Reinicia os timers com as novas configurações
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
    const modal = document.getElementById('configModal');
    if (modal.style.display === 'block') {
        closeConfigModal();
    } else {
        openConfigModal();
    }
}

function openConfigModal() {
    const modal = document.getElementById('configModal');
    const rotationInput = document.getElementById('rotationInterval');
    const checkInput = document.getElementById('checkInterval');
    
    // Carrega as configurações atuais
    if (window.photoMosaic) {
        const config = window.photoMosaic.getConfig();
        rotationInput.value = config.rotationInterval / 1000;
        checkInput.value = config.checkInterval / 1000;
    }
    
    modal.style.display = 'block';
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

function closeFullscreen() {
    const modal = document.getElementById('fullscreenModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Inicializa a aplicação quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    window.photoMosaic = new PhotoMosaic();
});

// Adiciona funcionalidade de drag and drop para upload de fotos
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    
    body.addEventListener('dragover', (e) => {
        e.preventDefault();
        body.style.opacity = '0.8';
    });
    
    body.addEventListener('dragleave', (e) => {
        e.preventDefault();
        body.style.opacity = '1';
    });
    
    body.addEventListener('drop', (e) => {
        e.preventDefault();
        body.style.opacity = '1';
        
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
            imageFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const photoMosaic = window.photoMosaic || document.querySelector('.photo-mosaic');
                    if (photoMosaic && photoMosaic.addPhotoFromFile) {
                        photoMosaic.addPhotoFromFile(e.target.result);
                    }
                };
                reader.readAsDataURL(file);
            });
        }
    });
}); 