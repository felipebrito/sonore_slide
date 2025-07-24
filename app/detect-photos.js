// Script para detectar automaticamente todas as fotos na pasta
// Este script pode ser usado para gerar a lista de fotos dinamicamente

class PhotoDetector {
    constructor() {
        this.photoExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    }
    
    async detectPhotos() {
        console.log('🔍 Iniciando detecção real de fotos da pasta...');
        
        try {
            // Usa a API real do servidor que lista o conteúdo da pasta
            const response = await fetch('/api/photos');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const photos = await response.json();
            
            console.log(`✅ Detecção real concluída: ${photos.length} fotos encontradas na pasta`);
            console.log('Fotos detectadas:', photos.map(p => p.split('/').pop()).sort());
            
            return photos;
            
        } catch (error) {
            console.error('❌ Erro na detecção real:', error);
            
            // Fallback: tenta detectar fotos conhecidas se a API falhar
            console.log('🔄 Tentando detecção de fallback...');
            return await this.fallbackDetection();
        }
    }
    
    async fallbackDetection() {
        const photos = [];
        const knownPhotos = [
            '360_0001.jpg', 'foto1.jpg', 'foto2.jpg', 'foto3.jpg', 'foto4.jpg', 'foto5.jpg',
            'foto6.jpg', 'foto7.jpg', 'foto8.jpg', 'foto9.jpg', 'foto10.jpg', 'foto11.jpg',
            'foto12.jpg', 'foto14.jpg', 'foto16.jpg', 'foto18.jpg', 'foto20.jpg', 'foto22.jpg'
        ];
        
        for (const photoName of knownPhotos) {
            const photoPath = `/fotos/${photoName}`;
            if (await this.checkPhotoExists(photoPath)) {
                photos.push(photoPath);
            }
        }
        
        console.log(`🔄 Fallback: ${photos.length} fotos detectadas`);
        return photos;
    }
    
    async checkPhotoExists(photoPath) {
        try {
            const response = await fetch(photoPath, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }
}

async function getAvailablePhotos() {
    const detector = new PhotoDetector();
    return await detector.detectPhotos();
}

// Disponibiliza a função globalmente
if (typeof window !== 'undefined') {
    window.getAvailablePhotos = getAvailablePhotos;
} 