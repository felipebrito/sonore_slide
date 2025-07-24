#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Photo Mosaic - Aplicação Standalone
Versão que pode ser executada diretamente sem servidor externo
"""

import os
import sys
import webbrowser
import threading
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socketserver
import json
import mimetypes

class PhotoServer(SimpleHTTPRequestHandler):
    def do_GET(self):
        # API para listar fotos
        if self.path == '/api/photos':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            photos = self.get_photos_from_directory()
            self.wfile.write(json.dumps(photos).encode())
            return
        
        # Servir arquivos estáticos
        elif self.path.startswith('/'):
            # Mapear caminhos
            if self.path == '/':
                self.path = '/index.html'
            
            # Verificar se arquivo existe
            file_path = os.path.join(os.getcwd(), self.path.lstrip('/'))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                self.send_response(200)
                
                # Determinar tipo MIME
                content_type, _ = mimetypes.guess_type(file_path)
                if content_type:
                    self.send_header('Content-type', content_type)
                
                self.end_headers()
                
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, 'File not found')
            return
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def get_photos_from_directory(self):
        """Lista todas as fotos na pasta Fotos/ (um nível acima)"""
        photos = []
        fotos_dir = os.path.join(os.path.dirname(os.getcwd()), 'Fotos')
        
        if os.path.exists(fotos_dir):
            for filename in os.listdir(fotos_dir):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    photos.append(f'/Fotos/{filename}')
        
        return sorted(photos)

def create_icons():
    """Cria ícones básicos se não existirem"""
    icons_dir = 'icons'
    if not os.path.exists(icons_dir):
        os.makedirs(icons_dir)
    
    # Criar ícone simples em SVG se não existir
    icon_path = os.path.join(icons_dir, 'icon-192x192.png')
    if not os.path.exists(icon_path):
        # Criar ícone básico usando PIL se disponível
        try:
            from PIL import Image, ImageDraw
            
            # Criar ícone 192x192
            img = Image.new('RGB', (192, 192), color='black')
            draw = ImageDraw.Draw(img)
            
            # Desenhar 4 retângulos representando as fotos
            colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4']
            positions = [(10, 10, 85, 85), (97, 10, 172, 85), 
                        (10, 97, 85, 172), (97, 97, 172, 172)]
            
            for i, (x1, y1, x2, y2) in enumerate(positions):
                draw.rectangle([x1, y1, x2, y2], fill=colors[i])
            
            img.save(icon_path)
            
            # Criar outras versões
            sizes = [16, 32, 72, 96, 128, 144, 152, 384, 512]
            for size in sizes:
                resized = img.resize((size, size), Image.Resampling.LANCZOS)
                resized.save(os.path.join(icons_dir, f'icon-{size}x{size}.png'))
                
        except ImportError:
            print("⚠️  PIL não encontrado. Ícones não serão criados automaticamente.")
            print("   Instale com: pip install Pillow")

def main():
    """Função principal"""
    print("=" * 50)
    print("    📸 Photo Mosaic - Standalone")
    print("=" * 50)
    print()
    
    # Verificar se estamos no diretório correto
    if not os.path.exists('index.html'):
        print("❌ Erro: index.html não encontrado!")
        print("   Execute este script na pasta app do Photo Mosaic")
        input("Pressione Enter para sair...")
        return
    
    # Criar ícones se necessário
    create_icons()
    
    # Configurar servidor
    PORT = 8000
    
    try:
        # Criar servidor
        with socketserver.TCPServer(("", PORT), PhotoServer) as httpd:
            print(f"✅ Servidor iniciado na porta {PORT}")
            print(f"📍 Acesse: http://localhost:{PORT}")
            print()
            print("💡 Dicas:")
            print("   - Pressione C para configurações")
            print("   - Pressione R para adicionar foto")
            print("   - Pressione S para embaralhar")
            print("   - Pressione ESC para fechar modais")
            print()
            print("⚠️  Para parar, pressione Ctrl+C")
            print()
            
            # Abrir navegador automaticamente
            def open_browser():
                time.sleep(2)
                webbrowser.open(f'http://localhost:{PORT}')
            
            threading.Thread(target=open_browser, daemon=True).start()
            
            # Manter servidor rodando
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Photo Mosaic encerrado.")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Erro: Porta {PORT} já está em uso!")
            print("   Feche outras instâncias ou use uma porta diferente")
        else:
            print(f"❌ Erro: {e}")
    except Exception as e:
        print(f"❌ Erro inesperado: {e}")
    
    input("Pressione Enter para sair...")

if __name__ == "__main__":
    main() 