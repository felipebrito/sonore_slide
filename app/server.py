"""
Servidor fixo para Photo Mosaic - Ctrl+C Funcionando
- Ctrl+C funciona corretamente no Windows
- Sempre encontra a pasta Fotos na raiz do projeto
- Pode ser executado de qualquer diretório
- Não depende de módulos externos
"""

import http.server
import socketserver
import os
import json
import mimetypes
import sys
import signal
import time

# Cache de fotos para carregamento mais rápido
PHOTOS_CACHE = None
CACHE_TIMESTAMP = 0

# Função para encontrar a raiz do projeto
def find_project_root():
    current = os.path.abspath(os.getcwd())
    while True:
        if os.path.isdir(os.path.join(current, 'Fotos')) and os.path.isdir(os.path.join(current, 'app')):
            return current
        parent = os.path.dirname(current)
        if parent == current:
            break
        current = parent
    return os.path.abspath(os.getcwd())

PROJECT_ROOT = find_project_root()
FOTOS_DIR = os.path.join(PROJECT_ROOT, 'Fotos')
APP_DIR = os.path.join(PROJECT_ROOT, 'app')

class PhotoServer(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        # Log apenas erros para melhor performance
        if '404' in format or '500' in format:
            timestamp = time.strftime("%H:%M:%S")
            message = format % args
            print(f"[{timestamp}] {message}")

    def do_GET(self):
        # Redirecionar raiz para a aplicação
        if self.path == '/':
            self.send_response(302)
            self.send_header('Location', '/index.html')
            self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
            self.send_header('Pragma', 'no-cache')
            self.send_header('Expires', '0')
            self.end_headers()
            return

        # Handler para Service Worker (evita 404)
        if self.path == '/sw.js':
            self.send_response(404)
            self.send_header('Content-type', 'text/plain')
            self.end_headers()
            return

        # API para listar fotos (com cache)
        if self.path == '/api/photos':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Cache-Control', 'public, max-age=300')  # Cache por 5 minutos
            self.end_headers()

            photos = self.get_photos_from_directory_cached()
            self.wfile.write(json.dumps(photos).encode('utf-8'))
            return

        # Servir fotos da pasta Fotos/
        elif self.path.startswith('/Fotos/'):
            photo_path = self.path[7:]  # Remove '/Fotos/' prefix
            full_path = os.path.join(FOTOS_DIR, photo_path)

            if os.path.exists(full_path) and os.path.isfile(full_path):
                self.send_response(200)
                content_type, _ = mimetypes.guess_type(full_path)
                if content_type:
                    self.send_header('Content-type', content_type)
                # Headers para cache de imagens
                self.send_header('Cache-Control', 'public, max-age=86400')  # Cache por 24h
                self.send_header('Expires', 'Thu, 31 Dec 2025 23:59:59 GMT')
                self.end_headers()
                with open(full_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, f'Photo not found: {full_path}')
            return

        # Servir arquivos estáticos da pasta app
        elif self.path.startswith('/'):
            file_path = os.path.join(APP_DIR, self.path.lstrip('/'))
            if os.path.exists(file_path) and os.path.isfile(file_path):
                self.send_response(200)
                content_type, _ = mimetypes.guess_type(file_path)
                if content_type:
                    self.send_header('Content-type', content_type)
                
                # Cache diferente para arquivos estáticos
                if file_path.endswith('.css'):
                    self.send_header('Cache-Control', 'public, max-age=3600')  # 1h
                elif file_path.endswith('.js'):
                    self.send_header('Cache-Control', 'public, max-age=3600')  # 1h
                elif file_path.endswith('.html'):
                    self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')  # Sempre atual
                    self.send_header('Pragma', 'no-cache')
                    self.send_header('Expires', '0')
                
                self.end_headers()
                with open(file_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_response(302)
                self.send_header('Location', '/index.html')
                self.end_headers()
            return

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def get_photos_from_directory_cached(self):
        global PHOTOS_CACHE, CACHE_TIMESTAMP
        current_time = time.time()
        
        # Usar cache se ainda for válido (5 minutos)
        if PHOTOS_CACHE and (current_time - CACHE_TIMESTAMP) < 300:
            return PHOTOS_CACHE
        
        # Recarregar cache
        photos = []
        if os.path.exists(FOTOS_DIR):
            for filename in os.listdir(FOTOS_DIR):
                if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
                    photos.append(f'/Fotos/{filename}')
        
        PHOTOS_CACHE = sorted(photos)
        CACHE_TIMESTAMP = current_time
        return PHOTOS_CACHE

def signal_handler(signum, frame):
    print("\n[STOP] Recebido sinal de parada (Ctrl+C)")
    print("[INFO] Parando servidor...")
    try:
        if hasattr(signal_handler, 'server'):
            signal_handler.server.shutdown()
        print("[OK] Servidor parado com sucesso!")
    except:
        pass
    sys.exit(0)

if __name__ == "__main__":
    PORT = 5000
    
    # Configurar signal handler para Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        httpd = socketserver.TCPServer(("", PORT), PhotoServer)
        signal_handler.server = httpd
        httpd.allow_reuse_address = True
        
        print("=" * 50)
        print("   PHOTO MOSAIC SERVER - FIXO")
        print("=" * 50)
        print(f"[OK] Servidor iniciado na porta {PORT}")
        print(f"[URL] Acesse: http://localhost:{PORT}")
        print(f"[DIR] Projeto: {PROJECT_ROOT}")
        print(f"[FOTOS] Pasta Fotos: {FOTOS_DIR}")
        print()
        print("[DICAS] Controles:")
        print("   - Pressione C para configuracoes")
        print("   - Pressione R para adicionar foto")
        print("   - Pressione S para embaralhar")
        print("   - Pressione ESC para fechar modais")
        print()
        print("[STOP] Para parar o servidor, pressione Ctrl+C")
        print("=" * 50)
        print()
        
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print("\n[STOP] Photo Mosaic encerrado pelo usuario.")
    except OSError as e:
        if e.errno == 48:
            print(f"[ERRO] Porta {PORT} ja esta em uso!")
            print("   Feche outras instancias ou use uma porta diferente")
        else:
            print(f"[ERRO] Erro do sistema: {e}")
    except Exception as e:
        print(f"[ERRO] Erro inesperado: {e}")
    finally:
        print("[FIM] Photo Mosaic finalizado.") 