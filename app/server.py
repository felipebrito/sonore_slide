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

# Detecção instantânea de fotos (sem cache)

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
        timestamp = time.strftime("%H:%M:%S.%f")[:-3]
        print(f"[{timestamp}] 🌐 Requisição recebida: {self.path}")
        
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
            timestamp = time.strftime("%H:%M:%S.%f")[:-3]
            print(f"[{timestamp}] 📡 Processando requisição /api/photos")
            
            try:
                photos = self.get_photos_from_directory_cached()
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
                self.send_header('Access-Control-Allow-Headers', 'Content-Type')
                self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')  # Sem cache
                self.send_header('Pragma', 'no-cache')
                self.send_header('Expires', '0')
                self.end_headers()

                response_data = json.dumps(photos)
                self.wfile.write(response_data.encode('utf-8'))
                
                # Log para debug
                print(f"[{timestamp}] ✅ API /api/photos: {len(photos)} fotos retornadas ({len(response_data)} bytes)")
                
            except Exception as e:
                print(f"[{timestamp}] ❌ Erro na API /api/photos: {e}")
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                error_response = json.dumps({"error": str(e)})
                self.wfile.write(error_response.encode('utf-8'))
            return

        # Servir fotos da pasta Fotos/
        elif self.path.startswith('/Fotos/'):
            from urllib.parse import unquote
            photo_path = unquote(self.path[7:])  # Remove '/Fotos/' prefix e decodifica URL
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
        # Sem cache - sempre lê a pasta diretamente
        start_time = time.time()
        photos = []
        
        timestamp = time.strftime("%H:%M:%S.%f")[:-3]
        print(f"[{timestamp}] 🔍 Iniciando leitura da pasta: {FOTOS_DIR}")
        
        if os.path.exists(FOTOS_DIR):
            try:
                files = os.listdir(FOTOS_DIR)
                print(f"[{timestamp}] 📁 Encontrados {len(files)} arquivos na pasta")
                
                for filename in files:
                    if filename.lower().endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif')):
                        photos.append(f'/Fotos/{filename}')
                        print(f"[{timestamp}] ✅ Foto detectada: {filename}")
                
            except Exception as e:
                print(f"[{timestamp}] ❌ Erro ao ler pasta: {e}")
        else:
            print(f"[{timestamp}] ❌ Pasta não encontrada: {FOTOS_DIR}")
        
        end_time = time.time()
        detection_time = (end_time - start_time) * 1000  # Convert to milliseconds
        
        # Log detalhado com timestamp
        print(f"[{timestamp}] 📸 Detecção concluída: {len(photos)} fotos em {detection_time:.1f}ms")
        
        return sorted(photos)

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