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
        print(f"Request: {self.path}")
        
        # Handle API endpoint for listing photos
        if self.path == '/api/photos':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Get actual photos from the Fotos directory
            photos = self.get_photos_from_directory()
            response = json.dumps(photos)
            print(f"API Response: {response}")
            self.wfile.write(response.encode())
            return
        
        # Handle static files
        elif self.path.startswith('/fotos/'):
            # Serve photos from the Fotos directory
            photo_path = self.path[7:]  # Remove '/fotos/' prefix
            full_path = os.path.join('Fotos', photo_path)
            
            if os.path.exists(full_path) and os.path.isfile(full_path):
                # Determine content type
                content_type, _ = mimetypes.guess_type(full_path)
                if content_type is None:
                    content_type = 'application/octet-stream'
                
                self.send_response(200)
                self.send_header('Content-type', content_type)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                with open(full_path, 'rb') as f:
                    self.wfile.write(f.read())
                return
            else:
                self.send_error(404, 'Photo not found')
                return
        
        # Handle other static files
        else:
            super().do_GET()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def get_photos_from_directory(self):
        """Get actual photos from the Fotos directory"""
        photos = []
        fotos_dir = 'Fotos'
        
        print(f"Checking directory: {os.path.abspath(fotos_dir)}")
        
        if os.path.exists(fotos_dir) and os.path.isdir(fotos_dir):
            # Supported image extensions
            image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.webp'}
            
            try:
                # List all files in the directory
                files = os.listdir(fotos_dir)
                print(f"Files in directory: {files}")
                
                for filename in files:
                    file_path = os.path.join(fotos_dir, filename)
                    
                    # Check if it's a file and has an image extension
                    if os.path.isfile(file_path):
                        _, ext = os.path.splitext(filename.lower())
                        if ext in image_extensions:
                            # Add to photos list with /fotos/ prefix
                            photos.append(f'/fotos/{filename}')
                
                # Sort photos for consistent ordering
                photos.sort()
                
                print(f"Found {len(photos)} photos in directory: {photos}")
                
            except Exception as e:
                print(f"Error reading photos directory: {e}")
                return []
        else:
            print(f"Directory {fotos_dir} does not exist or is not a directory")
        
        return photos

if __name__ == "__main__":
    PORT = 8000
    
    # Check if port is already in use
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', PORT))
    sock.close()
    
    if result == 0:
        print(f"Port {PORT} is already in use. Please stop the existing server first.")
        print("You can use: lsof -ti:8000 | xargs kill -9")
        exit(1)
    
    print(f"Starting server on port {PORT}")
    print(f"Current directory: {os.getcwd()}")
    print(f"Fotos directory exists: {os.path.exists('Fotos')}")
    
    with socketserver.TCPServer(("", PORT), PhotoServer) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.") 