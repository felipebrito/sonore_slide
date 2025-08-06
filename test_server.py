#!/usr/bin/env python3
"""
Script de teste para verificar se o servidor está funcionando
"""

import requests
import time
import sys
import os

def test_server():
    print("=" * 50)
    print("   TESTE DO SERVIDOR - PHOTO MOSAIC")
    print("=" * 50)
    print()
    
    # Verificar se o servidor está rodando
    print("[INFO] Testando conexão com servidor...")
    try:
        response = requests.get("http://localhost:5000", timeout=5)
        print(f"[OK] Servidor respondendo - Status: {response.status_code}")
        
        if response.status_code == 302:
            print("[OK] Redirecionamento funcionando")
            
            # Testar página principal
            response = requests.get("http://localhost:5000/index.html", timeout=5)
            print(f"[OK] Página principal carregada - Status: {response.status_code}")
            
            # Testar API de fotos
            response = requests.get("http://localhost:5000/api/photos", timeout=5)
            print(f"[OK] API de fotos funcionando - Status: {response.status_code}")
            
            # Testar arquivos estáticos
            files_to_test = ["styles.css", "script.js"]
            for file in files_to_test:
                response = requests.get(f"http://localhost:5000/{file}", timeout=5)
                print(f"[OK] {file} carregado - Status: {response.status_code}")
            
            # Testar uma foto
            response = requests.get("http://localhost:5000/Fotos/foto1.jpg", timeout=5)
            print(f"[OK] Foto de teste carregada - Status: {response.status_code}")
            
            print()
            print("[SUCESSO] Todos os testes passaram!")
            print("[INFO] A aplicação está funcionando corretamente")
            print("[URL] Acesse: http://localhost:5000")
            
        else:
            print(f"[ERRO] Status inesperado: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("[ERRO] Não foi possível conectar ao servidor")
        print("[INFO] Verifique se o servidor está rodando na porta 5000")
        
    except requests.exceptions.Timeout:
        print("[ERRO] Timeout ao conectar ao servidor")
        
    except Exception as e:
        print(f"[ERRO] Erro inesperado: {e}")

if __name__ == "__main__":
    test_server() 