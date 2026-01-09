#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Ultra simple - just read and write as UTF-8
"""
import codecs

file_path = r'd:\PROJETOS\Acapulco\frontend\src\pages\DashboardPage.js'

# Read everything
with open(file_path, 'rb') as f:
    raw = f.read()

# Decode ignoring errors
text = raw.decode('utf-8', errors='ignore')

# Write back cleanly
with open(file_path, 'w', encoding='utf-8', newline='\n') as f:
    f.write(text)

print("✅ Arquivo em UTF-8 limpo!")
