#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Photo Mosaic - Launcher
Script principal que inicia a aplicação
"""

import os
import sys
import subprocess

def main():
    """Função principal"""
    print("=" * 50)
    print("    📸 Photo Mosaic - Launcher")
    print("=" * 50)
    print()
    
    # Verificar se pasta app existe
    app_dir = os.path.join(os.path.dirname(__file__), 'app')
    if not os.path.exists(app_dir):
        print("❌ Erro: Pasta 'app' não encontrada!")
        print("   Certifique-se de que todos os arquivos estão presentes")
        input("Pressione Enter para sair...")
        return
    
    # Mudar para pasta app
    os.chdir(app_dir)
    
    # Executar o script standalone
    standalone_script = 'photo_mosaic_standalone.py'
    if os.path.exists(standalone_script):
        try:
            subprocess.run([sys.executable, standalone_script], check=True)
        except subprocess.CalledProcessError as e:
            print(f"❌ Erro ao executar aplicação: {e}")
            input("Pressione Enter para sair...")
        except KeyboardInterrupt:
            print("\n👋 Photo Mosaic encerrado.")
    else:
        print(f"❌ Erro: {standalone_script} não encontrado!")
        input("Pressione Enter para sair...")

if __name__ == "__main__":
    main() 