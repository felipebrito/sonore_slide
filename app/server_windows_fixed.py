"""
Servidor corrigido para a aplicação Mosaico de Fotos - Versão Windows
Com correção de encoding e tratamento de arquivos removidos
"""

import http.server
import socketserver
import os
import json
import mimetypes
import sys
import signal
import time

class PhotoServer(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        """Override para melhor logging sem caracteres especiais"""
        timestamp = time.strftime("%H:%M:%S")
        message = format % args
        print(f"[{timestamp}] {message}")
    
    def do_GET(self):
        # Redirecionar raiz para a aplicação
        if self.path == '/':
            self.send_response(302)
            self.send_header('Location', '/index_corrigido.html')
            self.end_headers()
            return
        
        # API para listar fotos
        if self.path == '/api/photos':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            photos = self.get_photos_from_directory()
            self.wfile.write(json.dumps(photos).encode('utf-8'))
            return
        
        # Servir fotos da pasta Fotos/
        elif self.path.startswith('/Fotos/'):
            # Construir caminho para pasta Fotos na raiz (um nível acima de app/)
            fotos_dir = os.path.join(os.path.dirname(os.getcwd()), 'Fotos')
            photo_path = self.path[7:]  # Remove '/Fotos/' prefix
            full_path = os.path.join(fotos_dir, photo_path)
            
            if os.path.exists(full_path) and os.path.isfile(full_path):
                self.send_response(200)
                
                # Determinar tipo MIME
                content_type, _ = mimetypes.guess_type(full_path)
                if content_type:
                    self.send_header('Content-type', content_type)
                
                self.end_headers()
                
                with open(full_path, 'rb') as f:
                    self.wfile.write(f.read())
            else:
                self.send_error(404, f'Photo not found: {full_path}')
            return
        
        # Servir arquivos estáticos da pasta app
        elif self.path.startswith('/'):
            # Verificar se arquivo existe na pasta app
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
                # Se arquivo não existe, redirecionar para index_corrigido.html
                self.send_response(302)
                self.send_header('Location', '/index_corrigido.html')
                self.end_headers()
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

class StoppableHTTPServer(socketserver.TCPServer):
    """Servidor HTTP que pode ser parado graciosamente"""
    
    def __init__(self, server_address, RequestHandlerClass):
        self.shutdown_flag = False
        super().__init__(server_address, RequestHandlerClass)
    
    def serve_forever(self):
        """Serve até que shutdown_flag seja True"""
        while not self.shutdown_flag:
            self.handle_request()
    
    def shutdown(self):
        """Marca o servidor para parar"""
        self.shutdown_flag = True

def signal_handler(signum, frame):
    """Handler para Ctrl+C"""
    print("\n[STOP] Recebido sinal de parada (Ctrl+C)")
    print("[INFO] Parando servidor...")
    if hasattr(signal_handler, 'server'):
        signal_handler.server.shutdown()
    print("[OK] Servidor parado com sucesso!")
    sys.exit(0)

if __name__ == "__main__":
    PORT = 5000
    
    # Configurar handler para Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    
    try:
        # Criar servidor com melhor tratamento de erros
        httpd = StoppableHTTPServer(("", PORT), PhotoServer)
        signal_handler.server = httpd
        
        print("=" * 50)
        print("   PHOTO MOSAIC SERVER - VERSÃO CORRIGIDA")
        print("=" * 50)
        print(f"[OK] Servidor iniciado na porta {PORT}")
        print(f"[URL] Acesse: http://localhost:{PORT}")
        print(f"[DIR] Diretorio atual: {os.getcwd()}")
        print(f"[FOTOS] Pasta Fotos: {os.path.join(os.path.dirname(os.getcwd()), 'Fotos')}")
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
        
        # Iniciar servidor
        httpd.serve_forever()
        
    except KeyboardInterrupt:
        print("\n[STOP] Photo Mosaic encerrado pelo usuario.")
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"[ERRO] Porta {PORT} ja esta em uso!")
            print("   Feche outras instancias ou use uma porta diferente")
        else:
            print(f"[ERRO] Erro do sistema: {e}")
    except Exception as e:
        print(f"[ERRO] Erro inesperado: {e}")
    finally:
        print("[FIM] Photo Mosaic finalizado.") 