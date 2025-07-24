#!/usr/bin/env python3
"""
Servidor simplificado para a aplicação Mosaico de Fotos
"""

import http.server
import socketserver
import os
import json
import mimetypes

class PhotoServer(http.server.SimpleHTTPRequestHandler):
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

if __name__ == "__main__":
    PORT = 8000
    
    try:
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
            print("⚠️  Para parar o servidor, pressione Ctrl+C")
            print()
            
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